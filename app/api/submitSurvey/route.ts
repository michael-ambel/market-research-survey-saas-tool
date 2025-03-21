import { NextResponse } from "next/server";
import connectDb from "../../../utils/connectDb";
import Response from "../../../models/Response";

export async function POST(request: Request) {
  try {
    await connectDb();

    const { surveyId, answers } = await request.json();

    if (!surveyId || !answers) {
      return NextResponse.json(
        { error: "Survey ID and answers are required" },
        { status: 400 }
      );
    }

    // Save the response
    const response = new Response({ surveyId, answers });
    await response.save();

    return NextResponse.json({ success: true, responseId: response._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
