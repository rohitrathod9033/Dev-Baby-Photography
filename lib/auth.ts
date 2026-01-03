import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export interface JwtPayload {
  id: string
  email: string
  role: "user" | "admin"
}

export async function signToken(payload: JwtPayload): Promise<string> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(secret)
  return token
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as unknown as JwtPayload
  } catch (error) {
    console.error("[Auth Debug] Token verification failed:", error)
    return null
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value || null
  console.log("[Auth Debug] Retrieved token from cookies:", token ? "Token exists (len=" + token.length + ")" : "No token found")
  return token
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

export async function getCurrentUser(): Promise<JwtPayload | null> {
  const token = await getAuthToken()
  if (!token) return null
  return verifyToken(token)
}
