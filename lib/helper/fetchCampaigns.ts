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

  const totalCampaigns = Number(
    await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "nextCampaignId", // <-- use this instead of "campaigns"
    })
  );

  const fetched: Campaign[] = [];
  const maxCount = Math.min(count, totalCampaigns);

  for (let i = 0; i < maxCount; i++) {
    const data = (await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "campaigns",
      args: [BigInt(i)],
    })) as readonly [
      bigint,           // id
      `0x${string}`,    // creator
      string,           // title
      string,           // organization
      string,           // description
      bigint,           // goalAmount
      bigint,           // totalDonations
      bigint,           // createdAt
      bigint,           // deadline
      string,           // category
      string,           // ipfsHash
      number,           // state (uint8)
      bigint            // supportCount
    ];

    const [
      id,
      creator,
      title,
      organization,
      description,
      goalAmount,
      totalDonations,
      createdAt,
      deadline,
      category,
      ipfsHash,
      state,
      supportCount
    ] = data;

    fetched.push({
      id: Number(id),
      creator,
      title,
      organization,
      description,
      goalAmount: Number(goalAmount) / 1e18,
      totalDonations: Number(totalDonations) / 1e18,
      createdAt: createdAt > 0n ? new Date(Number(createdAt) * 1000) : null,
      deadline: deadline > 0n ? new Date(Number(deadline) * 1000) : null,
      category,
      ipfsHash,
      state: Number(state),
      supportCount: Number(supportCount),
    });
  }

  return fetched;
}
