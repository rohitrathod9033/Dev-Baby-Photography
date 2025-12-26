"use client"

import type React from "react"

import { useEffect, useRef } from "react"

export default function SpotlightEffect() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const { clientX, clientY } = e
      const { left, top } = containerRef.current.getBoundingClientRect()

      const x = clientX - left
      const y = clientY - top

      containerRef.current.style.setProperty("--x", `${x}px`)
      containerRef.current.style.setProperty("--y", `${y}px`)
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={
        {
          background:
            "radial-gradient(circle 300px at var(--x, 50%) var(--y, 50%), rgba(244, 114, 182, 0.1) 0%, transparent 100%)",
        } as React.CSSProperties
      }
    />
  )
}
