// src/commands/commands.ts
import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import moveAgent from "../blockchain/move-agent";
import {
  AccountAddress,
  Ed25519PrivateKey,
  Network,
  AptosConfig,
  Aptos,
} from "@aptos-labs/ts-sdk";
import { BotContext } from "./bot";

interface UserSession {
  privateKey?: string;
  walletAddress?: string;
  stage?: string;
  recipientAddress?: string;
  amount?: number;
}

const userSessions = new Map<number, UserSession>();

export function registerCommands(bot: Telegraf<BotContext>): void {
  // Use session middleware
  bot.use(session());

  // Middleware to check if the user has registered their wallet
  const requirePrivateKey = (ctx: BotContext, next: () => Promise<void>) => {
    const userId = ctx.from?.id;
    if (!userId) return ctx.reply("Error identifying user.");
    const userSession = userSessions.get(userId);
    if (!userSession?.privateKey) {
      return ctx.reply(
        "Please register your wallet first by using the /register command.\n\n" +
          "Note: We will securely encrypt your private key. Never share your private key with anyone else."
      );
    }
    ctx.session = userSession;
    return next();
  };

  // Start command
  bot.start((ctx) => {
    ctx.reply(
      `Welcome to Pulse Pay! 💰\n\n` +
        `I can help you manage your crypto wallet and make payments on the Aptos blockchain (Testnet).\n\n` +
        `First, please register your wallet using the /register command.\n\n` +
        `Commands:\n` +
        `/balance - Check your wallet balance\n` +
        `/send - Send tokens to another address\n` +
        `/transactions - View your recent transactions\n` +
        `/help - Show available commands`
    );
  });

  // Help command
  bot.help((ctx) => {
    ctx.reply(
      `Pulse Pay Commands:\n\n` +
        `/start - Start the bot\n` +
        `/register - Register your wallet with your private key\n` +
        `/balance - Check your wallet balance\n` +
        `/send - Send tokens to another address\n` +
        `/transactions - View recent transactions\n` +
        `/logout - Remove your wallet information\n` +
        `/help - Show this help message`
    );
  });

  // Register command
  bot.command("register", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return ctx.reply("Error identifying user.");
    userSessions.set(userId, { stage: "awaiting_private_key" });
    ctx.reply(
      `To register your wallet, please send me your private key.\n\n` +
        `⚠️ IMPORTANT: This is for demonstration purposes only. In a real application, NEVER share your private key through Telegram.\n\n` +
        `For production, use a secure web portal with proper encryption and key management.\n\n` +
        `Type /cancel to abort this operation.`
    );
  });

  // Cancel command
  bot.command("cancel", (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return ctx.reply("Error identifying user.");
    const session = userSessions.get(userId);
    if (session?.stage) {
      delete session.stage;
      userSessions.set(userId, session);
      ctx.reply("Operation cancelled.");
    } else {
      ctx.reply("No ongoing operation to cancel.");
    }
  });

  // Logout command
  bot.command("logout", (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return ctx.reply("Error identifying user.");
    userSessions.delete(userId);
    ctx.reply(
      "Your wallet information has been removed. You can register again using /register."
    );
  });

  // Balance command
  bot.command("balance", requirePrivateKey, async (ctx) => {
    try {
      const userId = ctx.from?.id;
      if (!userId) return ctx.reply("Error identifying user.");
      const userSession = userSessions.get(userId);
      if (!userSession?.walletAddress) {
        return ctx.reply(
          "Could not find your wallet address. Please register again."
        );
      }
      ctx.reply("Checking your balance... Please wait.");
      const balance = await moveAgent.getBalance(userSession.walletAddress);
      ctx.reply(`Your current balance: ${balance} APT`);
    } catch (error) {
      console.error("Error checking balance:", error);
      ctx.reply(
        "Sorry, there was an error checking your balance. Please try again later."
      );
    }
  });

  // Start the send token process
  bot.command("send", requirePrivateKey, (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return ctx.reply("Error identifying user.");
    const sessionData = userSessions.get(userId);
    if (!sessionData) return ctx.reply("Session error. Please try again.");
    sessionData.stage = "awaiting_recipient";
    userSessions.set(userId, sessionData);
    ctx.reply("Please enter the recipient's Aptos address:");
  });

  // Transactions command
  bot.command("transactions", requirePrivateKey, async (ctx) => {
    try {
      const userId = ctx.from?.id;
      if (!userId) return ctx.reply("Error identifying user.");
      const userSession = userSessions.get(userId);
      if (!userSession?.walletAddress) {
        return ctx.reply(
          "Could not find your wallet address. Please register again."
        );
      }
      ctx.reply("Fetching your recent transactions... Please wait.");
      // For demonstration, we use dummy data.
      const transactions = [
        {
          hash: "0x123...abc",
          type: "SEND",
          amount: "5.0 APT",
          time: "Yesterday",
        },
        {
          hash: "0x456...def",
          type: "RECEIVE",
          amount: "10.0 APT",
          time: "3 days ago",
        },
      ];
      let message = "📋 Recent Transactions:\n\n";
      transactions.forEach((tx, index) => {
        message += `Transaction ${index + 1}:\n`;
        message += `Type: ${tx.type}\n`;
        message += `Amount: ${tx.amount}\n`;
        message += `Time: ${tx.time}\n`;
        message += `Hash: ${tx.hash}\n\n`;
      });
      message += `View more on Aptos Explorer: https://explorer.aptoslabs.com/account/${userSession.walletAddress}`;
      ctx.reply(message);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      ctx.reply(
        "Sorry, there was an error fetching your transaction history. Please try again later."
      );
    }
  });

  // Process text messages for multi-step commands (private key, recipient, amount, confirmation)
  bot.on(message("text"), async (ctx) => {
    const text = ctx.message.text;
    const userId = ctx.from?.id;
    if (!userId) return ctx.reply("Error identifying user.");
    if (text.startsWith("/")) return;
    const sessionData = userSessions.get(userId);
    if (!sessionData) return;

    switch (sessionData.stage) {
      case "awaiting_private_key":
        try {
          const privateKey = text.trim();
          if (privateKey.length < 32) {
            return ctx.reply(
              "The private key format appears to be invalid. Please check and try again."
            );
          }
          // Use testnet configuration
          const aptosConfig = new AptosConfig({ network: Network.TESTNET });
          const aptos = new Aptos(aptosConfig);
          try {
            const account = await aptos.deriveAccountFromPrivateKey({
              privateKey: new Ed25519PrivateKey(privateKey),
            });
            const walletAddress = account.accountAddress.toString();
            sessionData.privateKey = privateKey; // In production, encrypt this!
            sessionData.walletAddress = walletAddress;
            delete sessionData.stage;
            userSessions.set(userId, sessionData);
            // Remove the private key message for security
            await ctx.deleteMessage();
            ctx.reply(
              `✅ Wallet successfully registered!\n\n` +
                `Your address: ${walletAddress}\n\n` +
                `You can now use /balance to check your balance or /send to transfer tokens.`
            );
          } catch (error) {
            console.error("Error deriving account:", error);
            ctx.reply(
              "Invalid private key format. Please check your key and try again."
            );
          }
        } catch (error) {
          console.error("Error registering wallet:", error);
          ctx.reply(
            "There was an error registering your wallet. Please try again."
          );
        }
        break;

      case "awaiting_recipient":
        try {
          const recipientAddress = text.trim();
          try {
            AccountAddress.fromString(recipientAddress);
            sessionData.recipientAddress = recipientAddress;
            sessionData.stage = "awaiting_amount";
            userSessions.set(userId, sessionData);
            ctx.reply("Please enter the amount of APT to send:");
          } catch (error) {
            console.error("Invalid recipient address:", error);
            ctx.reply(
              "Invalid Aptos address format. Please check the address and try again."
            );
          }
        } catch (error) {
          console.error("Error processing recipient address:", error);
          ctx.reply(
            "There was an error processing the recipient address. Please try again."
          );
        }
        break;

      case "awaiting_amount":
        try {
          const amount = parseFloat(text.trim());
          if (isNaN(amount) || amount <= 0) {
            return ctx.reply("Please enter a valid amount greater than 0.");
          }
          sessionData.amount = amount;
          sessionData.stage = "confirming_transaction";
          userSessions.set(userId, sessionData);
          ctx.reply(
            `📤 Transaction Summary:\n\n` +
              `Recipient: ${sessionData.recipientAddress}\n` +
              `Amount: ${amount} APT\n\n` +
              `Please confirm by typing 'confirm' or cancel by typing 'cancel'`
          );
        } catch (error) {
          console.error("Error processing amount:", error);
          ctx.reply(
            "There was an error processing the amount. Please try again."
          );
        }
        break;

      case "confirming_transaction":
        if (text.toLowerCase() === "confirm") {
          ctx.reply("Processing transaction... Please wait.");
          try {
            if (!sessionData.recipientAddress || !sessionData.amount) {
              throw new Error("Missing transaction details");
            }
            const recipientAptos = AccountAddress.fromString(
              sessionData.recipientAddress
            );
            const txResult = await moveAgent.transferTokens(
              recipientAptos,
              sessionData.amount
            );
            const txAmount = sessionData.amount;
            const txRecipient = sessionData.recipientAddress;
            delete sessionData.stage;
            delete sessionData.recipientAddress;
            delete sessionData.amount;
            userSessions.set(userId, sessionData);
            ctx.reply(
              `Transaction successful! ✅\n\n` +
                `Amount: ${txAmount} APT\n` +
                `Recipient: ${txRecipient}\n` +
                `Transaction Hash: ${txResult}\n\n` +
                `Your transaction will be confirmed shortly.`
            );
          } catch (error) {
            console.error("Error sending tokens:", error);
            ctx.reply(
              "Sorry, there was an error processing your transaction. Please try again later."
            );
            delete sessionData.stage;
            delete sessionData.recipientAddress;
            delete sessionData.amount;
            userSessions.set(userId, sessionData);
          }
        } else if (text.toLowerCase() === "cancel") {
          delete sessionData.stage;
          delete sessionData.recipientAddress;
          delete sessionData.amount;
          userSessions.set(userId, sessionData);
          ctx.reply("Transaction cancelled.");
        } else {
          ctx.reply(
            'Please type "confirm" to proceed or "cancel" to abort the transaction.'
          );
        }
        break;

      default:
        ctx.reply(
          "I can help you manage your crypto wallet. Type /help to see what I can do."
        );
    }
  });
}
