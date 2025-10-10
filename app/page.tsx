"use client";

import { useEffect, JSX } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  TrendingUp,
  Users,
  FileText,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
} from "lucide-react";
import TransparencyStats from "@/components/TransparencyStats";
import { sdk } from "@farcaster/miniapp-sdk";

export default function HomePage(): JSX.Element {
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
  const features = [
    {
      icon: Shield,
      title: "On-Chain Transparency",
      description:
        "Every donation and expense is recorded on Base blockchain, ensuring complete transparency and accountability.",
    },
    {
      icon: Users,
      title: "Community Governance",
      description:
        "Campaigns must gather community support before activation, preventing fake or malicious campaigns.",
    },
    {
      icon: FileText,
      title: "Expense Tracking",
      description:
        "Multisig approval system for expenses with IPFS-stored receipts for public verification.",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Updates",
      description:
        "Track campaign progress, donations, and expenses in real-time with instant on-chain confirmation.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Campaign",
      description:
        "NGOs submit campaign details with goals and supporting documents.",
    },
    {
      number: "02",
      title: "Gather Support",
      description: "Community members support campaigns to activate them.",
    },
    {
      number: "03",
      title: "Receive Donations",
      description:
        "Donors contribute directly via wallet with on-chain receipts.",
    },
    {
      number: "04",
      title: "Track Spending",
      description: "Expenses are logged and approved with public verification.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-green-900/30 px-4 py-2 rounded-full border border-green-500/50 mb-4">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">
                Powered by Base
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
              <span className="block text-green-50 mb-2">Transparent</span>
              <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                On-Chain Giving
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-gray-400">
              Track NGO donations and expenses with complete transparency on
              Base blockchain. Every dollar, every transaction, verified
              on-chain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/explore">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold text-lg px-8 shadow-lg shadow-green-500/30"
                >
                  Explore Campaigns
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/create">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-500/50 text-green-400 hover:bg-green-900/20 text-lg px-8"
                >
                  Create Campaign
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-green-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-50 mb-4">
              Built for Trust
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              ChainLedger combines blockchain transparency with community
              governance to create the most trustworthy donation platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-950/50 border-green-900/30 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10 group"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg flex items-center justify-center mb-4 border border-green-500/30 group-hover:shadow-lg group-hover:shadow-green-500/30 transition-all">
                    <feature.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-50 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-50 mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From campaign creation to verified spending, every step is
              transparent and community-driven.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                    <span className="text-2xl font-bold text-black">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-green-50 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-green-500/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-green-950/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TransparencyStats />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-green-950/50 to-gray-950/50 border-green-500/50 shadow-xl shadow-green-500/10">
            <CardContent className="p-12 text-center">
              <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-green-50 mb-4">
                Ready to Make an Impact?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join the transparent giving revolution. Create your campaign or
                support verified NGOs making real change.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
                  >
                    <CheckCircle2 className="mr-2 w-5 h-5" />
                    Start a Campaign
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-green-500/50 text-green-400 hover:bg-green-900/20"
                  >
                    Browse Campaigns
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
