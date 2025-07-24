import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/connect";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("🔍 API Route: Received user ID:", id);
    console.log("🔍 API Route: ID type:", typeof id);
    console.log("🔍 API Route: ID length:", id?.length);

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("isaac-db");

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      console.error("Invalid ObjectId format received:", id);
      return NextResponse.json(
        {
          error: "Invalid user ID format",
          receivedId: id,
          expectedFormat: "24-character hex string",
        },
        { status: 400 }
      );
    }

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User fetched by ID:", user._id);

    // Only return safe fields
    return NextResponse.json({
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      badgeId: user.badgeId || "",
      department: user.department || "",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
