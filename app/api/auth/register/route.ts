import { NextResponse } from "next/server"
import { signToken, setAuthCookie, JwtPayload } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json()

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Please provide all fields" }, { status: 400 })
        }

        await connectDB()

        // Check if user already exists
        const userExists = await User.findOne({ email })
        if (userExists) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        })

        // Create JWT payload
        const payload: JwtPayload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        }

        // Sign and set cookie
        const token = await signToken(payload)
        await setAuthCookie(token)

        // Return user info
        const userInfo = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        }

        return NextResponse.json({ user: userInfo })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Registration failed" }, { status: 500 })
    }
}
