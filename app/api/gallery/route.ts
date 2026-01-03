import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Gallery from "@/models/Gallery"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
    await connectDB()
    try {
        const items = await Gallery.find({}).sort({ createdAt: -1 })
        return NextResponse.json(items)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const body = await req.json()

        if (!body.type || !body.src) {
            return NextResponse.json({ error: "Type and source are required" }, { status: 400 })
        }

        const newItem = await Gallery.create(body)
        return NextResponse.json(newItem, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 })
    }
}
