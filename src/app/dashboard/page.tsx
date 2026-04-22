import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { calculatePriority, getTodaysFocus, prioritizeAssignments } from "@/lib/algorithms/priority-scheduler"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { PriorityList } from "@/components/dashboard/PriorityList"
import { WeeklyCalendar } from "@/components/dashboard/WeeklyCalendar"
import { DashboardAnimations } from "@/components/dashboard/DashboardAnimations"
import { BookOpen, Calendar as CalendarIcon, CheckCircle, Clock } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Fetch data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      assignments: {
        where: { completed: false }
      },
      courses: {
        include: { sections: true }
      }
    }
  })

  if (!user) {
    return <div>User not found</div>
  }

  // Calculate stats
  const scoredAssignments = prioritizeAssignments(user.assignments)
  const todaysFocus = getTodaysFocus(user.assignments)
  
  const totalAssignments = user.assignments.length
  const totalHours = user.assignments.reduce((acc, curr) => acc + curr.estimatedHours, 0)
  
  // Transform courses/sections to calendar events
  const calendarEvents: any[] = []
  
  user.courses.forEach(course => {
    course.sections.forEach(section => {
      const days = section.days.split(",")
      days.forEach(day => {
        calendarEvents.push({
          id: section.id + day,
          title: course.courseCode,
          day: day.trim(),
          startTime: section.startTime,
          endTime: section.endTime,
          type: "class",
          color: course.color
        })
      })
    })
  })

  // Add assignments to calendar (due date)
  scoredAssignments.forEach(assignment => {
     const due = new Date(assignment.dueDate)
     const dayName = due.toLocaleDateString('en-US', { weekday: 'short' })
     
     calendarEvents.push({
        id: assignment.id,
        title: assignment.title,
        day: dayName,
        startTime: assignment.startTime, 
        endTime: assignment.endTime,
        type: "assignment"
     })
  })

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 max-w-7xl mx-auto relative">
      {/* Three.js + GSAP animations */}
      <DashboardAnimations />

      <div id="dashboard-header" className="flex items-center justify-between">
        <div>
          <h2 className="lovable-heading-page text-foreground">Dashboard</h2>
          <p className="text-sm text-[#5f5f5d] mt-1">Welcome back. Here&apos;s your academic overview.</p>
        </div>
      </div>
      
      {/* Stats Row */}
      <div id="stats-row" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Assignments Due"
          value={totalAssignments}
          description="Pending tasks"
          icon={<BookOpen className="h-4 w-4 text-foreground" />}
          sparklineData={[2, 4, 3, 6, 5, totalAssignments, totalAssignments + 1]}
        />
        <StatsCard
          title="Study Hours"
          value={Number(totalHours.toFixed(1))}
          description="Estimated effort remaining"
          icon={<Clock className="h-4 w-4 text-foreground" />}
          sparklineData={[5, 8, 6, 10, 7, totalHours]}
        />
        <StatsCard
          title="Focus Score"
          value={scoredAssignments.length > 0 ? Number(scoredAssignments[0].priorityScore.toFixed(1)) : 0}
          description="Top priority score"
          icon={<CheckCircle className="h-4 w-4 text-foreground" />}
          sparklineData={[3, 5, 7, 4, 6, scoredAssignments.length > 0 ? scoredAssignments[0].priorityScore : 0]}
        />
        <StatsCard
          title="Active Courses"
          value={user.courses.length}
          description="Enrolled courses"
          icon={<CalendarIcon className="h-4 w-4 text-foreground" />}
          sparklineData={[1, 2, 2, 3, user.courses.length]}
        />
      </div>

      {/* Main Content */}
      <div id="main-content" className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-full lg:col-span-4">
            <WeeklyCalendar events={calendarEvents} />
        </div>
        <div className="col-span-full lg:col-span-3">
          <PriorityList assignments={todaysFocus} />
        </div>
      </div>
    </div>
  )
}
