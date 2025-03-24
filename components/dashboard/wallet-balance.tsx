"use client";

import { PieChart, Pie, Cell, ResponsiveContainer,  Tooltip } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

// Sample data - in a real app, this would come from an API/blockchain
const data = [
  { name: "APT", value: 128.43, amount: "128.43 APT", usdValue: "$1,798.02" },
  { name: "USDC", value: 524.75, amount: "524.75 USDC", usdValue: "$524.75" },
  { name: "USDT", value: 210.32, amount: "210.32 USDT", usdValue: "$210.32" },
  { name: "wETH", value: 0.25, amount: "0.25 wETH", usdValue: "$837.50" },
];

export function WalletBalance() {
  return (
    <div className="flex flex-col md:flex-row w-full p-2 text-sm">
      <div className="w-full md:w-1/2 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              label={({ name }) => name}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]}
              labelFormatter={() => "USD Value"}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="w-full md:w-1/2 flex flex-col justify-center mt-4 md:mt-0">
        <h4 className="font-medium mb-2">Token Balances</h4>
        <div className="space-y-3">
          {data.map((token, index) => (
            <div key={token.name} className="flex justify-between items-center">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{token.name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{token.amount}</div>
                <div className="text-muted-foreground text-xs">{token.usdValue}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t">
          <div className="flex justify-between font-medium">
            <span>Total Balance:</span>
            <span>$3,370.59</span>
          </div>
        </div>
      </div>
    </div>
  );
}



