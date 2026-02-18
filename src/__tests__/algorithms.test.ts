import { calculatePriority } from "@/lib/algorithms/priority-scheduler"
import { generateSchedules } from "@/lib/algorithms/timetable-generator"
import { Assignment } from "@prisma/client"
import { CourseInput, Section } from "@/lib/types"

describe("Priority Scheduler", () => {
  const baseAssignment: Assignment = {
    id: "1",
    title: "Test",
    description: null,
    dueDate: new Date(),
    weight: 5,
    estimatedHours: 2,
    courseId: null,
    completed: false,
    userId: "u1",
    createdAt: new Date(),
    updatedAt: new Date(),
    priorityScore: null
  }

  test("calculates high urgency for overdue items", () => {
    const overdue = { ...baseAssignment, dueDate: new Date(Date.now() - 86400000) } // yesterday
    const result = calculatePriority(overdue)
    expect(result.urgencyScore).toBe(10)
    expect(result.priorityScore).toBeGreaterThan(7)
  })

  test("calculates low urgency for far future items", () => {
    const farFuture = { ...baseAssignment, dueDate: new Date(Date.now() + 86400000 * 20) } // 20 days later
    const result = calculatePriority(farFuture)
    expect(result.urgencyScore).toBe(1)
  })

  test("prioritizes quick wins (low effort)", () => {
    const quick = { ...baseAssignment, estimatedHours: 0.5 }
    const result = calculatePriority(quick)
    expect(result.effortScore).toBe(10)
  })
})

describe("Timetable Generator", () => {
  const sectionsC1: Section[] = [
    { id: "s1a", sectionNumber: "A", days: ["Mon"], startTime: "09:00", endTime: "10:00", courseCode: "C1", courseId: "c1" },
    { id: "s1b", sectionNumber: "B", days: ["Mon"], startTime: "10:00", endTime: "11:00", courseCode: "C1", courseId: "c1" }
  ]
  const sectionsC2: Section[] = [
    { id: "s2a", sectionNumber: "A", days: ["Mon"], startTime: "09:00", endTime: "10:00", courseCode: "C2", courseId: "c2" }, // Conflict with s1a
    { id: "s2b", sectionNumber: "B", days: ["Tue"], startTime: "09:00", endTime: "10:00", courseCode: "C2", courseId: "c2" }
  ]

  const courses: CourseInput[] = [
    { courseCode: "C1", sections: sectionsC1 },
    { courseCode: "C2", sections: sectionsC2 }
  ]

  const defaultConstraints = {
    avoidEarlyClasses: false,
    avoidLateClasses: false,
    maxDailyHours: 8,
    preferredDaysOff: []
  }

  test("generates valid schedules without conflicts", () => {
    const schedules = generateSchedules(courses, defaultConstraints)
    expect(schedules.length).toBeGreaterThan(0)
    
    // Should verify that no schedule contains conflicting sections
    // Combination (s1a, s2a) is invalid because both are Mon 9-10
    // Valid combinations: (s1a, s2b), (s1b, s2a), (s1b, s2b)
    
    const hasConflict = schedules.some(s => 
      s.courses.some(c => c.id === "s1a") && s.courses.some(c => c.id === "s2a")
    )
    expect(hasConflict).toBe(false)
  })

  test("filters or scores based on constraints", () => {
    const constraints = { ...defaultConstraints, avoidEarlyClasses: true }
    // 09:00 is early (< 540 mins = 09:00? No, 9*60=540. Code says start < 540. So 9:00 is NOT early. 8:59 IS early.)
    // Let's change definition or test case.
    // If we change s1a to 08:00
    const earlySection = { ...sectionsC1[0], startTime: "08:00", endTime: "09:00" }
    const coursesEarly = [
        { courseCode: "C1", sections: [earlySection] },
        { courseCode: "C2", sections: sectionsC2 } // s2a is 9:00 (ok), s2b is 9:00 (ok)
    ]
    
    const schedules = generateSchedules(coursesEarly, constraints)
    // The schedule with early section should have lower score
    // But since there's only one option for C1, it has to pick it.
    // Score should be < 100.
    
    expect(schedules[0].score).toBeLessThan(100)
  })
})
