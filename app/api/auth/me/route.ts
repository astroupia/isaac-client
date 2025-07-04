import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/connect";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  // Get session cookie
  const cookieStore = cookies();
  const sessionCookie = (await cookies()).get("session");
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
  const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  console.log('user', user);
  // Only return safe fields
  return NextResponse.json({
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    badgeId: user.badgeId || "",
    department: user.department || ""
  });
}
