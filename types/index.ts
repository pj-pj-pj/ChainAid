export type CampaignState = "Pending" | "Active" | "Completed" | "Cancelled";

export type UserRole = "Admin" | "Member" | "Donor" | "Viewer";

export interface Campaign {
  id: number;
  creator: string;
  title: string;
  description: string;
  goalAmount: number;
  totalDonations: number;
  createdAt: Date | null;
  deadline: Date | null;
  category: string;
  ipfsHash?: string;
  state: CampaignState;

  status?: string;
  imageUrl?: string;
}


export interface Supporter {
  id: string;
  address: string;
  campaignId: string;
  pledgeAmount?: number;
  timestamp: string;
  ensName?: string;
}

export interface Donation {
  id: string;
  campaignId: string;
  donorAddress: string;
  amount: number;
  message?: string;
  timestamp: string;
  txHash: string;
  nftMinted?: boolean;
  ensName?: string;
  campaignTitle: string;
}

export interface Expense {
  id: string;
  campaignId: string;
  amount: number;
  purpose: string;
  category: string;
  receiptUrl?: string; // IPFS hash
  submittedBy: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected" | "Executed";
  approvals: ExpenseApproval[];
  txHash?: string;
  requiredApprovals: number;
}

export interface ExpenseApproval {
  approverAddress: string;
  timestamp: string;
  approved: boolean;
}

export interface CampaignMember {
  address: string;
  role: UserRole;
  campaignId: string;
  addedAt: string;
  ensName?: string;
}

export interface Transaction {
  id: string;
  campaignId: string;
  type: "Donation" | "Expense" | "Support";
  amount: number;
  from: string;
  to?: string;
  timestamp: string;
  txHash: string;
  description: string;
}

export interface GlobalStats {
  totalFundsRaised: number;
  activeCampaigns: number;
  totalCampaigns: number;
  verifiedNGOs: number;
  totalDonors: number;
  totalExpenses: number;
}

export interface UploadedFile {
  name: string;
  ipfsHash: string;
  url: string;
  size: number;
}
