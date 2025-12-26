import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const query = currentUser.role === "admin" ? {} : { userId: currentUser.id }
    const bookings = await Booking.find(query).populate("userId packageId")

    return NextResponse.json({ bookings }, { status: 200 })
  } catch (error) {
    console.error("[v0] Get bookings error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { packageId, sessionDate, notes } = await request.json()

    const newBooking = new Booking({
      userId: currentUser.id,
      packageId,
      sessionDate,
      notes,
    })

    await newBooking.save()

    return NextResponse.json(
      {
        message: "Booking created successfully",
        booking: newBooking,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Create booking error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
