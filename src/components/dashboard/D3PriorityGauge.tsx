"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface D3PriorityGaugeProps {
  score: number
  maxScore?: number
  size?: number
  className?: string
}

export function D3PriorityGauge({ 
  score, 
  maxScore = 10, 
  size = 36, 
  className = "" 
}: D3PriorityGaugeProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const center = size / 2
    const radius = (size / 2) - 3
    const lineWidth = 3

    const g = svg
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${center},${center})`)

    // Background arc (full circle)
    const bgArc = d3.arc<unknown, d3.DefaultArcObject>()
      .innerRadius(radius - lineWidth)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(Math.PI * 2)

    g.append("path")
      .attr("d", bgArc({ innerRadius: radius - lineWidth, outerRadius: radius, startAngle: 0, endAngle: Math.PI * 2 }) as string)
      .attr("fill", "#eceae4")

    // Value arc
    const normalizedScore = Math.min(score / maxScore, 1)
    const endAngle = normalizedScore * Math.PI * 2

    // Color based on score
    let arcColor = "#1c1c1c"
    if (score > 8) arcColor = "#dc2626"
    else if (score > 5) arcColor = "#1c1c1c"
    else arcColor = "rgba(28,28,28,0.4)"

    const valueArc = d3.arc<unknown, d3.DefaultArcObject>()
      .innerRadius(radius - lineWidth)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(endAngle)
      .cornerRadius(1.5)

    g.append("path")
      .attr("d", valueArc({ innerRadius: radius - lineWidth, outerRadius: radius, startAngle: 0, endAngle } as d3.DefaultArcObject) as string)
      .attr("fill", arcColor)
      .attr("opacity", 0.8)

    // Center text
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", size * 0.28)
      .attr("font-weight", 600)
      .attr("fill", "#1c1c1c")
      .text(score.toFixed(1))

  }, [score, maxScore, size])

  return (
    <svg 
      ref={svgRef}
      className={`inline-block flex-shrink-0 ${className}`}
      aria-label={`Priority score: ${score}`}
    />
  )
}
