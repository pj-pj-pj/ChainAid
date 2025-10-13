"use client";

import { useReadContract, useBalance } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contracts";
import { useState, useEffect } from "react";
import { Campaign } from "@/lib/helper/fetchCampaigns";


export default function AllCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // ✅ 1️⃣ Fetch contract's on-chain balance (ETH)
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: CONTRACT_ADDRESS,
    chainId: 84532, // Base Sepolia
    watch: true, // keeps it live-updating
  });

  // ✅ 2️⃣ Read total number of campaigns
  const { data: totalCampaigns } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "nextCampaignId",
    chainId: 84532,
  });

  // ✅ 3️⃣ Fetch all campaigns (from mapping)
  useEffect(() => {
    async function loadCampaigns() {
      if (!totalCampaigns) return;

      const count = Number(totalCampaigns);
      console.log("Total campaigns:", count);

      const { createPublicClient, http } = await import("viem");
      const { baseSepolia } = await import("viem/chains");

      const client = createPublicClient({
        chain: baseSepolia,
        transport: http("https://base-sepolia-rpc.publicnode.com"),
      });

      const fetched: Campaign[] = [];
      for (let i = 0; i < count; i++) {
        const data = (await client.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "campaigns",
          args: [BigInt(i)],
        })) as readonly [
          bigint,
          `0x${string}`,
          string,
          string,
          bigint,
          bigint,
          bigint,
          bigint,
          string,
          string,
          number
        ];

        const [
          id,
          creator,
          title,
          description,
          goalAmount,
          totalDonations,
          createdAt,
          deadline,
          category,
          ipfsHash,
          state,
        ] = data;

        fetched.push({
          id: Number(id),
          creator,
          title,
          description,
          goalAmount: Number(goalAmount) / 1e18,
          totalDonations: Number(totalDonations) / 1e18,
          createdAt: createdAt > 0n ? new Date(Number(createdAt) * 1000) : null,
          deadline: deadline > 0n ? new Date(Number(deadline) * 1000) : null,
          category,
          ipfsHash,
          state: Number(state),
        });
      }

      setCampaigns(fetched);
    }

    loadCampaigns();
  }, [totalCampaigns]);

  // ✅ 4️⃣ Render everything
  return (
    <div className="p-6 space-y-6">
      {/* CONTRACT BALANCE */}
      <div className="p-4 border rounded-xl  shadow-sm">
        <h2 className="text-lg font-semibold mb-2">💰 Contract Balance</h2>
        {isBalanceLoading ? (
          <p>Loading balance...</p>
        ) : (
          <p>
            {balanceData?.formatted} {balanceData?.symbol}
          </p>
        )}
      </div>

      {/* CAMPAIGN DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.length === 0 ? (
          <p>Loading campaigns...</p>
        ) : (
          campaigns.map((c) => (
            <div
              key={c.id}
              className="p-4 border rounded-lg transition"
            >
              <h2 className="text-lg font-bold">{c.title || "Untitled Campaign"}</h2>
              <p>{c.description || "No description provided"}</p>
              <p><strong>Goal:</strong> {c.goalAmount} ETH</p>
              <p><strong>Raised:</strong> {c.totalDonations} ETH</p>
              <p><strong>Category:</strong> {c.category || "N/A"}</p>
              <p className="text-xs text-gray-500 mt-2">
                Created: {c.createdAt ? c.createdAt.toLocaleString() : "N/A"}
              </p>
              {c.ipfsHash && (
                <a
                  href={`https://ipfs.io/ipfs/${c.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  View IPFS
                </a>
              )}
            </div>
          ))
        )}
      </div>

      {/* JSON debug (optional) */}
      {/* <pre>{JSON.stringify(campaigns, null, 2)}</pre> */}
    </div>
  );
}
