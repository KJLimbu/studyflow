import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { CourseList } from "@/components/courses/CourseList"
import Link from "next/link"
import { Plus, Table } from "lucide-react"

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const courses = await prisma.course.findMany({
    where: { userId: session.user.id },
    include: { sections: true },
    orderBy: { courseCode: 'asc' }
  })

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="lovable-heading-page text-foreground">Courses</h2>
          <p className="text-sm text-[#5f5f5d] mt-1">Manage your enrolled courses and sections.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/courses/generator" className="lovable-btn-secondary inline-flex items-center gap-2 h-10 px-4 text-sm">
            <Table className="h-4 w-4" />
            Generator
          </Link>
          <Link href="/courses/add" className="lovable-btn-primary inline-flex items-center gap-2 h-10 px-4 text-sm">
            <Plus className="h-4 w-4" />
            Add Course
          </Link>
        </div>
      </div>
      
      <CourseList courses={courses} />
    </div>
  )
}
