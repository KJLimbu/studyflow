"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface ThreeSceneProps {
  variant?: "hero" | "dashboard" | "auth" | "minimal"
  className?: string
}

export function ThreeScene({ variant = "hero", className = "" }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "low-power"
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lovable warm color palette
    const warmCharcoal = new THREE.Color("#1c1c1c")
    const warmCream = new THREE.Color("#eceae4")
    const warmMuted = new THREE.Color("#5f5f5d")

    // Build geometry based on variant
    const group = new THREE.Group()

    if (variant === "hero") {
      // Floating wireframe icosahedron with orbiting torus
      const icoGeo = new THREE.IcosahedronGeometry(2.2, 1)
      const icoMat = new THREE.MeshBasicMaterial({ 
        color: warmCharcoal, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.08 
      })
      const ico = new THREE.Mesh(icoGeo, icoMat)
      group.add(ico)

      const torusGeo = new THREE.TorusGeometry(3.2, 0.03, 16, 100)
      const torusMat = new THREE.MeshBasicMaterial({ 
        color: warmMuted, 
        transparent: true, 
        opacity: 0.12 
      })
      const torus = new THREE.Mesh(torusGeo, torusMat)
      torus.rotation.x = Math.PI * 0.35
      group.add(torus)

      // Small floating dots
      const dotsGeo = new THREE.BufferGeometry()
      const dotsCount = 60
      const dotsPositions = new Float32Array(dotsCount * 3)
      for (let i = 0; i < dotsCount; i++) {
        dotsPositions[i * 3] = (Math.random() - 0.5) * 10
        dotsPositions[i * 3 + 1] = (Math.random() - 0.5) * 10
        dotsPositions[i * 3 + 2] = (Math.random() - 0.5) * 6
      }
      dotsGeo.setAttribute("position", new THREE.BufferAttribute(dotsPositions, 3))
      const dotsMat = new THREE.PointsMaterial({ 
        color: warmCharcoal, 
        size: 0.04, 
        transparent: true, 
        opacity: 0.15 
      })
      const dots = new THREE.Points(dotsGeo, dotsMat)
      group.add(dots)

      camera.position.z = 7

    } else if (variant === "dashboard") {
      // Orbiting ring of small spheres — data constellation feel
      const ringCount = 12
      for (let i = 0; i < ringCount; i++) {
        const angle = (i / ringCount) * Math.PI * 2
        const radius = 2.5
        const sphereGeo = new THREE.SphereGeometry(0.08 + Math.random() * 0.06, 16, 16)
        const sphereMat = new THREE.MeshBasicMaterial({ 
          color: warmCharcoal, 
          transparent: true, 
          opacity: 0.1 + Math.random() * 0.08 
        })
        const sphere = new THREE.Mesh(sphereGeo, sphereMat)
        sphere.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.5,
          0
        )
        group.add(sphere)
      }

      // Central subtle wireframe octahedron
      const octGeo = new THREE.OctahedronGeometry(1.2, 0)
      const octMat = new THREE.MeshBasicMaterial({ 
        color: warmMuted, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.06 
      })
      const oct = new THREE.Mesh(octGeo, octMat)
      group.add(oct)

      camera.position.z = 6

    } else if (variant === "auth") {
      // Gentle floating geometric lattice
      const linesMat = new THREE.LineBasicMaterial({ 
        color: warmCharcoal, 
        transparent: true, 
        opacity: 0.06 
      })
      
      for (let i = 0; i < 8; i++) {
        const linesGeo = new THREE.BufferGeometry()
        const points = []
        const startX = (Math.random() - 0.5) * 8
        const startY = (Math.random() - 0.5) * 8
        points.push(new THREE.Vector3(startX, startY, 0))
        points.push(new THREE.Vector3(startX + (Math.random() - 0.5) * 3, startY + (Math.random() - 0.5) * 3, 0))
        linesGeo.setFromPoints(points)
        const line = new THREE.Line(linesGeo, linesMat)
        group.add(line)
      }

      // Sparse floating dots
      const dotsGeo = new THREE.BufferGeometry()
      const dotsCount = 30
      const positions = new Float32Array(dotsCount * 3)
      for (let i = 0; i < dotsCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 8
        positions[i * 3 + 1] = (Math.random() - 0.5) * 8
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2
      }
      dotsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      const dotsMat = new THREE.PointsMaterial({ 
        color: warmCharcoal, 
        size: 0.05, 
        transparent: true, 
        opacity: 0.1 
      })
      group.add(new THREE.Points(dotsGeo, dotsMat))

      camera.position.z = 6

    } else {
      // Minimal: just floating dots
      const dotsGeo = new THREE.BufferGeometry()
      const dotsCount = 40
      const positions = new Float32Array(dotsCount * 3)
      for (let i = 0; i < dotsCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 8
        positions[i * 3 + 1] = (Math.random() - 0.5) * 8
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4
      }
      dotsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      const dotsMat = new THREE.PointsMaterial({ 
        color: warmCharcoal, 
        size: 0.04, 
        transparent: true, 
        opacity: 0.12 
      })
      group.add(new THREE.Points(dotsGeo, dotsMat))

      camera.position.z = 6
    }

    scene.add(group)

    // Animation loop
    let frameId: number
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      group.rotation.y += 0.002
      group.rotation.x += 0.001
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [variant])

  return (
    <div 
      ref={containerRef} 
      className={`three-canvas-container ${className}`}
      aria-hidden="true"
    />
  )
}
