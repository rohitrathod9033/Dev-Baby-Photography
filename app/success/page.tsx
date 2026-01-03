
"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
                <Suspense fallback={
                    <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                }>
                    <SuccessContent />
                </Suspense>
            </main>

            <Footer />
        </div>
    )
}

function SuccessContent() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get("session_id")
    const [status, setStatus] = useState("verifying") // verifying, confirmed, error

    useEffect(() => {
        if (sessionId) {
            fetch(`/api/payments/confirm?session_id=${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === "confirmed") {
                        setStatus("confirmed")
                    } else {
                        console.error("Payment validation failed", data)
                        setStatus("error")
                    }
                })
                .catch(err => {
                    console.error("Error verifying payment", err)
                    setStatus("error")
                })
        }
    }, [sessionId])

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-lg text-center"
        >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
                {status === "verifying" ? "Verifying Payment..." : "Payment Successful!"}
            </h1>

            <p className="text-muted-foreground mb-8">
                {status === "verifying" && "Please wait while we confirm your booking."}
                {status === "confirmed" && "Thank you for your booking. We have received your payment and confirmed your slot."}
                {status === "error" && "We received your payment request, but there was an issue confirming the booking details. Please contact support."}

                {sessionId && <span className="block mt-2 text-xs text-muted-foreground/60">Reference ID: {sessionId.slice(0, 10)}...</span>}
            </p>

            <div className="space-y-3">
                <Link
                    href="/packages"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    Book Another Package
                </Link>

                <Link
                    href="/"
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                    Return Home
                </Link>
            </div>
        </motion.div>
    )
}
