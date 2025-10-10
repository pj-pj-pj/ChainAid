"use client";

import { useState, JSX } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoleBadge from "@/components/RoleBadge";
import DonationCard from "@/components/DonationCard";
import ExpenseCard from "@/components/ExpenseCard";
import SupportProgressBar from "@/components/SupportProgressBar";
import { mockCampaigns, mockDonations, mockExpenses } from "@/utils/mockData";
import {
  ArrowLeft,
  ExternalLink,
  DollarSign,
  Users,
  Calendar,
  Target,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function CampaignDetailPage(): JSX.Element {
  const params = useParams();
  const campaignId = params.id as string;
  const [userRole] = useState<"Admin" | "Member" | "Donor" | "Viewer">("Donor");

  const campaign = mockCampaigns.find((c) => c.id === campaignId);
  const donations = mockDonations.filter((d) => d.campaignId === campaignId);
  const expenses = mockExpenses.filter((e) => e.campaignId === campaignId);

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400 mb-4">
            Campaign not found
          </h2>
          <Link href="/explore">
            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold">
              Back to Explore
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = (campaign.currentAmount / campaign.goalAmount) * 100;
  const totalExpenses = campaign.totalExpenses;
  const remainingBalance = campaign.remainingBalance;
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(campaign.deadline).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Active":
        return "bg-green-900/30 text-green-400 border-green-500/50";
      case "Pending":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-500/50";
      case "Completed":
        return "bg-blue-900/30 text-blue-400 border-blue-500/50";
      case "Cancelled":
        return "bg-red-900/30 text-red-400 border-red-500/50";
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link href="/explore">
          <Button
            variant="ghost"
            className="mb-6 text-green-400 hover:text-green-300 hover:bg-green-900/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
          </Button>
        </Link>

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-green-50">
                    {campaign.title}
                  </h1>
                  {campaign.verified && (
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-green-950/20 text-green-400 border-green-500/30"
                  >
                    {campaign.category}
                  </Badge>
                  <RoleBadge role={userRole} />
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{campaign.description}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gray-950/50 border-green-900/30">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-400">
                    ${campaign.currentAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Raised</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-950/50 border-green-900/30">
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-400">
                    ${campaign.goalAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Goal</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-950/50 border-green-900/30">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-400">
                    {campaign.supporterCount}
                  </p>
                  <p className="text-xs text-gray-500">Donors</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-950/50 border-green-900/30">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-400">
                    {daysLeft}
                  </p>
                  <p className="text-xs text-gray-500">Days Left</p>
                </CardContent>
              </Card>
            </div>

            {/* Progress */}
            <Card className="bg-gray-950/50 border-green-900/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-400">
                    Fundraising Progress
                  </span>
                  <span className="text-lg font-bold text-green-400">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-3 bg-gray-800"
                >
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
                </Progress>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>${campaign.currentAmount.toLocaleString()} raised</span>
                  <span>
                    $
                    {(
                      campaign.goalAmount - campaign.currentAmount
                    ).toLocaleString()}{" "}
                    remaining
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {campaign.status === "Pending" && (
              <SupportProgressBar
                currentSupporters={campaign.supporterCount || 25}
                requiredSupporters={50}
                currentPledged={campaign.pledgedSupport || 1250}
                requiredPledged={2500}
                status={campaign.status}
                deadline={campaign.deadline}
              />
            )}

            {campaign.status === "Active" && (
              <Card className="bg-gradient-to-br from-green-950/50 to-gray-950/50 border-green-500/50">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-green-50 mb-2">
                      Support This Campaign
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Make a transparent, on-chain donation
                    </p>
                  </div>

                  <Link href={`/donate/${campaign.id}`}>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold text-lg py-6">
                      <DollarSign className="mr-2 h-5 w-5" />
                      Donate Now
                    </Button>
                  </Link>

                  <div className="pt-4 border-t border-green-900/30">
                    <p className="text-xs text-gray-500 text-center">
                      All donations are on-chain and publicly verifiable
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Summary */}
            <Card className="bg-gray-950/50 border-green-900/30">
              <CardHeader>
                <CardTitle className="text-lg text-green-50">
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Raised</span>
                  <span className="font-semibold text-green-400">
                    ${campaign.currentAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Expenses</span>
                  <span className="font-semibold text-red-400">
                    -${totalExpenses.toLocaleString()}
                  </span>
                </div>
                <div className="pt-3 border-t border-green-900/30">
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-medium">
                      Remaining Balance
                    </span>
                    <span className="text-xl font-bold text-green-400">
                      ${remainingBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* On-Chain Verification */}
            <Card className="bg-gray-950/50 border-green-900/30">
              <CardHeader>
                <CardTitle className="text-lg text-green-50">
                  On-Chain Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`https://basescan.org/address/${campaign.creatorAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors group"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-mono text-xs">
                    {campaign.creatorAddress.slice(0, 20)}...
                    {campaign.creatorAddress.slice(-8)}
                  </span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="donations"
          className="space-y-6"
        >
          <TabsList className="bg-gray-950/50 border border-green-900/30">
            <TabsTrigger
              value="donations"
              className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400"
            >
              Donations ({donations.length})
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400"
            >
              Expenses ({expenses.length})
            </TabsTrigger>
            <TabsTrigger
              value="supporters"
              className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400"
            >
              Supporters ({campaign.supporterCount || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="donations"
            className="space-y-4"
          >
            {donations.length > 0 ? (
              donations.map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                />
              ))
            ) : (
              <Card className="bg-gray-950/50 border-green-900/30">
                <CardContent className="p-12 text-center">
                  <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No donations yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent
            value="expenses"
            className="space-y-4"
          >
            {(userRole === "Admin" || userRole === "Member") && (
              <Link href={`/expenses/${campaign.id}`}>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold">
                  Log New Expense
                </Button>
              </Link>
            )}

            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  userRole={userRole}
                />
              ))
            ) : (
              <Card className="bg-gray-950/50 border-green-900/30">
                <CardContent className="p-12 text-center">
                  <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No expenses logged yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="supporters">
            <Card className="bg-gray-950/50 border-green-900/30">
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Supporter list coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
