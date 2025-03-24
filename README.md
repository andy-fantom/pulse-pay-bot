# Pulse Pay

A modern payment system that integrates Telegram with the Aptos blockchain, powered by Move Agent Kit.

![Pulse Pay Logo](/public/image/logo.png)

## Overview

Pulse Pay allows users to send and receive cryptocurrency payments through a Telegram bot or a web interface. The application leverages the Move Agent Kit to interact with the Aptos blockchain, providing a seamless experience for users.

## Features

- **Telegram Bot Integration**: Send and receive payments directly through Telegram
- **Web Dashboard**: Manage your wallet, view transaction history, and more
- **Secure Wallet Management**: Connect your wallet securely without sharing private keys
- **Transaction History**: View all your past transactions in one place
- **Real-time Notifications**: Get instant notifications for transactions

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Blockchain**: Aptos, Move Agent Kit
- **Telegram Integration**: Telegraf.js
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Telegram Bot Token (obtained from BotFather)
- Aptos Wallet with private key for the service wallet
- HTTPS domain for webhook (or use ngrok for development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pulse-pay.git
cd pulse-pay
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file based on the provided `.env.example`:

```
# Next.js
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL="your-database-url"

# Telegram
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
WEBHOOK_URL=https://your-domain.com/api/webhook

# Aptos/Move
APTOS_PRIVATE_KEY="your-private-key"
APTOS_NODE_URL="https://fullnode.mainnet.aptoslabs.com/v1"
APTOS_NETWORK=mainnet

# Optional API Keys
PANORA_API_KEY=your-panora-api-key
OPENAI_API_KEY=your-openai-api-key
```

4. Set up the Telegram webhook:

```bash
pnpm run setup-webhook
```

5. Start the development server:

```bash
pnpm run dev
```

### Production Deployment

1. Build the application:

```bash
pnpm run build
```

2. Start the production server:

```bash
pnpm start
```

## Using the Telegram Bot

The Telegram bot supports the following commands:

- `/start` - Start the bot and see welcome message
- `/help` - Show available commands
- `/balance` - Check your wallet balance
- `/send <address> <amount>` - Send tokens to another address
- `/register` - Register or connect your wallet
- `/transactions` - View your recent transactions

## Setting Up the Webhook

To receive messages from Telegram, you need to set up a webhook. This is done automatically with the provided script:

```bash
pnpm run setup-webhook
```

This script requires your application to be accessible via HTTPS. For development, you can use ngrok:

```bash
ngrok http 3000
```

Then update your `.env` file with the ngrok URL:

```
WEBHOOK_URL=https://your-ngrok-url.io/api/webhook
```

And run the webhook setup script again.

## Move Agent Kit Integration

Pulse Pay leverages the [Move Agent Kit](https://github.com/MetaMove/move-agent-kit) to interact with the Aptos blockchain. This integration allows for:

- Sending and receiving tokens
- Checking balances
- Viewing transaction history
- Interacting with DeFi protocols

The integration is implemented in `src/lib/blockchain/move-agent.ts`.

## Security Considerations

- Never store private keys in plain text in the application
- Use encryption for storing user wallet information
- Implement strict validation for all transaction requests
- Use HTTPS for all API endpoints
- Implement rate limiting to prevent abuse

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Move Agent Kit](https://github.com/MetaMove/move-agent-kit) for blockchain integration
- [Shadcn UI](https://ui.shadcn.com/) for beautiful UI components
- [Telegraf](https://github.com/telegraf/telegraf) for Telegram bot implementation