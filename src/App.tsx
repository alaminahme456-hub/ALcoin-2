import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AppDashboard from './components/AppDashboard';
import { Transaction, Notification, WalletState } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Coins, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { 
  supabase, 
  ensureProfile, 
  fetchProfile, 
  updateProfile, 
  fetchTransactions, 
  addTransaction as addTransactionDb 
} from './lib/supabase';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: Notification['type'];
}

export default function App() {
  const [view, setView] = useState<'landing' | 'portal'>('landing');
  
  const [user, setUser] = useState<any>(null);
  const [dbStatus, setDbStatus] = useState<'connected' | 'not_connected' | 'missing_tables'>('connected');

  const [wallet, setWallet] = useState<WalletState>({
    rewardBalance: 0,
    profitBalance: 0,
    withdrawableBalance: 0
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif_1',
      timestamp: '15:10',
      title: 'Welcome to ALCOIN! 🎉',
      message: 'Create your account and complete activation to unlock all interactive earning tools.',
      read: false,
      type: 'announcement'
    }
  ]);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Keep track of auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch Supabase dashboard data upon user authentication login
  useEffect(() => {
    if (!user) {
      setWallet({
        rewardBalance: 0,
        profitBalance: 0,
        withdrawableBalance: 0
      });
      setTransactions([]);
      return;
    }

    const loadUserData = async () => {
      const email = user.email || '';
      // Ensure the profile exists in DB
      const profileSetup = await ensureProfile(user.id, email);
      if (!profileSetup) {
        setDbStatus('missing_tables');
      } else {
        setDbStatus('connected');
      }

      // Fetch profile data
      const data = await fetchProfile(user.id);
      if (data) {
        setWallet(data.wallet);
      }

      // Fetch transaction history
      const txs = await fetchTransactions(user.id);
      if (txs && txs.length > 0) {
        setTransactions(txs);
      }
    };

    loadUserData();
  }, [user]);

  // Smooth scroll helper for landing internal anchors
  useEffect(() => {
    if (view === 'landing') {
      const handleAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');
        if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
          e.preventDefault();
          const targetId = anchor.getAttribute('href')!;
          const elem = document.querySelector(targetId);
          if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      };
      
      document.addEventListener('click', handleAnchorClick);
      return () => document.removeEventListener('click', handleAnchorClick);
    }
  }, [view]);

  // Handle toast timers
  const triggerToast = (title: string, message: string, type: Notification['type']) => {
    const id = `toast_${Date.now()}`;
    const newToast: Toast = { id, title, message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const addNotificationAndToast = (title: string, message: string, type: Notification['type']) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      timestamp,
      title,
      message,
      read: false,
      type
    };

    setNotifications(prev => [newNotif, ...prev]);
    triggerToast(title, message, type);
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    if (user) {
      addTransactionDb(user.id, tx);
    }
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Sync balances on prediction, task payout, or token swaps
  const handleWalletUpdate = (updater: (prev: WalletState) => WalletState) => {
    setWallet(prev => {
      const next = updater(prev);
      const rounded = {
        rewardBalance: parseFloat(next.rewardBalance.toFixed(2)),
        profitBalance: parseFloat(next.profitBalance.toFixed(2)),
        withdrawableBalance: parseFloat(next.withdrawableBalance.toFixed(2))
      };

      if (user) {
        updateProfile(user.id, {
          reward_balance: rounded.rewardBalance,
          profit_balance: rounded.profitBalance,
          withdrawable_balance: rounded.withdrawableBalance
        });
      }

      return rounded;
    });
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      
      {/* Route Views coordination */}
      {view === 'landing' ? (
        <LandingPage onEnterPortal={() => setView('portal')} />
      ) : (
        <AppDashboard 
          onBackToHome={() => setView('landing')}
          transactions={transactions}
          onAddTransaction={addTransaction}
          wallet={wallet}
          onUpdateWallet={handleWalletUpdate}
          notifications={notifications}
          onAddNotification={addNotificationAndToast}
          onMarkNotificationsRead={markNotificationsRead}
          user={user}
          dbStatus={dbStatus}
        />
      )}

      {/* FLOATING REAL-TIME TOAST NOTIFICATIONS DRAWER */}
      <div id="global_toasts_container" className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className="bg-slate-900 border border-slate-800 text-left rounded-xl p-4 shadow-2xl flex items-start space-x-3 pointer-events-auto cursor-pointer select-none border-l-4 border-l-emerald-500 overflow-hidden"
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                {toast.type === 'earnings' ? <Coins className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-slate-150 leading-snug">{toast.title}</h5>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal font-normal">{toast.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
