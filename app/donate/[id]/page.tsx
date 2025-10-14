"use client";

import { useState, useEffect, JSX } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Campaign } from "@/types";
import type { Donation } from "@/types";
import { useAccount } from "wagmi";
import { useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS } from "@/lib/contracts";
import ChainAidABI from "@/abi/ChainAid.json";
import { parseEther } from "viem";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import { fetchCampaigns } from "@/lib/helper/fetchCampaigns";
import {
  ArrowLeft,
  DollarSign,
  CheckCircle2,
  ExternalLink,
  Shield,
  Info,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function DonatePage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const campaignId = Number(params.id);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoadingCampaign(true);
      try {
        const fetched = await fetchCampaigns(campaignId);
        if (!mounted) return;
        setCampaign(fetched);
      } catch (err) {
        console.error("Failed to fetch campaign", err);
        if (mounted) setCampaign(null);
      } finally {
        if (mounted) setIsLoadingCampaign(false);
      }
    }

    if (!Number.isNaN(campaignId)) {
      load();
    } else {
      setIsLoadingCampaign(false);
      setCampaign(null);
    }

    return () => {
      mounted = false;
    };
  }, [campaignId]);

  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [ethPriceUsd, setEthPriceUsd] = useState<number | null>(null);
  const [mintNFT, setMintNFT] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const addDonation = useAppStore((s) => s.addDonation);

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  useEffect(() => {
    let mounted = true;
    async function fetchPrice() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const json = await res.json();
        if (!mounted) return;
        setEthPriceUsd(json?.ethereum?.usd ?? null);
      } catch (err) {
        console.error("Failed to fetch ETH price", err);
        if (mounted) setEthPriceUsd(null);
      }
    }

    fetchPrice();
    return () => {
      mounted = false;
    };
  }, []);

  function usdToEth(usdString: string | number): string {
    const usd =
      typeof usdString === "number" ? usdString : parseFloat(String(usdString));
    if (!ethPriceUsd || !isFinite(usd) || usd <= 0) return "0";
    const eth = usd / ethPriceUsd;
    return eth.toFixed(4);
  }

  if (isLoadingCampaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-green-400" />
          <p className="text-gray-400">Loading campaign…</p>
        </div>
      </div>
    );
  }

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
    if (!isConnected || !address) {
      toast.error("Please connect your wallet to donate");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    setIsProcessing(true);

    try {
      // Build donation metadata to pin to IPFS (pre-tx)
      const donationMetaPreTx = {
        campaignId: String(campaign.id),
        campaignTitle: campaign.title,
        donorAddress: address || "",
        amount: Number(Number(amount)),
        message: message || undefined,
        timestamp: new Date().toISOString(),
        nftMinted: mintNFT || undefined,
      } as const;

      toast.info("Uploading donation metadata to IPFS...");

      // Pin metadata and require CID to include on-chain
      const pinRes = await fetch("/api/pinata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donationMetaPreTx),
      });
      const pinJson = await pinRes.json();
      if (!pinRes.ok || !pinJson?.cid) {
        console.error("Failed to pin donation metadata", pinJson);
        toast.error(
          "Failed to pin donation metadata to IPFS. Donation aborted."
        );
        setIsProcessing(false);
        return;
      }

      const receiptCid = pinJson.cid as string;
      toast.success("Donation metadata pinned to IPFS");

      toast.info("Sending donation transaction...");

      // compute ETH amount from USD
      const ethAmount = usdToEth(amount || 0); // string

      const contractAddress = CONTRACT_ADDRESS as `0x${string}`;

      // Call donate with campaignId and jsonCid
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: (ChainAidABI as any).abi,
        functionName: "donate",
        args: [BigInt(campaign.id), receiptCid],
        value: parseEther(ethAmount),
      });

      console.log("Donation tx sent:", tx);
      toast.success("Donation transaction sent");

      // record tx hash and update UI
      const txHashStr = String(tx);
      setTxHash(txHashStr);

      // Build Donation object (types/index.ts) and include receiptCid
      const donation: Donation = {
        id: `donation-${Date.now()}`,
        campaignId: String(campaign.id),
        donorAddress: address || "",
        amount: Number(Number(amount)), // USD amount stored as number
        message: message || undefined,
        timestamp: new Date().toISOString(),
        txHash: txHashStr,
        nftMinted: mintNFT || undefined,
        ensName: undefined,
        campaignTitle: campaign.title,
        receiptCid,
      };

      try {
        addDonation(donation);
      } catch (err) {
        console.warn("Failed to add donation to store", err);
      }

      // update local campaign totals optimistically
      setCampaign((prev) => {
        if (!prev) return prev;
        const updated: Campaign = {
          ...prev,
          totalDonations: (prev.totalDonations || 0) + Number(donation.amount),
        };
        return updated;
      });
    } catch (error: any) {
      console.error("Donation failed", error);
      toast.error(error?.message || "Donation failed");
    } finally {
      setIsProcessing(false);
    }
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
                      {usdToEth(amount || 0)} ETH {`($${amount})`}
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
                  {/* {mintNFT && (
                    <div className="pt-3 border-t border-green-900/30">
                      <div className="flex items-center gap-2 text-green-400">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm">NFT receipt minted!</span>
                      </div>
                    </div>
                  )} */}
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
                  <p className="text-sm text-gray-400 mt-1">
                    {ethPriceUsd ? (
                      <>
                        ≈ {usdToEth(amount || 0)} ETH{" "}
                        {amount ? `($${amount})` : ""}
                      </>
                    ) : (
                      <span>ETH price unavailable</span>
                    )}
                  </p>
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
                      Donate {`$${amount || "0"}`}{" "}
                      {`(${usdToEth(amount || 0)} ETH)`}
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
                    {campaign.status}campaign.status
                  </Badge>
                  {/* {campaign.verified && (
                    <Badge className="bg-blue-900/30 text-blue-400 border-blue-500/50">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )} */}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Raised</span>
                    <span className="font-semibold text-green-400">
                      {/* ${campaign.currentAmount.toLocaleString()} */}
                      insert data
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Goal</span>
                    <span className="font-semibold text-gray-300">
                      {/* ${campaign.goalAmount.toLocaleString()} */}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Donors</span>
                    <span className="font-semibold text-gray-300">
                      {/* {campaign.supporterCount} */}insert data
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-950/20 border-green-900/30">
              <CardContent className="p-5 py-1">
                <Shield className="w-8 h-5 text-green-400 mb-3" />
                <h3 className="font-semibold text-green-50 mb-2">
                  Secure & Transparent
                </h3>
                <p className="text-sm text-gray-400">
                  All donations are processed on-chain via Base, ensuring
                  complete transparency and security.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-950/20 border-yellow-900/30">
              <CardContent className="p-5 py-1">
                <Info className="w-8 h-5 text-yellow-400 mb-3" />
                <h3 className="font-semibold text-green-50 mb-2">Disclaimer</h3>
                <p className="text-sm text-gray-400">
                  Donation amounts entered in USD are converted to their ETH
                  equivalent at the current market rate, and conversion rates
                  may fluctuate at the time of transaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
