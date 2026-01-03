// Force rebuild
import Stripe from "stripe";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getCurrentUser } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
    apiVersion: "2024-12-18.acacia",
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

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: title,
                            images: image
                                ? [
                                    image.startsWith("http")
                                        ? image
                                        : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${image}`,
                                ]
                                : [],
                        },
                        unit_amount: Math.round(price * 100), // Stripe expects amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/packages`,
            metadata: {
                packageId,
                bookingId: newBooking._id.toString(),
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe Checkout Error:", err);
        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
