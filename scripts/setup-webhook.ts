// scripts/setup-webhook.ts
import * as dotenv from "dotenv";
import { Telegraf } from "telegraf";

dotenv.config();

async function setupWebhook() {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!botToken) {
      throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");
    }
    if (!webhookUrl) {
      throw new Error("WEBHOOK_URL environment variable is not set");
    }
    console.log(`Setting up webhook for Telegram bot at URL: ${webhookUrl}`);
    const bot = new Telegraf(botToken);
    await bot.telegram.deleteWebhook();
    console.log("Deleted existing webhook");
    await bot.telegram.setWebhook(webhookUrl);
    console.log("Webhook set successfully");
    const webhookInfo = await bot.telegram.getWebhookInfo();
    console.log("Webhook info:", webhookInfo);
    if (webhookInfo.url !== webhookUrl) {
      console.warn(
        `Warning: Webhook URL mismatch. Expected ${webhookUrl}, got ${webhookInfo.url}`
      );
    }
    console.log("Webhook setup complete");
    process.exit(0);
  } catch (error) {
    console.error("Error setting up webhook:", error);
    process.exit(1);
  }
}

setupWebhook();
