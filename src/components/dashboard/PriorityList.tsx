"use client"

import { ScoredAssignment } from "@/lib/algorithms/priority-scheduler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Flame } from "lucide-react"
import { cn, formatDuration } from "@/lib/utils"
import { D3PriorityGauge } from "./D3PriorityGauge"

interface PriorityListProps {
  assignments: ScoredAssignment[]
}

export function PriorityList({ assignments }: PriorityListProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="h-8 w-8 rounded-full bg-[rgba(28,28,28,0.04)] flex items-center justify-center">
            <Flame className="h-4 w-4 text-foreground" />
          </div>
          Today&apos;s Focus
        </CardTitle>
        <CardDescription>
          Top prioritized tasks based on urgency and importance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assignments.length === 0 ? (
            <div className="text-sm text-[#5f5f5d] text-center py-12 border border-dashed border-border rounded-xl">
              No pending assignments. You&apos;re all caught up!
            </div>
          ) : (
            assignments.map((assignment, index) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-foreground/20 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Rank number */}
                  <div className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                    index === 0 ? "bg-foreground text-[#fcfbf8]" :
                    index === 1 ? "bg-[rgba(28,28,28,0.1)] text-foreground" :
                    "bg-[rgba(28,28,28,0.04)] text-[#5f5f5d]"
                  )}>
                    {index + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium leading-none text-foreground">{assignment.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-[#5f5f5d]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{formatDuration(assignment.estimatedHours * 60)}</span>
                    </div>
                  </div>
                </div>
                {/* D3 Priority Gauge */}
                <D3PriorityGauge score={assignment.priorityScore} size={38} />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
