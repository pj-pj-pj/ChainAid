"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

const topDonors = [
  { address: "0x1234...5678", amount: 25.5, rank: 1 },
  { address: "0x2345...6789", amount: 18.2, rank: 2 },
  { address: "0x3456...7890", amount: 15.8, rank: 3 },
  { address: "0x4567...8901", amount: 12.4, rank: 4 },
  { address: "0x5678...9012", amount: 10.1, rank: 5 },
];

export default function TopDonors() {
  return (
    <Card className="border-gray-800 bg-gray-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Top Donors</h3>
        <Trophy className="h-5 w-5 text-yellow-500" />
      </div>
      <div className="space-y-4">
        {topDonors.map((donor) => (
          <div
            key={donor.address}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Badge
                variant="outline"
                className={`h-6 w-6 justify-center border-gray-800 p-0 ${
                  donor.rank === 1
                    ? "bg-yellow-500/20 text-yellow-500"
                    : donor.rank === 2
                    ? "bg-gray-400/20 text-gray-400"
                    : donor.rank === 3
                    ? "bg-orange-500/20 text-orange-500"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {donor.rank}
              </Badge>
              <Avatar className="h-8 w-8 border border-gray-800">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-xs text-white">
                  {donor.address.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-300">
                {donor.address}
              </span>
            </div>
            <span className="font-semibold text-white">{donor.amount} ETH</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
