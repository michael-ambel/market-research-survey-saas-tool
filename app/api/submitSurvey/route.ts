import { NextResponse } from "next/server";
import connectDb from "../../../utils/connectDb";
import Response from "../../../models/Response";
import Survey from "../../../models/Survey";

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

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    if (answers.length !== survey.questions.length) {
      return NextResponse.json(
        { error: "Number of answers must match the number of questions" },
        { status: 400 }
      );
    }

    const response = new Response({ surveyId, answers });
    await response.save();

    await Survey.findByIdAndUpdate(
      surveyId,
      { $push: { responses: response._id } },
      { new: true }
    );

    return NextResponse.json({ success: true, responseId: response._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
