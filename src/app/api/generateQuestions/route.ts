import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import connectDb from "@/utils/connectDb";
import Survey from "@/models/Survey";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    await connectDb();

    const { title } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Generate questions using OpenAI
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

    // Save the survey with generated questions
    const survey = new Survey({ title, questions });
    await survey.save();

    return NextResponse.json({ questions, surveyId: survey._id });
  } catch (error: any) {
    console.error(error);

    if (error.code === "insufficient_quota") {
      return NextResponse.json(
        {
          error:
            "OpenAI API quota exceeded. Please check your billing details.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
