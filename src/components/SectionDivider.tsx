"use client"

import { motion } from "framer-motion"

interface SectionDividerProps {
  variant?: "wave" | "zigzag" | "dots"
  color?: string
}

const SectionDivider = ({ variant = "wave", color = "bg-primary" }: SectionDividerProps) => {
  return (
    <div className="w-full h-16 flex items-center justify-center overflow-hidden">
      {variant === "wave" && (
        <motion.svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.87,168.19-17.5,250.6-.39C823.78,31,906.4,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill={`hsl(var(--primary))`}
            className="fill-primary opacity-75"
          />
          <motion.path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.87,168.19-17.5,250.6-.39C823.78,31,906.4,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill={`hsl(var(--primary))`}
            className="fill-primary opacity-50"
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.svg>
      )}

      {variant === "zigzag" && (
        <motion.div
          className="w-full flex gap-2 justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${color}`}
              animate={{ y: [0, -10, 0] }}
              transition={{ delay: i * 0.1, duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
          ))}
        </motion.div>
      )}

      {variant === "dots" && (
        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full ${color}`}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ delay: i * 0.2, duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default SectionDivider
