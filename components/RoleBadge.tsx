"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, FileText, DollarSign, Eye } from "lucide-react";

interface RoleBadgeProps {
  role: "Admin" | "Member" | "Donor" | "Viewer";
}

export default function RoleBadge({ role }: RoleBadgeProps): React.JSX.Element {
  const getRoleConfig = (
    role: string
  ): { icon: React.ReactElement; label: string; className: string } => {
    switch (role) {
      case "Admin":
        return {
          icon: <Crown className="w-3 h-3" />,
          label: "👑 Admin",
          className: "bg-green-900/30 text-green-400 border-green-500/50",
        };
      case "Member":
        return {
          icon: <FileText className="w-3 h-3" />,
          label: "🧾 Member",
          className: "bg-blue-900/30 text-blue-400 border-blue-500/50",
        };
      case "Donor":
        return {
          icon: <DollarSign className="w-3 h-3" />,
          label: "💰 Donor",
          className: "bg-yellow-900/30 text-yellow-400 border-yellow-500/50",
        };
      case "Viewer":
        return {
          icon: <Eye className="w-3 h-3" />,
          label: "👁️ Viewer",
          className: "bg-gray-900/30 text-gray-400 border-gray-500/50",
        };
      default:
        return {
          icon: <Eye className="w-3 h-3" />,
          label: role,
          className: "bg-gray-900/30 text-gray-400 border-gray-500/50",
        };
    }
  };

  const config = getRoleConfig(role);

  return (
    <Badge className={`flex items-center gap-1 ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}
