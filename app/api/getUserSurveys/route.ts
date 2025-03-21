import { NextResponse } from "next/server";
import { verifyToken, getAuthCookie } from "../../../utils/auth";
import connectDb from "../../../utils/connectDb";
import Survey from "../../../models/Survey";

export async function GET(request: Request) {
  try {
    await connectDb();

    // Extract the token from the request headers
    const token = getAuthCookie(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Fetch surveys for the logged-in user and populate the responses
    const surveys = await Survey.find({ userId: decoded.userId }).populate(
      "responses"
    );

    return NextResponse.json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
