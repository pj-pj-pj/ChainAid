import { create } from "zustand";
import type {
  Campaign,
  Donation,
  Expense,
  Supporter,
  CampaignMember,
  Transaction,
  GlobalStats,
} from "@/types";

interface AppState {
  campaigns: Campaign[];
  donations: Donation[];
  expenses: Expense[];
  supporters: Supporter[];
  members: CampaignMember[];
  transactions: Transaction[];
  globalStats: GlobalStats;

  // Actions
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  addDonation: (donation: Donation) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  addSupporter: (supporter: Supporter) => void;
  addMember: (member: CampaignMember) => void;
  removeMember: (campaignId: string, address: string) => void;
  addTransaction: (transaction: Transaction) => void;
  updateGlobalStats: (stats: Partial<GlobalStats>) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  setDonations: (donations: Donation[]) => void;

  // Getters
  getCampaignById: (id: string) => Campaign | undefined;
  getCampaignDonations: (campaignId: string) => Donation[];
  getCampaignExpenses: (campaignId: string) => Expense[];
  getCampaignSupporters: (campaignId: string) => Supporter[];
  getCampaignMembers: (campaignId: string) => CampaignMember[];
  getCampaignTransactions: (campaignId: string) => Transaction[];
}

export const useAppStore = create<AppState>((set, get) => ({
  campaigns: [],
  donations: [],
  expenses: [],
  supporters: [],
  members: [],
  transactions: [],
  globalStats: {
    totalFundsRaised: 0,
    activeCampaigns: 0,
    totalCampaigns: 0,
    verifiedNGOs: 0,
    totalDonors: 0,
    totalExpenses: 0,
  },

  setDonations: (donations: Donation[]) => set({ donations }),

  addCampaign: (campaign: Campaign) =>
    set((state: AppState) => ({
      campaigns: [...state.campaigns, campaign],
      globalStats: {
        ...state.globalStats,
        totalCampaigns: state.globalStats.totalCampaigns + 1,
        activeCampaigns:
          campaign.status === "Active"
            ? state.globalStats.activeCampaigns + 1
            : state.globalStats.activeCampaigns,
      },
    })),

  updateCampaign: (id: string, updates: Partial<Campaign>) =>
    set((state: AppState) => ({
      campaigns: state.campaigns.map((c: Campaign) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  addDonation: (donation: Donation) =>
    set((state: AppState) => {
      const campaign = state.campaigns.find(
        (c: Campaign) => c.id === donation.campaignId
      );
      const updatedCampaigns = campaign
        ? state.campaigns.map((c: Campaign) =>
            c.id === donation.campaignId
              ? {
                  ...c,
                  currentAmount: c.currentAmount + donation.amount,
                  remainingBalance: c.remainingBalance + donation.amount,
                }
              : c
          )
        : state.campaigns;

      return {
        donations: [...state.donations, donation],
        campaigns: updatedCampaigns,
        globalStats: {
          ...state.globalStats,
          totalFundsRaised:
            state.globalStats.totalFundsRaised + donation.amount,
          totalDonors:
            state.donations.filter(
              (d: Donation) => d.donorAddress === donation.donorAddress
            ).length === 0
              ? state.globalStats.totalDonors + 1
              : state.globalStats.totalDonors,
        },
      };
    }),

  addExpense: (expense: Expense) =>
    set((state: AppState) => ({
      expenses: [...state.expenses, expense],
    })),

  updateExpense: (id: string, updates: Partial<Expense>) =>
    set((state: AppState) => {
      const expense = state.expenses.find((e: Expense) => e.id === id);
      const updatedExpenses = state.expenses.map((e: Expense) =>
        e.id === id ? { ...e, ...updates } : e
      );

      // If expense is executed, update campaign balance and global stats
      if (updates.status === "Executed" && expense) {
        const updatedCampaigns = state.campaigns.map((c: Campaign) =>
          c.id === expense.campaignId
            ? {
                ...c,
                totalExpenses: c.totalExpenses + expense.amount,
                remainingBalance: c.remainingBalance - expense.amount,
              }
            : c
        );

        return {
          expenses: updatedExpenses,
          campaigns: updatedCampaigns,
          globalStats: {
            ...state.globalStats,
            totalExpenses: state.globalStats.totalExpenses + expense.amount,
          },
        };
      }

      return { expenses: updatedExpenses };
    }),

  addSupporter: (supporter: Supporter) =>
    set((state: AppState) => {
      const campaign = state.campaigns.find(
        (c: Campaign) => c.id === supporter.campaignId
      );
      const updatedCampaigns = campaign
        ? state.campaigns.map((c: Campaign) => {
            if (c.id === supporter.campaignId) {
              const newSupporterCount = c.supporterCount + 1;
              const newPledgedSupport =
                c.pledgedSupport + (supporter.pledgeAmount || 0);
              const shouldActivate =
                c.status === "Pending" &&
                (newSupporterCount >= c.supporterThreshold ||
                  newPledgedSupport >= c.supportGoal);

              return {
                ...c,
                supporterCount: newSupporterCount,
                pledgedSupport: newPledgedSupport,
                status: shouldActivate ? ("Active" as const) : c.status,
              };
            }
            return c;
          })
        : state.campaigns;

      return {
        supporters: [...state.supporters, supporter],
        campaigns: updatedCampaigns,
      };
    }),

  addMember: (member: CampaignMember) =>
    set((state: AppState) => ({
      members: [...state.members, member],
    })),

  removeMember: (campaignId: string, address: string) =>
    set((state: AppState) => ({
      members: state.members.filter(
        (m: CampaignMember) =>
          !(m.campaignId === campaignId && m.address === address)
      ),
    })),

  addTransaction: (transaction: Transaction) =>
    set((state: AppState) => ({
      transactions: [...state.transactions, transaction],
    })),

  updateGlobalStats: (stats: Partial<GlobalStats>) =>
    set((state: AppState) => ({
      globalStats: { ...state.globalStats, ...stats },
    })),

  setCampaigns: (campaigns: Campaign[]) =>
    set((state: AppState) => ({
      campaigns,
    })),

  getCampaignById: (id: string) => {
    return get().campaigns.find((c: Campaign) => c.id === id);
  },

  getCampaignDonations: (campaignId: string) => {
    return get().donations.filter((d: Donation) => d.campaignId === campaignId);
  },

  getCampaignExpenses: (campaignId: string) => {
    return get().expenses.filter((e: Expense) => e.campaignId === campaignId);
  },

  getCampaignSupporters: (campaignId: string) => {
    return get().supporters.filter(
      (s: Supporter) => s.campaignId === campaignId
    );
  },

  getCampaignMembers: (campaignId: string) => {
    return get().members.filter(
      (m: CampaignMember) => m.campaignId === campaignId
    );
  },

  getCampaignTransactions: (campaignId: string) => {
    return get().transactions.filter(
      (t: Transaction) => t.campaignId === campaignId
    );
  },
}));
