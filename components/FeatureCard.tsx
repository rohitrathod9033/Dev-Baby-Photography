"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FeatureCardProps {
  icon?: ReactNode
  title: string
  description: string
  delay?: number
  gradient?: boolean
}

const FeatureCard = ({ icon, title, description, delay = 0, gradient = false }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
      className={`relative rounded-2xl p-8 border border-border transition-all overflow-hidden ${
        gradient ? "bg-gradient-to-br from-primary/5 to-transparent" : "bg-card"
      }`}
    >
      {/* Animated background on hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
      </div>

      <div className="relative z-10">
        {icon && <div className="mb-4 text-primary text-4xl">{icon}</div>}
        <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
        <p className="text-foreground/70 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

export default FeatureCard
