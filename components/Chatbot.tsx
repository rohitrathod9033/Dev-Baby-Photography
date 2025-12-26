"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, MessageCircle, X, Minimize2, Maximize2, Calendar, Phone, Mail } from "lucide-react"

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! Welcome to Tiny Treasures Studio. Main aapka assistant hoon - kaise madad kar sakta hoon aaj?",
      sender: "bot",
      timestamp: new Date(),
      actions: [
        { label: "Book Appointment", action: "appointment", href: "/appointments" },
        { label: "View Packages", action: "packages", href: "/packages" },
        { label: "Contact Us", action: "contact", href: "/contact" },
      ],
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
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

      // Add bot response with actions based on intent
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: "bot",
        timestamp: new Date(),
      }

      if (data.intent === "appointment") {
        botMessage.actions = [
          { label: "Book Now", action: "book_appointment", href: "/appointments" },
          { label: "View Slots", action: "view_slots", href: "/appointments" },
        ]
      } else if (data.intent === "packages") {
        botMessage.actions = [
          { label: "Explore Packages", action: "explore_packages", href: "/packages" },
          { label: "Get Pricing", action: "pricing", href: "/packages" },
        ]
      } else if (data.intent === "contact") {
        botMessage.actions = [
          { label: "Contact Form", action: "contact_form", href: "/contact" },
          { label: "Call Us", action: "call" },
        ]
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Kshama kijiye, kuch problem ho gaya. Please try again ya admin se contact kijiye.",
        sender: "bot",
        timestamp: new Date(),
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
      window.location.href = "tel:+91-XXXX-XXX-XXX"
    }
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed bottom-6 right-6 w-96 z-50 transition-all duration-300 ${
              isMinimized ? "h-auto" : "h-[600px]"
            }`}
          >
            <div className="bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-full backdrop-blur-xl bg-opacity-95">
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-400 to-rose-500 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Tiny Treasures Assistant</h3>
                    <p className="text-xs text-rose-50">Always here to help</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              {!isMinimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                      {messages.map((msg, index) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {/* Message bubble */}
                          <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                                msg.sender === "user"
                                  ? "bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-br-none"
                                  : "bg-slate-100 text-slate-900 rounded-bl-none"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>

                          {/* Quick action buttons */}
                          {msg.actions && msg.actions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex flex-wrap gap-2 mt-2"
                            >
                              {msg.actions.map((action, idx) => (
                                <motion.button
                                  key={idx}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleQuickAction(action.action, action.href)}
                                  className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 text-white hover:shadow-lg transition-all font-medium flex items-center gap-1"
                                >
                                  {action.action === "appointment" && <Calendar className="w-3 h-3" />}
                                  {action.action === "contact" && <Mail className="w-3 h-3" />}
                                  {action.action === "call" && <Phone className="w-3 h-3" />}
                                  {action.label}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isLoading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{
                                duration: 0.6,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.2,
                              }}
                              className="w-2 h-2 bg-rose-400 rounded-full"
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400 focus:ring-opacity-30 transition-all text-sm"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="bg-gradient-to-r from-rose-400 to-rose-500 text-white p-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
