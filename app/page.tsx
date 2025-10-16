"use client";

import { useEffect } from "react";
import StatCard from "@/components/StatCard";
import CampaignCard from "@/components/CampaignCard";
import DonationChart from "@/components/DonationChart";
import TopDonors from "@/components/TopDonors";
import {
  DollarSign,
  Users,
  TrendingUp,
  Heart,
  ArrowRight,
  Box,
} from "lucide-react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useCampaignStore } from "@/store/useCampaignStore";
import Link from "next/link";

export default function DashboardPage() {
  const { campaigns, isLoading, fetchAll } = useCampaignStore();

  useEffect(() => {
    fetchAll(12);
  }, []);

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

  const activeCampaigns = campaigns.filter((c) => c.status === "Active");
  const totalRaised = campaigns.reduce((sum, c) => sum + c.totalDonations, 0);
  const totalDonors = campaigns.reduce((sum, c) => sum + c.supportCount, 0);
  const avgDonation = totalDonors > 0 ? totalRaised / campaigns.length : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Loading campaigns…</p>
        </div>
      </div>
    );
  }

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

        {/* Banner Image */}
        <div className="mb-8 overflow-hidden rounded-lg h-48 md:h-72">
          <img
            src="/bannerimg.png"
            alt="Dashboard Banner"
            className="w-full h-full object-cover object-[50%_54%]"
          />
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Raised"
            value={`${totalRaised.toLocaleString()} ETH`}
            icon={Box}
            trend="Donations collected across campaigns"
            trendUp={true}
          />
          <StatCard
            title="Active Campaigns"
            value={activeCampaigns.length.toString()}
            icon={Heart}
            trend="Campaigns currently accepting donations"
            trendUp={true}
          />
          <StatCard
            title="Total Donors"
            value={totalDonors.toLocaleString()}
            icon={Users}
            trend="Unique supporters who donated"
            trendUp={true}
          />
          <StatCard
            title="Avg Donation"
            value={`${avgDonation.toFixed(3)} ETH`}
            icon={TrendingUp}
            trend="Average donation per donor across campaigns"
            trendUp={true}
          />
        </div>

        {/* Chart and Top Donors */}
        {/* <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DonationChart />
          </div>
          <div>
            <TopDonors />
          </div>
        </div> */}

        {/* Featured Campaigns */}
        <div>
          <div className="mb-6 flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">
              Featured Campaigns
            </h2>
            <Link
              href="/explore"
              className="px-2 py-1 rounded-lg text-sm font-medium transition-all text-gray-400 hover:text-green-400"
            >
              <ArrowRight className="inline-block w-5 h-5 mr-1" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(() => {
              const topCampaigns = [...campaigns]
                .sort(
                  (a, b) => (b.totalDonations || 0) - (a.totalDonations || 0)
                )
                .slice(0, 3);
              return topCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                />
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
