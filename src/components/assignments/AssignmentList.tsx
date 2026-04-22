"use client"

import * as React from "react"
import { Assignment } from "@prisma/client"
import { calculatePriority } from "@/lib/algorithms/priority-scheduler"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Clock, CheckCircle2, Circle } from "lucide-react"
import { formatDuration } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { D3PriorityGauge } from "@/components/dashboard/D3PriorityGauge"

interface AssignmentListProps {
  assignments: Assignment[]
}

export function AssignmentList({ assignments }: AssignmentListProps) {
  const router = useRouter()
  const [loadingId, setLoadingId] = React.useState<string | null>(null)
  
  // Separate completed and pending
  const pending = assignments.filter(a => !a.completed)
  const completed = assignments.filter(a => a.completed)

  // Sort pending by priority
  const scoredPending = pending.map(calculatePriority).sort((a, b) => b.priorityScore - a.priorityScore)
  
  // Sort completed by recency
  const sortedCompleted = completed.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const toggleComplete = async (id: string, currentStatus: boolean) => {
    setLoadingId(id)
    try {
        const res = await fetch(`/api/assignments/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !currentStatus })
        })
        if (!res.ok) {
            const text = await res.text()
            console.error("PATCH failed:", res.status, text)
            return
        }
        router.refresh()
    } catch (error) {
        console.error("Failed to update assignment", error)
    } finally {
        setLoadingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return
    setLoadingId(id)
    try {
        const res = await fetch(`/api/assignments/${id}`, { method: "DELETE" })
        if (!res.ok) {
            console.error("DELETE failed:", res.status)
            return
        }
        router.refresh()
    } catch (error) {
        console.error("Failed to delete assignment", error)
    } finally {
        setLoadingId(null)
    }
  }

  return (
    <div className="space-y-8">
        <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Pending Tasks</h3>
            {scoredPending.length === 0 ? (
                <div className="text-center p-12 border border-dashed border-border rounded-xl text-[#5f5f5d]">
                    No pending assignments. Great job!
                </div>
            ) : (
                <div className="space-y-3">
                    {scoredPending.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-foreground/20 transition-all duration-200">
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-9 w-9 rounded-full border-2 border-[#eceae4] hover:border-foreground/40 hover:bg-[rgba(28,28,28,0.04)] transition-all duration-200 shrink-0"
                                    onClick={() => toggleComplete(assignment.id, assignment.completed)}
                                    disabled={loadingId === assignment.id}
                                    title="Mark as completed"
                                >
                                    <Circle className="h-5 w-5 text-[#5f5f5d]/50" />
                                </Button>
                                <div className="space-y-1">
                                    <div className="font-medium leading-none flex items-center gap-3 text-foreground">
                                        {assignment.title}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-[#5f5f5d]">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(assignment.dueDate).toLocaleDateString()}
                                        </span>
                                        <span>•</span>
                                        <span>{formatDuration(assignment.estimatedHours * 60)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <D3PriorityGauge score={assignment.priorityScore} size={34} />
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-[#5f5f5d] hover:text-destructive" 
                                    onClick={() => handleDelete(assignment.id)}
                                    disabled={loadingId === assignment.id}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {sortedCompleted.length > 0 && (
            <div>
                <h3 className="text-lg font-semibold mb-4 text-[#5f5f5d]">Completed</h3>
                <div className="space-y-3 opacity-60">
                    {sortedCompleted.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-[rgba(28,28,28,0.02)]">
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 rounded-full bg-foreground/10 text-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 shrink-0"
                                    onClick={() => toggleComplete(assignment.id, assignment.completed)}
                                    disabled={loadingId === assignment.id}
                                    title="Undo completion"
                                >
                                    <CheckCircle2 className="h-6 w-6" />
                                </Button>
                                <div className="space-y-1">
                                    <span className="font-medium leading-none line-through text-[#5f5f5d]">
                                        {assignment.title}
                                    </span>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-[#5f5f5d] hover:text-destructive" 
                                onClick={() => handleDelete(assignment.id)}
                                disabled={loadingId === assignment.id}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  )
}
