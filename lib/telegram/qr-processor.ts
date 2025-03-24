// lib/telegram/qr-processor.ts
import { Jimp } from "jimp";
import jsQR from "jsqr";
import qrcode from "qrcode";
import fetch from "node-fetch";
import WalletAdapterService from "../blockchain/wallet-adapter";

/**
 * Utility class for processing QR codes from images received via Telegram
 */
export class QRCodeProcessor {
  /**
   * Generate a QR code as a data URL
   * @param data Data to encode in the QR code
   * @returns Promise that resolves to a data URL string
   */
  public static async generateQRCode(data: string): Promise<string> {
    try {
      // Configure QR options for optimal scanning with potentially large data
      return await qrcode.toDataURL(data, {
        errorCorrectionLevel: "M", // Balance between data density and error correction
        margin: 1,
        width: 400, // Increased size for better scanning with large data
        color: {
          dark: "#000",
          light: "#fff",
        },
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw error;
    }
  }

  /**
   * Decode a QR code from an image URL
   * @param imageUrl URL of the image containing the QR code
   * @returns Decoded QR code data or null if no QR code found
   */
  public static async decodeQRCodeFromUrl(
    imageUrl: string
  ): Promise<string | null> {
    try {
      // Fetch the image
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();

      // Process the image with Jimp
      const image = await Jimp.read(Buffer.from(buffer));
      const { width, height } = image.bitmap;

      // Convert image to raw data for jsQR
      const imageData = new Uint8ClampedArray(width * height * 4);

      let i = 0;
      image.scan(0, 0, width, height, (x, y, idx) => {
        // Correctly access bitmap data
        imageData[i++] = image.bitmap.data[idx + 0]; // R
        imageData[i++] = image.bitmap.data[idx + 1]; // G
        imageData[i++] = image.bitmap.data[idx + 2]; // B
        imageData[i++] = image.bitmap.data[idx + 3]; // A
      });

      // Use jsQR to find and decode the QR code
      const qrCode = jsQR(imageData, width, height, {
        inversionAttempts: "dontInvert", // For better performance
      });

      if (qrCode) {
        return qrCode.data;
      }

      return null;
    } catch (error) {
      console.error("Error decoding QR code:", error);
      return null;
    }
  }

  /**
   * Process a decoded QR code containing transaction data
   * @param qrData The decoded QR code data
   * @returns Transaction result or error
   */
  public static async processTransactionQR(qrData: string) {
    try {
      const walletAdapter = WalletAdapterService;

      // Decode transaction data from QR
      const decodedData = walletAdapter.decodeTransactionFromQR(qrData);

      // Verify transaction
      if (!walletAdapter.verifyTransaction(decodedData)) {
        throw new Error("Invalid transaction data in QR code");
      }

      // Extract details for logging/verification before submission
      const details = walletAdapter.extractTransactionDetails(decodedData);
      console.log("Processing transaction:", details);

      // Submit transaction
      const txResult = await walletAdapter.submitTransaction(decodedData);

      return {
        success: true,
        hash: txResult.hash,
        // Check the transaction status
        // status: txResult.success ? "Success" : "Failed",
        // // Use any available version property
        // version: txResult.version || txResult.sequence_number || "Unknown",
        details: details,
      };
    } catch (error) {
      console.error("Transaction processing error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error processing transaction",
      };
    }
  }

  /**
   * Extract transaction details from QR code data
   * @param qrData The decoded QR code data
   * @returns Transaction details or null if invalid
   */
  public static extractTransactionDetails(qrData: string) {
    try {
      const walletAdapter = WalletAdapterService;
      const decodedData = walletAdapter.decodeTransactionFromQR(qrData);

      // Use the adapter's method to extract transaction details
      return walletAdapter.extractTransactionDetails(decodedData);
    } catch (error) {
      console.error("Error extracting transaction details:", error);
      return null;
    }
  }
}

export default QRCodeProcessor;
