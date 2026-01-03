"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Services from "@/components/Services"
import Testimonials from "@/components/Testimonials"
import Gallery from "@/components/Gallery"
import CTA from "@/components/CTA"
import Footer from "@/components/Footer"
import ScrollToTop from "@/components/ScrollToTop"
import ParticleEffect from "@/components/ParticleEffect"
import AnimatedBackground from "@/components/AnimatedBackground"
import Chatbot from "@/components/Chatbot"

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen relative"
    >
      <AnimatedBackground />
      <ParticleEffect />

      <Navbar />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Testimonials />
        <CTA />
      </main>
      <Footer />

      <ScrollToTop />
      <Chatbot />
    </motion.div>
  )
}
