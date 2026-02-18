export interface PriorityAssignment {
  id: string
  title: string
  dueDate: string | Date
  weight: number
  estimatedHours: number
  priorityScore: number
  courseColor?: string
  courseCode?: string
  completed: boolean
}

export interface TimeSlot {
  day: string
  startTime: string // "HH:MM"
  endTime: string // "HH:MM"
}

export interface Section {
  id: string
  sectionNumber: string
  days: string[]
  startTime: string
  endTime: string
  professor?: string
  location?: string
  courseId: string
  courseCode: string
}

export interface CourseInput {
  courseCode: string
  sections: Section[]
}

export interface Schedule {
  id: string
  courses: Section[]
  score: number
  warnings?: string[]
}

export interface UserConstraints {
  avoidEarlyClasses: boolean
  avoidLateClasses: boolean
  maxDailyHours: number
  preferredDaysOff: string[] // e.g. ["Fri"]
}
