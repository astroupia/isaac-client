import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/connect";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  // Get session cookie
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("session");
  if (!sessionCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  let session;
  try {
    session = JSON.parse(sessionCookie.value);
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
  const client = await clientPromise;
  const db = client.db("isaac-db");
  const user = await db.collection("users").findOne({ _id: { $eq: typeof session.userId === "string" ? new (await import('mongodb')).ObjectId(session.userId) : session.userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
}
