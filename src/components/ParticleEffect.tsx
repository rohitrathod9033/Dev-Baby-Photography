"use client"

import { useEffect, useRef } from "react"

const ParticleEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const createParticle = (e: MouseEvent) => {
      const particle = document.createElement("div")
      const x = e.clientX
      const y = e.clientY

      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        background: radial-gradient(circle, rgba(220, 38, 38, 0.8), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: particleFloat 1.5s ease-out forwards;
      `

      document.body.appendChild(particle)
      setTimeout(() => particle.remove(), 1500)
    }

    // Add CSS animation
    if (!document.getElementById("particle-styles")) {
      const style = document.createElement("style")
      style.id = "particle-styles"
      style.textContent = `
        @keyframes particleFloat {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(${(Math.random() - 0.5) * 100}px, -100px) scale(0);
          }
        }
      `
      document.head.appendChild(style)
    }

    document.addEventListener("click", createParticle)
    return () => document.removeEventListener("click", createParticle)
  }, [])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none" />
}

export default ParticleEffect
