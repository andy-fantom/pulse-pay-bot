"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AuthWalletConnector } from "@/components/AptosWalletConnector";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { toast } from "sonner";
import qrcode from "qrcode";
import WalletAdapterService from "@/lib/blockchain/wallet-adapter";
import Image from "next/image";

// Define proper types for transaction details
type TransactionDetails = {
  sender: string;
  recipient: string;
  amount: number;
  network: string;
};

export default function WalletPage() {
  const { account, wallet, connected, signTransaction } = useWallet();

  // States for transaction form
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isCreatingTx, setIsCreatingTx] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [txCreated, setTxCreated] = useState(false);
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionDetails | null>(null);

  // For Aptos SDK
  const [aptos, setAptos] = useState<Aptos | null>(null);

  // Initialize Aptos SDK
  useEffect(() => {
    const network =
      process.env.NEXT_PUBLIC_APTOS_NETWORK === "mainnet"
        ? Network.MAINNET
        : Network.TESTNET;

    const aptosConfig = new AptosConfig({ network });
    setAptos(new Aptos(aptosConfig));
  }, []);

  const handleCreateTransaction = async () => {
    if (!connected || !account) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!recipient) {
      toast.error("Please enter a recipient address");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsCreatingTx(true);
      setQrCodeUrl("");
      setTxCreated(false);

      // Validate recipient address
      let recipientAddress;
      try {
        recipientAddress = AccountAddress.from(recipient);
      } catch (e) {
        console.error("Invalid recipient address format:", e);
        toast.error("Invalid recipient address format");
        setIsCreatingTx(false);
        return;
      }

      // Create transaction payload
      const walletService = WalletAdapterService;
      const amountInOctas = parseFloat(amount) * 100000000; // Convert APT to Octas

      const transaction = await walletService.createTransferTransaction(
        account.address.toString(),
        recipientAddress.toString(),
        Math.floor(amountInOctas)
      );

      if (!transaction) {
        throw new Error("Failed to create transaction");
      }

      // Sign the transaction (without submitting)
      const { authenticator, rawTransaction } = await signTransaction({
        transactionOrPayload: transaction,
      });
      console.log("Transaction signed successfully:", rawTransaction);

      // Encode the transaction and signature for QR code
      const qrData = walletService.encodeTransactionForQR(
        transaction,
        authenticator
      );

      // Extract transaction details for display
      setTransactionDetails({
        sender: account.address.toString(),
        recipient: recipientAddress.toString(),
        amount: parseFloat(amount),
        network: process.env.NEXT_PUBLIC_APTOS_NETWORK || "testnet",
      });

      // Generate QR code
      const qrImageUrl = await qrcode.toDataURL(qrData, {
        margin: 1,
        width: 250,
        color: {
          dark: "#000",
          light: "#fff",
        },
      });

      setQrCodeUrl(qrImageUrl);
      setTxCreated(true);
      toast.success("Transaction signed successfully! QR code generated.");
    } catch (error) {
      console.error("Transaction creation failed:", error);
      toast.error(`Failed to create transaction`);
    } finally {
      setIsCreatingTx(false);
    }
  };

  console.log(wallet, aptos, connected, account);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            Aptos Wallet for Telegram
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Connect your Aptos wallet, sign transactions, and generate QR codes
            to use with the Telegram bot.
          </p>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <AuthWalletConnector />
              </div>

              {connected && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Create Transaction
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Recipient Address
                      </label>
                      <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="0x..."
                        disabled={isCreatingTx}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Amount (APT)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="0.0"
                        min="0"
                        step="0.1"
                        disabled={isCreatingTx}
                      />
                    </div>

                    <button
                      onClick={handleCreateTransaction}
                      disabled={isCreatingTx}
                      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300"
                    >
                      {isCreatingTx
                        ? "Creating Transaction..."
                        : "Sign Transaction & Generate QR Code"}
                    </button>
                  </div>
                </div>
              )}

              {txCreated && qrCodeUrl && transactionDetails && (
                <div className="mt-8 border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-center">
                    Transaction QR Code
                  </h2>

                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Transaction Details
                    </h3>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">From:</span>{" "}
                      {transactionDetails.sender.substring(0, 8)}...
                      {transactionDetails.sender.substring(
                        transactionDetails.sender.length - 8
                      )}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">To:</span>{" "}
                      {transactionDetails.recipient.substring(0, 8)}...
                      {transactionDetails.recipient.substring(
                        transactionDetails.recipient.length - 8
                      )}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Amount:</span>{" "}
                      {transactionDetails.amount} APT
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Network:</span>{" "}
                      {transactionDetails.network}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="bg-white p-4 border rounded-lg shadow-sm">
                      <Image
                        src={qrCodeUrl}
                        alt="Transaction QR Code"
                        className="w-[250px] h-[250px]"
                        height={250}
                        width={250}
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    Send this QR code to the Telegram bot to broadcast your
                    transaction
                  </p>

                  <div className="mt-6 text-center">
                    <a
                      href="https://t.me/your_bot_username"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      Open Telegram Bot
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Connect your Aptos wallet using the button above</li>
              <li>
                Enter the recipient&apos;s address and the amount you want to
                send
              </li>
              <li>
                Sign the transaction locally (your private keys never leave your
                device)
              </li>
              <li>
                A QR code containing the signed transaction will be generated
              </li>
              <li>Send this QR code to our Telegram bot</li>
              <li>
                The bot will verify and broadcast the transaction to the Aptos
                network
              </li>
            </ol>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              All transactions are processed securely. Your private keys never
              leave your device.
            </p>
            <p className="mt-2">
              © {new Date().getFullYear()} Aptos Wallet Telegram Integration
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
