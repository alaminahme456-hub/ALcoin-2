export interface Transaction {
  id: string;
  timestamp: string;
  type: 'credit' | 'debit';
  category: 'rewards' | 'profit' | 'withdrawable' | 'general';
  description: string;
  amount: number;
}

export interface Ad {
  id: string;
  title: string;
  reward: number;
  duration: number; // in seconds
  company: string;
  category: string;
  description: string;
  icon: string;
}

export interface SponsoredTask {
  id: string;
  title: string;
  reward: number;
  category: 'survey' | 'visit' | 'install' | 'share';
  company: string;
  description: string;
  isCompleted: boolean;
  questions?: {
    id: string;
    question: string;
    options: string[];
  }[];
}

export interface Notification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  read: boolean;
  type: 'earnings' | 'announcement' | 'promotion' | 'account' | 'prediction';
}

export interface WalletState {
  rewardBalance: number;
  profitBalance: number;
  withdrawableBalance: number;
}

export interface PredictionState {
  isActive: boolean;
  direction: 'UP' | 'DOWN' | null;
  stakeAmount: number;
  profitPercentage: number;
  entryPrice: number;
  remainingSeconds: number;
}

export interface Referral {
  id: string;
  name: string;
  joinedDate: string;
  earningsGenerated: number;
  status: 'active' | 'inactive';
}
