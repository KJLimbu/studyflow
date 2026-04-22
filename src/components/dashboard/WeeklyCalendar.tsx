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
        <CardTitle className="text-foreground">Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex min-w-[600px]">
            {/* Time labels */}
            <div className="w-16 flex-none border-r border-border">
              <div className="h-10 border-b border-border" /> {/* Header spacer */}
              {hours.map((hour) => (
                <div key={hour} className="h-[60px] border-b border-border text-xs text-[#5f5f5d] p-1 text-right pr-2">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Days columns */}
            <div className="flex-1 grid grid-cols-5 md:grid-cols-7 divide-x divide-border">
              {daysOfWeek.map((day) => (
                <div key={day} className={cn("min-w-[100px]", day === "Sat" || day === "Sun" ? "hidden md:block bg-[rgba(28,28,28,0.02)]" : "")}>
                  <div className="h-10 border-b border-border flex items-center justify-center font-medium text-sm text-foreground bg-[rgba(28,28,28,0.02)] sticky top-0 z-10">
                    {day}
                  </div>
                  <div className="relative h-[720px]"> {/* 12 hours * 60px */}
                    {hours.map((_, i) => (
                      <div key={i} className="h-[60px] border-b border-dashed border-[#eceae4]/70" />
                    ))}
                    
                    {events.filter(e => e.day === day).map(event => (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute left-1 right-1 rounded-lg px-2 py-1 text-xs border overflow-hidden transition-all duration-200",
                          event.type === "class" 
                            ? "bg-foreground/5 border-foreground/15 text-foreground" 
                            : "bg-[rgba(28,28,28,0.04)] border-[#eceae4] text-foreground"
                        )}
                        style={getEventStyle(event)}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="truncate text-[10px] text-[#5f5f5d]">
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
