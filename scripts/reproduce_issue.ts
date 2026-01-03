
import mongoose from "mongoose";
import Stripe from "stripe";

import path from "path";

import fs from "fs";

// Load env vars manually
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

// Models
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    role: { type: String, default: 'user' },
    name: { type: String }
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' }, // Use Package model if needed
    status: { type: String, default: 'pending' },
    bookingDate: { type: Date, default: Date.now },
});
const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

// Mocks
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
    apiVersion: "2024-12-18.acacia",
});

async function main() {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to DB");

    // 1. Find Admin User
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
        console.error("No admin user found!");
        process.exit(1);
    }
    console.log("Found admin:", admin.email, admin._id.toString());

    // 2. Mock Data
    const packageId = new mongoose.Types.ObjectId(); // Fake package ID
    const title = "Test Package";
    const price = 100;
    const image = "/test.jpg";

    try {
        // 3. Create Pending Booking (Logic from route.ts)
        console.log("Attempting to create booking...");
        const newBooking = await Booking.create({
            userId: admin._id,
            packageId: packageId,
            status: "pending",
            bookingDate: new Date(),
        });
        console.log("Booking created:", newBooking._id);

        // 4. Create Stripe Session (Logic from route.ts)
        console.log("Attempting to create stripe session...");
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: title,
                            images: ["http://localhost:3000/test.jpg"]
                        },
                        unit_amount: Math.round(price * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/packages`,
            metadata: {
                packageId: packageId.toString(),
                bookingId: newBooking._id.toString(),
            },
        });

        console.log("Session created successfully:", session.url);

    } catch (err) {
        console.error("Error creating session:", err);
    } finally {
        await mongoose.disconnect();
    }
}

main();
