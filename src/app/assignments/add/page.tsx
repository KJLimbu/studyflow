import { AssignmentForm } from "@/components/assignments/AssignmentForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddAssignmentPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add Assignment</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
                <CardDescription>
                    Enter the details of your assignment to have it automatically prioritized.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AssignmentForm />
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
