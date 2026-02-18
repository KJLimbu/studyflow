"use client"

import { ScoredAssignment } from "@/lib/algorithms/priority-scheduler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Flame } from "lucide-react"
import { cn, formatDuration } from "@/lib/utils"

interface PriorityListProps {
  assignments: ScoredAssignment[]
}

export function PriorityList({ assignments }: PriorityListProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Today's Focus
        </CardTitle>
        <CardDescription>
          Top prioritized tasks for today based on urgency and importance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No pending assignments. You're all caught up!
            </p>
          ) : (
            assignments.map((assignment, index) => (
              <div
                key={assignment.id}
                className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-none pt-1">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold",
                      index === 0 ? "border-red-500 text-red-500 bg-red-500/10" :
                      index === 1 ? "border-orange-500 text-orange-500 bg-orange-500/10" :
                      "border-blue-500 text-blue-500 bg-blue-500/10"
                    )}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold leading-none">{assignment.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{formatDuration(assignment.estimatedHours * 60)}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={
                  assignment.priorityScore > 8 ? "destructive" :
                  assignment.priorityScore > 5 ? "default" : "secondary"
                }>
                  Score: {assignment.priorityScore}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
