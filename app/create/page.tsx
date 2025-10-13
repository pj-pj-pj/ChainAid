"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS } from "@/lib/contracts";
import { parseEther } from "viem";

import ChainAidABI from "@/abi/ChainAid.json";
const contractAddress = CONTRACT_ADDRESS as `0x${string}`;

export default function CreateCampaignPage() {
  const { writeContractAsync } = useWriteContract();

  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    organization: "",
    category: "",
    goal: "",
    duration: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Healthcare",
    "Education",
    "Environment",
    "Water & Sanitation",
    "Emergency Relief",
    "Community Development",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);

    try {
      // ---------------------------------------
      // 1️⃣ Prepare campaign metadata (IPFS)
      // ---------------------------------------
      const goalAmount = Number(formData.goal) || 0;
      const durationDays = Number(formData.duration) || 0;

      const now = new Date();
      const deadlineISO =
        durationDays > 0
          ? new Date(
              now.getTime() + durationDays * 24 * 60 * 60 * 1000
            ).toISOString()
          : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const metadata = {
        id: `campaign-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        goalAmount,
        currentAmount: 0,
        createdAt: now.toISOString(),
        deadline: deadlineISO,
        status: "Pending",
        organizationName: formData.organization,
        imageUrl: formData.image || undefined,
        verified: false,
        supporterCount: 0,
        supporterThreshold: 50,
        creatorAddress: address || "",
        creatorOrganization: formData.organization || undefined,
        totalExpenses: 0,
        donors: 0,
      };

      // ---------------------------------------
      // 2️⃣ Upload metadata to IPFS (via Pinata)
      // ---------------------------------------
      toast.info("Uploading campaign metadata to IPFS...");

      const uploadRes = await fetch("/api/pinata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok)
        throw new Error(uploadData.error || "Failed to upload metadata");

      const jsoncid = uploadData.cid;

      console.log("✅ Metadata uploaded to IPFS:", jsoncid);
      toast.success("Campaign metadata uploaded to IPFS!");

      // ---------------------------------------
      // 3️⃣ Store essential data on-chain
      // ---------------------------------------
      const goalAmountInWei = parseEther(formData.goal);

      toast.info("Sending transaction to Base Network...");

      // ni recommed lang ni gpt this
      const deadlineTimestamp = Math.floor(
        new Date(deadlineISO).getTime() / 1000
      ); // convert deadline to UNIX timestamp (seconds)

      const tx = await writeContractAsync({
        address: contractAddress,
        abi: (ChainAidABI as any).abi,
        functionName: "createCampaign",
        args: [
          formData.title,              // 1. title
          formData.description,        // 2. description
          formData.organization,       // new  field: organization
          goalAmountInWei,             // 3. goal amount in wei
          BigInt(deadlineTimestamp),   // 4. deadline as uint256
          formData.category,           // 5. category
          jsoncid                      // 6. ipfsHash (CID string)
        ],
        value: parseEther("0.0001"),   // ✅ creation fee
      });


      console.log("✅ Transaction sent:", tx);
      toast.success(`Campaign created successfully! Tx: ${tx}`);

      // ---------------------------------------
      // 4️⃣ Reset form
      // ---------------------------------------
      setFormData({
        title: "",
        description: "",
        organization: "",
        category: "",
        goal: "",
        duration: "",
        image: "",
      });
    } catch (error: any) {
      console.error("❌ handleSubmit error:", error);
      toast.error(error.message || "Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Create Campaign</h1>
          <p className="mt-2 text-gray-400">
            Launch your verified charity campaign on Base Network
          </p>
        </div>

        {/* Connection Alert */}
        {!isConnected && (
          <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-500">
              Please connect your wallet to create a campaign
            </AlertDescription>
          </Alert>
        )}

        {/* Creation Fee Notice */}
        <Card className="mb-6 border-green-500/50 bg-green-500/10 p-4">
          <p className="text-sm text-green-400">
            <strong>Campaign Creation Fee:</strong> 0.0001 ETH
          </p>
          <p className="mt-1 text-xs text-green-300">
            This fee helps maintain platform integrity and prevents spam
          </p>
        </Card>

        {/* Form */}
        <Card className="border-gray-800 bg-gray-900 p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Campaign Title */}
            <div>
              <Label
                htmlFor="title"
                className="text-white"
              >
                Campaign Title *
              </Label>
              <Input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter campaign title"
                className="mt-2 border-gray-800 bg-gray-950 text-white placeholder:text-gray-500 focus:border-green-500"
              />
            </div>

            {/* Organization */}
            <div>
              <Label
                htmlFor="organization"
                className="text-white"
              >
                Organization Name *
              </Label>
              <Input
                id="organization"
                type="text"
                required
                value={formData.organization}
                onChange={(e) => handleChange("organization", e.target.value)}
                placeholder="Your organization name"
                className="mt-2 border-gray-800 bg-gray-950 text-white placeholder:text-gray-500 focus:border-green-500"
              />
            </div>

            {/* Description */}
            <div>
              <Label
                htmlFor="description"
                className="text-white"
              >
                Description *
              </Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe your campaign and its impact..."
                rows={5}
                className="mt-2 border-gray-800 bg-gray-950 text-white placeholder:text-gray-500 focus:border-green-500"
              />
            </div>

            {/* Category */}
            <div>
              <Label
                htmlFor="category"
                className="text-white"
              >
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger className="mt-2 border-gray-800 bg-gray-950 text-white focus:border-green-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-gray-800 bg-gray-950 text-white">
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-white hover:bg-gray-800"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Goal and Duration */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="goal"
                  className="text-white"
                >
                  Funding Goal (ETH) *
                </Label>
                <Input
                  id="goal"
                  type="number"
                  step="0.001"
                  required
                  value={formData.goal}
                  onChange={(e) => handleChange("goal", e.target.value)}
                  placeholder="0.00"
                  className="mt-2 border-gray-800 bg-gray-950 text-white placeholder:text-gray-500 focus:border-green-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="duration"
                  className="text-white"
                >
                  Duration (days) *
                </Label>
                <Input
                  id="duration"
                  type="number"
                  required
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  placeholder="30"
                  className="mt-2 border-gray-800 bg-gray-950 text-white placeholder:text-gray-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <Label
                htmlFor="image"
                className="text-white"
              >
                Campaign Image URL
              </Label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleChange("image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-500 focus:border-green-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-800 bg-gray-950 text-white hover:bg-gray-800"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isConnected || isSubmitting}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {isSubmitting
                ? "Creating Campaign..."
                : "Create Campaign (0.0001 ETH)"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
