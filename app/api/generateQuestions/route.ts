import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import connectDb from "../../../utils/connectDb";
import Survey from "../../../models/Survey";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fallback questions
const FALLBACK_QUESTIONS = [
  "What is your overall satisfaction with our product?",
  "How likely are you to recommend our product to others?",
  "What features do you find most useful?",
  "What improvements would you suggest?",
  "How would you rate our customer support?",
];

export async function POST(request: Request) {
  try {
    await connectDb();

    const { title } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    let questions: string[] = [];
    let isFallback = false;

    try {
      // Generate questions using OpenAI
      const prompt = `Generate five engaging questions for a survey based on the topic: ${title}`;
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
      });

      questions =
        response.choices[0].message.content
          ?.split("\n")
          .filter((q) => q.trim()) || [];
    } catch (error) {
      console.error("OpenAI API Error:", error);
      questions = FALLBACK_QUESTIONS;
      isFallback = true;
    }

    // Save the survey with generated questions
    const survey = new Survey({ title, questions });
    await survey.save();

    return NextResponse.json({ questions, surveyId: survey._id, isFallback });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
