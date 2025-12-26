import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

const protectedRoutes = ["/admin", "/packages", "/profile"]
const adminRoutes = ["/admin"]
const publicRoutes = ["/login", "/register", "/admin/login", "/"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get auth token from cookies
  const token = request.cookies.get("auth-token")?.value

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => pathname === route)

  // If accessing public routes, allow
  if (isPublicRoute && !isProtectedRoute) {
    return NextResponse.next()
  }

  // If accessing protected route without token
  if (isProtectedRoute && !token) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verify token
  if (token && isProtectedRoute) {
    const payload = await verifyToken(token)

    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }

    // Check admin access
    if (isAdminRoute && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
