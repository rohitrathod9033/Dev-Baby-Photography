import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ContactMessage from "@/models/ContactMessage"

export async function POST(req: Request) {
    try {
        const { name, email, mobile, subject, message } = await req.json()

        // Validate input
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Please provide all required fields" },
                { status: 400 }
            )
        }

        await connectDB()

        const newMessage = await ContactMessage.create({
            name,
            email,
            mobile,
            subject,
            message,
        })

        return NextResponse.json(
            { message: "Message sent successfully", success: true, data: newMessage },
            { status: 201 }
        )
    } catch (error) {
        console.error("Contact API Error:", error)
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        )
    }
}
