import { Section, Assignment } from "@prisma/client"

export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return hours * 60 + minutes
}

export function isOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  const s1 = timeToMinutes(start1)
  const e1 = timeToMinutes(end1)
  const s2 = timeToMinutes(start2)
  const e2 = timeToMinutes(end2)

  // Start must be strictly before End of another to overlap
  return Math.max(s1, s2) < Math.min(e1, e2)
}

export function checkAssignmentConflict(
  targetDate: Date,
  startTime: string,
  endTime: string,
  userSections: Section[],
  userAssignments: Assignment[],
  excludeAssignmentId?: string
): string | null {
  
  // 1. Check existing assignments on the same literal day
  const targetDateString = targetDate.toISOString().split("T")[0]
  
  for (const assignment of userAssignments) {
    if (assignment.id === excludeAssignmentId) continue
    
    const assignDateString = assignment.dueDate.toISOString().split("T")[0]
    
    if (targetDateString === assignDateString) {
      if (isOverlap(startTime, endTime, assignment.startTime, assignment.endTime)) {
        return `Time conflict with existing assignment: '${assignment.title}' (${assignment.startTime} - ${assignment.endTime})`
      }
    }
  }

  // 2. Check course sections
  // Courses happen weekly on specific days. E.g. "Mon,Wed"
  const dayNameShort = targetDate.toLocaleDateString("en-US", { weekday: "short" }) // e.g., "Mon"
  
  for (const section of userSections) {
    const sectionDays = section.days.split(",").map(d => d.trim())
    
    if (sectionDays.includes(dayNameShort)) {
      if (isOverlap(startTime, endTime, section.startTime, section.endTime)) {
      	return `Time conflict with a scheduled class: Section ${section.sectionNumber} (${section.startTime} - ${section.endTime})`
      }
    }
  }

  return null // No conflict found
}
