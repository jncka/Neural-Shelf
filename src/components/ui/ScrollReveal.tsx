"use client"

import { useEffect } from "react"

export function ScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible")
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    )

    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el))

    return () => obs.disconnect()
  }, [])

  return null
}
