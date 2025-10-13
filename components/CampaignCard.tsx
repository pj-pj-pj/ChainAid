"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Campaign } from "@/types";
import {
  Calendar,
  Target,
  Users,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { JSX } from "react";

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({
  campaign,
}: CampaignCardProps): JSX.Element {
  // const progress = (campaign.currentAmount / campaign.goalAmount) * 100;
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(campaign.deadline || Date.now()).getTime() - Date.now()) /
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
    <Link href={`/campaign/${campaign.id}`}>
      <Card className="group hover:border-green-500/50 transition-all duration-300 bg-gray-950/50 border-green-900/30 hover:shadow-lg hover:shadow-green-500/10 overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-gray-900 via-green-950/30 to-gray-900 overflow-hidden">
          {/* {campaign.imageUrl ? (
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <TrendingUp className="w-16 h-16 text-green-500/30" />
            </div>
          )} */}
          {
            
          }
        </div>

        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-lg font-bold text-green-50 group-hover:text-green-400 transition-colors line-clamp-2">
              {campaign.title}
            </CardTitle>
            {/* {campaign.verified && (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            )} */}
          </div>
          <div className="flex flex-wrap gap-2">
            {/* <Badge className={getStatusColor(campaign.status)}>
              {campaign.status}
            </Badge> */}
            <Badge
              variant="outline"
              className="bg-green-950/20 text-green-400 border-green-500/30"
            >
              {campaign.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-400 line-clamp-2">
            {campaign.description}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Raised</span>
              <span className="font-semibold text-green-400">
                {/* ${campaign.currentAmount.toLocaleString()} / $
                {campaign.goalAmount.toLocaleString()} */}
              </span>
            </div>
            {/* <Progress
              value={progress}
              className="h-2 bg-gray-800"
            >
              <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all" />
            </Progress> */}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-green-900/30">
            <div className="flex flex-col items-center">
              <Users className="w-4 h-4 text-green-500 mb-1" />
              <span className="text-xs text-gray-500">Donors</span>
              <span className="text-sm font-semibold text-green-400">
                {/* {campaign.supporterCount} */}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Target className="w-4 h-4 text-green-500 mb-1" />
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-sm font-semibold text-green-400">
                {/* {Math.round(progress)}% */}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="w-4 h-4 text-green-500 mb-1" />
              <span className="text-xs text-gray-500">Days Left</span>
              <span className="text-sm font-semibold text-green-400">
                {daysLeft}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
