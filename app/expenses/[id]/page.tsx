"use client";

import { JSX, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockCampaigns } from "@/utils/mockData";
// import { uploadToIPFS } from "@/utils/ipfs";
import {
  ArrowLeft,
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function ExpensePage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const campaign = mockCampaigns.find((c) => c.id === campaignId);

  const [formData, setFormData] = useState({
    amount: "",
    purpose: "",
    category: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const categories = [
    "Operations",
    "Equipment",
    "Staff",
    "Materials",
    "Transportation",
    "Marketing",
    "Other",
  ];

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload receipt to IPFS
      let receiptUrl = "";
      if (file) {
        setUploadProgress(20);
        // const uploadResult = await uploadToIPFS(file);
        // receiptUrl = uploadResult.url;
        setUploadProgress(60);
      }

      // Simulate expense submission
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUploadProgress(100);

      // Redirect back to campaign
      setTimeout(() => {
        router.push(`/campaign/${campaignId}`);
      }, 1000);
    } catch (error) {
      console.error("Error submitting expense:", error);
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const isFormValid = (): boolean => {
    return (
      formData.amount.trim() !== "" &&
      formData.purpose.trim() !== "" &&
      formData.category !== "" &&
      file !== null
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
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

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-900/30 px-4 py-2 rounded-full border border-green-500/50 mb-4">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">
              On-Chain Tracking
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-4">
            Log Expense
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Record campaign expenses with receipts stored on IPFS for public
            verification
          </p>
        </div>

        <Card className="bg-gray-950/50 border-green-900/30">
          <CardHeader>
            <CardTitle className="text-2xl text-green-50">
              Expense Details
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Requires 2 admin approvals before execution
            </p>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Campaign Info */}
              <div className="bg-green-950/20 p-4 rounded-lg border border-green-900/30">
                <p className="text-sm text-gray-400 mb-1">Campaign</p>
                <p className="font-semibold text-green-50">{campaign.title}</p>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label
                  htmlFor="amount"
                  className="text-green-50"
                >
                  Amount (USD) *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="1000"
                  required
                  min="1"
                  className="bg-gray-900/50 border-green-900/30 text-green-50 placeholder:text-gray-500 focus:border-green-500"
                />
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <Label
                  htmlFor="purpose"
                  className="text-green-50"
                >
                  Purpose *
                </Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  placeholder="Describe what this expense is for..."
                  required
                  rows={4}
                  className="bg-gray-900/50 border-green-900/30 text-green-50 placeholder:text-gray-500 focus:border-green-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-green-50"
                >
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: string): void =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="bg-gray-900/50 border-green-900/30 text-green-50 focus:border-green-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-950 border-green-900/30">
                    {categories.map((category: string) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="text-green-50 focus:bg-green-900/20 focus:text-green-400"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Receipt Upload */}
              <div className="space-y-2">
                <Label
                  htmlFor="file"
                  className="text-green-50"
                >
                  Receipt / Proof *
                </Label>
                <p className="text-sm text-gray-500">
                  Upload receipt (stored on IPFS)
                </p>
                <div className="border-2 border-dashed border-green-900/30 rounded-lg p-8 text-center hover:border-green-500/50 transition-all bg-gray-900/30">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf"
                  />
                  <label
                    htmlFor="file"
                    className="cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-green-50 font-medium mb-1">
                      {file ? file.name : "Click to upload receipt"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Images or PDFs up to 10MB
                    </p>
                  </label>
                </div>
              </div>

              {/* Upload Progress */}
              {isSubmitting && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Submitting expense...</span>
                    <span className="text-green-400">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-900/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 border-t border-green-900/30">
                <Button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting Expense...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-5 w-5" />
                      Submit for Approval
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card className="bg-green-950/20 border-green-900/30">
            <CardContent className="p-6">
              <CheckCircle2 className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-semibold text-green-50 mb-2">
                Multisig Approval
              </h3>
              <p className="text-sm text-gray-400">
                Expenses require multiple admin approvals before funds are
                released
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-950/20 border-green-900/30">
            <CardContent className="p-6">
              <AlertCircle className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-semibold text-green-50 mb-2">
                Public Verification
              </h3>
              <p className="text-sm text-gray-400">
                All receipts are stored on IPFS and publicly accessible for
                transparency
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
