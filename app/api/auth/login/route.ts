import { NextResponse } from "next/server"
import { signToken, setAuthCookie, JwtPayload } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }

        await connectDB()

        // Find user by email (include password for comparison)
        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Verify password
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Create JWT payload
        const payload: JwtPayload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        }

        // Sign and set cookie
        const token = await signToken(payload)
        await setAuthCookie(token)

        // Return user info (excluding password)
        const userInfo = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        }

        return NextResponse.json({ user: userInfo })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
