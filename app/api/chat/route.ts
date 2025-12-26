import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

const INTENTS = {
  GREETING: {
    patterns: ["hi", "hello", "namaste", "hey", "shukriya", "kaise ho", "kaisa hai", "hiya"],
    response: "greeting",
  },
  APPOINTMENT: {
    patterns: [
      "book",
      "appointment",
      "slot",
      "timing",
      "date",
      "time",
      "schedule",
      "booking",
      "mil sakta",
      "available",
      "kab",
      "session",
    ],
    response: "appointment",
  },
  PACKAGES: {
    patterns: ["package", "pricing", "cost", "rate", "price", "plan", "offer", "deal", "services", "rate"],
    response: "packages",
  },
  PAYMENT: {
    patterns: ["payment", "pay", "cost", "charge", "amount", "price", "paise", "bill"],
    response: "payment",
  },
  ABOUT: {
    patterns: ["about", "who are you", "story", "team", "experience", "history", "studio", "aap kaun"],
    response: "about",
  },
  CONTACT: {
    patterns: ["contact", "phone", "email", "address", "reach", "connect", "number"],
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
  const systemPrompt = `
You are Tiny Treasures Studio's friendly virtual assistant. Your name is implied by the studio.

TONE & PERSONALITY:
- Friendly, polite, confident, and supportive
- Use simple Hinglish (Hindi-English mix naturally)
- Short, clear, helpful replies (max 2-3 sentences)
- Never robotic or overwhelming
- Always solution-oriented

KEY RULES:
1. Never mention AI models, OpenAI, or that you're an AI
2. Never say "as an AI model" or expose internal logic
3. Always stay in character as a human assistant
4. Keep responses conversational and warm
5. Add helpful context without being pushy

RESPONSE GUIDELINES BY INTENT:
- APPOINTMENT: Mention Mon-Sat, 9 AM-9 PM, 1-hour slots. Suggest booking now.
- PACKAGES: Direct to packages with enthusiasm
- PAYMENT: Explain payment process simply
- CONTACT: Provide contact options warmly
- GREETING: Greet warmly and ask how to help
- GENERAL: Offer to help or escalate if needed

User message: "${message}"
Intent: ${intent}

Respond ONLY with the chat message - nothing else. Keep it Hinglish, natural, and helpful.
`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: systemPrompt,
      temperature: 0.8,
      maxTokens: 100,
    })

    return text.trim()
  } catch (error) {
    console.error("AI generation error:", error)
    return getDefaultResponse(intent)
  }
}

function getDefaultResponse(intent: string): string {
  const responses: Record<string, string> = {
    greeting:
      "Hi 👋 Main aapka assistant hoon! Kaise help kar sakta hoon aapko aaj? Appointment, packages, ya kuch aur?",
    appointment:
      "Bilkul! Hum Monday se Saturday tak appointments dete hain, 9 AM se 9 PM tak. Har session 1 hour ka hota hai. Kab book karna hai?",
    packages:
      "Hum bahut sare premium packages offer karte hain! Aap yahan dekh sakte ho details, pricing, aur availability. Kaunsa package pasand hai aapko?",
    payment:
      "Payment bahut simple hai! Aap card, UPI, ya bank transfer se pay kar sakte ho. Kya aapko payment process samajhana hai?",
    about:
      "Hum ek professional photography studio hain jo quality, trust, aur best experience pe focus karte hain. Aur jaankari chahiye?",
    contact:
      "Aap humse directly contact kar sakte ho Contact Page se ya mujhe aapka number dikha duun. Aap kya prefer karte ho?",
    general:
      "Iska thoda clarify kar denge? Ya main aapko admin se connect kara duun? Main yahan hoon help karne ke liye!",
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
    return NextResponse.json(
      {
        message: "Kshama kijiye, kuch problem ho gaya. Please dobara try kijiye.",
        intent: "error",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  }
}
