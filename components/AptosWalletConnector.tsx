"use client";

import {
  APTOS_CONNECT_ACCOUNT_URL,
  AboutAptosConnect,
  AboutAptosConnectEducationScreen,
  AdapterNotDetectedWallet,
  AdapterWallet,
  AptosPrivacyPolicy,
  WalletItem,
  WalletSortingOptions,
  groupAndSortWallets,
  isAptosConnectWallet,
  isInstallRequired,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Copy,
  LogOut,
  User,
  QrCode,
} from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import qrcode from "qrcode";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import WalletAdapterService from "@/lib/blockchain/wallet-adapter";
interface WalletRowProps {
  wallet: AdapterWallet | AdapterNotDetectedWallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem
      wallet={wallet}
      onConnect={onConnect}
      className="flex items-center justify-between px-4 py-3 gap-4 border rounded-md"
    >
      <div className="flex items-center gap-4">
        <WalletItem.Icon className="h-6 w-6" />
        <WalletItem.Name className="text-base font-normal" />
      </div>
      {isInstallRequired(wallet) ? (
        <Button size="sm" variant="ghost" asChild>
          <WalletItem.InstallLink />
        </Button>
      ) : (
        <WalletItem.ConnectButton asChild>
          <Button size="sm">Connect</Button>
        </WalletItem.ConnectButton>
      )}
    </WalletItem>
  );
}

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect}>
      <WalletItem.ConnectButton asChild>
        <Button size="lg" variant="outline" className="w-full gap-4">
          <WalletItem.Icon className="h-5 w-5" />
          <WalletItem.Name className="text-base font-normal" />
        </Button>
      </WalletItem.ConnectButton>
    </WalletItem>
  );
}

