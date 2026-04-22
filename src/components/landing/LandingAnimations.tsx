"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ThreeScene } from "@/components/three/ThreeScene"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function LandingAnimations() {
  useEffect(() => {
    // Hero entrance animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    
    tl.fromTo("#hero-badge", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
    )
    .fromTo("#hero-heading", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8 }, 
      "-=0.3"
    )
    .fromTo("#hero-subtitle", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6 }, 
      "-=0.4"
    )
    .fromTo("#hero-cta", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6 }, 
      "-=0.3"
    )

    // Features section scroll animation
    gsap.fromTo("#features-heading", 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: "#features-heading", start: "top 85%" }
      }
    )

    gsap.fromTo("#features-grid > div", 
      { opacity: 0, y: 25 },
      { 
        opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: "#features-grid", start: "top 85%" }
      }
    )

    // Stats section scroll animation
    gsap.fromTo("#stats-section > div > div",
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: "#stats-section", start: "top 85%" }
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <>
      {/* Three.js ambient 3D background for hero */}
      <div className="absolute inset-0 -top-20 pointer-events-none z-0">
        <ThreeScene variant="hero" />
      </div>
      
      {/* Warm gradient washes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none z-0" />
    </>
  )
}
