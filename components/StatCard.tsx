"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { JSX } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  description?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
}: StatCardProps): JSX.Element {
  return (
    <Card className="bg-gray-950/50 border-green-900/30 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <h3 className="text-3xl font-bold text-green-400 mt-2">{value}</h3>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
            {trend && (
              <p className="text-xs text-green-500 mt-2 font-medium">{trend}</p>
            )}
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg flex items-center justify-center border border-green-500/30">
            <Icon className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
