"use client";

import { useState, useEffect, JSX } from "react";
import { useAccount } from "wagmi";
import { useAppStore } from "@/store/useAppStore";
import { mockCampaigns } from "@/utils/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const { campaigns, setCampaigns } = useAppStore();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setCampaigns(mockCampaigns);
  }, [setCampaigns]);

  // Mock admin check - in production, verify from smart contract
  // const isAdmin =
  //   address?.toLowerCase() ===
  //   "0x7c480e6EaB4c0Df88BBE6EB5cf72a175d648115c".toLowerCase();

  const isAdmin = true; // For demo purposes, allow all connected users as admins

  const pendingCampaigns = campaigns.filter((c) => c.status === "Pending");
  const totalRaised = campaigns.reduce((sum, c) => sum + c.currentAmount, 0);
  const totalDonors = campaigns.reduce((sum, c) => sum + c.supporterCount, 0);

  const handleVerifyCampaign = (campaignId: string) => {
    toast.success("Campaign verified successfully");
  };

  const handleRejectCampaign = (campaignId: string) => {
    toast.error("Campaign rejected");
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
            <p className="mt-1 text-gray-400">
              Manage campaigns and platform settings
            </p>
          </div>
        </div>

        {/* Access Control */}
        {!isConnected ? (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-500">
              Please connect your wallet to access the admin panel
            </AlertDescription>
          </Alert>
        ) : !isAdmin ? (
          <Alert className="border-red-500/50 bg-red-500/10">
            <XCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-500">
              Access denied. You don't have admin privileges.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="mb-8 grid gap-6 sm:grid-cols-3">
              <Card className="border-gray-800 bg-gray-900 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Total Raised
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-white">
                      {totalRaised.toLocaleString()} ETH
                    </h3>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                    <DollarSign className="h-7 w-7 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="border-gray-800 bg-gray-900 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Total Campaigns
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-white">
                      {campaigns.length}
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
                      Total Donors
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-white">
                      {totalDonors}
                    </h3>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="border-gray-800 bg-gray-900">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="verification"
                  className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
                >
                  Campaign Verification
                  {pendingCampaigns.length > 0 && (
                    <Badge className="ml-2 bg-green-500 text-white">
                      {pendingCampaigns.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="ngos"
                  className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
                >
                  Manage NGOs
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="overview"
                className="mt-6"
              >
                <Card className="border-gray-800 bg-gray-900 p-6">
                  <h3 className="mb-4 text-lg font-bold text-white">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {campaigns.slice(0, 5).map((campaign) => (
                      <div
                        key={campaign.id}
                        className="flex items-center justify-between border-b border-gray-800 pb-4"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {campaign.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {campaign.creatorOrganization ||
                              campaign.creatorAddress}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            campaign.verified
                              ? "border-green-500/50 bg-green-500/20 text-green-400"
                              : "border-yellow-500/50 bg-yellow-500/20 text-yellow-400"
                          }
                        >
                          {campaign.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent
                value="verification"
                className="mt-6"
              >
                <Card className="border-gray-800 bg-gray-900 p-6">
                  <h3 className="mb-4 text-lg font-bold text-white">
                    Campaigns Awaiting Verification
                  </h3>
                  {pendingCampaigns.length === 0 ? (
                    <p className="py-8 text-center text-gray-400">
                      No campaigns pending verification
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {pendingCampaigns.map((campaign) => (
                        <Card
                          key={campaign.id}
                          className="border-gray-800 bg-gray-950 p-4"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold text-white">
                                {campaign.title}
                              </h4>
                              <p className="mt-1 text-sm text-gray-400">
                                {campaign.creatorOrganization}
                              </p>
                              <Badge
                                variant="outline"
                                className="mt-2 border-green-500/50 bg-green-500/10 text-green-400"
                              >
                                {campaign.category}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleVerifyCampaign(campaign.id)
                                }
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleRejectCampaign(campaign.id)
                                }
                                className="border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent
                value="ngos"
                className="mt-6"
              >
                <Card className="border-gray-800 bg-gray-900 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">
                      Verified NGOs
                    </h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                          Add NGO
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="border-gray-800 bg-gray-900 text-white">
                        <DialogHeader>
                          <DialogTitle>Add Verified NGO</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label
                              htmlFor="ngo-name"
                              className="text-white"
                            >
                              NGO Name
                            </Label>
                            <Input
                              id="ngo-name"
                              placeholder="Enter NGO name"
                              className="mt-2 border-gray-800 bg-gray-950 text-white"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="ngo-address"
                              className="text-white"
                            >
                              Wallet Address
                            </Label>
                            <Input
                              id="ngo-address"
                              placeholder="0x..."
                              className="mt-2 border-gray-800 bg-gray-950 text-white"
                            />
                          </div>
                          <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                            Add NGO
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-4">
                    {campaigns
                      .filter((c) => c.verified)
                      .map((campaign) => (
                        <div
                          key={campaign.id}
                          className="flex items-center justify-between border-b border-gray-800 pb-4"
                        >
                          <div>
                            <p className="font-medium text-white">
                              {campaign.creatorOrganization ||
                                campaign.creatorAddress}
                            </p>
                            <p className="text-sm text-gray-400">
                              {campaign.creatorAddress}
                            </p>
                          </div>
                          <Badge className="border-green-500/50 bg-green-500/20 text-green-400">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        </div>
                      ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
