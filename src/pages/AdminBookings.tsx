"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Trash2, Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useNavigate } from "react-router-dom"

interface BookedSlot {
  _id: string
  date: string
  startTime: string
  endTime: string
  bookedBy?: {
    name: string
    email: string
  }
}

const AdminBookings = () => {
  const [slots, setSlots] = useState<BookedSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState("")
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin-login")
    }
  }, [isAdmin, navigate])

  useEffect(() => {
    fetchSlots()
  }, [selectedDate])

  const fetchSlots = async () => {
    setLoading(true)
    try {
      const url = selectedDate ? `/api/slots/admin?date=${selectedDate}` : "/api/slots/admin"
      const response = await fetch(url)
      const data = await response.json()
      setSlots(data.slots || [])
      setError("")
    } catch (err) {
      setError("Failed to fetch bookings")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSlot = async (slotId: string) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return

    setDeleting(slotId)
    try {
      const response = await fetch("/api/slots/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId }),
      })

      if (!response.ok) throw new Error("Failed to delete")

      setSlots(slots.filter((s) => s._id !== slotId))
    } catch (err) {
      setError("Failed to delete booking")
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  const bookedSlots = slots.filter((s) => s.bookedBy)
  const allSlots = slots.length

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Manage Bookings</h1>
          <p className="text-foreground/70">View and manage all appointment slots</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-foreground/60 text-sm mb-2">Total Slots</p>
            <p className="text-3xl font-bold text-foreground">{allSlots}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-foreground/60 text-sm mb-2">Booked</p>
            <p className="text-3xl font-bold text-primary">{bookedSlots.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-foreground/60 text-sm mb-2">Available</p>
            <p className="text-3xl font-bold text-green-600">{allSlots - bookedSlots.length}</p>
          </div>
        </div>

        {/* Date Filter */}
        <div className="mb-8">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Slots Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : bookedSlots.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <Calendar className="w-12 h-12 text-foreground/30 mx-auto mb-3" />
            <p className="text-foreground/60">No bookings found</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Time</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Customer Name</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Email</th>
                  <th className="text-right py-3 px-4 text-foreground font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookedSlots.map((slot, index) => (
                  <motion.tr
                    key={slot._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-card/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-foreground">{new Date(slot.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-foreground">
                      {slot.startTime} - {slot.endTime}
                    </td>
                    <td className="py-3 px-4 text-foreground">{slot.bookedBy?.name || "N/A"}</td>
                    <td className="py-3 px-4 text-foreground/70">{slot.bookedBy?.email || "N/A"}</td>
                    <td className="py-3 px-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteSlot(slot._id)}
                        disabled={deleting === slot._id}
                        className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                      >
                        {deleting === slot._id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminBookings
