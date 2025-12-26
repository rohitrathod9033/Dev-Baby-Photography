"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react"

interface ModernVideoPlayerProps {
  src: string
  thumbnail?: string
  title?: string
  className?: string
}

export default function ModernVideoPlayer({ src, thumbnail, title, className = "" }: ModernVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen()
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  return (
    <div
      className={`relative w-full bg-black rounded-xl overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={thumbnail}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Play Button Overlay */}
      {!isPlaying && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 transition-all"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-20 h-20 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </motion.div>
        </motion.button>
      )}

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 ${
          showControls ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Progress Bar */}
        <div
          className="w-full h-1 bg-slate-700 rounded-full cursor-pointer mb-3 hover:h-2 transition-all"
          onClick={(e) => {
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
            const percent = (e.clientX - rect.left) / rect.width
            if (videoRef.current) {
              videoRef.current.currentTime = percent * videoRef.current.duration
            }
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlayPause} className="hover:scale-110 transition-transform">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
            </button>

            <button onClick={toggleMute} className="hover:scale-110 transition-transform">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {title && <span className="text-sm font-medium">{title}</span>}
          </div>

          <button onClick={toggleFullscreen} className="hover:scale-110 transition-transform">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
