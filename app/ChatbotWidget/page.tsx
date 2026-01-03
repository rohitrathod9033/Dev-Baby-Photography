"use client"

import ChatbotWidget from "@/components/ChatbotWidget"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function ChatbotPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-20">
                <ChatbotWidget />
            </div>
            <Footer />
        </div>
    )
}
