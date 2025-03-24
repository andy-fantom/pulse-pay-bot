import {
  Aptos,
  AptosConfig,
  Network,
  Ed25519PrivateKey,
  AccountAddress,
  TransactionResponse,
} from "@aptos-labs/ts-sdk";
import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit";

class MoveAgentService {
  private static instance: MoveAgentService;
  private agent: AgentRuntime | null = null;
  private tools: unknown | null = null;
  private initialized = false;

  private constructor() {}

  public static getInstance(): MoveAgentService {
    if (!MoveAgentService.instance) {
      MoveAgentService.instance = new MoveAgentService();
    }
    return MoveAgentService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const network =
        process.env.APTOS_NETWORK === "mainnet"
          ? Network.MAINNET
          : Network.TESTNET;

      const aptosConfig = new AptosConfig({ network });
      const aptos = new Aptos(aptosConfig);

      if (!process.env.APTOS_PRIVATE_KEY) {
        throw new Error("APTOS_PRIVATE_KEY environment variable is not set");
      }

      // Create a private key instance
      const privateKey = new Ed25519PrivateKey(process.env.APTOS_PRIVATE_KEY);

      // Derive account from the private key
      const account = await aptos.deriveAccountFromPrivateKey({
        privateKey,
      });

      const signer = new LocalSigner(account, network);

      this.agent = new AgentRuntime(signer, aptos, {
        PANORA_API_KEY: process.env.PANORA_API_KEY,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      });

      this.tools = createAptosTools(this.agent);
      this.initialized = true;

      console.log("Move Agent initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Move Agent:", error);
      throw error;
    }
  }

  public getAgent(): AgentRuntime {
    if (!this.agent || !this.initialized) {
      throw new Error("Move Agent not initialized. Call initialize() first.");
    }
    return this.agent;
  }

  public getTools() {
    if (!this.tools || !this.initialized) {
      throw new Error(
        "Move Agent tools not initialized. Call initialize() first."
      );
    }
    return this.tools;
  }

  // Helper methods for common operations
  public async transferTokens(
    toAddress: AccountAddress,
    amount: number,
    mint: string = "0x1::aptos_coin::AptosCoin"
  ): Promise<string> {
    const agent = this.getAgent();
    return await agent.transferTokens(toAddress, amount, mint);
  }

  public async getBalance(address: string): Promise<number> {
    const agent = this.getAgent();
    return await agent.getBalance(address);
  }

  public async getTransactionInfo(
    txHash: string
  ): Promise<TransactionResponse> {
    const agent = this.getAgent();
    return await agent.getTransaction(txHash);
  }
}

export default MoveAgentService.getInstance();
