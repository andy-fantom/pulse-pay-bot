"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Activity,
  CreditCard,
  DollarSign,
  Home,
  Settings,
  User,
  Wallet,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <Home className="mr-2 h-4 w-4" />,
  },
  {
    title: "Wallet",
    href: "/dashboard/wallet",
    icon: <Wallet className="mr-2 h-4 w-4" />,
  },
  {
    title: "Send & Receive",
    href: "/dashboard/send",
    icon: <CreditCard className="mr-2 h-4 w-4" />,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: <Activity className="mr-2 h-4 w-4" />,
  },
  {
    title: "Contacts",
    href: "/dashboard/contacts",
    icon: <User className="mr-2 h-4 w-4" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
  {
    title: "Home",
    href: "/",
    icon: <Home className="mr-2 h-4 w-4" />,
  },

];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-4 py-4">
      <div className="grid gap-1">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              pathname === item.href
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground"
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <div className="px-3 py-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            BALANCE
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-primary" />
              <span className="font-medium">128.43 APT</span>
            </div>
            <span className="text-xs text-muted-foreground">$1,798.02</span>
          </div>
        </div>
        
        <div className="mt-2 px-3 py-2">
          <Link
            href="/dashboard/deposit"
            className="flex items-center text-sm text-primary hover:underline"
          >
            <span className="mr-1">+</span> Deposit Funds
          </Link>
        </div>
      </div>
      
      <div className="mt-auto pt-6">
        <div className="rounded-lg bg-primary/10 p-4">
          <h4 className="font-medium text-sm mb-2">Telegram Integration</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Use our Telegram bot for quick transactions and balance checks.
          </p>
          <a
            href="https://t.me/OgPulser_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium"
          >
            Open Telegram Bot
          </a>
        </div>
      </div>
    </nav>
  );
}