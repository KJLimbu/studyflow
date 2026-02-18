import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { AssignmentList } from "@/components/assignments/AssignmentList"
import { Button } from "@/components/ui/button"
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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
        <div className="flex items-center space-x-2">
          <Link href="/assignments/add">
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Assignment
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-4">
        <AssignmentList assignments={user.assignments} />
      </div>
    </div>
  )
}
