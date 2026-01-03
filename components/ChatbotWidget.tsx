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

    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-5xl mx-auto relative z-10 font-sans">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-600 text-sm font-semibold mb-4 tracking-wide uppercase shadow-sm border border-rose-200">
            24/7 Support
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-600">help you?</span>
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            I'm here to assist with bookings, packages, and any questions you might have.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col md:flex-row h-[600px] w-full"
        >
          {/* Sidebar / Info Panel (Desktop) */}
          <div className="hidden md:flex w-1/3 bg-gradient-to-br from-rose-500 to-indigo-600 p-8 flex-col text-white justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/30">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Tiny Treasures AI</h3>
              <p className="text-rose-100/90 mb-6">Your personal photography assistant.</p>

              <div className="space-y-4 text-sm text-rose-50/80">
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span>Always Online</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                  <span>⚡ Instant Responses</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 text-xs text-rose-200/60">
              Powered by OpenAI &copy; 2024
            </div>

            {/* Decorative Circles */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-20 -left-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-xl"></div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white/50 relative">
            {/* Mobile Header */}
            <div className="md:hidden p-4 border-b border-gray-100 flex items-center gap-3 bg-white/80 backdrop-blur-md sticky top-0 z-20">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Tiny Treasures AI</h3>
                <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                </span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm relative ${msg.sender === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none"
                        : "bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-md"
                        }`}
                    >
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1.5 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {messages.length > 0 &&
                messages[messages.length - 1].sender === "bot" &&
                messages[messages.length - 1].actions && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2.5 mt-2 pl-2"
                  >
                    {messages[messages.length - 1].actions?.map((action, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickAction(action.action, action.href)}
                        className="text-sm px-4 py-2 rounded-xl bg-white border border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 hover:shadow-md transition-all font-medium shadow-sm"
                      >
                        {action.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center pl-4">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                        className="w-2 h-2 bg-indigo-400 rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full pl-6 pr-14 py-4 rounded-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-gray-700 placeholder:text-gray-400 font-medium"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}
