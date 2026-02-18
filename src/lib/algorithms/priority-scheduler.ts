import { Assignment } from "@prisma/client"
import { dateDiffInDays } from "../utils"

export type ScoredAssignment = Assignment & {
  priorityScore: number
  urgencyScore: number
  importanceScore: number
  effortScore: number
}

// Weights
const WEIGHTS = {
  URGENCY: 0.4,
  IMPORTANCE: 0.4,
  EFFORT: 0.2, // Inverted: Quick wins get higher score
}

export function calculatePriority(assignment: Assignment): ScoredAssignment {
  const today = new Date()
  const due = new Date(assignment.dueDate)
  const daysUntilDue = dateDiffInDays(today, due)

  // 1. Urgency Score (0-10)
  // 0 days or overdue = 10
  // 14+ days = 1
  let urgencyScore = 0
  if (daysUntilDue <= 0) urgencyScore = 10
  else if (daysUntilDue >= 14) urgencyScore = 1
  else {
    // Linear interpolation: 14 days -> 1, 0 days -> 10
    // Slope = (1 - 10) / (14 - 0) = -9 / 14 ≈ -0.64
    urgencyScore = 10 - (daysUntilDue * (9 / 14))
  }

  // 2. Importance Score (1-10) - direct mapping
  const importanceScore = Math.max(1, Math.min(10, assignment.weight))

  // 3. Effort Score (0-10) - Inverted
  // 0-1 hour = 10 (Quick win)
  // 10+ hours = 1 (Big task)
  let effortScore = 0
  if (assignment.estimatedHours <= 1) effortScore = 10
  else if (assignment.estimatedHours >= 10) effortScore = 1
  else {
    // Linear interpolation: 1 hour -> 10, 10 hours -> 1
    // Slope = (1 - 10) / (10 - 1) = -9 / 9 = -1
    effortScore = 10 - (assignment.estimatedHours - 1)
  }

  const finalScore = 
    (urgencyScore * WEIGHTS.URGENCY) +
    (importanceScore * WEIGHTS.IMPORTANCE) +
    (effortScore * WEIGHTS.EFFORT)

  return {
    ...assignment,
    priorityScore: parseFloat(finalScore.toFixed(2)),
    urgencyScore: parseFloat(urgencyScore.toFixed(2)),
    importanceScore: parseFloat(importanceScore.toFixed(2)),
    effortScore: parseFloat(effortScore.toFixed(2)),
  }
}

export function prioritizeAssignments(assignments: Assignment[]): ScoredAssignment[] {
  return assignments
    .filter(a => !a.completed)
    .map(calculatePriority)
    .sort((a, b) => b.priorityScore - a.priorityScore)
}

export function getTodaysFocus(assignments: Assignment[], limit = 3): ScoredAssignment[] {
  const prioritize = prioritizeAssignments(assignments)
  return prioritize.slice(0, limit)
}
