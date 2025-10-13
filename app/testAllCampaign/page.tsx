"use client";

import { useEffect, useState } from "react";
import { useCampaignStore } from "@/store/useCampaignStore";
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

export default function ExplorePage() {
  const { campaigns, isLoading, fetchAll } = useCampaignStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Fetch only once (cached in Zustand)
  useEffect(() => {
    fetchAll(12);
  }, []);

  console.log("All campaigns:", campaigns);

  const categories = [
    "all",
    ...campaigns
      .map((c) => c.category)
      .filter((cat, idx, arr) => cat && arr.indexOf(cat) === idx),
  ];

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || campaign.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" ||
      (typeof campaign.state === "string"
        ? campaign.state.toLowerCase() === selectedStatus
        : false);
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
        <div className="mb-8 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-gray-800 bg-gray-950 pl-10 text-white placeholder:text-gray-500 focus:border-green-500"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="flex-1 border-gray-800 bg-gray-950 text-white focus:border-green-500">
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
            <SelectTrigger className="flex-1 border-gray-800 bg-gray-950 text-white focus:border-green-500">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-gray-800 bg-gray-950 text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading ? (
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
}