function renderEducationScreen(screen: AboutAptosConnectEducationScreen) {
  return (
    <>
      <DialogHeader className="grid grid-cols-[1fr_4fr_1fr] items-center space-y-0">
        <Button variant="ghost" size="icon" onClick={screen.cancel}>
          <ArrowLeft />
        </Button>
        <DialogTitle className="leading-snug text-base text-center">
          About Aptos Connect
        </DialogTitle>
      </DialogHeader>

      <div className="flex h-[162px] pb-3 items-end justify-center">
        <screen.Graphic />
      </div>
      <div className="flex flex-col gap-2 text-center pb-4">
        <screen.Title className="text-xl" />
        <screen.Description className="text-sm text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a]:text-foreground" />
      </div>

      <div className="grid grid-cols-3 items-center">
        <Button
          size="sm"
          variant="ghost"
          onClick={screen.back}
          className="justify-self-start"
        >
          Back
        </Button>
        <div className="flex items-center gap-2 place-self-center">
          {screen.screenIndicators.map((ScreenIndicator, i) => (
            <ScreenIndicator key={i} className="py-4">
              <div className="h-0.5 w-6 transition-colors bg-muted [[data-active]>&]:bg-foreground" />
            </ScreenIndicator>
          ))}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={screen.next}
          className="gap-2 justify-self-end"
        >
          {screen.screenIndex === screen.totalScreens - 1 ? "Finish" : "Next"}
          <ArrowRight size={16} />
        </Button>
      </div>
    </>
  );
}
export function AuthWalletConnector({
  walletSortingOptions = {}, // Default empty object to prevent undefined
  onTransactionCreated, // Optional callback for when a transaction is created
  recipientAddress = "", // Optional pre-filled recipient
  amount = 0, // Optional pre-filled amount
}: {
  walletSortingOptions?: WalletSortingOptions;
  onTransactionCreated?: (qrCodeData: string) => void;
  recipientAddress?: string;
  amount?: number;
}) {
  const { account, connected, disconnect, wallet, signTransaction } =
    useWallet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [isTxFormOpen, setIsTxFormOpen] = useState(false);
  const [txRecipient, setTxRecipient] = useState(recipientAddress || "");
  const [txAmount, setTxAmount] = useState(amount || 0);
  const [qrCodeData, setQrCodeData] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [txInProgress, setTxInProgress] = useState(false);
  const [aptos, setAptos] = useState<Aptos | null>(null);
  const [walletAdapter, setWalletAdapter] = useState<
    typeof WalletAdapterService | null
  >(null);

  console.log(qrCodeData, aptos);
  useEffect(() => {
    const network =
      process.env.NEXT_PUBLIC_APTOS_NETWORK === "mainnet"
        ? Network.MAINNET
        : Network.TESTNET;

    const aptosConfig = new AptosConfig({
      network,
    });

    setAptos(new Aptos(aptosConfig));

    // Initialize Wallet Adapter Service
    const initWalletAdapter = async () => {
      const adapter = WalletAdapterService;
      await adapter.initialize();
      setWalletAdapter(adapter);
    };

    initWalletAdapter();
  }, []);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);
  const closeQRDialog = useCallback(() => setIsQRDialogOpen(false), []);
  const closeTxFormDialog = useCallback(() => setIsTxFormOpen(false), []);

  const copyAddress = useCallback(async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address.toString());
      toast("Wallet address copied to clipboard. You can now paste it");
    } catch {
      toast.error(
        "Failed to copy wallet address to clipboard. Please try again."
      );
    }
  }, [account?.address]);

  const createTransactionPayload = async () => {
    if (!account?.address || !txRecipient || txAmount <= 0 || !walletAdapter) {
      toast.error("Please fill in all required fields");
      return null;
    }

    try {
      // Create a transaction using the wallet adapter service
      return await walletAdapter.createTransferTransaction(
        account.address.toString(),
        txRecipient,
        Math.floor(txAmount * 100000000) // Convert to Octas
      );
    } catch (error) {
      console.error("Failed to create transaction:", error);
      toast.error(`Failed to create transaction`);
      return null;
    }
  };

  const handleSignTransaction = async () => {
    if (!connected) {
      toast.error("Please connect wallet first");
      return;
    }

    setTxInProgress(true);
    setQrCodeData("");
    setQrCodeUrl("");

    try {
      const transaction = await createTransactionPayload();

      if (!transaction) {
        throw new Error("Failed to create transaction");
      }

      // Sign the transaction with the connected wallet
      const { authenticator, rawTransaction } = await signTransaction({
        transactionOrPayload: transaction,
      });
      console.log("rawTransaction", rawTransaction);

      // Encode the signed transaction for QR code
      const qrPayload = walletAdapter?.encodeTransactionForQR(
        transaction,
        authenticator
      );
      if (!qrPayload) {
        throw new Error("Failed to encode transaction for QR code");
      }
      setQrCodeData(qrPayload);

      // Generate QR code as data URL
      try {
        const dataUrl = await qrcode.toDataURL(qrPayload, {
          margin: 1,
          width: 250,
          color: {
            dark: "#000",
            light: "#fff",
          },
        });
        setQrCodeUrl(dataUrl);
        closeTxFormDialog();
        setIsQRDialogOpen(true);

        // If callback is provided, invoke it
        if (onTransactionCreated) {
          onTransactionCreated(qrPayload);
        }
      } catch (qrError) {
        console.error("QR code generation failed:", qrError);
        toast.error(`QR code generation failed`);
      }
    } catch (error) {
      console.error("Transaction signing failed:", error);
      toast.error(`Transaction signing failed`);
    } finally {
      setTxInProgress(false);
    }
  };

  // Component for QR dialog
  const QRDialog = () => (
    <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <p className="mb-4 text-sm text-center text-muted-foreground">
            Send this QR code to the Telegram bot to broadcast your transaction
          </p>
          <div className="bg-white p-4 rounded-md">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="Transaction QR Code"
                className="w-[250px] h-[250px]"
              />
            ) : (
              <div className="w-[250px] h-[250px] flex items-center justify-center">
                <p className="text-gray-400">Generating QR code...</p>
              </div>
            )}
          </div>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            QR code contains a signed transaction to send {txAmount} APT to{" "}
            {txRecipient.substring(0, 6)}...
            {txRecipient.substring(txRecipient.length - 4)}
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <Button onClick={closeQRDialog}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Transaction form dialog
  const TransactionFormDialog = () => (
    <Dialog open={isTxFormOpen} onOpenChange={setIsTxFormOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient Address</label>
            <input
              type="text"
              value={txRecipient}
              onChange={(e) => setTxRecipient(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="0x..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (APT)</label>
            <input
              type="number"
              value={txAmount}
              onChange={(e) => setTxAmount(parseFloat(e.target.value))}
              className="w-full p-2 border rounded-md"
              min="0"
              step="0.1"
            />
          </div>
          <Button
            onClick={handleSignTransaction}
            disabled={txInProgress}
            className="w-full"
          >
            {txInProgress
              ? "Signing..."
              : "Sign Transaction & Generate QR Code"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {connected ? (
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="cursor-pointer">
                {account?.ansName ||
                  truncateAddress(account?.address?.toString()) ||
                  "Unknown"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={copyAddress}
                className="gap-2 cursor-pointer"
              >
                <Copy className="h-4 w-4" /> Copy address
              </DropdownMenuItem>
              {wallet && isAptosConnectWallet(wallet) && (
                <DropdownMenuItem asChild>
                  <a
                    href={APTOS_CONNECT_ACCOUNT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2"
                  >
                    <User className="h-4 w-4" /> Account
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => setIsTxFormOpen(true)}
                className="gap-2 cursor-pointer"
              >
                <QrCode className="h-4 w-4" /> Create Transaction
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={disconnect}
                className="gap-2 cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Connect a Wallet</Button>
          </DialogTrigger>
          <ConnectWalletDialog close={closeDialog} {...walletSortingOptions} />
        </Dialog>
      )}

      <TransactionFormDialog />
      <QRDialog />
    </>
  );
}

interface ConnectWalletDialogProps extends WalletSortingOptions {
  close: () => void;
}

function ConnectWalletDialog({
  close,
  ...walletSortingOptions
}: ConnectWalletDialogProps) {
  const { wallets = [], notDetectedWallets = [] } = useWallet();

  const { aptosConnectWallets, availableWallets, installableWallets } =
    groupAndSortWallets(
      [...wallets, ...notDetectedWallets],
      walletSortingOptions
    );

  const hasAptosConnectWallets = !!aptosConnectWallets.length;

  return (
    <DialogContent className="max-h-screen overflow-auto">
      <AboutAptosConnect renderEducationScreen={renderEducationScreen}>
        <DialogHeader>
          <DialogTitle className="flex flex-col text-center leading-snug">
            {hasAptosConnectWallets ? (
              <>
                <span>Log in or sign up</span>
                <span>with Social + Aptos Connect</span>
              </>
            ) : (
              "Connect Wallet"
            )}
          </DialogTitle>
        </DialogHeader>

        {hasAptosConnectWallets && (
          <div className="flex flex-col gap-2 pt-3">
            {aptosConnectWallets.map((wallet) => (
              <AptosConnectWalletRow
                key={wallet.name}
                wallet={wallet}
                onConnect={close}
              />
            ))}
            <p className="flex gap-1 justify-center items-center text-muted-foreground text-sm">
              Learn more about{" "}
              <AboutAptosConnect.Trigger className="flex gap-1 py-3 items-center text-foreground">
                Aptos Connect <ArrowRight size={16} />
              </AboutAptosConnect.Trigger>
            </p>
            <AptosPrivacyPolicy className="flex flex-col items-center py-1">
              <p className="text-xs leading-5">
                <AptosPrivacyPolicy.Disclaimer />{" "}
                <AptosPrivacyPolicy.Link className="text-muted-foreground underline underline-offset-4" />
                <span className="text-muted-foreground">.</span>
              </p>
              <AptosPrivacyPolicy.PoweredBy className="flex gap-1.5 items-center text-xs leading-5 text-muted-foreground" />
            </AptosPrivacyPolicy>
            <div className="flex items-center gap-3 pt-4 text-muted-foreground">
              <div className="h-px w-full bg-secondary" />
              Or
              <div className="h-px w-full bg-secondary" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-3">
          {availableWallets.map((wallet) => (
            <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
          ))}
          {!!installableWallets.length && (
            <Collapsible className="flex flex-col gap-3">
              <CollapsibleTrigger asChild>
                <Button size="sm" variant="ghost" className="gap-2">
                  More wallets <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-3">
                {installableWallets.map((wallet) => (
                  <WalletRow
                    key={wallet.name}
                    wallet={wallet}
                    onConnect={close}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </AboutAptosConnect>
    </DialogContent>
  );
}
