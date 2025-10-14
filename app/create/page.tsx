"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { parseEther } from "viem";
import { toast } from "sonner";
import { Upload, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CONTRACT_ADDRESS } from "@/lib/contracts";
import ChainAidABI from "@/abi/ChainAid.json";

import { CATEGORIES, CATEGORY_TYPE } from "@/utils/CONSTANTS";
import { SelectItemIndicator } from "@radix-ui/react-select";

const contractAddress = CONTRACT_ADDRESS as `0x${string}`;

// Form validation schema
const formSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  organization: z.string().min(3, "Organization name is required"),
  category: z.string().min(1, "Category is required"),
  goal: z.string().min(1, "Goal amount is required"),
  duration: z.string().min(1, "Duration is required"),
});

export default function CreateCampaignPage() {
  const { writeContractAsync } = useWriteContract();
  const { address, isConnected } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      organization: "",
      category: "",
      goal: "",
      duration: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare campaign metadata
      const goalAmount = Number(values.goal) || 0;
      const durationDays = Number(values.duration) || 0;
      const now = new Date();
      const deadlineISO = new Date(
        now.getTime() +
          (durationDays > 0 ? durationDays : 30) * 24 * 60 * 60 * 1000
      ).toISOString();

      const metadata = {
        id: `campaign-${Date.now()}`,
        title: values.title,
        description: values.description,
        category: values.category,
        goalAmount,
        currentAmount: 0,
        createdAt: now.toISOString(),
        deadline: deadlineISO,
        status: "Pending",
        organizationName: values.organization,
        imageUrl: `/category/${values.category
          .replace(/ /g, "-")
          .toLocaleLowerCase()}.jpg`,
        verified: false,
        supporterCount: 0,
        supporterThreshold: 50,
        creatorAddress: address || "",
        creatorOrganization: values.organization,
        totalExpenses: 0,
        donors: 0,
      };

      // Upload to IPFS
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
      toast.success("Campaign metadata uploaded to IPFS!");

      // Create campaign on-chain
      toast.info("Sending transaction to Base Network...");
      const deadlineTimestamp = Math.floor(
        new Date(deadlineISO).getTime() / 1000
      );
      const goalAmountInWei = parseEther(values.goal);

      const tx = await writeContractAsync({
        address: contractAddress,
        abi: (ChainAidABI as any).abi,
        functionName: "createCampaign",
        args: [
          values.title,
          values.organization,
          values.description,
          goalAmountInWei,
          BigInt(deadlineTimestamp),
          values.category,
          jsoncid,
        ],
        value: parseEther("0.0001"),
      });

      toast.success(`Campaign created successfully! Tx: ${tx}`);
      console.log("✅ Campaign created. Transaction:", jsoncid, tx);
      form.reset();
    } catch (error: any) {
      console.error("❌ Error creating campaign:", error);
      toast.error(error.message || "Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Create Campaign</h1>
          <p className="mt-2 text-gray-400">
            Launch your verified charity campaign on Base Network
          </p>
        </div>

        {!isConnected && (
          <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-500">
              Please connect your wallet to create a campaign
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-6 border-green-500/50 bg-green-500/10 p-4">
          <p className="text-sm text-green-400">
            <strong>Campaign Creation Fee:</strong> 0.0001 ETH
          </p>
          <p className="mt-1 text-xs text-green-300">
            This fee helps maintain platform integrity and prevents spam
          </p>
        </Card>

        <Card className="border-gray-800 bg-gray-900 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Campaign Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-500 focus:border-green-500"
                        placeholder="Enter campaign title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Organization Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-500 focus:border-green-500"
                        placeholder="Your organization name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-500 focus:border-green-500"
                        placeholder="Describe your campaign and its impact..."
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-800 bg-gray-950 text-white focus:border-green-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-gray-800 bg-gray-950 text-white">
                        {
                          CATEGORIES.map((cat) => (
                            <SelectItem
                              key={cat.value}
                              value={cat.value as CATEGORY_TYPE}
                              className="text-white hover:bg-gray-800"
                            >
                              {cat.name}
                            </SelectItem>
                          )) /* Use the imported CATEGORIES array */
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Funding Goal (ETH)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.001"
                          className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-500 focus:border-green-500"
                          placeholder="0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Duration (days)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-500 focus:border-green-500"
                          placeholder="30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
          </Form>
        </Card>
      </div>
    </div>
  );
}
