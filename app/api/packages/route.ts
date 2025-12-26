import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Package from "@/models/Package"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const packages = await Package.find()
    return NextResponse.json({ packages }, { status: 200 })
  } catch (error) {
    console.error("[v0] Get packages error:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()

    const newPackage = new Package(data)
    await newPackage.save()

    return NextResponse.json(
      {
        message: "Package created successfully",
        package: newPackage,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Create package error:", error)
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 })
  }
}
