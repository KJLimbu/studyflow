"use client"

import { Schedule } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { daysOfWeek, minutesToTime, timeToMinutes } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface TimetableGridProps {
  schedule: Schedule
  index: number
  onSelect: () => void
}

export function TimetableGrid({ schedule, index, onSelect }: TimetableGridProps) {
  const startHour = 8 // 8 AM
  const endHour = 20 // 8 PM
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour)

  const getEventStyle = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = timeToMinutes(endTime)
    const durationMinutes = endMinutes - startMinutes
    
    // Calculate top offset relative to startHour
    const startOffsetMinutes = startMinutes - (startHour * 60)
    
    // 40px per hour for compact view in generator results
    const hourHeight = 40
    const top = (startOffsetMinutes / 60) * hourHeight
    const height = (durationMinutes / 60) * hourHeight

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={onSelect}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between">
            <span>Option {index + 1}</span>
            <span className="text-sm font-normal text-muted-foreground">Score: {schedule.score}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        <div className="flex text-[10px]">
            <div className="w-10 flex-none border-r bg-muted/20">
              <div className="h-6 border-b" /> 
              {hours.map((hour) => (
                <div key={hour} className="h-[40px] border-b text-muted-foreground p-1 text-right pr-1">
                  {hour}
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-5 divide-x">
              {daysOfWeek.slice(1, 6).map((day) => ( // Mon-Fri only for compact view
                <div key={day} className="min-w-[40px] relative">
                  <div className="h-6 border-b flex items-center justify-center font-medium bg-muted/20">
                    {day}
                  </div>
                  <div className="relative h-[480px]"> 
                    {hours.map((_, i) => (
                      <div key={i} className="h-[40px] border-b border-dashed border-muted/50" />
                    ))}
                    
                    {schedule.courses.filter(c => c.days.includes(day)).map(course => (
                        <div
                        key={course.id + day}
                        className="absolute left-0.5 right-0.5 rounded px-1 py-0.5 text-[0.6rem] border overflow-hidden bg-primary/10 border-primary/20 text-primary-foreground leading-tight"
                        style={getEventStyle(course.startTime, course.endTime)}
                        title={`${course.courseCode}\n${course.startTime}-${course.endTime}`}
                      >
                        <div className="font-semibold text-primary truncate">{course.courseCode}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
