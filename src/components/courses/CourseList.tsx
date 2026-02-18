"use client"

import { Course, Section } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CourseWithSections extends Course {
  sections: Section[]
}

interface CourseListProps {
  courses: CourseWithSections[]
}

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function CourseList({ courses }: CourseListProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return

    try {
        const res = await fetch(`/api/courses/${id}`, { method: "DELETE" })
        if (!res.ok) {
            console.error("DELETE failed:", res.status)
            return
        }
        router.refresh()
    } catch (error) {
        console.error("Failed to delete course", error)
    }
  }

  if (courses.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No courses found. Add one to get started!
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden">
          <div className="h-2 w-full" style={{ backgroundColor: course.color || '#3b82f6' }} />
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
                <span>{course.courseCode}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(course.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{course.title}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sections</div>
                <div className="flex flex-wrap gap-2">
                    {course.sections.length > 0 ? (
                        course.sections.map(s => (
                            <Badge key={s.id} variant="secondary">
                                {s.sectionNumber} ({s.days} {s.startTime})
                            </Badge>
                        ))
                    ) : (
                        <span className="text-xs text-muted-foreground italic">No sections added</span>
                    )}
                </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
