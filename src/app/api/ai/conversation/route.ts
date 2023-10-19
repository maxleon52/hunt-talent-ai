import { NextResponse, NextRequest } from "next/server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "", // defaults to process.env["OPENAI_API_KEY"]
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages } = body;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return NextResponse.json(response.choices[0].message);
}
