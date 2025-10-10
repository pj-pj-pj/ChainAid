"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Expense } from "@/types";
import {
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { JSX } from "react";

interface ExpenseCardProps {
  expense: Expense;
  userRole?: "Admin" | "Member" | "Donor" | "Viewer";
  onApprove?: (expenseId: string) => void;
}

export default function ExpenseCard({
  expense,
  userRole,
  onApprove,
}: ExpenseCardProps): JSX.Element {
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  interface Approval {
    approved: boolean;
  }

  const currentApprovals: number = expense.approvals.filter(
    (a: Approval) => a.approved
  ).length;

  const getStatusConfig = (
    status: string
  ): { icon: JSX.Element; className: string; label: string } => {
    switch (status) {
      case "Approved":
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          className: "bg-green-900/30 text-green-400 border-green-500/50",
          label: "Approved",
        };
      case "Pending":
        return {
          icon: <Clock className="w-4 h-4" />,
          className: "bg-yellow-900/30 text-yellow-400 border-yellow-500/50",
          label: "Pending Approval",
        };
      case "Rejected":
        return {
          icon: <XCircle className="w-4 h-4" />,
          className: "bg-red-900/30 text-red-400 border-red-500/50",
          label: "Rejected",
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          className: "bg-gray-900/30 text-gray-400 border-gray-500/50",
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(expense.status);
  const canApprove =
    userRole === "Admin" &&
    expense.status === "Pending" &&
    currentApprovals < expense.requiredApprovals;

  return (
    <Card className="bg-gray-950/50 border-green-900/30 hover:border-green-500/50 transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold text-green-50 mb-2">
              {expense.purpose}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={statusConfig.className}>
                {statusConfig.icon}
                <span className="ml-1">{statusConfig.label}</span>
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-950/20 text-green-400 border-green-500/30"
              >
                {expense.category}
              </Badge>
              {expense.status === "Pending" && (
                <Badge
                  variant="outline"
                  className="bg-yellow-950/20 text-yellow-400 border-yellow-500/30"
                >
                  {currentApprovals} / {expense.requiredApprovals} approvals
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 bg-green-900/30 px-3 py-1 rounded-lg border border-green-500/30">
            <span className="text-xl font-bold text-green-400">
              ${expense.amount.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="text-sm text-gray-400">
          <p>
            <span className="text-gray-500">Submitted by:</span>{" "}
            <span className="text-green-400 font-mono">
              {expense.submittedBy.slice(0, 6)}...
              {expense.submittedBy.slice(-4)}
            </span>
          </p>
          <p>
            <span className="text-gray-500">Date:</span>{" "}
            <span className="text-gray-300">
              {formatDate(expense.submittedAt)}
            </span>
          </p>
        </div>

        {expense.receiptUrl && (
          <Link
            href={expense.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors group"
          >
            <FileText className="w-4 h-4" />
            <span>View Receipt (IPFS)</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}

        {expense.txHash && (
          <Link
            href={`https://basescan.org/tx/${expense.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors group"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="font-mono">
              {expense.txHash.slice(0, 8)}...{expense.txHash.slice(-6)}
            </span>
          </Link>
        )}

        {canApprove && onApprove && (
          <Button
            onClick={(): void => onApprove(expense.id)}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Approve Expense
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
