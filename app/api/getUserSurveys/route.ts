import { NextResponse } from "next/server";
import connectDb from "../../../utils/connectDb";
import Survey from "../../../models/Survey";
import { verifyToken, getAuthCookie } from "../../../utils/auth";

export async function GET(request: Request) {
  const token = getAuthCookie();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    const surveys = await Survey.find({ userId: decoded.userId }).populate(
      "responses"
    );
    return NextResponse.json(surveys);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
