import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { question } = await req.json();

  try {
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            cotent:
              "You are a knowlegeable assistant that provides quality information",
          },
          {
            role: "user",
            content: `Tell me ${question}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 64,
        top_p: 1,
      }),
    });

    const responseData = await response.json();
    const reply = responseData.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
