"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedHeadingProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function AnimatedHeading({ children, className = "", delay = 0 }: AnimatedHeadingProps) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={`gradient-text-animated font-bold ${className}`}
    >
      {children}
    </motion.h2>
  )
}
