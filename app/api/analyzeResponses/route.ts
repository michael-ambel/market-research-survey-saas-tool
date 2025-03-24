// app/api/analyze/route.ts
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import connectDb from "../../../utils/connectDb";
import Survey from "../../../models/Survey";
import Response from "../../../models/Response";
import { verifyToken, getAuthCookie } from "../../../utils/auth";
import {
  AnalysisResponse,
  ErrorResponse,
  TokenPayload,
  ResponseData,
  PopulatedSurvey,
} from "../../../types/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(
  req: Request
): Promise<NextResponse<AnalysisResponse | ErrorResponse>> {
  const token = getAuthCookie(req);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token) as TokenPayload;
  if (!decoded) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const surveyId = searchParams.get("surveyId");

    if (!surveyId) {
      return NextResponse.json(
        { error: "Survey ID required" },
        { status: 400 }
      );
    }

    const survey = (await Survey.findById(surveyId)
      .populate({
        path: "responses",
        model: Response,
      })
      .exec()) as PopulatedSurvey;

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    if (survey.responses.length === 0) {
      return NextResponse.json(
        { error: "No responses available for analysis" },
        { status: 400 }
      );
    }

    const responseData: ResponseData[] = survey.responses.map((response) => ({
      answers: response.answers,
      createdAt: response.createdAt,
    }));

    const prompt = `Analyze these survey responses and provide key insights in bullet points:
Title: ${survey.title}
Questions: ${survey.questions.join("\n")}
Responses: ${JSON.stringify(responseData)}

Focus on:
- Common patterns in responses
- Unexpected findings
- Potential areas for improvement
- Sentiment analysis
- Key takeaways

Format the response in markdown with bold headings for each section.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const insights = completion.choices[0]?.message?.content;
    if (!insights) {
      throw new Error("Failed to generate insights");
    }

    return NextResponse.json({ insights });
  } catch (error: unknown) {
    console.error("Analysis error:", error);

    const errorResponse: ErrorResponse = {
      error:
        error instanceof Error ? error.message : "Failed to analyze responses",
    };

    if (error instanceof Error && process.env.NODE_ENV === "development") {
      errorResponse.details = error.stack;
    }

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
