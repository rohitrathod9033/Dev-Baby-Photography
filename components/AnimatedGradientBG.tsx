"use client"

import { useEffect, useRef } from "react"

export default function AnimatedGradientBG() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.003

      // Create animated gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)

      const hue1 = (time * 30 + 280) % 360
      const hue2 = (time * 25 + 320) % 360
      const hue3 = (time * 20 + 360) % 360

      gradient.addColorStop(0, `hsl(${hue1}, 70%, 60%)`)
      gradient.addColorStop(0.5, `hsl(${hue2}, 80%, 55%)`)
      gradient.addColorStop(1, `hsl(${hue3}, 75%, 65%)`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add noise/texture
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 5
        data[i] -= noise
        data[i + 1] -= noise
        data[i + 2] -= noise
      }

      ctx.putImageData(imageData, 0, 0)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-screen opacity-20 pointer-events-none z-0" />
}
