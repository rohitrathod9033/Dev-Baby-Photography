"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Check, AlertCircle, Loader2 } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface Slot {
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
}

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)
  const [bookingSlot, setBookingSlot] = useState<Slot | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate)
    }
  }, [selectedDate])

  const fetchSlots = async (date: Date) => {
    setLoading(true)
    try {
      const dateString = date.toISOString().split("T")[0]
      const response = await fetch(`/api/slots?date=${dateString}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      setSlots(data.slots || [])
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch available slots")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBookSlot = async (slot: Slot) => {
    setIsBooking(true)
    setError("")
    try {
      const response = await fetch("/api/slots/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate?.toISOString(),
          startTime: slot.startTime,
          endTime: slot.endTime,
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          logout() // Clear client session
          router.push("/login")
          throw new Error("Session expired. Please login again.")
        }
        const data = await response.json()
        throw new Error(data.error || "Failed to book slot")
      }

      setSuccess(true)
      setBookingSlot(slot)
      setSlots(slots.filter((s) => s.startTime !== slot.startTime))

      setTimeout(() => {
        setSuccess(false)
        setBookingSlot(null)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book slot")
    } finally {
      setIsBooking(false)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">Book Your Session</h1>
          <p className="text-lg text-foreground/70">Choose your preferred date and time from our available slots</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Date Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl p-8 border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-serif font-bold text-foreground">Select Date</h2>
            </div>

            <input
              type="date"
              min={getMinDate()}
              onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <p className="text-sm text-foreground/60 mt-4">Available Monday to Saturday, 9:00 AM to 9:00 PM</p>
          </motion.div>

          {/* Booking Confirmation */}
          {success && bookingSlot && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                <Check className="w-12 h-12 text-green-600 mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">Booking Confirmed!</h3>
              <p className="text-green-700 mb-2">
                {bookingSlot.startTime} - {bookingSlot.endTime}
              </p>
              <p className="text-sm text-green-600">Redirecting to your bookings...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-8 flex items-center gap-4"
            >
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-red-900 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Slots Grid */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              Available Times
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : slots.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-card rounded-2xl border border-border"
              >
                <Calendar className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                <p className="text-foreground/60 text-lg">No available slots for this date</p>
                <p className="text-foreground/40 text-sm mt-2">Please choose another date</p>
              </motion.div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                {slots.map((slot) => (
                  <motion.button
                    key={slot.startTime}
                    variants={item}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBookSlot(slot)}
                    disabled={isBooking}
                    className="py-3 px-4 rounded-lg border-2 border-border bg-card text-foreground font-medium transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {slot.startTime}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  )
}

