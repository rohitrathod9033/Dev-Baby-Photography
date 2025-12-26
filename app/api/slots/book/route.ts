import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Slot from "@/models/Slot"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { date, startTime, endTime } = await request.json()

    if (!date || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if slot already exists
    let slot = await Slot.findOne({
      date: new Date(date),
      startTime,
      endTime,
    })

    // CRITICAL: Prevent double booking at DB level
    if (slot && slot.isBooked) {
      return NextResponse.json({ error: "Slot is already booked" }, { status: 409 })
    }

    if (!slot) {
      // Create new slot if it doesn't exist
      slot = new Slot({
        date: new Date(date),
        startTime,
        endTime,
        isBooked: true,
        bookedBy: currentUser.id,
      })
    } else {
      // Update existing slot
      slot.isBooked = true
      slot.bookedBy = currentUser.id
    }

    await slot.save()

    return NextResponse.json(
      {
        message: "Slot booked successfully",
        slot,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Book slot error:", error)
    return NextResponse.json({ error: "Failed to book slot" }, { status: 500 })
  }
}
