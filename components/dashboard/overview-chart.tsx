"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Sample data - in a real app, this would come from an API/blockchain
const data = [
  { date: "2023-03-01", sent: 12.5, received: 24.8, volume: 37.3 },
  { date: "2023-03-05", sent: 18.3, received: 12.1, volume: 30.4 },
  { date: "2023-03-10", sent: 8.9, received: 23.7, volume: 32.6 },
  { date: "2023-03-15", sent: 15.4, received: 18.2, volume: 33.6 },
  { date: "2023-03-20", sent: 21.1, received: 10.5, volume: 31.6 },
  { date: "2023-03-25", sent: 14.8, received: 25.3, volume: 40.1 },
  { date: "2023-03-30", sent: 10.2, received: 30.5, volume: 40.7 },
];

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => {
            const d = new Date(date);
            return `${d.getDate()}/${d.getMonth() + 1}`;
          }}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis 
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => `${value} APT`}
        />
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(2)} APT`, undefined]}
          labelFormatter={(label) => {
            const date = new Date(label);
            return date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
          }}
        />
        <Area
          type="monotone"
          dataKey="received"
          stackId="1"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorReceived)"
          name="Received"
        />
        <Area
          type="monotone"
          dataKey="sent"
          stackId="1"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorSent)"
          name="Sent"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}