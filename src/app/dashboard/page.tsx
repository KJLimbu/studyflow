import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { calculatePriority, getTodaysFocus, prioritizeAssignments } from "@/lib/algorithms/priority-scheduler"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { PriorityList } from "@/components/dashboard/PriorityList"
import { WeeklyCalendar } from "@/components/dashboard/WeeklyCalendar"
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
  // We need to score assignments first
  const scoredAssignments = prioritizeAssignments(user.assignments)
  const todaysFocus = getTodaysFocus(user.assignments)
  
  const totalAssignments = user.assignments.length
  const totalHours = user.assignments.reduce((acc, curr) => acc + curr.estimatedHours, 0)
  
  // Transform courses/sections to calendar events
  // For demo/MVP, just showing course sections as repeating events is tricky without real date expansion
  // We'll just map the generic "days" to this week's calendar for visualization
  const calendarEvents: any[] = []
  
  user.courses.forEach(course => {
    course.sections.forEach(section => {
      // section.days might be "Mon,Wed"
      const days = section.days.split(",") // Assuming simple CSV for now based on earlier generic implementation choices
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
     // Naive day extraction from date
     const due = new Date(assignment.dueDate)
     const dayName = due.toLocaleDateString('en-US', { weekday: 'short' })
     // Only add if it's in the view (visual simplification: assumes assignments are this week for the calendar view)
     
     calendarEvents.push({
        id: assignment.id,
        title: assignment.title,
        day: dayName,
        startTime: "12:00", // Default time? Or specific? Model just has dueDate (date only usually). 
        // Let's assume due date is end of day or specific time.
        // For visual, let's put it at 1 hour block.
        endTime: "13:00",
        type: "assignment"
     })
  })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Assignments Due"
          value={totalAssignments}
          description="Pending tasks"
          icon={BookOpen}
        />
        <StatsCard
          title="Study Hours"
          value={totalHours.toFixed(1)}
          description="Estimated effort remaining"
          icon={Clock}
        />
        <StatsCard
          title="Focus Score"
          value={scoredAssignments.length > 0 ? scoredAssignments[0].priorityScore : 0}
          description="Top priority score"
          icon={CheckCircle}
        />
        <StatsCard
          title="Active Courses"
          value={user.courses.length}
          description="Enrolled courses"
          icon={CalendarIcon}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
            <WeeklyCalendar events={calendarEvents} />
        </div>
        <div className="col-span-3">
          <PriorityList assignments={todaysFocus} />
        </div>
      </div>
    </div>
  )
}
