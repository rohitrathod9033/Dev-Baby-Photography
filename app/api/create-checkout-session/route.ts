import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getCurrentUser } from "@/lib/auth";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
    try {
        const { packageId, title, price, image } = await req.json();

        if (!packageId || !title || !price) {
            return NextResponse.json(
                { error: "Missing required package details" },
                { status: 400 }
            );
        }

        await connectDB();
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Create Pending Booking
        const newBooking = await Booking.create({
            userId: user.id,
            packageId: packageId,
            status: "pending",
            bookingDate: new Date(),
        });

        const amountInPaise = Math.round(price * 100);

        const options = {
            amount: amountInPaise,
            currency: "USD", // Or INR, depending on requirements. Assuming USD for now based on previous code.
            receipt: newBooking._id.toString(),
            notes: {
                packageId: String(packageId),
                bookingId: newBooking._id.toString(),
                userId: user.id,
            },
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            orderId: order.id,
            amount: amountInPaise,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            bookingId: newBooking._id.toString(), // Send this back for verification later if needed
        });

    } catch (err: any) {
        console.error("Razorpay Order Error:", err);
        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
