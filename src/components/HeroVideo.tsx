"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"
import VideoPlayer from "./VideoPlayer"
import { useState } from "react"

interface HeroVideoProps {
  title?: string
  description?: string
  videoSrc?: string
  videoPoster?: string
}

const HeroVideo = ({ title = "Our Studio", description, videoSrc, videoPoster }: HeroVideoProps) => {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {title && <h2 className="text-4xl font-serif font-bold text-foreground mb-4 text-center">{title}</h2>}
          {description && <p className="text-lg text-foreground/70 text-center mb-12">{description}</p>}

          {videoSrc ? (
            <div className="rounded-2xl overflow-hidden border border-border">
              <VideoPlayer src={videoSrc} poster={videoPoster} />
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 aspect-video flex items-center justify-center cursor-pointer group"
              onClick={() => setShowVideo(true)}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Play className="w-20 h-20 text-white fill-white" />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default HeroVideo
