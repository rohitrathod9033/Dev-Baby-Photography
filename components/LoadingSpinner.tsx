"use client"

import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  message?: string
}

const LoadingSpinner = ({ size = "md", message }: LoadingSpinnerProps) => {
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 60,
  }

  const dotSize = size === "sm" ? 3 : size === "md" ? 4 : 6

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
        className="relative"
        style={{ width: sizeMap[size], height: sizeMap[size] }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.6,
              delay: i * 0.2,
            }}
            className="absolute w-full h-full"
            style={{
              transform: `rotate(${(360 / 8) * i}deg)`,
            }}
          >
            <div
              className="bg-primary rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"
              style={{
                width: dotSize,
                height: dotSize,
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-foreground/70 text-sm font-medium"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

export default LoadingSpinner
