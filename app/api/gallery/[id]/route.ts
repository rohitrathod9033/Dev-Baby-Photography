import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Gallery from "@/models/Gallery"
import { getCurrentUser } from "@/lib/auth"

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const { id } = params
        const deleted = await Gallery.findByIdAndDelete(id)

        if (!deleted) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Item deleted successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
    }
}
