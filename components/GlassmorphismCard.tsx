"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GlassmorphismCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: boolean
}

export default function GlassmorphismCard({ children, className = "", hoverEffect = true }: GlassmorphismCardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5 } : {}}
      className={`glass-effect rounded-2xl p-6 border border-white border-opacity-20 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  )
}
