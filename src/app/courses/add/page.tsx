import { CourseForm } from "@/components/courses/CourseForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddCoursePage() {
  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="lovable-heading-page text-foreground">Add Course</h2>
          <p className="text-sm text-[#5f5f5d] mt-1">Register a new course to track.</p>
        </div>
      </div>
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>Enter the basic info for your course.</CardDescription>
          </CardHeader>
          <CardContent>
            <CourseForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
