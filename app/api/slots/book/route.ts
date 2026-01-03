import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Slot from "@/models/Slot"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { date, startTime, endTime } = body

        if (!date || !startTime || !endTime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        await connectDB()

        const bookingDate = new Date(date)
        // Normalize to midnight UTC to match our storage convention if strictly needed,
        // but the query below handles finding the likely candidate.
        // However, if we are creating a new slot, we should ensure the date is clean.
        bookingDate.setUTCHours(0, 0, 0, 0)

        // Check if slot already exists
        const existingSlot = await Slot.findOne({
            date: bookingDate,
            startTime: startTime,
        })

        if (existingSlot) {
            if (existingSlot.isBooked) {
                return NextResponse.json({ error: "Slot already booked" }, { status: 409 })
            }

            // Update existing slot
            existingSlot.isBooked = true
            existingSlot.bookedBy = user.id
            await existingSlot.save()
        } else {
            // Create new slot
            await Slot.create({
                date: bookingDate,
                startTime,
                endTime,
                isBooked: true,
                bookedBy: user.id,
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error booking slot:", error)
        return NextResponse.json({ error: "Failed to book slot" }, { status: 500 })
    }
}
