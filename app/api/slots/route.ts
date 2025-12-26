import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Slot from "@/models/Slot"
import { addDays, setHours, setMinutes, getDay, format, parseISO } from "date-fns"

// Generate slots for a given date
function generateSlotsForDate(date: Date) {
  const dayOfWeek = getDay(date)

  // No slots on Sunday (0)
  if (dayOfWeek === 0) {
    return []
  }

  const slots = []
  // 9 AM to 9 PM (12 slots of 1 hour each)
  for (let hour = 9; hour < 21; hour++) {
    const startTime = format(setMinutes(setHours(date, hour), 0), "HH:mm")
    const endTime = format(setMinutes(setHours(date, hour + 1), 0), "HH:mm")
    slots.push({ startTime, endTime, date: new Date(date) })
  }
  return slots
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")

    if (!dateParam) {
      // Return slots for the next 30 days
      const slots = []
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (let i = 0; i < 30; i++) {
        const currentDate = addDays(today, i)
        const daySlots = generateSlotsForDate(currentDate)
        if (daySlots.length > 0) {
          // Get existing booked slots from DB
          const bookedSlots = await Slot.find({
            date: {
              $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
              $lt: new Date(currentDate.setHours(23, 59, 59, 999)),
            },
            isBooked: true,
          })

          const bookedTimes = bookedSlots.map((s) => s.startTime)
          slots.push(
            ...daySlots
              .filter((slot) => !bookedTimes.includes(slot.startTime))
              .map((slot) => ({
                ...slot,
                isBooked: false,
              })),
          )
        }
      }

      return NextResponse.json({ slots }, { status: 200 })
    }

    // Get slots for a specific date
    const selectedDate = parseISO(dateParam)
    const dayOfWeek = getDay(selectedDate)

    if (dayOfWeek === 0) {
      return NextResponse.json({ slots: [], message: "No slots available on Sunday" }, { status: 200 })
    }

    const daySlots = generateSlotsForDate(selectedDate)
    const bookedSlots = await Slot.find({
      date: {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999)),
      },
      isBooked: true,
    })

    const bookedTimes = bookedSlots.map((s) => s.startTime)
    const availableSlots = daySlots.filter((slot) => !bookedTimes.includes(slot.startTime))

    return NextResponse.json({ slots: availableSlots }, { status: 200 })
  } catch (error) {
    console.error("[v0] Get slots error:", error)
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 })
  }
}
