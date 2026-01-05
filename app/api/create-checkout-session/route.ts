// Force rebuild
import Stripe from "stripe";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getCurrentUser } from "@/lib/auth";


const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: Request) {
    console.log("Processing checkout session request...");

    try {
        if (!stripeSecretKey) {
            console.error("STRIPE_SECRET_KEY is missing");
            return NextResponse.json(
                { error: "Server configuration error: STRIPE_SECRET_KEY missing" },
                { status: 500 }
            );
        }

        const stripe = new Stripe(stripeSecretKey, {
            // @ts-ignore
            apiVersion: "2024-06-20",
        });

        const body = await req.json();
        console.log("Request body:", JSON.stringify(body));
        const { packageId, title, price, image } = body;

        if (!packageId || !title || !price) {
            console.error("Missing required fields:", { packageId, title, price });
            return NextResponse.json(
                { error: "Missing required package details" },
                { status: 400 }
            );
        }

        await connectDB();
        const user = await getCurrentUser();

        if (!user) {
            console.warn("Unauthorized access attempt");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Create Pending Booking
        console.log("Creating pending booking for user:", user.id);
        const newBooking = await Booking.create({
            userId: user.id,
            packageId: packageId,
            status: "pending",
            bookingDate: new Date(),
        });

        let appUrl = process.env.NEXT_PUBLIC_APP_URL;
        console.log("Environment:", {
            NODE_ENV: process.env.NODE_ENV,
            APP_URL: appUrl,
            params: { packageId, title, price }
        });

        if (process.env.NODE_ENV === "production") {
            if (!appUrl) {
                console.error("CRITICAL: NEXT_PUBLIC_APP_URL is missing in production");
                throw new Error("NEXT_PUBLIC_APP_URL is missing in production environment");
            }
            if (appUrl.includes("localhost")) {
                console.warn("Warning: NEXT_PUBLIC_APP_URL is set to localhost in production");
            }
        }

        appUrl = appUrl || "http://localhost:3000";

        // Construct image URL safely
        const imageUrl = image
            ? (image.startsWith("http") ? image : `${appUrl}${image}`)
            : null;

        console.log("Stripe Line Item Image URL:", imageUrl);

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: title,
                            images: imageUrl ? [imageUrl] : [],
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

        console.log("Checkout session created:", session.id);
        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe Checkout Error Stack:", err.stack);
        console.error("Stripe Checkout Error Message:", err.message);
        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
