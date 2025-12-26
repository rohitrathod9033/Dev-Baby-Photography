"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"

interface AnimatedStatsProps {
  value: number
  label: string
  suffix?: string
}

export default function AnimatedStats({ value, label, suffix = "" }: AnimatedStatsProps) {
  const { ref, inView } = useInView({ threshold: 0.5 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev < value) {
          return prev + Math.ceil(value / 50)
        }
        return value
      })
    }, 30)

    return () => clearInterval(interval)
  }, [inView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="text-4xl font-bold gradient-text-animated mb-2">
        {count}
        {suffix}
      </div>
      <p className="text-slate-600 dark:text-slate-400">{label}</p>
    </motion.div>
  )
}
