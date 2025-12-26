import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ContactMessage from "@/models/ContactMessage"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, message, subject } = await request.json()

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (message.length < 10) {
      return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 400 })
    }

    const newMessage = new ContactMessage({
      name,
      email,
      message,
      subject: subject || "General Inquiry",
    })

    await newMessage.save()

    return NextResponse.json(
      {
        message: "Message received successfully. We'll get back to you soon!",
        data: newMessage,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Contact message error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const messages = await ContactMessage.find().sort({ createdAt: -1 })

    return NextResponse.json({ messages }, { status: 200 })
  } catch (error) {
    console.error("[v0] Get contact messages error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
