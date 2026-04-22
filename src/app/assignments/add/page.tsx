import { AssignmentForm } from "@/components/assignments/AssignmentForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddAssignmentPage() {
  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 max-w-7xl mx-auto">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="lovable-heading-page text-foreground">Add Assignment</h2>
          <p className="text-sm text-[#5f5f5d] mt-1">Create a new task to be automatically prioritized.</p>
        </div>
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
