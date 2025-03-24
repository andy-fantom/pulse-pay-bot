import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ModeToggle } from '@/components/global/modetoggle';
import { UserNav } from '@/components/global/navbar';
import { WalletProvider } from '@/components/AppWalletProvider';
import { AutoConnectProvider } from '@/components/AutoConnectProvider';
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pulse Pay - Blockchain Payments via Telegram',
  description: 'Send and receive crypto payments on the Aptos blockchain through Telegram',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <AutoConnectProvider>
          <ReactQueryClientProvider>
            <WalletProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="border-b sticky top-0 z-10 bg-background">
                  <div className="flex h-16 items-center px-4">
                    <div className="flex items-center font-semibold text-lg mr-4">
                      <span className="text-primary">Pulse</span>
                      <span>Pay</span>
                    </div>
                    <div className="ml-auto flex items-center space-x-4">
                      <ModeToggle />
                      <UserNav />
                    </div>
                  </div>
                </header>
          {children}
          <Toaster />
        </ThemeProvider>
        </WalletProvider>
          </ReactQueryClientProvider>
        </AutoConnectProvider>
      </body>
    </html>
  );
}