"use client"

import { useEffect, useRef, useCallback } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Hook: Fade-up animation triggered on scroll
 */
export function useGsapFadeUp(options?: { delay?: number; duration?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current
    gsap.set(el, { opacity: 0, y: options?.y ?? 30 })

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: options?.duration ?? 0.8,
      delay: options?.delay ?? 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill()
      })
    }
  }, [options?.delay, options?.duration, options?.y])

  return ref
}

/**
 * Hook: Stagger children animation on scroll
 */
export function useGsapStagger(options?: { delay?: number; stagger?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current
    const children = el.children

    gsap.set(children, { opacity: 0, y: options?.y ?? 20 })

    const tween = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: options?.stagger ?? 0.1,
      delay: options?.delay ?? 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill()
      })
    }
  }, [options?.delay, options?.stagger, options?.y])

  return ref
}

/**
 * Hook: Count-up animation for numeric values
 */
export function useGsapCountUp(targetValue: number, options?: { duration?: number; delay?: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current
    const obj = { value: 0 }

    const tween = gsap.to(obj, {
      value: targetValue,
      duration: options?.duration ?? 1.5,
      delay: options?.delay ?? 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        if (el) {
          el.textContent = options?.decimals
            ? obj.value.toFixed(options.decimals)
            : Math.round(obj.value).toString()
        }
      },
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill()
      })
    }
  }, [targetValue, options?.duration, options?.delay, options?.decimals])

  return ref
}

/**
 * Hook: Scale-in animation
 */
export function useGsapScaleIn(options?: { delay?: number; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current
    gsap.set(el, { opacity: 0, scale: 0.95 })

    const tween = gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration: options?.duration ?? 0.8,
      delay: options?.delay ?? 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill()
      })
    }
  }, [options?.delay, options?.duration])

  return ref
}
