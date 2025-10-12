"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useAppStore } from "@/store/useAppStore";
import { mockCampaigns } from "@/utils/mockData";
import CampaignCard from "@/components/CampaignCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function MyCampaignsPage() {
  const { address, isConnected } = useAccount();
  const { campaigns, setCampaigns } = useAppStore();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setCampaigns(mockCampaigns);
  }, [setCampaigns]);

  // Filter campaigns created by current user
  const myCampaigns = campaigns.filter(
    (c) => c.creatorAddress.toLowerCase() === address?.toLowerCase()
  );
  const activeCampaigns = myCampaigns.filter((c) => c.status === "Active");
  const completedCampaigns = myCampaigns.filter(
    (c) => c.status === "Completed"
  );

  return (
    <div className="min-h-screen bg-black px-4 py-8 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">My Campaigns</h1>
            <p className="mt-2 text-gray-400">Manage your created campaigns</p>
          </div>
          <Link href="/create">
            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </Link>
        </div>

        {/* Connection Alert */}
        {!isConnected ? (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-500">
              Please connect your wallet to view your campaigns
            </AlertDescription>
          </Alert>
        ) : myCampaigns.length === 0 ? (
          <Card className="border-gray-800 bg-gray-900 p-12 text-center">
            <p className="text-lg text-gray-400">
              You haven't created any campaigns yet
            </p>
            <Link href="/create">
              <Button className="mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Campaign
              </Button>
            </Link>
          </Card>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="border-gray-800 bg-gray-900">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
              >
                All ({myCampaigns.length})
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
              >
                Active ({activeCampaigns.length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
              >
                Completed ({completedCampaigns.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="all"
              className="mt-6"
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="active"
              className="mt-6"
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activeCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                  />
                ))}
              </div>
              {activeCampaigns.length === 0 && (
                <Card className="border-gray-800 bg-gray-900 p-12 text-center">
                  <p className="text-lg text-gray-400">No active campaigns</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent
              value="completed"
              className="mt-6"
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {completedCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                  />
                ))}
              </div>
              {completedCampaigns.length === 0 && (
                <Card className="border-gray-800 bg-gray-900 p-12 text-center">
                  <p className="text-lg text-gray-400">
                    No completed campaigns
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
