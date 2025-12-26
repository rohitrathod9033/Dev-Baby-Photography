"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, MessageCircle } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  actions?: Array<{
    label: string
    action: string
    href?: string
  }>
}

export default function ChatbotWidget() {
  const [hasGreeted, setHasGreeted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!hasGreeted) {
      console.log("[v0] ChatbotWidget mounted, showing greeting")
      setHasGreeted(true)
      const openingMessage: Message = {
        id: "greeting",
        content:
          "Hi 👋\nMain aapka virtual assistant hoon 😊\nMain aapki appointment, packages, aur payments me help kar sakta hoon.\nAap kya karna chahoge?",
        sender: "bot",
        timestamp: new Date(),
        actions: [
          { label: "Appointment Book Karni Hai", action: "appointment", href: "/appointments" },
          { label: "Packages Dekh Sakte Ho", action: "packages", href: "/appointments" },
          { label: "Payment Help", action: "payment" },
        ],
      }
      setMessages([openingMessage])
    }
  }, [hasGreeted])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: "bot",
        timestamp: new Date(),
      }

      if (data.intent === "appointment") {
        botMessage.actions = [
          { label: "Appointment Book Karni Hai", action: "book_appointment", href: "/appointments" },
          { label: "Slots Dekho", action: "view_slots", href: "/appointments" },
        ]
      } else if (data.intent === "packages") {
        botMessage.actions = [
          { label: "Packages Explore Karo", action: "explore_packages", href: "/appointments" },
          { label: "Pricing Dekho", action: "pricing" },
        ]
      } else if (data.intent === "payment") {
        botMessage.actions = [
          { label: "Payment Kaise Hogi?", action: "payment_info" },
          { label: "Admin se Connect Karo", action: "admin_connect" },
        ]
      } else if (data.intent === "contact") {
        botMessage.actions = [
          { label: "Contact Form", action: "contact_form", href: "/contact" },
          { label: "Call Karo", action: "call" },
        ]
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("[v0] Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Kshama kijiye, kuch problem ho gaya. Please dobara try kijiye ya support team se contact kijiye.",
        sender: "bot",
        timestamp: new Date(),
        actions: [{ label: "Admin se Connect Karo", action: "admin_connect" }],
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string, href?: string) => {
    if (href) {
      window.location.href = href
    } else if (action === "call") {
      const userMsg: Message = {
        id: Date.now().toString(),
        content: "Mujhe call karni hai",
        sender: "user",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])

      const callMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: "Aap humse yahan call kar sakte ho: +91-XXXX-XXXX-XX\nYa aap kuch aur guidance chahoge?",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, callMsg])
    } else if (action === "admin_connect") {
      const userMsg: Message = {
        id: Date.now().toString(),
        content: "Mujhe support team se connect karna hai",
        sender: "user",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])

      const escalateMsg: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Main aapko support team se connect kar deta hoon 👍\nPlease 5-10 minutes ke liye wait kijiye. Jaldi hi admin aapko reply kar dega!",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, escalateMsg])
    }
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Need Help?</h2>
          <p className="text-gray-600 text-lg">Chat with our virtual assistant right here</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 text-white px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white bg-opacity-25 flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Tiny Treasures Assistant</h3>
                <p className="text-sm text-rose-50 font-medium">Online - Ready to help</p>
              </div>
            </div>
          </div>

          <div className="p-6 h-96 overflow-y-auto bg-gradient-to-b from-white to-gray-50 space-y-4 flex flex-col">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-rose-400 to-rose-500 text-white rounded-br-sm shadow-md"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.content.split("\n").map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </motion.div>
            ))}

            {messages.length > 0 &&
              messages[messages.length - 1].sender === "bot" &&
              messages[messages.length - 1].actions && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 mt-3">
                  {messages[messages.length - 1].actions?.map((action, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickAction(action.action, action.href)}
                      className="text-xs px-3 py-2 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 text-white hover:shadow-lg transition-all font-medium whitespace-nowrap"
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                      className="w-2 h-2 bg-rose-400 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">Typing...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="border-t border-gray-100 p-6 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Apna message type kijiye..."
                className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:outline-none focus:border-rose-400 focus:ring-0 transition-all text-sm placeholder-gray-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-rose-400 to-rose-500 text-white p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
