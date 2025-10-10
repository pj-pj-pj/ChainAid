"use client";

import { useState, JSX } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { mockCampaigns } from "@/utils/mockData";
import {
  ArrowLeft,
  DollarSign,
  CheckCircle2,
  ExternalLink,
  Shield,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function DonatePage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const campaign = mockCampaigns.find((c) => c.id === campaignId);

  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [mintNFT, setMintNFT] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400 mb-4">
            Campaign not found
          </h2>
          <Link href="/explore">
            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold">
              Back to Explore
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDonate = async (): Promise<void> => {
    setIsProcessing(true);

    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock transaction hash
    const mockTxHash = "0x" + Math.random().toString(16).substring(2, 66);
    setTxHash(mockTxHash);
    setIsProcessing(false);
  };

  if (txHash) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-green-950/50 to-gray-950/50 border-green-500/50 shadow-xl shadow-green-500/10">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
                <CheckCircle2 className="w-12 h-12 text-black" />
              </div>

              <h2 className="text-3xl font-bold text-green-50 mb-4">
                Donation Successful!
              </h2>
              <p className="text-gray-400 mb-8">
                Thank you for your generous contribution to {campaign.title}
              </p>

              <div className="bg-gray-900/50 p-6 rounded-lg border border-green-900/30 mb-8">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount</span>
                    <span className="font-semibold text-green-400">
                      ${amount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Transaction</span>
                    <Link
                      href={`https://basescan.org/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors group"
                    >
                      <span className="font-mono text-sm">
                        {txHash.slice(0, 8)}...{txHash.slice(-6)}
                      </span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  {mintNFT && (
                    <div className="pt-3 border-t border-green-900/30">
                      <div className="flex items-center gap-2 text-green-400">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm">NFT receipt minted!</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/campaign/${campaign.id}`}>
                  <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold">
                    View Campaign
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    variant="outline"
                    className="border-green-500/50 text-green-400 hover:bg-green-900/20"
                  >
                    Explore More Campaigns
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href={`/campaign/${campaign.id}`}>
          <Button
            variant="ghost"
            className="mb-6 text-green-400 hover:text-green-300 hover:bg-green-900/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaign
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-950/50 border-green-900/30">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-6 h-6 text-green-400" />
                  <CardTitle className="text-2xl text-green-50">
                    Make a Donation
                  </CardTitle>
                </div>
                <p className="text-gray-400">
                  Support this campaign on Base blockchain
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Preset Amounts */}
                <div className="space-y-2">
                  <Label className="text-green-50">Select Amount</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {presetAmounts.map((preset) => (
                      <Button
                        key={preset}
                        onClick={(): void => setAmount(preset.toString())}
                        variant="outline"
                        className={`${
                          amount === preset.toString()
                            ? "bg-green-900/30 text-green-400 border-green-500/50"
                            : "bg-gray-900/30 text-gray-400 border-gray-700 hover:border-green-500/50 hover:text-green-400"
                        }`}
                      >
                        ${preset}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <Label
                    htmlFor="amount"
                    className="text-green-50"
                  >
                    Or Enter Custom Amount (USD)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                      setAmount(e.target.value)
                    }
                    placeholder="100"
                    min="1"
                    className="bg-gray-900/50 border-green-900/30 text-green-50 placeholder:text-gray-500 focus:border-green-500"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-green-50"
                  >
                    Message (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(
                      e: React.ChangeEvent<HTMLTextAreaElement>
                    ): void => setMessage(e.target.value)}
                    placeholder="Leave an encouraging message..."
                    rows={3}
                    className="bg-gray-900/50 border-green-900/30 text-green-50 placeholder:text-gray-500 focus:border-green-500"
                  />
                </div>

                {/* NFT Receipt */}
                <div className="flex items-start space-x-3 bg-green-950/20 p-4 rounded-lg border border-green-900/30">
                  <Checkbox
                    id="nft"
                    checked={mintNFT}
                    onCheckedChange={(checked: boolean): void =>
                      setMintNFT(checked)
                    }
                    className="border-green-500/50 data-[state=checked]:bg-green-500 data-[state=checked]:text-black"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="nft"
                      className="text-green-50 font-medium cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-green-400" />
                      Mint NFT Receipt
                    </Label>
                    <p className="text-sm text-gray-400 mt-1">
                      Get an on-chain proof of your donation as an NFT
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleDonate}
                  disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold text-lg py-6 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Transaction...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-5 w-5" />
                      Donate ${amount || "0"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Summary */}
          <div className="space-y-6">
            <Card className="bg-gray-950/50 border-green-900/30">
              <CardHeader>
                <CardTitle className="text-lg text-green-50">
                  {campaign.title}
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-green-900/30 text-green-400 border-green-500/50">
                    {campaign.status}
                  </Badge>
                  {campaign.verified && (
                    <Badge className="bg-blue-900/30 text-blue-400 border-blue-500/50">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Raised</span>
                    <span className="font-semibold text-green-400">
                      ${campaign.currentAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Goal</span>
                    <span className="font-semibold text-gray-300">
                      ${campaign.goalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Donors</span>
                    <span className="font-semibold text-gray-300">
                      {campaign.supporterCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-950/20 border-green-900/30">
              <CardContent className="p-6">
                <Shield className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="font-semibold text-green-50 mb-2">
                  Secure & Transparent
                </h3>
                <p className="text-sm text-gray-400">
                  All donations are processed on-chain via Base, ensuring
                  complete transparency and security.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
