"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function DashboardAnimations() {
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    
    tl.fromTo("#dashboard-header", 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.5, delay: 0.1 }
    )

    // Stats cards staggered entrance
    gsap.fromTo("#stats-row > div",
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
        delay: 0.2
      }
    )

    // Main content fade up
    gsap.fromTo("#main-content > div",
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
        delay: 0.4
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return null
}
