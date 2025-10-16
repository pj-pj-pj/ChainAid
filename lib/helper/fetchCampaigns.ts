import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contracts";
import { Campaign, Donation } from "@/types";

const RPC_URL = "https://base-sepolia-rpc.publicnode.com";

const IPFS_GATEWAYS = [`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/`];

// --- In-memory IPFS cache ---
const ipfsCache = new Map<string, any>();

// --- Date helpers (exported) ---
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function parseDateSafe(
  raw?: string | number | Date | null
): Date | null {
  if (raw == null) return null;
  if (raw instanceof Date) return isNaN(raw.getTime()) ? null : raw;
  if (typeof raw === "number") {
    // treat numbers <= 1e12 as seconds
    const ms = raw > 1e12 ? raw : raw * 1000;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof raw === "string") {
    const s = raw.trim();
    if (/^\d+$/.test(s)) {
      // numeric string
      const ms = s.length <= 10 ? Number(s) * 1000 : Number(s);
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

export function daysLeftFromNow(
  deadlineRaw?: string | number | Date | null,
  { roundUp = true }: { roundUp?: boolean } = {}
): number {
  const deadline = parseDateSafe(deadlineRaw);
  if (!deadline) return 0;
  const diffMs = deadline.getTime() - Date.now();
  if (diffMs <= 0) return 0;
  const days = diffMs / MS_PER_DAY;
  return Math.max(0, roundUp ? Math.ceil(days) : Math.floor(days));
}

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
export async function fetchCampaigns(
  limit = 10,
  offset = 0
): Promise<Campaign[]> {
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

      // Map numeric on-chain state -> human-friendly string
      const mapState = (num: number | bigint) => {
        const n = Number(num);
        switch (n) {
          case 0:
            return "Pending" as const;
          case 1:
            return "Active" as const;
          case 2:
            return "Cancelled" as const;
          case 3:
            return "Completed" as const;
          default:
            return "Pending" as const;
        }
      };

      let stateStr = mapState(state);
      try {
        if (daysLeftFromNow(Number(new Date(metadata?.deadline))) <= 0) {
          stateStr = "Completed";
        }
      } catch (e) {
        // ignore
      }

      return {
        id: Number(id),
        creator,
        title: metadata?.title || title,
        organization: metadata?.organizationName || organization,
        description: metadata?.description || description,
        goalAmount: Number(goalAmount) / 1e18,
        totalDonations: Number(totalDonations) / 1e18,
        createdAt: new Date(metadata?.createdAt),
        deadline: new Date(metadata?.deadline),
        category: metadata?.category || category,
        ipfsHash,
        imageUrl: metadata?.imageUrl || `/category/${category}.jpg`,
        state: stateStr,
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

    const mapState = (num: number | bigint) => {
      const n = Number(num);
      switch (n) {
        case 0:
          return "Pending" as const;
        case 1:
          return "Active" as const;
        case 2:
          return "Cancelled" as const;
        case 3:
          return "Completed" as const;
        default:
          return "Pending" as const;
      }
    };

    let stateStr = mapState(state);
    try {
      if (daysLeftFromNow(Number(new Date(metadata?.deadline))) <= 0) {
        stateStr = "Completed";
      }
    } catch (e) {
      // ignore
    }

    return {
      id: Number(campaignId),
      creator,
      title: metadata?.title || title,
      description: metadata?.description || description,
      goalAmount: Number(goalAmount) / 1e18,
      totalDonations: Number(totalDonations) / 1e18,
      createdAt: new Date(metadata?.createdAt),
      deadline: new Date(metadata?.deadline),
      category: metadata?.category || category,
      ipfsHash,
      imageUrl: metadata?.imageUrl || `/category/${category}.jpg`,
      state: stateStr,
      supportCount: Number(supportCount),
      verified: metadata?.verified || false,
      supporterThreshold: metadata?.supporterThreshold || 50,
    };
  } catch (error) {
    console.error(`❌ Failed to fetch campaign ${id}:`, error);
    return null;
  }
}

// --- Fetch donations for a campaign ---
export async function fetchDonations(
  campaignId: number
): Promise<Donation[] | null> {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });

  try {
    const donations = (await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getDonations",
      args: [BigInt(campaignId)],
    })) as readonly any[];

    return await Promise.all(
      donations.map(async (donation, index) => {
        // Access struct fields by property name instead of destructuring
        const donor = donation.donor || donation[0];
        const amount = donation.amount || donation[1];
        const timestamp = donation.timestamp || donation[2];
        const jsonCid = donation.jsonCid || donation[3];

        const donationMetadata = jsonCid
          ? await fetchIpfsMetadata(jsonCid)
          : null;

        return {
          id: `${campaignId}-${index}`,
          campaignId: campaignId.toString(),
          donorAddress: donor,
          amount: Number(amount) / 1e18,
          timestamp: new Date(Number(timestamp) * 1000).toISOString(),
          txHash: donationMetadata?.txHash || "",
          receiptCid: jsonCid || undefined,
          message: donationMetadata?.message,
          campaignTitle: donationMetadata?.campaignTitle || "",
          ensName: donationMetadata?.ensName,
        };
      })
    );
  } catch (error) {
    console.error(
      `❌ Failed to fetch donations for campaign ${campaignId}:`,
      error
    );
    return [];
  }
}
