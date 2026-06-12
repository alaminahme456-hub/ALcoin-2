import { createClient } from '@supabase/supabase-js';
import { WalletState, Transaction, Referral } from '../types';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables are missing! Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL Schema code for easy copying
export const SUPABASE_SQL_SCHEMA = `-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    reward_balance NUMERIC DEFAULT 0,
    profit_balance NUMERIC DEFAULT 0,
    withdrawable_balance NUMERIC DEFAULT 0,
    is_activated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual access to profiles" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    timestamp TEXT,
    type TEXT,
    category TEXT,
    description TEXT,
    amount NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual access to transactions" ON public.transactions FOR ALL USING (auth.uid() = user_id);

-- Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT,
    joined_date TEXT,
    earnings_generated NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual access to referrals" ON public.referrals FOR ALL USING (auth.uid() = user_id);

-- Create tasks_completed table
CREATE TABLE IF NOT EXISTS public.tasks_completed (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_id TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, task_id)
);

-- Enable RLS for tasks_completed
ALTER TABLE public.tasks_completed ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual access to tasks_completed" ON public.tasks_completed FOR ALL USING (auth.uid() = user_id);`;

// DEFENSIVE UTILITIES FOR GRACEFUL FALLBACKS WHEN TABLES DO NOT YET EXIST

/**
 * Ensures user profile exists in Supabase.
 */
export async function ensureProfile(userId: string, email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('ensureProfile query error (it is likely the profiles table does not exist):', error.message);
      return false;
    }

    if (!data) {
      const { error: insertError } = await supabase.from('profiles').insert({
        id: userId,
        email,
        reward_balance: 0,
        profit_balance: 0,
        withdrawable_balance: 0,
        is_activated: false,
      });

      if (insertError) {
        console.warn('ensureProfile insert error:', insertError.message);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.warn('ensureProfile caught exception:', err);
    return false;
  }
}

/**
 * Fetches user profile balances.
 */
export async function fetchProfile(userId: string): Promise<{ wallet: WalletState; isActivated: boolean } | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('reward_balance, profit_balance, withdrawable_balance, is_activated')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('fetchProfile error:', error.message);
      return null;
    }

    return {
      wallet: {
        rewardBalance: Number(data.reward_balance || 0),
        profitBalance: Number(data.profit_balance || 0),
        withdrawableBalance: Number(data.withdrawable_balance || 0),
      },
      isActivated: Boolean(data.is_activated),
    };
  } catch (err) {
    console.warn('fetchProfile caught exception:', err);
    return null;
  }
}

/**
 * Updates user balances or activation state.
 */
export async function updateProfile(
  userId: string,
  updates: {
    reward_balance?: number;
    profit_balance?: number;
    withdrawable_balance?: number;
    is_activated?: boolean;
  }
): Promise<boolean> {
  try {
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);

    if (error) {
      console.warn('updateProfile error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('updateProfile caught exception:', err);
    return false;
  }
}

/**
 * Fetches user transaction history.
 */
export async function fetchTransactions(userId: string): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('id, timestamp, type, category, description, amount')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('fetchTransactions error:', error.message);
      return [];
    }

    return (data || []).map((t) => ({
      id: t.id,
      timestamp: t.timestamp,
      type: t.type as 'credit' | 'debit',
      category: t.category as 'rewards' | 'profit' | 'withdrawable' | 'general',
      description: t.description,
      amount: Number(t.amount),
    }));
  } catch (err) {
    console.warn('fetchTransactions caught exception:', err);
    return [];
  }
}

/**
 * Inserts a transaction.
 */
export async function addTransaction(userId: string, tx: Transaction): Promise<boolean> {
  try {
    const { error } = await supabase.from('transactions').insert({
      id: tx.id,
      user_id: userId,
      timestamp: tx.timestamp,
      type: tx.type,
      category: tx.category,
      description: tx.description,
      amount: tx.amount,
    });

    if (error) {
      console.warn('addTransaction error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('addTransaction caught exception:', err);
    return false;
  }
}

/**
 * Fetches referrals list.
 */
export async function fetchReferrals(userId: string): Promise<Referral[]> {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('id, name, joined_date, earnings_generated, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('fetchReferrals error:', error.message);
      return [];
    }

    return (data || []).map((r) => ({
      id: r.id,
      name: r.name,
      joinedDate: r.joined_date,
      earningsGenerated: Number(r.earnings_generated),
      status: r.status as 'active' | 'inactive',
    }));
  } catch (err) {
    console.warn('fetchReferrals caught exception:', err);
    return [];
  }
}

/**
 * Inserts a referral.
 */
export async function addReferral(userId: string, ref: Referral): Promise<boolean> {
  try {
    const { error } = await supabase.from('referrals').insert({
      id: ref.id,
      user_id: userId,
      name: ref.name,
      joined_date: ref.joinedDate,
      earnings_generated: ref.earningsGenerated,
      status: ref.status,
    });

    if (error) {
      console.warn('addReferral error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('addReferral caught exception:', err);
    return false;
  }
}

/**
 * Fetches completed task IDs.
 */
export async function fetchCompletedTasks(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.from('tasks_completed').select('task_id').eq('user_id', userId);

    if (error) {
      console.warn('fetchCompletedTasks error:', error.message);
      return [];
    }

    return (data || []).map((t) => t.task_id);
  } catch (err) {
    console.warn('fetchCompletedTasks caught exception:', err);
    return [];
  }
}

/**
 * Records a completed task.
 */
export async function addTaskCompleted(userId: string, taskId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('tasks_completed').insert({
      user_id: userId,
      task_id: taskId,
    });

    if (error) {
      console.warn('addTaskCompleted error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('addTaskCompleted caught exception:', err);
    return false;
  }
}
