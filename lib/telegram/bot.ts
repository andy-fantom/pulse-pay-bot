// src/bot.ts
import { Telegraf, Context } from "telegraf";
import moveAgent from "../blockchain/move-agent";
import { registerCommands } from "./commands";
import * as tg from "telegraf/types";

interface UserSession {
  privateKey?: string;
  walletAddress?: string;
  stage?: string;
  recipientAddress?: string;
  amount?: number;
}

export interface BotContext extends Context {
  session: UserSession;
}

class TelegramBot {
  private static instance: TelegramBot;
  private bot: Telegraf<BotContext>;
  private initialized = false;

  private constructor() {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");
    }
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
  }

  public static getInstance(): TelegramBot {
    if (!TelegramBot.instance) {
      TelegramBot.instance = new TelegramBot();
    }
    return TelegramBot.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    try {
      // Initialize the Move Agent first
      await moveAgent.initialize();

      // Register commands and middleware
      registerCommands(this.bot);

      // Setup logging middleware
      this.bot.use(async (ctx, next) => {
        const start = Date.now();
        console.log(`Processing update ${ctx.update.update_id}`);
        await next();
        const ms = Date.now() - start;
        console.log(`Response time: ${ms}ms`);
      });

      // Handle errors
      this.bot.catch((err, ctx) => {
        console.error(`Error for ${ctx.updateType}`, err);
        ctx.reply(
          "An error occurred while processing your request. Please try again later."
        );
      });

      this.initialized = true;
      console.log("Telegram bot initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Telegram bot:", error);
      throw error;
    }
  }

  public getBot(): Telegraf<BotContext> {
    if (!this.initialized) {
      throw new Error("Telegram bot not initialized. Call initialize() first.");
    }
    return this.bot;
  }

  public async setupWebhook(url: string): Promise<void> {
    try {
      await this.bot.telegram.deleteWebhook();
      await this.bot.telegram.setWebhook(url);
      console.log(`Webhook set to ${url}`);
    } catch (error) {
      console.error("Failed to set webhook:", error);
      throw error;
    }
  }

  public async handleUpdate(update: tg.Update): Promise<void> {
    try {
      await this.bot.handleUpdate(update);
    } catch (error) {
      console.error("Error handling update:", error);
    }
  }
}

export default TelegramBot.getInstance();
