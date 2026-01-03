
import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
    // @ts-ignore
    apiVersion: "2024-06-20",
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
            return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
        }

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            await connectDB();
            const bookingId = session.metadata?.bookingId;

            if (bookingId) {
                await Booking.findByIdAndUpdate(bookingId, { status: "confirmed" });
                return NextResponse.json({ status: "confirmed", bookingId });
            } else {
                return NextResponse.json({ error: "No booking ID found in session metadata" }, { status: 400 });
            }
        } else {
            return NextResponse.json({ status: "pending", message: "Payment not completed" });
        }
    } catch (error: any) {
        console.error("Payment Confirmation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
