"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface D3SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  fillOpacity?: number
  className?: string
}

export function D3Sparkline({ 
  data, 
  width = 120, 
  height = 32, 
  color = "#1c1c1c",
  fillOpacity = 0.08,
  className = "" 
}: D3SparklineProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 2, right: 2, bottom: 2, left: 2 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data) || 1])
      .range([innerHeight, 0])

    // Area fill
    const area = d3.area<number>()
      .x((_, i) => xScale(i))
      .y0(innerHeight)
      .y1(d => yScale(d))
      .curve(d3.curveCatmullRom.alpha(0.5))

    g.append("path")
      .datum(data)
      .attr("d", area)
      .attr("fill", color)
      .attr("fill-opacity", fillOpacity)

    // Line
    const line = d3.line<number>()
      .x((_, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveCatmullRom.alpha(0.5))

    g.append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.4)

    // End dot
    const lastValue = data[data.length - 1]
    g.append("circle")
      .attr("cx", xScale(data.length - 1))
      .attr("cy", yScale(lastValue))
      .attr("r", 2)
      .attr("fill", color)
      .attr("fill-opacity", 0.6)

  }, [data, width, height, color, fillOpacity])

  return (
    <svg 
      ref={svgRef}
      className={`inline-block ${className}`}
      aria-hidden="true"
    />
  )
}
