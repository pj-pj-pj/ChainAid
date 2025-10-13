import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contracts";
import { Campaign } from "@/types";

const RPC_URL = "https://base-sepolia-rpc.publicnode.com";

const IPFS_GATEWAYS = [
  "https://gateway.pinata.cloud/ipfs/",
  "https://ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
];

// --- In-memory IPFS cache ---
const ipfsCache = new Map<string, any>();

export async function fetchIpfsMetadata(ipfsHash: string): Promise<any | null> {
  if (!ipfsHash) return null;
  if (ipfsCache.has(ipfsHash)) return ipfsCache.get(ipfsHash);

  for (const gateway of IPFS_GATEWAYS) {
    try {
      const res = await fetch(`${gateway}${ipfsHash}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        ipfsCache.set(ipfsHash, data);
        return data;
      }
    } catch {
      continue;
    }
  }
  console.warn("⚠️ Failed to fetch IPFS metadata for:", ipfsHash);
  return null;
}

// --- Main fetch function with multicall ---
export async function fetchCampaigns(limit = 10, offset = 0): Promise<Campaign[]> {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });

  // Read total campaign count
  const totalCampaigns = Number(
    await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "nextCampaignId",
    })
  );

  if (totalCampaigns === 0) return [];

  const start = Math.max(totalCampaigns - (offset + limit), 0);
  const end = Math.min(totalCampaigns, totalCampaigns - offset);

  const calls = [];
  for (let i = start; i < end; i++) {
    calls.push({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "campaigns",
      args: [BigInt(i)],
    });
  }

  const responses = await client.multicall({ contracts: calls });

  // Parse on-chain campaign structs
  const campaigns = await Promise.all(
    responses.map(async (r) => {
      const data = r.result as readonly [
        bigint,
        `0x${string}`,
        string,
        string,
        string,
        bigint,
        bigint,
        bigint,
        bigint,
        string,
        string,
        number,
        bigint
      ];

      if (!data) return null;

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
        supportCount,
      ] = data;

      const metadata = await fetchIpfsMetadata(ipfsHash);

      return {
        id: Number(id),
        creator,
        title: metadata?.title || title,
        organization: metadata?.organizationName || organization,
        description: metadata?.description || description,
        goalAmount: Number(goalAmount) / 1e18,
        totalDonations: Number(totalDonations) / 1e18,
        createdAt: createdAt > 0n ? new Date(Number(createdAt) * 1000) : null,
        deadline: deadline > 0n ? new Date(Number(deadline) * 1000) : null,
        category: metadata?.category || category,
        ipfsHash,
        imageUrl: metadata?.imageUrl || `/category/${category}.jpg`,
        state: Number(state),
        supportCount: Number(supportCount),
        verified: metadata?.verified || false,
        supporterThreshold: metadata?.supporterThreshold || 50,
      };
    })
  );

  return campaigns.filter(Boolean) as Campaign[];
}

// --- Fetch a single campaign by ID ---
export async function fetchCampaignById(id: number): Promise<Campaign | null> {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });

  try {
    const data = (await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "campaigns",
      args: [BigInt(id)],
    })) as readonly [
      bigint,
      `0x${string}`,
      string,
      string,
      string,
      bigint,
      bigint,
      bigint,
      bigint,
      string,
      string,
      number,
      bigint
    ];

    const [
      campaignId,
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
      supportCount,
    ] = data;

    const metadata = await fetchIpfsMetadata(ipfsHash);

    return {
      id: Number(campaignId),
      creator,
      title: metadata?.title || title,
      organization: metadata?.organizationName || organization,
      description: metadata?.description || description,
      goalAmount: Number(goalAmount) / 1e18,
      totalDonations: Number(totalDonations) / 1e18,
      createdAt: createdAt > 0n ? new Date(Number(createdAt) * 1000) : null,
      deadline: deadline > 0n ? new Date(Number(deadline) * 1000) : null,
      category: metadata?.category || category,
      ipfsHash,
      imageUrl: metadata?.imageUrl || `/category/${category}.jpg`,
      state: Number(state),
      supportCount: Number(supportCount),
      verified: metadata?.verified || false,
      supporterThreshold: metadata?.supporterThreshold || 50,
    };
  } catch (error) {
    console.error(`❌ Failed to fetch campaign ${id}:`, error);
    return null;
  }
}
