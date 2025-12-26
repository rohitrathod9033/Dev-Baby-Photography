import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

// Intent patterns for Hinglish detection
const INTENTS = {
  GREETING: {
    patterns: ["hi", "hello", "namaste", "hey", "shukriya", "kaise ho", "kaisa hai"],
    response: "greeting",
  },
  APPOINTMENT: {
    patterns: ["book", "appointment", "slot", "timing", "date", "time", "schedule", "booking"],
    response: "appointment",
  },
  PACKAGES: {
    patterns: ["package", "pricing", "cost", "rate", "price", "plan", "offer", "deal"],
    response: "packages",
  },
  ABOUT: {
    patterns: ["about", "who are you", "story", "team", "experience", "history"],
    response: "about",
  },
  CONTACT: {
    patterns: ["contact", "phone", "email", "address", "reach", "connect"],
    response: "contact",
  },
}

function detectIntent(message: string): string {
  const lowerMsg = message.toLowerCase()

  for (const [, intent] of Object.entries(INTENTS)) {
    if (intent.patterns.some((pattern) => lowerMsg.includes(pattern))) {
      return intent.response
    }
  }

  return "general"
}

async function generateChatbotResponse(message: string, intent: string) {
  const hinglishContext = `
You are Tiny Treasures Studio's AI Assistant. Respond in simple Hinglish (mix of Hindi and English).
Keep responses short (max 2-3 sentences), friendly, and actionable.
Always include a soft call-to-action.

User message: "${message}"
Detected intent: ${intent}

Guidelines:
- For appointments: Mention slots are available Mon-Sat, 9 AM - 9 PM, 1 hour each
- For packages: Direct them to packages page
- For contact: Provide friendly contact info
- Always be polite, confident, and helpful
- Use Hinglish naturally (e.g., "aap yahan se appointment book kar sakte ho")
- If unsure, offer to connect with admin

Respond with ONLY the chat message, no additional text.
`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: hinglishContext,
      temperature: 0.7,
      maxTokens: 150,
    })

    return text.trim()
  } catch (error) {
    console.error("AI generation error:", error)
    return getDefaultResponse(intent)
  }
}

function getDefaultResponse(intent: string): string {
  const responses: Record<string, string> = {
    greeting: "Hi! Main aapka assistant hoon. Kaise madad kar sakta hoon aaj?",
    appointment:
      "Bilkul! Appointments Monday-Saturday, 9 AM-9 PM available hain. Har slot 1 hour ka hota hai. Kaunsa date aur time chahiye?",
    packages:
      "Hum multiple premium packages offer karte hain. Aap details, pricing, aur availability yahin dekh sakte ho. Kaunsa package explore karna chahoge?",
    about:
      "Hum ek professional photography studio hain jo quality, trust, aur smooth experience pe focus karta hai. Kya main aapko more details dikha doon?",
    contact:
      "Aap humse Contact Page ke through directly connect kar sakte ho ya main aapko contact details dikha doon?",
    general:
      "Ye thoda specific lag raha hai. Main admin se connect karwa deta hoon ya aap thoda aur clarify kar sakte ho?",
  }

  return responses[intent] || responses.general
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const intent = detectIntent(message)
    const response = await generateChatbotResponse(message, intent)

    return NextResponse.json({
      message: response,
      intent,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
