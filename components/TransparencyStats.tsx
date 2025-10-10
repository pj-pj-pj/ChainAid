"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, CheckCircle2, DollarSign } from "lucide-react";
import StatCard from "./StatCard";
import { JSX } from "react";

export default function TransparencyStats(): JSX.Element {
  // Mock data - would come from blockchain in production
  const stats = {
    totalRaised: 1250000,
    activeCampaigns: 24,
    verifiedNGOs: 12,
    totalTransactions: 5847,
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
          Platform Transparency
        </h2>
        <p className="text-gray-400">All data verified on-chain via Base</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Raised"
          value={`$${(stats.totalRaised / 1000000).toFixed(2)}M`}
          icon={DollarSign}
          description="Across all campaigns"
          trend="+12% this month"
        />
        <StatCard
          title="Active Campaigns"
          value={stats.activeCampaigns.toString()}
          icon={TrendingUp}
          description="Currently fundraising"
        />
        <StatCard
          title="Verified NGOs"
          value={stats.verifiedNGOs.toString()}
          icon={CheckCircle2}
          description="Community approved"
        />
        <StatCard
          title="Transactions"
          value={stats.totalTransactions.toLocaleString()}
          icon={Activity}
          description="On-chain records"
        />
      </div>

      <Card className="bg-gradient-to-br from-gray-950/80 to-green-950/20 border-green-900/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-50">
            Recent On-Chain Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: "Donation",
                amount: 5000,
                campaign: "Education for All",
                time: "2 min ago",
              },
              {
                type: "Expense",
                amount: 2500,
                campaign: "Clean Water Project",
                time: "15 min ago",
              },
              {
                type: "Donation",
                amount: 10000,
                campaign: "Medical Relief Fund",
                time: "1 hour ago",
              },
              {
                type: "Campaign Created",
                amount: 0,
                campaign: "Food Bank Initiative",
                time: "3 hours ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-green-900/20 hover:border-green-500/30 transition-all"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-400">
                    {activity.type}
                  </p>
                  <p className="text-xs text-gray-500">{activity.campaign}</p>
                </div>
                {activity.amount > 0 && (
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-400">
                      ${activity.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                )}
                {activity.amount === 0 && (
                  <p className="text-xs text-gray-500">{activity.time}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
