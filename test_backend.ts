
// Mock Next.js Request/Response if needed but we just want to test logic.
// We will test the logic of generating slots and DB query.

import connectDB from "./lib/mongodb";
import Slot from "./models/Slot";

async function main() {
    console.log("Connecting to DB...");
    try {
        const conn = await connectDB();
        console.log("Connected to DB state:", conn.readyState); // 1 = connected
    } catch (e) {
        console.error("DB Connection Failed:", e);
        return;
    }

    const dateStr = "2025-01-01";
    const queryDate = new Date(dateStr);
    console.log("Query Date:", queryDate);

    const startOfDay = new Date(queryDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(queryDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log("Start:", startOfDay);
    console.log("End:", endOfDay);

    try {
        const existingSlots = await Slot.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });
        console.log("Existing Slots found:", existingSlots.length);
        if (existingSlots.length > 0) {
            console.log("Sample slot:", existingSlots[0]);
        }
    } catch (e) {
        console.error("Slot.find failed:", e);
    }

    // Test generation logic
    const slots = [];
    const startHour = 9;
    const endHour = 21;
    const dateIso = queryDate.toISOString();

    for (let i = startHour; i < endHour; i++) {
        slots.push({
            date: dateIso,
            startTime: formatTime(i),
            endTime: formatTime(i + 1),
            isBooked: false,
        });
    }
    console.log("Generated slots count:", slots.length);
    console.log("First generated slot:", slots[0]);

    process.exit(0);
}

function formatTime(hour: number) {
    const h = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 && hour < 24 ? "PM" : "AM";
    return `${h}:00 ${ampm}`;
}

main();
