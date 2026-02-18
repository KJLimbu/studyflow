"use client"

import * as React from "react"
import { Assignment } from "@prisma/client"
import { calculatePriority } from "@/lib/algorithms/priority-scheduler"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Clock, CheckCircle2, Circle } from "lucide-react"
import { formatDuration } from "@/lib/utils"
import { useRouter } from "next/navigation"

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
            <h3 className="text-lg font-medium mb-4">Pending Tasks</h3>
            {scoredPending.length === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-muted/20 text-muted-foreground">
                    No pending assignments. Great job!
                </div>
            ) : (
                <div className="space-y-3">
                    {scoredPending.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-9 w-9 rounded-full border-2 border-muted-foreground/30 hover:border-green-500 hover:bg-green-500/10 transition-colors shrink-0"
                                    onClick={() => toggleComplete(assignment.id, assignment.completed)}
                                    disabled={loadingId === assignment.id}
                                    title="Mark as completed"
                                >
                                    <Circle className="h-5 w-5 text-muted-foreground/50" />
                                </Button>
                                <div className="space-y-1">
                                    <div className="font-semibold leading-none flex items-center gap-2">
                                        {assignment.title}
                                        <Badge variant={
                                            assignment.priorityScore > 8 ? "destructive" :
                                            assignment.priorityScore > 5 ? "default" : "secondary"
                                        } className="text-[10px] h-5 px-1.5">
                                            {assignment.priorityScore.toFixed(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(assignment.dueDate).toLocaleDateString()}
                                        </span>
                                        <span>•</span>
                                        <span>{formatDuration(assignment.estimatedHours * 60)}</span>
                                    </div>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive" 
                                onClick={() => handleDelete(assignment.id)}
                                disabled={loadingId === assignment.id}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {sortedCompleted.length > 0 && (
            <div>
                <h3 className="text-lg font-medium mb-4 text-muted-foreground">Completed</h3>
                <div className="space-y-3 opacity-60">
                    {sortedCompleted.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 rounded-full bg-green-500/20 text-green-600 hover:bg-red-500/10 hover:text-red-500 transition-colors shrink-0"
                                    onClick={() => toggleComplete(assignment.id, assignment.completed)}
                                    disabled={loadingId === assignment.id}
                                    title="Undo completion"
                                >
                                    <CheckCircle2 className="h-6 w-6" />
                                </Button>
                                <div className="space-y-1">
                                    <span className="font-medium leading-none line-through">
                                        {assignment.title}
                                    </span>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive" 
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
