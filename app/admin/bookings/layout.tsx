"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import LoadingSpinner from "@/components/LoadingSpinner"

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner />
    </div>
  )
}

export default function AdminBookingsLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/admin-login")
    }
  }, [isAuthenticated, isAdmin, isLoading, router])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return <>{children}</>
}
