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
      console.log(
        `Creating transfer transaction: from ${sender} to ${recipient} for ${amount} octas`
      );

      // Create a transaction that can be signed locally by the wallet
      const transaction = await this.aptos.transaction.build.simple({
        sender: AccountAddress.from(sender),
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [AccountAddress.from(recipient), amount],
        },
      });

      console.log("Transaction built successfully");
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
      // Convert BigInt values to strings for serialization
      const processedTransaction = JSON.parse(
        JSON.stringify(transaction, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      // Process authenticator for serialization
      const processedAuthenticator = JSON.parse(
        JSON.stringify(authenticator, (key, value) => {
          if (typeof value === "bigint") {
            return value.toString();
          }
          // Handle Uint8Array or ArrayBuffer
          if (
            value &&
            (value.buffer instanceof ArrayBuffer || value instanceof Uint8Array)
          ) {
            return Array.from(value);
          }
          return value;
        })
      );

      const payload = {
        transaction: processedTransaction,
        authenticator: processedAuthenticator,
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(payload);
      console.log("Transaction payload prepared for QR code");

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
      console.log("Starting QR data decoding...");

      // Convert from base64 to buffer
      const compressed = Buffer.from(qrData, "base64");

      // Decompress data
      const decompressed = pako.inflate(compressed);

      // Convert to string
      const jsonString = new TextDecoder().decode(decompressed);

      // Parse JSON
      const parsed = JSON.parse(jsonString);

      console.log("QR data decoded successfully");

      // Process any string representations of arrays back to proper arrays
      const processAuthenticator = (auth: any) => {
        if (auth && auth.signature && Array.isArray(auth.signature)) {
          auth.signature = new Uint8Array(auth.signature);
        }
        return auth;
      };

      // Process authenticator
      if (parsed.authenticator) {
        parsed.authenticator = processAuthenticator(parsed.authenticator);
      }

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
      console.log("Starting transaction submission...");
      const { transaction, authenticator } = decodedData;

      // Convert string numbers back to BigInt if needed
      if (typeof transaction.gasUnitPrice === "string") {
        transaction.gasUnitPrice = BigInt(transaction.gasUnitPrice);
      }

      if (typeof transaction.maxGasAmount === "string") {
        transaction.maxGasAmount = BigInt(transaction.maxGasAmount);
      }

      if (typeof transaction.expirationTimestampSecs === "string") {
        transaction.expirationTimestampSecs = BigInt(
          transaction.expirationTimestampSecs
        );
      }

      // Process the sender to ensure it's an AccountAddress
      if (typeof transaction.sender === "string") {
        transaction.sender = AccountAddress.from(transaction.sender);
      }

      // Ensure functionArguments are properly formatted for submission
      if (transaction.payload && transaction.payload.functionArguments) {
        transaction.payload.functionArguments =
          transaction.payload.functionArguments.map((arg: any) => {
            // Handle address conversion
            if (typeof arg === "string" && arg.startsWith("0x")) {
              return AccountAddress.from(arg);
            }
            // Handle numeric conversions
            if (typeof arg === "string" && !isNaN(Number(arg))) {
              return BigInt(arg);
            }
            return arg;
          });
      }

      console.log("Submitting transaction...");
      const submittedTransaction = await this.aptos.transaction.submit.simple({
        transaction,
        senderAuthenticator: authenticator,
      });

      console.log("Transaction submitted, hash:", submittedTransaction.hash);
      console.log("Waiting for transaction confirmation...");

      const result = await this.aptos.waitForTransaction({
        transactionHash: submittedTransaction.hash,
      });

      console.log("Transaction confirmed:", result);
      return result;
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
        const args =
          transaction.payload.functionArguments ||
          transaction.payload.arguments;
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
        const args =
          transaction.payload.functionArguments ||
          transaction.payload.arguments;
        const recipient = args[0];
        const amount = args[1];

        return {
          type: "transfer",
          sender: transaction.sender.toString
            ? transaction.sender.toString()
            : transaction.sender,
          recipient: recipient.toString ? recipient.toString() : recipient,
          amount: Number(amount) / 100000000, // Convert from Octas to APT
          gasUnitPrice: transaction.gasUnitPrice?.toString() || "0",
          maxGasAmount: transaction.maxGasAmount?.toString() || "0",
        };
      }

      // Generic transaction details fallback
      return {
        type: "transaction",
        sender: transaction.sender.toString
          ? transaction.sender.toString()
          : transaction.sender,
        function: transaction.payload.function,
        args:
          transaction.payload.functionArguments ||
          transaction.payload.arguments ||
          [],
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
