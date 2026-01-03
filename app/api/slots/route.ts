import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Slot, { ISlot } from "@/models/Slot"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const dateStr = searchParams.get("date")

        if (!dateStr) {
            return NextResponse.json({ error: "Date is required" }, { status: 400 })
        }

        const queryDate = new Date(dateStr)
        let existingSlots: ISlot[] = []

        try {
            await connectDB()

            const startOfDay = new Date(queryDate)
            startOfDay.setUTCHours(0, 0, 0, 0)

            const endOfDay = new Date(queryDate)
            endOfDay.setUTCHours(23, 59, 59, 999)

            // Find existing slots in DB
            existingSlots = await Slot.find({
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            })
        } catch (dbError) {
            console.error("Database connection or query failed:", dbError)
            // Fallback to empty existingSlots => generated slots will be returned
        }

        // Generate standard slots for the day
        const startOfDay = new Date(queryDate)
        startOfDay.setUTCHours(0, 0, 0, 0)

        const generatedSlots = generateTimeSlots(startOfDay)

        // Merge generated slots with existing DB slots (DB takes precedence)
        const finalSlots = generatedSlots.map((genSlot) => {
            // Find matching slot in DB by startTime
            const dbSlot = existingSlots.find((s) => s.startTime === genSlot.startTime)

            if (dbSlot) {
                return {
                    date: dbSlot.date.toISOString(),
                    startTime: dbSlot.startTime,
                    endTime: dbSlot.endTime,
                    isBooked: dbSlot.isBooked,
                }
            }

            return genSlot
        })

        return NextResponse.json({ slots: finalSlots })
    } catch (error) {
        console.error("Error fetching slots:", error)
        return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 })
    }
}

function generateTimeSlots(date: Date) {
    const slots = []
    const startHour = 9 // 9 AM
    const endHour = 21 // 9 PM

    // Create a base date string to minimize mutation issues
    const dateIso = date.toISOString()

    for (let i = startHour; i < endHour; i++) {
        slots.push({
            date: dateIso,
            startTime: formatTime(i),
            endTime: formatTime(i + 1),
            isBooked: false,
        })
    }

    return slots
}

function formatTime(hour: number) {
    const h = hour > 12 ? hour - 12 : hour
    // Handle 12 PM and 12 AM cases if needed (though loop starts at 9)
    const ampm = hour >= 12 && hour < 24 ? "PM" : "AM"
    return `${h}:00 ${ampm}`
}
