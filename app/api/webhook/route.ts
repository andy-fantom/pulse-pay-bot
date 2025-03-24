import { NextRequest, NextResponse } from "next/server";
import telegramBot from "@/lib/telegram/bot";

// Initialize the bot when the server starts
let botInitialized = false;

const initBot = async () => {
  if (!botInitialized) {
    await telegramBot.initialize();
    botInitialized = true;
    console.log("Bot initialized in webhook handler");
  }
};

export async function POST(request: NextRequest) {
  try {
    // Initialize the bot if not already initialized
    await initBot();

    // Parse the incoming update from Telegram
    const update = await request.json();

    // Process the update with the Telegram bot
    await telegramBot.handleUpdate(update);

    // Return a success response to Telegram
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in webhook handler:", error);

    // Return an error response
    return NextResponse.json(
      { ok: false, message: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// Telegram sends a GET request to verify the webhook
export async function GET() {
  return NextResponse.json({ ok: true, message: "Webhook is active" });
}
