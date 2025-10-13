"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useAppStore } from "@/store/useAppStore";
import { mockDonations } from "@/utils/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, AlertCircle, Heart, TrendingUp } from "lucide-react";

export default function MyContributionsPage() {
  const { address, isConnected } = useAccount();
  const { donations, setDonations } = useAppStore();

  useEffect(() => {
    setDonations(mockDonations);
  }, [setDonations]);

  const myDonations = donations.filter(
    (d) => d.donorAddress.toLowerCase() === address?.toLowerCase()
  );
  const totalDonated = myDonations.reduce((sum, d) => sum + d.amount, 0);
  // Calculate number of unique campaigns supported without creating a Set instance
  const campaignsSupported = myDonations
    .map((d) => d.campaignId)
    .filter((id, idx, arr) => arr.indexOf(id) === idx).length;

  return (
    <div className="min-h-screen bg-black px-4 py-8 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">My Contributions</h1>
          <p className="mt-2 text-gray-400">
            Track your donation history and impact
          </p>
        </div>

        {/* Connection Alert */}
        {!isConnected ? (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-500">
              Please connect your wallet to view your contributions
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8 grid gap-6 sm:grid-cols-3">
              <Card className="border-gray-800 bg-gray-900 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Total Donated
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-white">
                      {totalDonated.toFixed(4)} ETH
                    </h3>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                    <Heart className="h-7 w-7 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="border-gray-800 bg-gray-900 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Campaigns Supported
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-white">
                      {campaignsSupported}
                    </h3>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="border-gray-800 bg-gray-900 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Total Donations
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-white">
                      {myDonations.length}
                    </h3>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                    <Heart className="h-7 w-7 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Donations List */}
            {myDonations.length === 0 ? (
              <Card className="border-gray-800 bg-gray-900 p-12 text-center">
                <p className="text-lg text-gray-400">No donations yet</p>
                <p className="mt-2 text-sm text-gray-500">
                  Start making a difference by supporting a campaign
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">
                  Donation History
                </h2>
                {myDonations.map((donation) => (
                  <Card
                    key={donation.id}
                    className="border-gray-800 bg-gray-900 p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">
                          {donation.campaignTitle}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                          Donated on{" "}
                          {new Date(donation.timestamp).toLocaleDateString()}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className="border-green-500/50 bg-green-500/10 text-green-400"
                          >
                            {donation.amount} ETH
                          </Badge>
                          <a
                            href={`https://basescan.org/tx/${donation.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-green-400"
                          >
                            <div className="flex items-center space-x-1">
                              <span>View Transaction</span>
                              <ExternalLink className="h-3 w-3" />
                            </div>
                          </a>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="border-gray-800 bg-gray-950 text-white hover:border-green-500 hover:bg-gray-800"
                        onClick={() =>
                          window.open(
                            `/campaign/${donation.campaignId}`,
                            "_self"
                          )
                        }
                      >
                        View Campaign
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
