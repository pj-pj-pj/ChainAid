"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { mockCampaigns, mockDonations } from "@/utils/mockData";
import StatCard from "@/components/StatCard";
import CampaignCard from "@/components/CampaignCard";
import DonationChart from "@/components/DonationChart";
import TopDonors from "@/components/TopDonors";
import { DollarSign, Users, TrendingUp, Heart } from "lucide-react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function DashboardPage() {
  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (document.readyState !== "complete") {
          await new Promise((resolve) => {
            if (document.readyState === "complete") {
              resolve(void 0);
            } else {
              window.addEventListener("load", () => resolve(void 0), {
                once: true,
              });
            }
          });
        }

        await sdk.actions.ready();
        console.log(
          "Farcaster SDK initialized successfully - app fully loaded"
        );
      } catch (error) {
        console.error("Failed to initialize Farcaster SDK:", error);
        setTimeout(async () => {
          try {
            await sdk.actions.ready();
            console.log("Farcaster SDK initialized on retry");
          } catch (retryError) {
            console.error("Farcaster SDK retry failed:", retryError);
          }
        }, 1000);
      }
    };
    initializeFarcaster();
  }, []);
  const { campaigns, setCampaigns, setDonations } = useAppStore();

  useEffect(() => {
    setCampaigns(mockCampaigns);
    setDonations(mockDonations);
  }, [setCampaigns, setDonations]);

  const activeCampaigns = campaigns.filter((c) => c.status === "Active");
  const totalRaised = campaigns.reduce((sum, c) => sum + c.currentAmount, 0);
  const totalDonors = campaigns.reduce((sum, c) => sum + c.donors, 0);

  return (
    <div className="min-h-screen bg-black px-4 py-8 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Track transparent blockchain donations on Base Network
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Raised"
            value={`${totalRaised.toLocaleString()} ETH`}
            icon={DollarSign}
            trend="+12.5% from last month"
            trendUp={true}
          />
          <StatCard
            title="Active Campaigns"
            value={activeCampaigns.length.toString()}
            icon={Heart}
            trend="+3 new this week"
            trendUp={true}
          />
          <StatCard
            title="Total Donors"
            value={totalDonors.toLocaleString()}
            icon={Users}
            trend="+234 this month"
            trendUp={true}
          />
          <StatCard
            title="Avg Donation"
            value="0.45 ETH"
            icon={TrendingUp}
            trend="+8.2% from last month"
            trendUp={true}
          />
        </div>

        {/* Chart and Top Donors */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DonationChart />
          </div>
          <div>
            <TopDonors />
          </div>
        </div>

        {/* Featured Campaigns */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Featured Campaigns
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeCampaigns.slice(0, 3).map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
