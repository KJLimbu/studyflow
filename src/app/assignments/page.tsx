import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { AssignmentList } from "@/components/assignments/AssignmentList"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AssignmentsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      assignments: {
        orderBy: { dueDate: 'asc' }
      }
    }
  })

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="lovable-heading-page text-foreground">Assignments</h2>
          <p className="text-sm text-[#5f5f5d] mt-1">Manage and track your academic tasks.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/assignments/add" className="lovable-btn-primary inline-flex items-center gap-2 h-10 px-4 text-sm">
            <Plus className="h-4 w-4" />
            Add Assignment
          </Link>
        </div>
      </div>
      
      <div className="grid gap-4">
        <AssignmentList assignments={user.assignments} />
      </div>
    </div>
  )
}
