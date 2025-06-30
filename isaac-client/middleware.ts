import { NextRequest, NextResponse } from "next/server"

export default function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value
  const url = req.nextUrl

  // Protect all /dashboard routes
  if (url.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}