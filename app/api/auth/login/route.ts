import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/connect"
import { serialize } from "cookie"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const client = await clientPromise
  const db = client.db("isaac-db")
  const user = await db.collection("users").findOne({ email })
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
  // Create a simple session (could be JWT or random string)
  const session = { userId: user._id.toString(), role: user.role }
  const cookie = serialize("session", JSON.stringify(session), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
  const res = NextResponse.json({ success: true })
  res.headers.set("Set-Cookie", cookie)
  return res
}