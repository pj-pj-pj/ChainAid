"use client";

import { useState, JSX } from "react";
import { useRouter } from "next/navigation";
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
import { uploadToIPFS } from "@/utils/ipfs";
import {
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function CreateCampaignPage(): JSX.Element {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    duration: "",
    category: "",
    image: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const categories = [
    "Education",
    "Healthcare",
    "Environment",
    "Disaster Relief",
    "Animal Welfare",
    "Community Development",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload file to IPFS if present
      let ipfsUrl = "";
      if (file) {
        setUploadProgress(10);
        const uploadResult = await uploadToIPFS(file);
        ipfsUrl = uploadResult.url;
        setUploadProgress(50);
      }

      // Simulate campaign creation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUploadProgress(100);

      // Redirect to campaign page
      setTimeout(() => {
        router.push("/explore");
      }, 1000);
    } catch (error) {
      console.error("Error creating campaign:", error);
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const isFormValid = (): boolean => {
    return (
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.goal.trim() !== "" &&
      formData.duration.trim() !== "" &&
      formData.category !== ""
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-900/30 px-4 py-2 rounded-full border border-green-500/50 mb-4">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">
              Create on Base
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-4">
            Create Campaign
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Launch a transparent, community-verified fundraising campaign on
            Base blockchain
          </p>
        </div>

        <Card className="bg-gray-950/50 border-green-900/30">
          <CardHeader>
            <CardTitle className="text-2xl text-green-50">
              Campaign Details
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Your campaign will be pending until it reaches 50 supporters or
              $2,500 in pledged support
            </p>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-green-50"
                >
                  Campaign Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Clean Water for Rural Communities"
                  required
                  className="bg-gray-900/50 border-green-900/30 text-green-50 placeholder:text-gray-500 focus:border-green-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-green-50"
                >
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your campaign goals, impact, and how funds will be used..."
                  required
                  rows={6}
                  className="bg-gray-900/50 border-green-900/30 text-green-50 placeholder:text-gray-500 focus:border-green-500"
                />
              </div>

              {/* Goal and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="goal"
                    className="text-green-50"
                  >
                    Funding Goal (USD) *
                  </Label>
                  <Input
                    id="goal"
                    type="number"
                    value={formData.goal}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                      setFormData({ ...formData, goal: e.target.value })
                    }
                    placeholder="50000"
                    required
                    min="1"
                    className="bg-gray-900/50 border-green-900/30 text-green-50 placeholder:text-gray-500 focus:border-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="duration"
                    className="text-green-50"
                  >
                    Duration (days) *
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="90"
                    required
                    min="1"
                    className="bg-gray-900/50 border-green-900/30 text-green-50 placeholder:text-gray-500 focus:border-green-500"
                  />
                </div>
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

              {/* File Upload */}
              <div className="space-y-2">
                <Label
                  htmlFor="file"
                  className="text-green-50"
                >
                  Supporting Documents (Optional)
                </Label>
                <p className="text-sm text-gray-500">
                  Upload images, PDFs, or other documents (stored on IPFS)
                </p>
                <div className="border-2 border-dashed border-green-900/30 rounded-lg p-8 text-center hover:border-green-500/50 transition-all bg-gray-900/30">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="file"
                    className="cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-green-50 font-medium mb-1">
                      {file ? file.name : "Click to upload"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Images, PDFs, or documents up to 10MB
                    </p>
                  </label>
                </div>
              </div>

              {/* Upload Progress */}
              {isSubmitting && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Creating campaign...</span>
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
                      Creating Campaign...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Create Campaign
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Small deposit required to prevent spam. Refundable if campaign
                  is successful.
                </p>
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
                Community Verified
              </h3>
              <p className="text-sm text-gray-400">
                Campaigns must gather community support before accepting
                donations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-950/20 border-green-900/30">
            <CardContent className="p-6">
              <AlertCircle className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-semibold text-green-50 mb-2">
                Full Transparency
              </h3>
              <p className="text-sm text-gray-400">
                All donations and expenses are recorded on-chain with public
                verification
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
