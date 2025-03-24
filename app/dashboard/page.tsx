import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  ArrowDownUp, CreditCard, DollarSign, Users} from "lucide-react";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { WalletBalance } from "@/components/dashboard/wallet-balance";
import { SendTokensForm } from "@/components/dashboard/send-tokens-form";
import { WalletSelector } from "@/components/WalletButton";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          {/* <Button>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button> */}
          <WalletSelector />
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="send">Send Tokens</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Balance
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128.43 APT</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sent (30d)
                </CardTitle>
                <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45.21 APT</div>
                <p className="text-xs text-muted-foreground">
                  +12 transactions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Received (30d)
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">62.45 APT</div>
                <p className="text-xs text-muted-foreground">
                  +8 transactions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Contacts
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 since last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Transaction Overview</CardTitle>
                <CardDescription>
                  Your transaction volume over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <OverviewChart />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Wallet Balance</CardTitle>
                <CardDescription>
                  Distribution of your token holdings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WalletBalance />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your most recent transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View and filter your transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* More comprehensive transaction history component would go here */}
              <RecentTransactions showAll />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="send" className="space-y-4">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Send Tokens</CardTitle>
              <CardDescription>
                Transfer tokens to another address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SendTokensForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your wallet and Telegram connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Settings form would go here */}
              <p>Settings page content</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}