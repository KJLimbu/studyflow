"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { D3Sparkline } from "./D3Sparkline"
import { useGsapCountUp } from "@/components/animations/useGsapAnimations"
import { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: ReactNode
  className?: string
  sparklineData?: number[]
}

export function StatsCard({ title, value, description, icon, className, sparklineData }: StatsCardProps) {
  const numericValue = typeof value === "string" ? parseFloat(value) || 0 : value
  const isDecimal = typeof value === "number" && !Number.isInteger(value)
  const countRef = useGsapCountUp(numericValue, {
    duration: 1.2,
    delay: 0.3,
    decimals: isDecimal ? 1 : 0
  })

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#5f5f5d]">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-[rgba(28,28,28,0.04)] flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-3xl font-semibold tracking-tight text-foreground">
              <span ref={countRef}>0</span>
            </div>
            {description && (
              <p className="text-xs text-[#5f5f5d] mt-1">
                {description}
              </p>
            )}
          </div>
          {sparklineData && sparklineData.length > 0 && (
            <D3Sparkline data={sparklineData} width={100} height={28} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
