import {
  Aptos,
  AptosConfig,
  Network,
  AccountAddress,
  TransactionResponse,
  SimpleTransaction,
} from "@aptos-labs/ts-sdk";
import { AccountAuthenticator } from "@aptos-labs/wallet-adapter-core";
import { Buffer } from "buffer";
import pako from "pako";

// Singleton pattern for the Wallet Adapter Service
class WalletAdapterService {
  private static instance: WalletAdapterService;
  private aptos: Aptos;
  private initialized = false;

  private constructor() {
    const network =
      process.env.NEXT_PUBLIC_APTOS_NETWORK === "mainnet"
        ? Network.MAINNET
        : Network.TESTNET;

    const aptosConfig = new AptosConfig({
      network,
    });

    this.aptos = new Aptos(aptosConfig);
  }

  public static getInstance(): WalletAdapterService {
    if (!WalletAdapterService.instance) {
      WalletAdapterService.instance = new WalletAdapterService();
    }
    return WalletAdapterService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Perform any initialization steps if needed
      this.initialized = true;
      console.log("Wallet Adapter Service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Wallet Adapter Service:", error);
      throw error;
    }
  }

  public getAptos(): Aptos {
    if (!this.initialized) {
      this.initialize();
    }
    return this.aptos;
  }

  // Create a transaction payload that can be signed locally by the wallet
  public async createTransferTransaction(
    sender: string,
    recipient: string,
    amount: number
  ) {
    try {
      // Create a transaction that can be signed locally by the wallet
      const transaction = await this.aptos.transaction.build.simple({
        sender: AccountAddress.from(sender),
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [AccountAddress.from(recipient), amount],
        },
      });

      return transaction;
    } catch (error) {
      console.error("Failed to create transaction:", error);
      throw error;
    }
  }

  // Encode a signed transaction to be included in a QR code with compression
  public encodeTransactionForQR(
    transaction: SimpleTransaction,
    authenticator: AccountAuthenticator
  ): string {
    try {
      // Custom replacer function to handle BigInt values during serialization
      const replacer = (key: string, value: unknown) => {
        // Convert BigInt to string
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };

      const payload = {
        transaction,
        authenticator,
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(payload, replacer);

      // Compress using pako
      const compressed = pako.deflate(jsonString);

      // Convert compressed data to base64
      return Buffer.from(compressed).toString("base64");
    } catch (error) {
      console.error("Failed to encode transaction:", error);
      throw error;
    }
  }

  // Decode transaction data from QR code with decompression
  public decodeTransactionFromQR(qrData: string) {
    try {
      // Convert from base64 to buffer
      const compressed = Buffer.from(qrData, "base64");

      // Decompress data
      const decompressed = pako.inflate(compressed);

      // Convert to string
      const jsonString = new TextDecoder().decode(decompressed);

      // Parse JSON
      const parsed = JSON.parse(jsonString);

      // Revive any BigInt from strings if needed
      return parsed;
    } catch (error) {
      console.error("Failed to decode QR data:", error);
      throw new Error("Invalid QR code format");
    }
  }

  // Submit transaction that was decoded from QR code
  public async submitTransaction(
    decodedData: any
  ): Promise<TransactionResponse> {
    try {
      const { transaction, authenticator } = decodedData;

      const submittedTransaction = await this.aptos.transaction.submit.simple({
        transaction,
        senderAuthenticator: authenticator,
      });

      return await this.aptos.waitForTransaction({
        transactionHash: submittedTransaction.hash,
      });
    } catch (error) {
      console.error("Failed to submit transaction:", error);
      throw error;
    }
  }

  // Verify the transaction data from QR code
  public verifyTransaction(decodedData: any): boolean {
    try {
      console.log("Starting transaction verification...");

      // Check if basic structure exists
      if (!decodedData) {
        console.error("Verification failed: decodedData is null or undefined");
        return false;
      }

      const { transaction, authenticator } = decodedData;

      // Basic structure check
      if (!transaction) {
        console.error("Verification failed: missing transaction object");
        return false;
      }

      if (!authenticator) {
        console.error("Verification failed: missing authenticator");
        return false;
      }

      // Validate sender exists
      if (!transaction.sender) {
        console.error("Verification failed: missing sender address");
        return false;
      }

      // Validate transaction has a payload
      if (!transaction.payload) {
        console.error("Verification failed: missing transaction payload");
        return false;
      }

      // More flexible function validation - allow any valid function format
      if (!transaction.payload.function) {
        console.error("Verification failed: missing function in payload");
        return false;
      }

      // We can support multiple transaction types, not just transfers
      if (transaction.payload.function === "0x1::aptos_account::transfer") {
        // For transfer transactions, validate recipient and amount
        const args = transaction.payload.arguments;
        if (!args || args.length < 2) {
          console.error(
            "Verification failed: missing or incomplete arguments for transfer"
          );
          return false;
        }

        // Check that amount is present (but be more flexible with validation)
        const amount = args[1];
        if (amount === undefined) {
          console.error(
            "Verification failed: missing amount in transfer arguments"
          );
          return false;
        }
      }

      console.log("Transaction verification passed");
      return true;
    } catch (error) {
      console.error("Transaction verification failed with exception:", error);
      return false;
    }
  }

  // Extract transaction details from decoded QR data
  public extractTransactionDetails(decodedData: any) {
    try {
      const { transaction } = decodedData;

      if (!transaction || !transaction.payload) {
        return null;
      }

      // For APT transfers
      if (transaction.payload.function === "0x1::aptos_account::transfer") {
        const recipient = transaction.payload.arguments[0];
        const amount = transaction.payload.arguments[1];

        return {
          type: "transfer",
          sender: transaction.sender.toString(),
          recipient: recipient.toString(),
          amount: Number(amount) / 100000000, // Convert from Octas to APT
          gasUnitPrice: transaction.gasUnitPrice?.toString() || "0",
          maxGasAmount: transaction.maxGasAmount?.toString() || "0",
        };
      }

      // Generic transaction details fallback
      return {
        type: "transaction",
        sender: transaction.sender.toString(),
        function: transaction.payload.function,
        args: transaction.payload.arguments || [],
        gasUnitPrice: transaction.gasUnitPrice?.toString() || "0",
        maxGasAmount: transaction.maxGasAmount?.toString() || "0",
      };
    } catch (error) {
      console.error("Error extracting transaction details:", error);
      return null;
    }
  }

  // Get account balance
  public async getBalance(address: string): Promise<number> {
    try {
      const accountResources = await this.aptos.getAccountResources({
        accountAddress: address,
      });

      const aptosCoinResource = accountResources.find(
        (r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
      );

      if (!aptosCoinResource) {
        return 0;
      }

      return Number((aptosCoinResource.data as any).coin.value);
    } catch (error) {
      console.error("Failed to get balance:", error);
      return 0;
    }
  }
}

export default WalletAdapterService.getInstance();
