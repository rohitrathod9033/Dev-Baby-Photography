
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
// Ensure models are registered to avoid populate errors
import "@/models/User";
import "@/models/Package";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    try {
        await connectDB();

        // Auth Check
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const bookings = await Booking.find({})
            .populate("userId", "name email")
            .populate("packageId", "title price")
            .sort({ createdAt: -1 });

        return NextResponse.json(bookings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
