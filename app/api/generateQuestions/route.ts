import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import connectDb from "@/utils/connectDb";
import Survey from "@/models/Survey";
import { verifyToken, getAuthCookie } from "@/utils/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const token = getAuthCookie(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    const { title } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const prompt = `Generate five engaging questions for a survey based on the topic: ${title}`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });

    const questions = response.choices[0].message.content
      ?.split("\n")
      .filter((q) => q.trim());

    if (!questions) {
      return NextResponse.json(
        { error: "Failed to generate questions" },
        { status: 500 }
      );
    }

    const survey = new Survey({
      title,
      questions,
      userId: decoded.userId,
    });
    await survey.save();

    return NextResponse.json({ questions, surveyId: survey._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
