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
      <div className="text-center p-12 text-[#5f5f5d] border border-dashed border-border rounded-xl">
        No courses found. Add one to get started!
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden hover:border-foreground/20 transition-all duration-200">
          <div className="h-1.5 w-full rounded-t-xl" style={{ backgroundColor: course.color || '#1c1c1c' }} />
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-foreground">
                <span>{course.courseCode}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-[#5f5f5d] hover:text-destructive" 
                  onClick={() => handleDelete(course.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardTitle>
            <p className="text-sm text-[#5f5f5d]">{course.title}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                <div className="text-xs font-medium text-[#5f5f5d] uppercase tracking-wider">Sections</div>
                <div className="flex flex-wrap gap-2">
                    {course.sections.length > 0 ? (
                        course.sections.map(s => (
                            <Badge key={s.id} variant="secondary">
                                {s.sectionNumber} ({s.days} {s.startTime})
                            </Badge>
                        ))
                    ) : (
                        <span className="text-xs text-[#5f5f5d] italic">No sections added</span>
                    )}
                </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
