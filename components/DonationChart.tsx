"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", amount: 12000 },
  { month: "Feb", amount: 19000 },
  { month: "Mar", amount: 15000 },
  { month: "Apr", amount: 25000 },
  { month: "May", amount: 22000 },
  { month: "Jun", amount: 30000 },
];

export default function DonationChart() {
  return (
    <Card className="border-gray-800 bg-gray-900 p-6">
      <h3 className="mb-4 text-lg font-bold text-white">Monthly Donations</h3>
      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
          />
          <XAxis
            dataKey="month"
            stroke="#9CA3AF"
          />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "0.5rem",
              color: "#fff",
            }}
          />
          <Bar
            dataKey="amount"
            fill="url(#colorGradient)"
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient
              id="colorGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#32a852"
              />
              <stop
                offset="100%"
                stopColor="#1b8237"
              />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
