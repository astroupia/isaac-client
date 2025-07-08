import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/connect";

export async function POST(req: NextRequest) {
  const { email, password, firstName, lastName, role } = await req.json();
  console.log("Register request:", { email, firstName });
  const client = await clientPromise;
  const db = client.db("isaac-db");
  const existing = await db.collection("users").findOne({ email });
  console.log("Existing user:", existing);
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 10);
  let user: any = { email, password: hashed, firstName, lastName, role, isActive: true, createdAt: new Date(), updatedAt: new Date() };
  if (role === 'investigator') {
    user.currentCaseload = 0;
    user.maxCaseload = 5;
    user.specialization = [];
    user.completionRate = 100;
  }
  const result = await db.collection("users").insertOne(user);
  console.log("Insert result:", result);
  return NextResponse.json({ success: true });
}