"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { generateSchedules } from "@/lib/algorithms/timetable-generator"
import { CourseInput, Schedule } from "@/lib/types"
import { TimetableGrid } from "@/components/scheduler/TimetableGrid"
import { Loader2 } from "lucide-react"

export default function GeneratorPage() {
  const [coursesJson, setCoursesJson] = React.useState(JSON.stringify([
    {
        courseCode: "CS101",
        sections: [
            { id: "s1", sectionNumber: "A", days: ["Mon", "Wed"], startTime: "09:00", endTime: "10:30", courseId: "c1", courseCode: "CS101" },
            { id: "s2", sectionNumber: "B", days: ["Tue", "Thu"], startTime: "13:00", endTime: "14:30", courseId: "c1", courseCode: "CS101" }
        ]
    },
    {
        courseCode: "MATH201",
        sections: [
            { id: "s3", sectionNumber: "A", days: ["Tue", "Thu"], startTime: "09:00", endTime: "10:30", courseId: "c2", courseCode: "MATH201" }
        ]
    }
  ], null, 2))
  
  const [constraints, setConstraints] = React.useState({
    avoidEarlyClasses: false,
    avoidLateClasses: false,
    maxDailyHours: 8,
    preferredDaysOff: [] as string[]
  })
  
  const [schedules, setSchedules] = React.useState<Schedule[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
        const courses = JSON.parse(coursesJson) as CourseInput[]
        await new Promise(resolve => setTimeout(resolve, 500))
        const results = generateSchedules(courses, constraints)
        setSchedules(results)
    } catch (e) {
        alert("Invalid JSON format")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="lovable-heading-page text-foreground">Schedule Generator</h2>
          <p className="text-sm text-[#5f5f5d] mt-1">Generate conflict-free timetable options.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Course Data (JSON)</CardTitle>
                    <CardDescription>
                        Paste your course sections here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        className="font-mono text-xs h-[300px] bg-[#f7f4ed] border-[#eceae4]" 
                        value={coursesJson}
                        onChange={(e) => setCoursesJson(e.target.value)}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <Checkbox 
                            id="early" 
                            checked={constraints.avoidEarlyClasses}
                            onCheckedChange={(c) => setConstraints({...constraints, avoidEarlyClasses: !!c})}
                        />
                        <Label htmlFor="early" className="text-sm font-normal text-foreground cursor-pointer">Avoid Early Classes (Before 9 AM)</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Checkbox 
                            id="late" 
                            checked={constraints.avoidLateClasses}
                            onCheckedChange={(c) => setConstraints({...constraints, avoidLateClasses: !!c})}
                        />
                        <Label htmlFor="late" className="text-sm font-normal text-foreground cursor-pointer">Avoid Late Classes (After 5 PM)</Label>
                    </div>
                </CardContent>
            </Card>
            
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full h-11">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Schedules
            </Button>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Results ({schedules.length})</h3>
            <div className="grid grid-cols-1 gap-4">
                {schedules.map((schedule, i) => (
                    <TimetableGrid 
                        key={schedule.id} 
                        schedule={schedule} 
                        index={i} 
                        onSelect={() => alert(`Selected Option ${i+1}`)} 
                    />
                ))}
            </div>
            {schedules.length === 0 && !isLoading && (
                <div className="text-center text-[#5f5f5d] p-12 border rounded-xl border-dashed border-border">
                    No schedules generated yet.
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
