import { NextResponse } from "next/server";
import { verifyToken, getAuthCookie } from "../../../utils/auth";
import connectDb from "../../../utils/connectDb";
import Survey from "../../../models/Survey";
import Response from "../../../models/Response";

export async function GET(request: Request) {
  try {
    await connectDb();

    const token = getAuthCookie(request);
    console.log("Token:", token);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    console.log("Decoded:", decoded);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const surveys = await Survey.find({ userId: decoded.userId })
      .populate({ path: "responses", model: Response })
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
