"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  adminLogin: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock authentication - in production, this would call a real API
      const mockUsers = [
        { id: "1", email: "user@example.com", password: "password123", name: "John Doe", role: "user" as const },
        { id: "2", email: "test@example.com", password: "test123", name: "Jane Smith", role: "user" as const },
      ]

      const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const adminLogin = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock admin authentication
      const adminCredentials = {
        id: "admin-1",
        email: "admin@example.com",
        password: "admin123",
        name: "Admin User",
        role: "admin" as const,
      }

      if (email === adminCredentials.email && password === adminCredentials.password) {
        const { password: _, ...adminWithoutPassword } = adminCredentials
        setUser(adminWithoutPassword)
        localStorage.setItem("user", JSON.stringify(adminWithoutPassword))
      } else {
        throw new Error("Invalid admin credentials")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // Mock registration - in production, this would call a real API
      if (!email || !password || !name) {
        throw new Error("All fields are required")
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: "user",
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("user")
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    adminLogin,
    register,
    logout,
    isAuthenticated: user !== null,
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
