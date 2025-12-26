"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, MessageCircle, X, Minimize2, Maximize2 } from "lucide-react"

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

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isOpen && !hasGreeted) {
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
  }, [isOpen, hasGreeted])

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
      console.error("Error:", error)
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
    <>
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110 group"
            title="Chat with us!"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0 rounded-full bg-rose-400 opacity-20"
            />
            <MessageCircle className="w-8 h-8 relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
              isMinimized ? "w-96 h-auto" : "w-96 h-[600px]"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white bg-opacity-25 flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Tiny Treasures</h3>
                    <p className="text-xs text-rose-50 font-medium">Online Assistant</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all backdrop-blur-sm"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setIsOpen(false)
                      setHasGreeted(false)
                    }}
                    className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-gray-50">
                    <AnimatePresence mode="popLayout">
                      {messages.map((msg, index) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
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
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-wrap gap-2 mt-3 pl-1"
                          >
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
                    </AnimatePresence>

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

                  <form onSubmit={handleSendMessage} className="border-t border-gray-100 p-4 bg-white">
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
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
