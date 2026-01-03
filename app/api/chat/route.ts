import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
    let message = ""
    try {
        const body = await req.json()
        message = body.message

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                message: "Gemini API Key is missing. Please configure GEMINI_API_KEY in .env file.",
                intent: "general"
            })
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

        const prompt = `
        You are the virtual assistant for 'Dev Baby Photography' (also known as Tiny Treasures).
        Your goal is to help users with appointments, packages, pricing, and payments.
        Be polite, helpful, and concise.
        
        You must respond in a valid JSON format with two fields:
        1. 'message': Your natural language response to the user.
        2. 'intent': One of the following values based on the user's need: 'appointment', 'packages', 'payment', 'contact', 'greeting', 'general'.
        
        Intent Guide:
        - appointment: for booking, looking for slots, or timing questions.
        - packages: for prices, costs, or package descriptions.
        - payment: for questions about how to pay.
        - contact: for calls, emails, or location.
        - greeting: for hi, hello, or intros.
        - general: for anything else.

        Do NOT include markdown formatting like \`\`\`json. Just return the raw JSON string.
        
        User's message: "${message}"
        `

        const result = await model.generateContent(prompt)
        const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim()

        const responseData = JSON.parse(responseText)

        return NextResponse.json({
            message: responseData.message,
            intent: responseData.intent
        })

    } catch (error: any) {
        console.error("Chat API Error:", error)

        // Fallback Logic
        const lowerMsg = message.toLowerCase()
        let responseMessage = "I'm having trouble connecting to my AI brain. However, I can still try to help."
        let intent = "general"

        if (lowerMsg.includes("appointment") || lowerMsg.includes("book") || lowerMsg.includes("slot")) {
            responseMessage = "You can book an appointment or view available slots on our Appointments page."
            intent = "appointment"
        } else if (lowerMsg.includes("package") || lowerMsg.includes("price") || lowerMsg.includes("cost")) {
            responseMessage = "We have various packages available. You can check them out on our Packages page."
            intent = "packages"
        } else if (lowerMsg.includes("pay") || lowerMsg.includes("money")) {
            responseMessage = "For payments, you can proceed through the booking flow. If you have issues, please contact admin."
            intent = "payment"
        } else if (lowerMsg.includes("contact") || lowerMsg.includes("call") || lowerMsg.includes("email") || lowerMsg.includes("mobile")) {
            responseMessage = "You can contact us via our Contact form or using the details provided."
            intent = "contact"
        } else if (lowerMsg.includes("hi") || lowerMsg.includes("hello")) {
            responseMessage = "Hello! I am currently running on backup power, but I can still assist you with basics!"
            intent = "greeting"
        }

        return NextResponse.json({
            message: responseMessage,
            intent: intent,
            isFallback: true
        })
    }
}
