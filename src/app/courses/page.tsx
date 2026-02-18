import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { CourseList } from "@/components/courses/CourseList"
import { Button } from "@/components/ui/button"
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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
        <div className="flex items-center space-x-2">
          <Link href="/courses/generator">
            <Button variant="outline">
                <Table className="mr-2 h-4 w-4" />
                Generator
            </Button>
          </Link>
          <Link href="/courses/add">
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
            </Button>
          </Link>
        </div>
      </div>
      
      <CourseList courses={courses} />
    </div>
  )
}
