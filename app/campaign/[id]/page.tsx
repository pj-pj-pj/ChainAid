"use client";

import { useEffect, useState, JSX } from "react";
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
import {
  ArrowLeft,
  ExternalLink,
  DollarSign,
  Users,
  Calendar,
  Target,
  CheckCircle2,
  TrendingUp,
  Box,
} from "lucide-react";
import { useCampaignStore } from "@/store/useCampaignStore";
import formatCategory from "@/lib/helper/formatCategory";
import { daysLeftFromNow, fetchDonations } from "@/lib/helper/fetchCampaigns";
import { useAccount } from "wagmi";

export default function CampaignDetailPage(): JSX.Element {
  const { id } = useParams();
  const { fetchSingle } = useCampaignStore();
  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<"Admin" | "Donor" | "">("");
  const [donations, setDonations] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const { address } = useAccount();

  useEffect(() => {
    async function load() {
      if (!id) return;
      setIsLoading(true);
      try {
        const fetched = await fetchSingle(Number(id));
        setCampaign(fetched);

        if (fetched?.creator && address) {
          try {
            if (fetched.creator.toLowerCase() === address.toLowerCase()) {
              setUserRole("Admin");
            }
          } catch (e) {
            console.warn("campaign creator/address compare failed", e);
          }
        }

        // Fetch donations for this campaign
        const fetchedDonations = await fetchDonations(Number(id));
        setDonations(fetchedDonations || []);

        console.log(Number(id));
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading campaign data...
      </div>
    );

  if (!campaign)
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

  const progress = (campaign.totalDonations / campaign.goalAmount) * 100 || 0;
  const remainingBalance =
    campaign.totalDonations - (campaign.totalExpenses || 0);
  const daysLeft = daysLeftFromNow(campaign.deadline);

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
                  <Badge className={getStatusColor(campaign.state)}>
                    {campaign.state}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-green-950/20 text-green-400 border-green-500/30"
                  >
                    {formatCategory(campaign.category)}
                  </Badge>
                  <RoleBadge role={userRole} />
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{campaign.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gray-950/50 border-green-900/30">
                <CardContent className="p-4 text-center">
                  <Box className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-400">
                    {campaign.totalDonations.toLocaleString()}{" "}
                    <span className="text-s">ETH</span>
                  </p>
                  <p className="text-xs text-gray-500">Raised</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-950/50 border-green-900/30">
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-400">
                    {campaign.goalAmount.toLocaleString()}{" "}
                    <span className="text-s">ETH</span>
                  </p>
                  <p className="text-xs text-gray-500">Goal</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-950/50 border-green-900/30">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-400">
                    {campaign.supportCount || 0}
                  </p>
                  <p className="text-xs text-gray-500">Supporters</p>
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
                    {(Math.trunc(progress * 100) / 100).toFixed(2) + "%"}
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-3 bg-gray-800"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>
                    {campaign.totalDonations.toLocaleString()}{" "}
                    <span className="text-xs">ETH</span> raised
                  </span>
                  <span>
                    {(
                      campaign.goalAmount - campaign.totalDonations
                    ).toLocaleString()}{" "}
                    <span className="text-xs">ETH</span> remaining
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (Financials + Verification) */}
          <div className="space-y-6">
            <Card className="bg-gray-950/50 border-green-900/30">
              <CardHeader>
                <CardTitle className="text-lg text-green-50">
                  On-Chain Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`https://basescan.org/address/${campaign.creator}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors group"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-mono text-xs">
                    {campaign.creator.slice(0, 20)}...
                    {campaign.creator.slice(-8)}
                  </span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs (Donations/Expenses/Supporters) */}
        <Tabs
          defaultValue="donations"
          className="space-y-6"
        >
          <TabsList className="bg-gray-950/50 border border-green-900/30">
            <TabsTrigger value="donations">
              Donations ({donations.length})
            </TabsTrigger>
            <TabsTrigger value="expenses">
              Expenses ({expenses.length})
            </TabsTrigger>
            <TabsTrigger value="supporters">
              Supporters ({campaign.supportCount || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donations">
            {donations.length > 0 ? (
              donations.map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                />
              ))
            ) : (
              <Card className="bg-gray-950/50 border-green-900/30">
                <CardContent className="p-12 text-center text-gray-400">
                  No donations yet
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="expenses">
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
                <CardContent className="p-12 text-center text-gray-400">
                  No expenses logged yet
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="supporters">
            <Card className="bg-gray-950/50 border-green-900/30">
              <CardContent className="p-12 text-center text-gray-400">
                Supporter list coming soon
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
