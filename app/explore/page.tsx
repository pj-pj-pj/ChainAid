"use client";

import { useState, useMemo, JSX } from "react";
import CampaignCard from "@/components/CampaignCard";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockCampaigns } from "@/utils/mockData";
import type { Campaign } from "@/types";
import { Filter, SlidersHorizontal } from "lucide-react";

export default function ExplorePage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const statuses = ["All", "Active", "Pending", "Completed"];
  const categories = [
    "All",
    "Education",
    "Healthcare",
    "Environment",
    "Disaster Relief",
    "Animal Welfare",
  ];

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((campaign: Campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || campaign.status === statusFilter;
      const matchesCategory =
        categoryFilter === "All" || campaign.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-4">
            Explore Campaigns
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover transparent, community-verified campaigns making real
            impact on Base
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search campaigns..."
          />

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-green-400">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {statuses.map((status: string) => (
                  <Badge
                    key={status}
                    onClick={(): void => setStatusFilter(status)}
                    className={`cursor-pointer transition-all ${
                      statusFilter === status
                        ? "bg-green-900/50 text-green-400 border-green-500"
                        : "bg-gray-900/50 text-gray-400 border-gray-700 hover:border-green-500/50"
                    }`}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category: string) => (
                <Button
                  key={category}
                  onClick={(): void => setCategoryFilter(category)}
                  variant="outline"
                  size="sm"
                  className={`${
                    categoryFilter === category
                      ? "bg-green-900/30 text-green-400 border-green-500/50"
                      : "bg-gray-900/30 text-gray-400 border-gray-700 hover:border-green-500/50 hover:text-green-400"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Found{" "}
            <span className="text-green-400 font-semibold">
              {filteredCampaigns.length}
            </span>{" "}
            campaigns
          </p>
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign: Campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-900/30">
              <Filter className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
