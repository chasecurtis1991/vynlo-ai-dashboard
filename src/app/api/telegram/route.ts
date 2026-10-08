import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, token, chatId } = body;

    if (!token || !chatId || !message) {
      return NextResponse.json(
        { error: "Missing token, chatId, or message" },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return NextResponse.json({ success: true });
    } else {
      let errorMsg = data.description || "Unknown error";
      if (data.description === "Unauthorized") {
        errorMsg = "Invalid bot token. Please check your Telegram Bot Token.";
      } else if (data.description && data.description.includes("chat not found")) {
        errorMsg = "Invalid Chat ID. Make sure your bot is added to the chat/group.";
      }
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Telegram API - Error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
