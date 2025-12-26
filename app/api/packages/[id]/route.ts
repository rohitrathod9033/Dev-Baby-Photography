import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Package from "@/models/Package"
import { getCurrentUser } from "@/lib/auth"
import { Types } from "mongoose"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 })
    }

    const pkg = await Package.findById(id)
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({ package: pkg })
  } catch (error) {
    console.error("[v0] Get package error:", error)
    return NextResponse.json({ error: "Failed to fetch package" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 })
    }

    const data = await request.json()
    const updatedPackage = await Package.findByIdAndUpdate(id, data, { new: true })

    if (!updatedPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Package updated successfully",
      package: updatedPackage,
    })
  } catch (error) {
    console.error("[v0] Update package error:", error)
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 })
    }

    const deletedPackage = await Package.findByIdAndDelete(id)

    if (!deletedPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Package deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete package error:", error)
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 })
  }
}
