import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import connectDb from "@/utils/connectDb";
import Survey from "@/models/Survey";
import { verifyToken, getAuthCookie } from "@/utils/auth";
import type {
  AnalysisResponse,
  ErrorResponse,
  TokenPayload,
} from "@/types/types";
import Response from "@/models/Response";

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

  try {
    const decoded = verifyToken(token) as TokenPayload;
    if (!decoded.userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    await connectDb();

    const { searchParams } = new URL(req.url);
    const surveyId = searchParams.get("surveyId");

    if (!surveyId) {
      return NextResponse.json(
        { error: "Survey ID required" },
        { status: 400 }
      );
    }

    // Set timeout for the entire operation
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const survey = await Survey.findById(surveyId).populate({
      path: "responses",
      model: Response,
    });

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    if (survey.responses.length === 0) {
      return NextResponse.json(
        { error: "No responses available for analysis" },
        { status: 400 }
      );
    }

    // Optimized prompt for faster response
    const prompt = `Analyze these survey responses quickly (under 8 seconds):
Title: ${survey.title}
Questions: ${survey.questions.join("\n")}
Total Responses: ${survey.responses.length}

Provide concise bullet points focusing on:
- Most common patterns
- Key unexpected findings
- Primary areas for improvement
- Overall sentiment summary
- Top 3 recommendations

Format: Markdown with bold section headings. Keep response under 300 tokens.`;

    const completion = await openai.chat.completions.create(
      {
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    const insights = completion.choices[0]?.message?.content;
    if (!insights) {
      throw new Error("Failed to generate insights");
    }

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Analysis error:", error);

    const status =
      error instanceof Error && error.name === "AbortError" ? 504 : 500;
    const message =
      status === 504
        ? "Analysis timed out - try with fewer responses"
        : (error instanceof Error && error.message) || "Analysis failed";

    return NextResponse.json(
      {
        error: message,
        ...(process.env.NODE_ENV === "development" &&
          error instanceof Error && {
            details: error.stack,
          }),
      },
      { status }
    );
  }
}
