"use client";

import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sample data - in a real app, this would come from an API/blockchain
const transactions = [
  {
    id: "tx1",
    type: "sent",
    amount: "12.5 APT",
    recipient: "0x1a2b...3c4d",
    date: "2023-03-28T14:32:45",
    status: "completed",
    hash: "0xabcd...1234",
  },
  {
    id: "tx2",
    type: "received",
    amount: "5.2 APT",
    sender: "0x5e6f...7g8h",
    date: "2023-03-27T09:15:22",
    status: "completed",
    hash: "0xefgh...5678",
  },
  {
    id: "tx3",
    type: "sent",
    amount: "0.8 APT",
    recipient: "0x9i10...11j12",
    date: "2023-03-26T18:45:10",
    status: "completed",
    hash: "0xijkl...9012",
  },
  {
    id: "tx4",
    type: "received",
    amount: "15.0 APT",
    sender: "0x13k14...15l16",
    date: "2023-03-25T11:22:33",
    status: "completed",
    hash: "0xmnop...3456",
  },
  {
    id: "tx5",
    type: "sent",
    amount: "3.7 APT",
    recipient: "0x17m18...19n20",
    date: "2023-03-24T16:08:59",
    status: "completed",
    hash: "0xqrst...7890",
  },
];

interface RecentTransactionsProps {
  showAll?: boolean;
}

export function RecentTransactions({ showAll = false }: RecentTransactionsProps) {
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5);
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="hidden md:table-cell">From/To</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayTransactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell>
              <div className="flex items-center">
                {tx.type === "sent" ? (
                  <ArrowUp className="mr-2 h-4 w-4 text-red-500" />
                ) : (
                  <ArrowDown className="mr-2 h-4 w-4 text-green-500" />
                )}
                <span className="capitalize">{tx.type}</span>
              </div>
            </TableCell>
            <TableCell className="font-medium">{tx.amount}</TableCell>
            <TableCell className="hidden md:table-cell">
              {tx.type === "sent" ? tx.recipient : tx.sender}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {new Date(tx.date).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </TableCell>
            <TableCell>
              <Badge 
                variant={tx.status === "completed" ? "default" : "outline"}
                className={
                  tx.status === "completed" 
                    ? "bg-green-500 hover:bg-green-500/80" 
                    : ""
                }
              >
                {tx.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button size="sm" variant="ghost" asChild>
                <a 
                  href={`https://explorer.aptoslabs.com/txn/${tx.hash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <span className="sr-only">View transaction</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}   