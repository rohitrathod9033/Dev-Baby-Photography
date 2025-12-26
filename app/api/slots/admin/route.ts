import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Slot from "@/models/Slot"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")

    const query: any = {}
    if (dateParam) {
      const selectedDate = new Date(dateParam)
      query.date = {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999)),
      }
    }

    const slots = await Slot.find(query).populate("bookedBy", "name email").sort({ date: 1, startTime: 1 })

    return NextResponse.json({ slots }, { status: 200 })
  } catch (error) {
    console.error("[v0] Admin get slots error:", error)
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { slotId } = await request.json()

    const result = await Slot.findByIdAndDelete(slotId)

    if (!result) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Slot deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Delete slot error:", error)
    return NextResponse.json({ error: "Failed to delete slot" }, { status: 500 })
  }
}
