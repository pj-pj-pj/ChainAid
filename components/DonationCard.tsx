"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Donation } from "@/types";
import { DollarSign, ExternalLink, User } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";

interface DonationCardProps {
  donation: Donation;
}

export default function DonationCard({
  donation,
}: DonationCardProps): JSX.Element {
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const donorDisplay = donation.ensName || formatAddress(donation.donorAddress);

  return (
    <Card className="bg-gray-950/50 border-green-900/30 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center border border-green-500/30">
              <User className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-green-50">
                {donorDisplay}
              </CardTitle>
              <p className="text-sm text-gray-500">
                {formatDate(donation.timestamp)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-green-900/30 px-3 py-1 rounded-lg border border-green-500/30">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-lg font-bold text-green-400">
              {donation.amount.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>

      {donation.message && (
        <CardContent>
          <div className="bg-gray-900/50 p-3 rounded-lg border border-green-900/20">
            <p className="text-sm text-gray-300 italic">
              &quot;{donation.message}&quot;
            </p>
          </div>
        </CardContent>
      )}

      <CardContent className="pt-0">
        <Link
          href={`https://basescan.org/tx/${donation.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors group"
        >
          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span className="font-mono">{formatAddress(donation.txHash)}</span>
        </Link>
      </CardContent>
    </Card>
  );
}
