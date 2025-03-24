// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Telegraf, Context } from "telegraf";
import { message } from "telegraf/filters";

import QRCodeProcessor from "../../../lib/telegram/qr-processor";
import WalletAdapterService from "../../../lib/blockchain/wallet-adapter";

// Initialize the bot
const initializeBot = () => {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");
  }

  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

  // Add QR code handling capabilities
  bot.on(message("photo"), async (ctx) => {
    try {
      await ctx.reply("📷 QR code received. Processing...");

      const photos = ctx.message.photo;
      const fileId = photos[photos.length - 1].file_id; // Get highest resolution

      const fileInfo = await ctx.telegram.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`;

      // Decode QR code from image
      await ctx.reply("🔍 Scanning QR code...");
      const qrData = await QRCodeProcessor.decodeQRCodeFromUrl(fileUrl);

      if (!qrData) {
        await ctx.reply(
          "❌ Unable to read QR code. Please make sure the image contains a valid transaction QR code."
        );
        return;
      }

      // Extract transaction details
      try {
        const walletAdapter = WalletAdapterService;
        const decodedData = walletAdapter.decodeTransactionFromQR(qrData);

        // Verify the transaction data
        if (!walletAdapter.verifyTransaction(decodedData)) {
          await ctx.reply("❌ Invalid transaction data in QR code.");
          return;
        }

        // Extract and display transaction details
        const txDetails = walletAdapter.extractTransactionDetails(decodedData);

        if (!txDetails) {
          await ctx.reply(
            "❌ Could not extract transaction details from QR code."
          );
          return;
        }

        if (txDetails.type === "transfer") {
          await ctx.reply(
            `📋 Transaction Details:\n\n` +
              `Type: ${txDetails.type.toUpperCase()}\n` +
              `From: ${txDetails.sender.substring(
                0,
                8
              )}...${txDetails.sender.substring(
                txDetails.sender.length - 8
              )}\n` +
              `To: ${txDetails.recipient.substring(
                0,
                8
              )}...${txDetails.recipient.substring(
                txDetails.recipient.length - 8
              )}\n` +
              `Amount: ${txDetails.amount} APT\n` +
              `Gas Price: ${txDetails.gasUnitPrice}\n\n` +
              `Do you want to broadcast this transaction?`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "✅ Approve & Broadcast",
                      callback_data: `broadcast_tx:${Buffer.from(
                        qrData
                      ).toString("base64")}`,
                    },
                    { text: "❌ Cancel", callback_data: "cancel_tx" },
                  ],
                ],
              },
            }
          );
        } else {
          await ctx.reply(
            `📋 Transaction Details:\n\n` +
              `Type: ${txDetails.type.toUpperCase()}\n` +
              `From: ${txDetails.sender.substring(
                0,
                8
              )}...${txDetails.sender.substring(
                txDetails.sender.length - 8
              )}\n` +
              `Function: ${txDetails.function}\n` +
              `Gas Price: ${txDetails.gasUnitPrice}\n\n` +
              `Do you want to broadcast this transaction?`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "✅ Approve & Broadcast",
                      callback_data: `broadcast_tx:${Buffer.from(
                        qrData
                      ).toString("base64")}`,
                    },
                    { text: "❌ Cancel", callback_data: "cancel_tx" },
                  ],
                ],
              },
            }
          );
        }
      } catch (error) {
        console.error("Error processing QR code data:", error);
        await ctx.reply(`❌ Error processing QR code`);
      }
    } catch (error) {
      console.error("Error handling photo:", error);
      await ctx.reply(
        "An error occurred while processing the image. Please try again."
      );
    }
  });

  // Handle callback queries for QR code transaction approvals
  bot.on("callback_query", async (ctx) => {
    try {
      const callbackData = ctx.callbackQuery.id;

      if (callbackData.startsWith("broadcast_tx:")) {
        // Extract the QR code data from the callback
        const encodedQRData = callbackData.split(":")[1];
        const qrCodeData = Buffer.from(encodedQRData, "base64").toString();

        // Process the transaction
        await ctx.answerCbQuery("Processing transaction...");
        await ctx.editMessageText("⏳ Processing transaction... Please wait.");

        const result = await QRCodeProcessor.processTransactionQR(qrCodeData);

        if (result.success) {
          await ctx.editMessageText(
            `✅ Transaction submitted successfully!\n\n` +
              `Transaction hash: ${result.hash}\n` +
              `Status: ${result.success}\n` +
              `Details: ${result.details}\n\n` +
              `Check explorer: https://explorer.aptoslabs.com/txn/${result.hash}?network=testnet`
          );
        } else {
          await ctx.editMessageText(
            `❌ Transaction failed:\n${result.error || "Unknown error"}\n\n` +
              `Please try again or contact support if the issue persists.`
          );
        }
      } else if (callbackData === "cancel_tx") {
        await ctx.answerCbQuery("Transaction cancelled");
        await ctx.editMessageText(
          "⚠️ Transaction cancelled. No transaction was broadcast."
        );
      }
    } catch (error) {
      console.error("Error handling callback query:", error);
      await ctx.answerCbQuery("An error occurred. Please try again.");
      try {
        await ctx.editMessageText(
          "An error occurred while processing your request. Please try again."
        );
      } catch (e) {
        // Message might have been deleted or cannot be edited
        console.error("Could not edit message:", e);
      }
    }
  });

  // Add QR code specific commands
  bot.command("qrcode", async (ctx) => {
    await ctx.reply(
      `📱 QR Code Transaction Guide:\n\n` +
        `1. Go to our web app to connect your wallet\n` +
        `2. Create and sign a transaction on the web app\n` +
        `3. Send the generated QR code to this bot\n` +
        `4. Review and confirm the transaction details\n` +
        `5. The transaction will be broadcast to the Aptos network\n\n` +
        `Web app link: ${
          process.env.NEXTAUTH_URL || "https://your-web-app.com"
        }`
    );
  });

  return bot;
};

let bot: Telegraf<Context>;

// Handle POST request from Telegram
export async function POST(request: NextRequest) {
  try {
    if (!bot) {
      bot = initializeBot();
    }

    // Get the update from Telegram
    const update = await request.json();

    // Process the update
    await bot.handleUpdate(update);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// Handle GET request (for health check)
export async function GET() {
  return NextResponse.json({ status: "Telegram webhook endpoint is working" });
}
