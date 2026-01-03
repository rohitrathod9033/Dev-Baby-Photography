import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Match the connection string from lib/mongodb.ts or use the default
const MONGODB_URI = "mongodb+srv://rohitrathod60371:rohitrathod60371@dev-baby-photography.jvochng.mongodb.net";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const email = "admin@gmail.com";
        const password = "admin@123"; // Updated per user request
        const name = "Admin User";

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log(`Admin user already exists: ${email}`);
            console.log("If you don't know the password, you can update it in this script.");
            // Update password if it exists just to be sure
            const salt = await bcrypt.genSalt(10);
            existingAdmin.password = await bcrypt.hash(password, salt);
            await existingAdmin.save();
            console.log("Password updated to 'adminpassword'");
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const admin = await User.create({
                email,
                password: hashedPassword,
                name,
                role: "admin",
            });

            console.log("Admin user created successfully!");
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error("Error managing admin user:", error);
        process.exit(1);
    }
}

createAdmin();

