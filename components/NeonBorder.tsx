"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface NeonBorderProps {
  children: ReactNode
  className?: string
  color?: "rose" | "purple" | "blue"
}

export default function NeonBorder({ children, className = "", color = "rose" }: NeonBorderProps) {
  const colors = {
    rose: "from-rose-400 to-rose-500",
    purple: "from-purple-400 to-purple-500",
    blue: "from-blue-400 to-blue-500",
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className={`relative p-1 rounded-xl ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${colors[color]} rounded-xl blur-lg opacity-75`} />
      <div className="relative bg-white dark:bg-slate-950 rounded-xl p-6">{children}</div>
    </motion.div>
  )
}
