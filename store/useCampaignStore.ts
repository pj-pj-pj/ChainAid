import { create } from "zustand";
import { fetchCampaigns, fetchCampaignById } from "@/lib/helper/fetchCampaigns";
import { Campaign } from "@/types";

interface CampaignState {
  campaigns: Campaign[];
  isLoading: boolean;
  hasLoaded: boolean;
  fetchAll: (limit?: number, offset?: number) => Promise<void>;
  getCampaignById: (id: number) => Campaign | undefined;
  fetchSingle: (id: number) => Promise<Campaign | null>;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  isLoading: false,
  hasLoaded: false,

  fetchAll: async (limit = 10, offset = 0) => {
    if (get().hasLoaded) return; // already fetched
    set({ isLoading: true });
    try {
      const data = await fetchCampaigns(limit, offset);
      set({ campaigns: data, hasLoaded: true });
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getCampaignById: (id: number) => get().campaigns.find((c) => c.id === id),

  fetchSingle: async (id: number) => {
    const existing = get().getCampaignById(id);
    if (existing) return existing;
    const data = await fetchCampaignById(id);
    if (data) set({ campaigns: [...get().campaigns, data] });
    return data;
  },
}));
