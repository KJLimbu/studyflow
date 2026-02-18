"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { daysOfWeek, minutesToTime, timeToMinutes } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface CalendarEvent {
  id: string
  title: string
  day: string // "Mon", "Tue", etc.
  startTime: string // "09:00"
  endTime: string
  color?: string
  type: "class" | "assignment"
}

interface WeeklyCalendarProps {
  events: CalendarEvent[]
}

export function WeeklyCalendar({ events }: WeeklyCalendarProps) {
  const startHour = 8 // 8 AM
  const endHour = 20 // 8 PM
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour)

  const getEventStyle = (event: CalendarEvent) => {
    const startMinutes = timeToMinutes(event.startTime)
    const endMinutes = timeToMinutes(event.endTime)
    const durationMinutes = endMinutes - startMinutes
    
    // Calculate top offset relative to startHour
    const startOffsetMinutes = startMinutes - (startHour * 60)
    
    // 60px per hour height
    const top = (startOffsetMinutes / 60) * 60
    const height = (durationMinutes / 60) * 60

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex min-w-[600px]">
            {/* Time labels */}
            <div className="w-16 flex-none border-r bg-muted/20">
              <div className="h-10 border-b" /> {/* Header spacer */}
              {hours.map((hour) => (
                <div key={hour} className="h-[60px] border-b text-xs text-muted-foreground p-1 text-right pr-2">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Days columns */}
            <div className="flex-1 grid grid-cols-5 md:grid-cols-7 divide-x">
              {daysOfWeek.map((day) => (
                <div key={day} className={cn("min-w-[100px]", day === "Sat" || day === "Sun" ? "hidden md:block bg-muted/10" : "")}>
                  <div className="h-10 border-b flex items-center justify-center font-medium text-sm bg-muted/20 sticky top-0 z-10">
                    {day}
                  </div>
                  <div className="relative h-[720px]"> {/* 12 hours * 60px */}
                    {hours.map((_, i) => (
                      <div key={i} className="h-[60px] border-b border-dashed border-muted/50" />
                    ))}
                    
                    {events.filter(e => e.day === day).map(event => (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute left-1 right-1 rounded px-2 py-1 text-xs border overflow-hidden",
                          event.type === "class" ? "bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-100" :
                          "bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-100"
                        )}
                        style={getEventStyle(event)}
                      >
                        <div className="font-semibold truncate">{event.title}</div>
                        <div className="truncate text-[10px] opacity-80">
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
