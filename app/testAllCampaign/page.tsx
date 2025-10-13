"use client";

import { useReadContract } from "wagmi";
import { Campaign } from "@/types";
import { fetchCampaigns } from "@/lib/helper/fetchCampaigns";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contracts";

import { useState, useEffect, JSX } from "react";
import CampaignCard from "@/components/CampaignCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const page = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data: totalCampaigns } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "nextCampaignId",
    chainId: 84532,
  });

  useEffect(() => {
    async function load() {
      if (!totalCampaigns) return;
      setIsLoading(true);
      try {
        const fetched = await fetchCampaigns(Number(totalCampaigns));
        setCampaigns(fetched);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [totalCampaigns]);

  const categories = [
    "all",
    ...campaigns
      .map((c) => c.category)
      .filter((cat, idx, arr) => arr.indexOf(cat) === idx),
  ];

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || campaign.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || campaign.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-black px-4 py-8 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">All Campaigns</h1>
          <p className="mt-2 text-gray-400">
            Explore verified campaigns and make a difference
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex gap-4 ">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-gray-800 bg-gray-950 pl-10 text-white placeholder:text-gray-500 focus:border-indigo-500"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="flex-1 border-gray-800 bg-gray-950 text-white focus:border-indigo-500">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="border-gray-800 bg-gray-950 text-white">
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-white hover:bg-gray-800"
                >
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="flex-1 border-gray-800 bg-gray-950 text-white focus:border-indigo-500">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-gray-800 bg-gray-950 text-white">
              <SelectItem
                value="pending"
                className="text-white hover:bg-gray-800"
              >
                Pending
              </SelectItem>
              <SelectItem value="all" className="text-white hover:bg-gray-800">
                All Status
              </SelectItem>
              <SelectItem
                value="active"
                className="text-white hover:bg-gray-800"
              >
                Active
              </SelectItem>
              <SelectItem
                value="completed"
                className="text-white hover:bg-gray-800"
              >
                Completed
              </SelectItem>
              <SelectItem
                value="cancelled"
                className="text-white hover:bg-gray-800"
              >
                Cancelled
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading / Results */}
        {isLoading ? (
          //TODO: MAKE THIS A PROPER LOADING SPINNER COMPONENT
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="animate-spin h-8 w-8 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <p className="mt-4 text-gray-400">Loading campaigns…</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-400">
                Showing {filteredCampaigns.length} campaign
                {filteredCampaigns.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Campaigns Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>

            {/* No Results */}
            {filteredCampaigns.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-lg text-gray-400">No campaigns found</p>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default page;
