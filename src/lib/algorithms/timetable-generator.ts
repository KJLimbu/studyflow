import { CourseInput, Schedule, Section, UserConstraints, TimeSlot } from "../types"
import { timeToMinutes, daysOfWeek } from "../utils"

// Helper to check if two time slots overlap
function isOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
  if (slot1.day !== slot2.day) return false
  const start1 = timeToMinutes(slot1.startTime)
  const end1 = timeToMinutes(slot1.endTime)
  const start2 = timeToMinutes(slot2.startTime)
  const end2 = timeToMinutes(slot2.endTime)

  return Math.max(start1, start2) < Math.min(end1, end2)
}

function hasConflict(section1: Section, section2: Section): boolean {
  // A section might have multiple meeting times (days)
  // We assume section.days is generic, but usually a section meets at same time on multiple days
  // or different times.
  // Implementation assumption: Section has `days` array and SAME `startTime`/`endTime` for all those days.
  // If complex schedule (diff times per day), data model needs update. 
  // Current model: days=["Mon","Wed"], startTime="09:00", endTime="10:00".
  
  for (const day of section1.days) {
    if (section2.days.includes(day)) {
      // Both meet on this day, check time overlap
      const slot1: TimeSlot = { day, startTime: section1.startTime, endTime: section1.endTime }
      const slot2: TimeSlot = { day, startTime: section2.startTime, endTime: section2.endTime }
      if (isOverlap(slot1, slot2)) return true
    }
  }
  return false
}

function calculateScheduleScore(schedule: Section[], constraints: UserConstraints): number {
  let score = 100
  
  for (const section of schedule) {
    const start = timeToMinutes(section.startTime)
    const end = timeToMinutes(section.endTime)
    
    // Avoid Early Classes (Before 9 AM = 540 mins)
    if (constraints.avoidEarlyClasses && start < 540) {
      score -= 10
    }
    
    // Avoid Late Classes (After 5 PM = 17:00 = 1020 mins)
    if (constraints.avoidLateClasses && end > 1020) {
      score -= 10
    }
    
    // Preferred Days Off
    for (const day of section.days) {
      if (constraints.preferredDaysOff.includes(day)) {
        score -= 20 // Heavy penalty for working on day off
      }
    }
  }
  
  // Max Daily Hours calculation
  const dailyMinutes: Record<string, number> = {}
  for (const section of schedule) {
    const duration = timeToMinutes(section.endTime) - timeToMinutes(section.startTime)
    for (const day of section.days) {
      dailyMinutes[day] = (dailyMinutes[day] || 0) + duration
    }
  }
  
  const maxMinutes = constraints.maxDailyHours * 60
  for (const day in dailyMinutes) {
    if (dailyMinutes[day] > maxMinutes) {
      score -= 15
    }
  }
  
  return Math.max(0, score)
}

export function generateSchedules(
  courses: CourseInput[],
  constraints: UserConstraints
): Schedule[] {
  const results: Schedule[] = []
  
  // Backtracking function
  function backtrack(courseIndex: number, currentSchedule: Section[]) {
    // Base case: Assigned a section for every course
    if (courseIndex === courses.length) {
      const score = calculateScheduleScore(currentSchedule, constraints)
      results.push({
        id: crypto.randomUUID(),
        courses: [...currentSchedule],
        score,
        warnings: [] // TODO: Populate warnings based on score penalties
      })
      return
    }

    const currentCourse = courses[courseIndex]
    
    // Try every section of the current course
    for (const section of currentCourse.sections) {
      // Check for conflicts with already picked sections
      let conflict = false
      for (const picked of currentSchedule) {
        if (hasConflict(picked, section)) {
          conflict = true
          break
        }
      }

      if (!conflict) {
        currentSchedule.push(section)
        backtrack(courseIndex + 1, currentSchedule)
        currentSchedule.pop() // Backtrack
      }
    }
  }

  backtrack(0, [])
  
  // Sort by score descending
  return results.sort((a, b) => b.score - a.score)
}
