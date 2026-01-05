// Force rebuild
import Stripe from "stripe";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getCurrentUser } from "@/lib/auth";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing in environment variables");
}

const stripe = new Stripe(stripeSecretKey, {
    // @ts-ignore
    apiVersion: "2024-06-20",
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

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        console.log("Creating checkout session with App URL:", appUrl);

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
                                        : `${appUrl}${image}`,
                                ]
                                : [],
                        },
                        unit_amount: Math.round(price * 100), // Stripe expects amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/packages`,
            metadata: {
                packageId: String(packageId),
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
