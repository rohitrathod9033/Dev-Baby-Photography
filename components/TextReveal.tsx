"use client"

import { motion } from "framer-motion"

interface TextRevealProps {
  text: string
  delay?: number
}

export default function TextReveal({ text, delay = 0 }: TextRevealProps) {
  const words = text.split(" ")

  return (
    <div className="flex flex-wrap gap-2">
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + index * 0.05 }}
          viewport={{ once: true }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}
