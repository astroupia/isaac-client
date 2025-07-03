import { NextRequest, NextResponse } from "next/server"

// Define the roles and their allowed paths
const ROLE_PATHS: Record<string, string[]> = {
  admin: ["/dashboard/admin", "/dashboard/settings"],
  chief: ["/dashboard/chief"],
  investigator: ["/dashboard/investigator"],
  traffic: ["/dashboard/traffic"],
}

// Public paths that don't require authentication
const PUBLIC_PATHS = ["/login", "/signup"]

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionCookie = req.cookies.get("session")?.value
  
  // Skip middleware for public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Handle dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // Redirect to login if no session
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    try {
      // Verify session is valid
      const session = JSON.parse(sessionCookie)
      if (!session.userId || !session.role) {
        throw new Error("Invalid session")
      }

      // Check if user has access to the requested path
      const userRole = session.role.toLowerCase()
      const allowedPaths = ROLE_PATHS[userRole] || []
      const hasAccess = allowedPaths.some(path => pathname.startsWith(path))

      // Redirect to role-specific dashboard if trying to access unauthorized path
      if (!hasAccess) {
        const defaultPath = allowedPaths[0] || "/login"
        return NextResponse.redirect(new URL(defaultPath, req.url))
      }

      // Add user role to request headers for server components
      const requestHeaders = new Headers(req.headers)
      requestHeaders.set("x-user-role", userRole)
      requestHeaders.set("x-user-id", session.userId)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      // Clear invalid session and redirect to login
      const response = NextResponse.redirect(new URL("/login", req.url))
      response.cookies.delete("session")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup"
  ],
}