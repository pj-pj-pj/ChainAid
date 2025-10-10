"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JSX } from "react";

interface SupportProgressBarProps {
  currentSupporters: number;
  requiredSupporters: number;
  currentPledged: number;
  requiredPledged: number;
  status: string;
  deadline: string;
}

export default function SupportProgressBar({
  currentSupporters,
  requiredSupporters,
  currentPledged,
  requiredPledged,
  status,
  deadline,
}: SupportProgressBarProps): JSX.Element {
  const supporterProgress = (currentSupporters / requiredSupporters) * 100;
  const pledgeProgress = (currentPledged / requiredPledged) * 100;
  const isActivated = status === "Active";
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <Card className="bg-gradient-to-br from-gray-950/80 to-green-950/20 border-green-900/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-green-50">
            Community Support
          </CardTitle>
          {isActivated ? (
            <Badge className="bg-green-900/30 text-green-400 border-green-500/50">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Activated
            </Badge>
          ) : (
            <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-500/50">
              <Clock className="w-3 h-3 mr-1" />
              {daysLeft} days left
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Supporters Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Supporters</span>
            </div>
            <span className="font-semibold text-green-400">
              {currentSupporters} / {requiredSupporters}
            </span>
          </div>
          <Progress
            value={supporterProgress}
            className="h-2 bg-gray-800"
          >
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
              style={{ width: `${Math.min(supporterProgress, 100)}%` }}
            />
          </Progress>
          <p className="text-xs text-gray-500">
            {requiredSupporters - currentSupporters > 0
              ? `${
                  requiredSupporters - currentSupporters
                } more supporters needed`
              : "Supporter goal reached!"}
          </p>
        </div>

        {/* Pledge Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Pledged Support</span>
            </div>
            <span className="font-semibold text-green-400">
              ${currentPledged.toLocaleString()} / $
              {requiredPledged.toLocaleString()}
            </span>
          </div>
          <Progress
            value={pledgeProgress}
            className="h-2 bg-gray-800"
          >
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
              style={{ width: `${Math.min(pledgeProgress, 100)}%` }}
            />
          </Progress>
          <p className="text-xs text-gray-500">
            {requiredPledged - currentPledged > 0
              ? `$${(
                  requiredPledged - currentPledged
                ).toLocaleString()} more needed`
              : "Pledge goal reached!"}
          </p>
        </div>

        {/* Activation Status */}
        {!isActivated && (
          <div className="pt-2 border-t border-green-900/30">
            <p className="text-sm text-gray-400">
              Campaign will activate when{" "}
              <span className="text-green-400 font-semibold">either</span>{" "}
              supporter or pledge goal is reached.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
