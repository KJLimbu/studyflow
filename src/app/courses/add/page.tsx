import { CourseForm } from "@/components/courses/CourseForm"

export default function AddCoursePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add Course</h2>
      </div>
      <div className="max-w-2xl">
        <CourseForm />
      </div>
    </div>
  )
}
