import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contracts";
import { Campaign } from "@/types";

export async function fetchCampaigns(count: number): Promise<Campaign[]> {
  if (!count || count <= 0) return [];

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

  return fetched;
}
