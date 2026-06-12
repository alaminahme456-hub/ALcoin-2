import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, 
  Layers, 
  Users, 
  TrendingUp, 
  PiggyBank, 
  Award, 
  AlertCircle,
  Copy, 
  Check, 
  Tv, 
  Play, 
  Plus, 
  ArrowRight,
  ChevronRight,
  Clock, 
  Smartphone, 
  CheckCircle2, 
  X,
  CreditCard,
  Send,
  Navigation,
  Key,
  Lock,
  LockOpen,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  RefreshCw,
  Bell,
  HelpCircle
} from 'lucide-react';
import LiveChart from './LiveChart';
import { 
  Transaction, 
  Ad, 
  SponsoredTask, 
  Notification, 
  WalletState, 
  PredictionState, 
  Referral 
} from '../types';
import { 
  supabase, 
  fetchReferrals, 
  addReferral, 
  fetchCompletedTasks, 
  addTaskCompleted, 
  updateProfile, 
  SUPABASE_SQL_SCHEMA 
} from '../lib/supabase';

interface AppDashboardProps {
  onBackToHome: () => void;
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
  wallet: WalletState;
  onUpdateWallet: (updater: (prev: WalletState) => WalletState) => void;
  notifications: Notification[];
  onAddNotification: (title: string, msg: string, type: Notification['type']) => void;
  onMarkNotificationsRead: () => void;
  user: any;
  dbStatus: 'connected' | 'not_connected' | 'missing_tables';
}

export default function AppDashboard({
  onBackToHome,
  transactions,
  onAddTransaction,
  wallet,
  onUpdateWallet,
  notifications,
  onAddNotification,
  onMarkNotificationsRead,
  user,
  dbStatus,
}: AppDashboardProps) {
  
  // App Setup States
  const [currentTab, setCurrentTab] = useState<'overview' | 'ads' | 'tasks' | 'predictions' | 'referrals' | 'wallet'>('overview');
  
  // Authentication Real States (Supabase)
  const [signupForm, setSignupForm] = useState({ email: '', password: '' });
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const isSignedUp = !!user;
  
  // Activation Simulation (Step 2)
  const [isActivating, setIsActivating] = useState(false);
  const [activationProgress, setActivationProgress] = useState(0);
  const [activationLogs, setActivationLogs] = useState<string[]>([]);
  const [isActivated, setIsActivated] = useState(false);

  // Sync referrals and task completions from Supabase on mount/auth change
  useEffect(() => {
    if (!user) {
      setIsActivated(false);
      return;
    }

    const loadUserData = async () => {
      // Fetch activation status
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_activated')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profile) {
        setIsActivated(Boolean(profile.is_activated));
      }

      // Fetch referrals
      const refs = await fetchReferrals(user.id);
      if (refs && refs.length > 0) {
        setReferrals(refs);
      }

      // Fetch completed tasks
      const completedIds = await fetchCompletedTasks(user.id);
      if (completedIds && completedIds.length > 0) {
        setTasks(prev => prev.map(t => completedIds.includes(t.id) ? { ...t, isCompleted: true } : t));
      }
    };

    loadUserData();
  }, [user]);

  // Active Ads Tracking
  const [allAds, setAllAds] = useState<Ad[]>([
    {
      id: 'ad_1',
      title: 'EcoTech Smart Grid Solutions',
      reward: 12,
      duration: 5,
      company: 'EcoTech Global',
      category: 'Smart Energy',
      description: 'Engage with direct future solutions promoting green carbon neutrality.',
      icon: 'zap'
    },
    {
      id: 'ad_2',
      title: 'Sovereign Web3 Vault Demo',
      reward: 18,
      duration: 6,
      company: 'Sovereign Crypto',
      category: 'Blockchain Security',
      description: 'Discover the relative security advantages of offline sandboxed vaults.',
      icon: 'shield-check'
    },
    {
      id: 'ad_3',
      title: 'FinTech Africa Mobile Pay App',
      reward: 15,
      duration: 5,
      company: 'ALTECH Solutions',
      category: 'Payments',
      description: 'Review low-overhead payment tools developed with lightning speeds.',
      icon: 'credit-card'
    },
    {
      id: 'ad_4',
      title: 'Alafia Agritech Logistics',
      reward: 25,
      duration: 8,
      company: 'Alafia Foods',
      category: 'Agriculture',
      description: 'Track fresh agricultural harvests with zero waste parameters.',
      icon: 'compass'
    }
  ]);

  const [activeAdWatching, setActiveAdWatching] = useState<Ad | null>(null);
  const [adTimer, setAdTimer] = useState(0);
  const [adFinished, setAdFinished] = useState(false);

  // Sponsored Tasks States
  const [tasks, setTasks] = useState<SponsoredTask[]>([
    {
      id: 'task_1',
      title: 'ALTECH Consumer Technology Survey',
      reward: 45,
      category: 'survey',
      company: 'ALTECH Research',
      description: 'Answer 3 fast multiple-choice questions regarding your digital screen habits.',
      isCompleted: false,
      questions: [
        {
          id: 'q1',
          question: 'How many hours on average do you engage with screen rewards daily?',
          options: ['Less than 1 hour', '1 to 3 hours', 'More than 3 hours']
        },
        {
          id: 'q2',
          question: 'What payout method represents your primary preference?',
          options: ['WhatsApp Transfer', 'Mobile Money', 'Bank Wire', 'Crypto USDT']
        },
        {
          id: 'q3',
          question: 'Would you invite colleagues if there are high residual yields?',
          options: ['Definitely Yes', 'Maybe Yes', 'Not Sure']
        }
      ]
    },
    {
      id: 'task_2',
      title: 'Explore ALTECH Innovation Lab Site',
      reward: 30,
      category: 'visit',
      company: 'ALTECH Labs',
      description: 'Load our newly deployed decentralized dashboard and remain active for 6 seconds.',
      isCompleted: false
    },
    {
      id: 'task_3',
      title: 'Install ALCOIN PWA Workspace Sandbox',
      reward: 80,
      category: 'install',
      company: 'ALCOIN Team',
      description: 'Simulate the process of downloading the secure platform launcher utility.',
      isCompleted: false
    },
    {
      id: 'task_4',
      title: 'Campaign: Share Promo Link on WhatsApp',
      reward: 35,
      category: 'share',
      company: 'ALTECH Marketing',
      description: 'Copy and simulate dispatching the campaign message to WhatsApp communities.',
      isCompleted: false
    }
  ]);

  const [activeSurvey, setActiveSurvey] = useState<SponsoredTask | null>(null);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>({});
  const [surveyStep, setSurveyStep] = useState(0);

  const [activeVisitTask, setActiveVisitTask] = useState<SponsoredTask | null>(null);
  const [visitTimer, setVisitTimer] = useState(0);

  const [activeInstallTask, setActiveInstallTask] = useState<SponsoredTask | null>(null);
  const [installProgress, setInstallProgress] = useState(0);

  // Referral Simulated Stats & Actions
  const [referrals, setReferrals] = useState<Referral[]>([
    { id: 'ref_1', name: 'Zainab Ibrahim', joinedDate: '2026-06-08', earningsGenerated: 50, status: 'active' },
    { id: 'ref_2', name: 'Chinedu Okafor', joinedDate: '2026-06-10', earningsGenerated: 25, status: 'active' }
  ]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Live Chart & Prediction States
  const [chartPrice, setChartPrice] = useState(1.2450);
  const [prediction, setPrediction] = useState<PredictionState>({
    isActive: false,
    direction: null,
    stakeAmount: 20,
    profitPercentage: 65,
    entryPrice: 0,
    remainingSeconds: 0,
  });
  const [recentPredictionsCount, setRecentPredictionsCount] = useState(0);

  // Wallet Actions (Transfer / Withdraw)
  const [swapForm, setSwapForm] = useState({ from: 'reward' as 'reward' | 'profit', amount: '' });
  const [withdrawForm, setWithdrawForm] = useState({
    method: 'WhatsApp Transfer',
    destination: '',
    amount: ''
  });

  // Modal Alert Notification
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // Active Prediction Countdown Tick
  useEffect(() => {
    if (!prediction.isActive) return;

    if (prediction.remainingSeconds <= 0) {
      // Resolve Prediction
      const finalPrice = chartPrice;
      const isUpWin = prediction.direction === 'UP' && finalPrice > prediction.entryPrice;
      const isDownWin = prediction.direction === 'DOWN' && finalPrice < prediction.entryPrice;
      const isWin = isUpWin || isDownWin;

      setPrediction(prev => ({ ...prev, isActive: false }));

      if (isWin) {
        // Calculate Payout
        const earningsMultiplier = parseFloat((prediction.streakCount !== undefined ? 1.1 : 1).toFixed(2)); // multiplier
        const winProfit = prediction.stakeAmount * (prediction.profitPercentage / 100);
        const resolvedPayout = parseFloat((prediction.stakeAmount + winProfit).toFixed(2));

        onUpdateWallet(prev => ({
          ...prev,
          profitBalance: parseFloat((prev.profitBalance + resolvedPayout).toFixed(2))
        }));

        const winMsg = `Success! Price resolved in your direction. Entry price: $${prediction.entryPrice.toFixed(4)}, Exit price: $${finalPrice.toFixed(4)}. You unlocked $${resolvedPayout} ALC!`;
        onAddNotification('Prediction Won! 📈', winMsg, 'prediction');
        
        onAddTransaction({
          id: `tx_pred_win_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'credit',
          category: 'profit',
          description: `ALC Prediction Outcome: WIN (+${prediction.profitPercentage}%)`,
          amount: resolvedPayout
        });
      } else {
        const loseMsg = `Predict incorrect. Entry price: $${prediction.entryPrice.toFixed(4)}, Exit price: $${finalPrice.toFixed(4)}. Stake amount $${prediction.stakeAmount} ALC was lost. Better luck next target!`;
        onAddNotification('Prediction Lost 📉', loseMsg, 'prediction');

        onAddTransaction({
          id: `tx_pred_lose_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'debit',
          category: 'rewards',
          description: `ALC Prediction Outcome: LOST`,
          amount: prediction.stakeAmount
        });
      }
      setRecentPredictionsCount(c => c + 1);
      return;
    }

    const timer = setTimeout(() => {
      setPrediction(prev => ({ ...prev, remainingSeconds: prev.remainingSeconds - 1 }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [prediction.isActive, prediction.remainingSeconds, chartPrice]);

  // Active Ad Countdown Timer
  useEffect(() => {
    if (!activeAdWatching) return;
    
    if (adTimer <= 0) {
      setAdFinished(true);
      return;
    }

    const timer = setTimeout(() => {
      setAdTimer(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeAdWatching, adTimer]);

  // Active Visit Countdown Timer
  useEffect(() => {
    if (!activeVisitTask) return;

    if (visitTimer <= 0) {
      // Claim task rewards
      const tId = activeVisitTask.id;
      setTasks(prev => prev.map(t => t.id === tId ? { ...t, isCompleted: true } : t));
      
      if (user) {
        addTaskCompleted(user.id, tId);
      }

      onUpdateWallet(prev => ({
        ...prev,
        rewardBalance: parseFloat((prev.rewardBalance + activeVisitTask.reward).toFixed(2))
      }));

      onAddTransaction({
        id: `tx_task_visit_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'credit',
        category: 'rewards',
        description: `Completed Visit: ${activeVisitTask.title}`,
        amount: activeVisitTask.reward
      });

      onAddNotification('Rewards Dispatched! 🏆', `Earned +${activeVisitTask.reward} ALC for visiting ALTECH labs.`, 'earnings');
      setActiveVisitTask(null);
      return;
    }

    const timer = setTimeout(() => {
      setVisitTimer(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeVisitTask, visitTimer, user]);

  // Active Install Progress Bar Simulator
  useEffect(() => {
    if (!activeInstallTask) return;

    if (installProgress >= 100) {
      // Complete installer reward
      const tId = activeInstallTask.id;
      setTasks(prev => prev.map(t => t.id === tId ? { ...t, isCompleted: true } : t));

      if (user) {
        addTaskCompleted(user.id, tId);
      }

      onUpdateWallet(prev => ({
        ...prev,
        rewardBalance: parseFloat((prev.rewardBalance + activeInstallTask.reward).toFixed(2))
      }));

      onAddTransaction({
        id: `tx_task_install_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'credit',
        category: 'rewards',
        description: `Install Complete: ${activeInstallTask.title}`,
        amount: activeInstallTask.reward
      });

      onAddNotification('Installation Confirmed! 📱', `Earned +${activeInstallTask.reward} ALC for installing Workspace Launcher.`, 'earnings');
      setActiveInstallTask(null);
      return;
    }

    const timer = setTimeout(() => {
      setInstallProgress(prev => prev + 10);
    }, 450);

    return () => clearTimeout(timer);
  }, [activeInstallTask, installProgress, user]);

  // Real Supabase Authentication submit (Unified Sign In & Sign Up)
  const handleSupabaseAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.email || !signupForm.password) return;

    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: signupForm.email,
          password: signupForm.password,
        });

        if (error) {
          setAuthError(error.message);
          onAddNotification('Sign Up Failed ❌', error.message, 'account');
        } else {
          onAddNotification(
            'Account Created! 🎉',
            `Your account has been created for ${signupForm.email}.`,
            'account'
          );
          if (data?.user) {
            // Instantly create profile row
            await supabase.from('profiles').insert({
              id: data.user.id,
              email: signupForm.email,
              reward_balance: 0,
              profit_balance: 0,
              withdrawable_balance: 0,
              is_activated: false
            });
            onAddNotification('Welcome to ALCOIN! 🚀', 'Your profile is ready and fully set up!', 'account');

            // Automatically attempt sign-in for seamless experience without separate step
            try {
              await supabase.auth.signInWithPassword({
                email: signupForm.email,
                password: signupForm.password,
              });
            } catch (signInErr) {
              console.warn('Auto login exception:', signInErr);
            }
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: signupForm.email,
          password: signupForm.password,
        });

        if (error) {
          setAuthError(error.message);
          onAddNotification('Sign In Failed ❌', error.message, 'account');
        } else {
          onAddNotification('Welcome Back! 🔓', `Successfully signed in as ${signupForm.email}`, 'account');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Account Activation Trigger (Step 2)
  const startActivationProcess = () => {
    setIsActivating(true);
    setActivationProgress(0);
    setActivationLogs([]);

    const logPoints = [
      'Establishing sandbox key pair validation...',
      'Assigning high-purity rewards ledger address...',
      'Mapping ALTECH residual referral token ID...',
      'Verifying dynamic UP/DOWN pricing market integrations...',
      'Security protocols established. Workspace fully decrypted!'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logPoints.length) {
        setActivationLogs(prev => [...prev, logPoints[currentStep]]);
        setActivationProgress(prev => Math.min(prev + 20, 100));
        currentStep++;
      } else {
        clearInterval(interval);
        setIsActivated(true);
        setIsActivating(false);
        if (user) {
          updateProfile(user.id, { is_activated: true });
        }
        onAddNotification('Portal Activated! 🔓', 'Welcome to ALCOIN rewards. All simulated monetization categories are unlocked.', 'account');
      }
    }, 800);
  };

  // Watch Ad Execution
  const triggerWatchAd = (ad: Ad) => {
    setAdTimer(ad.duration);
    setAdFinished(false);
    setActiveAdWatching(ad);
  };

  const claimAdRewards = () => {
    if (!activeAdWatching) return;
    
    onUpdateWallet(prev => ({
      ...prev,
      rewardBalance: parseFloat((prev.rewardBalance + activeAdWatching.reward).toFixed(2))
    }));

    onAddTransaction({
      id: `tx_ad_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'credit',
      category: 'rewards',
      description: `Watched Ad: ${activeAdWatching.company}`,
      amount: activeAdWatching.reward
    });

    onAddNotification('Reward Credited! 📺', `Watched ad "${activeAdWatching.title}" and earned +${activeAdWatching.reward} ALC.`, 'earnings');
    
    // Clear State
    setActiveAdWatching(null);
  };

  // Sponsored Surveys Completion
  const submitSurvey = () => {
    if (!activeSurvey) return;

    setTasks(prev => prev.map(t => t.id === activeSurvey.id ? { ...t, isCompleted: true } : t));
    
    if (user) {
      addTaskCompleted(user.id, activeSurvey.id);
    }

    onUpdateWallet(prev => ({
      ...prev,
      rewardBalance: parseFloat((prev.rewardBalance + activeSurvey.reward).toFixed(2))
    }));

    onAddTransaction({
      id: `tx_survey_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'credit',
      category: 'rewards',
      description: `Survey Completed: ${activeSurvey.company}`,
      amount: activeSurvey.reward
    });

    onAddNotification('Survey Approved 📋', `Earned +${activeSurvey.reward} ALC for technology preference feedback.`, 'earnings');
    
    setActiveSurvey(null);
    setSurveyAnswers({});
    setSurveyStep(0);
  };

  // Launch simulated website visit
  const startVisitTask = (task: SponsoredTask) => {
    setVisitTimer(6);
    setActiveVisitTask(task);
  };

  // Launch simulated app install
  const startInstallTask = (task: SponsoredTask) => {
    setInstallProgress(0);
    setActiveInstallTask(task);
  };

  // Share campaign on WhatsApp
  const simulateWhatsAppShare = (task: SponsoredTask) => {
    onAddNotification(' WhatsApp Active', 'Simulating payload redirect to WhatsApp api. Please hold.', 'promotion');
    
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, isCompleted: true } : t));
      
      if (user) {
        addTaskCompleted(user.id, task.id);
      }

      onUpdateWallet(prev => ({
        ...prev,
        rewardBalance: parseFloat((prev.rewardBalance + task.reward).toFixed(2))
      }));

      onAddTransaction({
        id: `tx_task_share_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'credit',
        category: 'rewards',
        description: `Promo Shared: ${task.title}`,
        amount: task.reward
      });

      onAddNotification('Ref Share Logged! 🤝', `Earned +${task.reward} ALC for sharing campaigns.`, 'earnings');
    }, 1500);
  };

  // Referral Simulated Event
  const simulateFriendReferral = () => {
    const names = ['Kofi Mensah', 'Prisca Okafor', 'Sarah Bello', 'Moussa Diallo', 'Ebuka Egwu'];
    const chosenName = names[Math.floor(Math.random() * names.length)] + ' ' + (Math.floor(Math.random() * 90) + 10);
    const date = new Date().toISOString().split('T')[0];
    const bonus = 25;

    const newRef: Referral = {
      id: `ref_${Date.now()}`,
      name: chosenName,
      joinedDate: date,
      earningsGenerated: bonus,
      status: 'active'
    };

    setReferrals(prev => [newRef, ...prev]);

    if (user) {
      addReferral(user.id, newRef);
    }

    onUpdateWallet(prev => ({
      ...prev,
      rewardBalance: parseFloat((prev.rewardBalance + bonus).toFixed(2))
    }));

    onAddTransaction({
      id: `tx_ref_bonus_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'credit',
      category: 'rewards',
      description: `Passive Referral Bonus: ${chosenName}`,
      amount: bonus
    });

    onAddNotification('Referral Milestone! 🤝', `Your friend ${chosenName} joined! Generated +${bonus} ALC.`, 'promotion');
  };

  // Copy Referral Code
  const copyReferralLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Prediction Placement Submission
  const handlePlacePrediction = (direction: 'UP' | 'DOWN') => {
    if (!isActivated) return;
    const stake = parseFloat(prediction.stakeAmount.toString());

    // Deduct Stake based on where there are funds
    let canBet = false;
    let balanceType: 'rewardBalance' | 'profitBalance' = 'rewardBalance';

    if (wallet.rewardBalance >= stake) {
      canBet = true;
      balanceType = 'rewardBalance';
    } else if (wallet.profitBalance >= stake) {
      canBet = true;
      balanceType = 'profitBalance';
    }

    if (!canBet) {
      alert("Insufficient Balance in simulated wallet. Please clear ads or tasks to gain tokens.");
      return;
    }

    // Deduct stake instantly
    onUpdateWallet(prev => ({
      ...prev,
      [balanceType]: parseFloat((prev[balanceType] - stake).toFixed(2))
    }));

    // Start countdown prediction
    setPrediction(prev => ({
      ...prev,
      isActive: true,
      direction,
      entryPrice: chartPrice,
      remainingSeconds: 10
    }));

    onAddTransaction({
      id: `tx_pred_place_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'debit',
      category: 'rewards',
      description: `Prediction Stake Placed (${direction})`,
      amount: stake
    });

    onAddNotification('Stake Locked! 🎲', `Lock-in price selected at $${chartPrice.toFixed(4)}. Initiating 10s prediction market index cycle...`, 'prediction');
  };

  // Swap Reward/Profit to Withdrawable
  const handleSwapTokens = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(swapForm.amount);
    if (!amount || amount <= 0) return;

    if (swapForm.from === 'reward' && wallet.rewardBalance < amount) {
      alert("Insufficient Reward balance strings.");
      return;
    }
    if (swapForm.from === 'profit' && wallet.profitBalance < amount) {
      alert("Insufficient Profit balance strings.");
      return;
    }

    onUpdateWallet(prev => {
      if (swapForm.from === 'reward') {
        return {
          ...prev,
          rewardBalance: parseFloat((prev.rewardBalance - amount).toFixed(2)),
          withdrawableBalance: parseFloat((prev.withdrawableBalance + amount).toFixed(2))
        };
      } else {
        return {
          ...prev,
          profitBalance: parseFloat((prev.profitBalance - amount).toFixed(2)),
          withdrawableBalance: parseFloat((prev.withdrawableBalance + amount).toFixed(2))
        };
      }
    });

    onAddTransaction({
      id: `tx_swap_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'credit',
      category: 'withdrawable',
      description: `Converted ${amount} ${swapForm.from.toUpperCase()} strings to export ledger`,
      amount: amount
    });

    onAddNotification('Swap Successful! ⚖️', `Exchanged ${amount} ALC units to withrawable.`, 'earnings');
    setSwapForm(prev => ({ ...prev, amount: '' }));
  };

  // Withdraw Submission
  const handleWithdrawalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawForm.amount);
    if (!amount || amount <= 0) return;
    if (!withdrawForm.destination) {
      alert("Please configure withdrawal credentials.");
      return;
    }

    if (wallet.withdrawableBalance < amount) {
      alert("Withdrawable Balance is insufficient. Swap your Rewards or Profits to Withdrawable standard first.");
      return;
    }

    // Deduct instant
    onUpdateWallet(prev => ({
      ...prev,
      withdrawableBalance: parseFloat((prev.withdrawableBalance - amount).toFixed(2))
    }));

    const txId = `tx_withdraw_${Date.now()}`;
    const txTime = new Date().toLocaleTimeString();

    onAddTransaction({
      id: txId,
      timestamp: txTime,
      type: 'debit',
      category: 'withdrawable',
      description: `Withdraw: ${withdrawForm.method} to ${withdrawForm.destination} (PENDING)`,
      amount: amount
    });

    onAddNotification('Withdraw Pending 🏦', `Payout request for ${amount} ALC initiated. Manual blockchain check started.`, 'account');
    setWithdrawForm(prev => ({ ...prev, amount: '' }));

    // Simulate approval sweep after 10-15 seconds
    setTimeout(() => {
      onAddNotification('Payout Approved! ✅', `Withdrawal transfer of ${amount} ALC successfully processed to ${withdrawForm.destination}.`, 'account');
    }, 12000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-blue-500 selection:text-black">
      
      {/* Top Console Bar */}
      <nav id="dashboard_top_bar" className="bg-[#0A0A0A] border-b border-white/10 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={onBackToHome}>
              <div className="w-8 h-8 bg-blue-500 flex items-center justify-center">
                <span className="text-xs font-black text-black">ALC</span>
              </div>
              <div>
                <span className="text-sm font-black tracking-tighter text-white block uppercase">ALCOIN<span className="text-blue-500 font-extrabold">.</span></span>
                <span className="text-[7.5px] font-black text-blue-400 font-mono tracking-widest leading-[1] block">WORKSPACE DEMO</span>
              </div>
            </div>

            <div className="hidden lg:flex space-x-4 text-[10px] font-mono tracking-widest uppercase">
              <button 
                onClick={() => setCurrentTab('overview')} 
                className={`py-2 px-3 transition-colors font-black ${currentTab === 'overview' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-white/60 hover:text-white'}`}
              >
                Overview
              </button>
              <button 
                disabled={!isActivated}
                onClick={() => setCurrentTab('ads')} 
                className={`py-2 px-3 transition-colors font-black ${!isActivated ? 'opacity-30 cursor-not-allowed' : currentTab === 'ads' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-white/60 hover:text-white'}`}
              >
                Advertisements
              </button>
              <button 
                disabled={!isActivated}
                onClick={() => setCurrentTab('tasks')} 
                className={`py-2 px-3 transition-colors font-black ${!isActivated ? 'opacity-30 cursor-not-allowed' : currentTab === 'tasks' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-white/60 hover:text-white'}`}
              >
                Tasks & Campaigns
              </button>
              <button 
                disabled={!isActivated}
                onClick={() => setCurrentTab('predictions')} 
                className={`py-2 px-3 transition-colors font-black ${!isActivated ? 'opacity-30 cursor-not-allowed' : currentTab === 'predictions' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-white/60 hover:text-white'}`}
              >
                Predictions
              </button>
              <button 
                disabled={!isActivated}
                onClick={() => setCurrentTab('referrals')} 
                className={`py-2 px-3 transition-colors font-black ${!isActivated ? 'opacity-30 cursor-not-allowed' : currentTab === 'referrals' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-white/60 hover:text-white'}`}
              >
                Referrals
              </button>
              <button 
                disabled={!isActivated}
                onClick={() => setCurrentTab('wallet')} 
                className={`py-2 px-3 transition-colors font-black ${!isActivated ? 'opacity-30 cursor-not-allowed' : currentTab === 'wallet' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-white/60 hover:text-white'}`}
              >
                Wallet & Pay
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification triggers */}
            <div className="relative">
              <button 
                id="dash_notifications_bell"
                onClick={() => {
                  setShowNotificationCenter(!showNotificationCenter);
                  onMarkNotificationsRead();
                }}
                className="p-2.5 text-white/70 hover:text-white bg-[#111111] border border-white/10 hover:bg-white/5 transition-colors focus:outline-none"
              >
                <Bell className="w-3.5 h-3.5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                )}
              </button>
            </div>

            {isSignedUp && (
              <button
                onClick={async () => {
                  const { error } = await supabase.auth.signOut();
                  if (!error) {
                    onAddNotification('Signed Out 👋', 'You have securely terminated your backend session.', 'account');
                  }
                }}
                className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-red-500 border border-red-500/30 bg-red-500/5 hover:bg-red-500/20 hover:text-white transition-all font-bold"
              >
                <span>Sign Out ({user?.role === 'authenticated' ? 'Active' : 'User'})</span>
              </button>
            )}

            <button
              id="back_to_landing_site_btn"
              onClick={onBackToHome}
              className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-[#22C55E] border border-white/10 bg-[#111111] hover:bg-white/5 hover:text-white transition-all font-bold"
            >
              <span>← marketing site</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Primary Dashboard Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Mobile-Menu / Overview Panel */}
        <div id="dashboard_side_tracker_col" className="w-full md:w-64 shrink-0 space-y-6">
          
          {/* Main User Stat Balance Frame */}
          {isSignedUp && (
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 pointer-events-none rounded-bl-3xl"></div>
              <div className="flex items-center space-x-2 text-white/50 text-[10px] font-mono tracking-widest block uppercase font-bold">
                <Coins className="w-3.5 h-3.5 text-blue-400" />
                <span>ALC Ledger Balance</span>
              </div>
              <span className="text-3xl font-black tracking-tighter font-mono text-blue-500 block mt-1.5">
                {(wallet.rewardBalance + wallet.profitBalance + wallet.withdrawableBalance).toFixed(2)} <span className="text-xs text-white/40 block sm:inline font-sans font-medium uppercase font-mono tracking-widest">ALC</span>
              </span>
              <div className="border-t border-white/5 pt-3 mt-3 flex items-center justify-between text-[10px] text-white/60 font-mono font-bold uppercase tracking-widest">
                <span className={`inline-flex items-center space-x-1.5 ${isActivated ? 'text-[#22C55E]' : 'text-amber-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${isActivated ? 'bg-[#22C55E] animate-pulse' : 'bg-amber-500'}`}></span>
                  <span>{isActivated ? 'ACTIVE LEDGER' : 'PENDING LEDGER'}</span>
                </span>
              </div>
            </div>
          )}

          {/* Quick Stats breakdowns */}
          {isSignedUp && (
            <div className="p-4 bg-[#111111] border border-white/10 rounded-2xl space-y-3.5 text-left text-[10px] uppercase font-mono tracking-widest font-extrabold">
              <div className="flex justify-between items-center pb-2 border-b border-white/5 font-semibold">
                <span className="text-white/40">Reward Balance:</span>
                <span className="font-black text-white">{wallet.rewardBalance.toFixed(2)} ALC</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5 font-semibold">
                <span className="text-white/40">Profit Pool:</span>
                <span className="font-black text-[#22C55E]">{wallet.profitBalance.toFixed(2)} ALC</span>
              </div>
              <div className="flex justify-between items-center text-blue-400 font-bold">
                <span className="text-white/40">Withdrawable:</span>
                <span className="font-black">{wallet.withdrawableBalance.toFixed(2)} ALC</span>
              </div>
            </div>
          )}

          {/* Setup / Guided Tutorial Progress Tracker based on User Copy */}
          <div className="p-5 bg-[#111111] border border-white/10 rounded-2xl text-left">
            <h4 className="text-[10px] font-black font-mono tracking-widest text-[#22C55E] block uppercase border-b border-white/5 pb-2 mb-3">Onboarding Roadmap</h4>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${isSignedUp ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-[#0A0A0A] border border-white/10 text-white/40'}`}>
                  {isSignedUp ? <Check className="w-3 h-3 stroke-[2.5]" /> : '1'}
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-white tracking-tight block">Sign Up Account</span>
                  <span className="text-[10px] text-white/50 block leading-tight font-normal mt-0.5">Setup username and password</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${isActivated ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-[#0A0A0A] border border-white/10 text-white/40'}`}>
                  {isActivated ? <Check className="w-3 h-3 stroke-[2.5]" /> : '2'}
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-white tracking-tight block">Activate Security</span>
                  <span className="text-[10px] text-white/50 block leading-tight font-normal mt-0.5">Deploy rewards ledger nodes</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-black font-mono border ${isActivated ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-[#0A0A0A] border-white/15 text-white/40'}`}>
                  3
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-white tracking-tight block">Earning & Growth</span>
                  <span className="text-[10px] text-white/50 block leading-tight font-normal mt-0.5">Explore ads & market predictions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Tab Content Screen */}
        <div id="dashboard_tab_content_col" className="flex-1 space-y-8">
          
          {/* Check Onboarding status and force creation if not signed up */}
          {!isSignedUp && (
            <div id="onboarding_sign_up_block" className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-10 text-left max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-10 -translate-y-1/2 px-3 py-1 bg-blue-500 text-black text-[9px] font-black uppercase tracking-widest font-mono font-bold">
                Supabase Auth Mode
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5 mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mt-2">ALCOIN Gateway</h3>
                  <p className="text-xs text-white/60 mt-2 leading-relaxed font-normal">
                    Secure real-time authentication connected directly to your Supabase cloud backend.
                  </p>
                </div>
                <div className="flex bg-[#0A0A0A] border border-white/10 p-1 rounded-md self-start sm:self-auto">
                  <button
                    onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase font-black tracking-wider transition-all rounded-sm ${authMode === 'signup' ? 'bg-blue-500 text-black font-extrabold' : 'text-white/60 hover:text-white'}`}
                  >
                    Register
                  </button>
                  <button
                    onClick={() => { setAuthMode('login'); setAuthError(null); }}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase font-black tracking-wider transition-all rounded-sm ${authMode === 'login' ? 'bg-blue-500 text-black font-extrabold' : 'text-white/60 hover:text-white'}`}
                  >
                    Login
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3.5 mb-5 bg-red-500/10 border border-red-500/20 rounded-md flex items-start space-x-2.5 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleSupabaseAuth} className="space-y-5">
                <div>
                  <label className="text-[9px] text-white/40 font-black uppercase tracking-widest font-mono block mb-1.5">Gmail Address</label>
                  <input 
                    type="email" 
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="yourname@gmail.com"
                    className="w-full px-4 py-3 rounded-none bg-[#0a0a0a] border border-white/10 focus:outline-none focus:border-blue-500 text-white transition-all text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-white/40 font-black uppercase tracking-widest font-mono block mb-1.5">Account Password</label>
                  <input 
                    type="password" 
                    required
                    value={signupForm.password}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-none bg-[#0a0a0a] border border-white/10 focus:outline-none focus:border-blue-500 text-white transition-all text-xs font-mono"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-4 bg-white hover:bg-blue-500 hover:text-white disabled:bg-white/10 text-black text-xs font-black uppercase tracking-widest font-mono transition-colors flex items-center justify-center space-x-2"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing Gateway authentication...</span>
                    </>
                  ) : (
                    <span>{authMode === 'signup' ? 'Create Real Account' : 'Authenticate Credentials'}</span>
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-white/5 pt-5 space-y-5">
                <div className="flex items-start space-x-3 text-xs text-white/70">
                  <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <strong className="text-white block font-sans tracking-tight">Active Supabase Connection</strong>
                    <span className="text-[10px] text-white/45 font-mono block mt-0.5">https://gopneqtdlucexozhbcgv.supabase.co</span>
                  </div>
                </div>

                {/* DB Sync diagnostics & copyable table schema notice */}
                {dbStatus === 'missing_tables' && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3.5">
                    <div className="flex items-start space-x-2.5 text-amber-300 text-xs font-semibold">
                      <AlertCircle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                      <div>
                        <span>Database migration tables pending!</span>
                        <p className="text-[10px] text-amber-200/70 font-normal mt-1 leading-relaxed">
                          To store your balances, transactions, and completed tasks permanently on your cloud console, please execute this schema in your Supabase SQL Editor.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-[#0A0A0A] border border-white/10 p-3 rounded font-mono text-[9px] text-white/60 overflow-x-auto max-h-40">
                      <pre>{SUPABASE_SQL_SCHEMA}</pre>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                        onAddNotification('Copied SQL Schema! 📋', 'Copy-paste the schema copy directly into your Supabase SQL Editor to bootstrap backend.', 'announcement');
                      }}
                      className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono tracking-wider uppercase font-bold transition-all"
                    >
                      Copy SQL Schema Code
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Activated Step 2 Trigger */}
          {isSignedUp && !isActivated && (
            <div id="onboarding_activation_block" className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-10 text-left max-w-2xl mx-auto shadow-2xl relative overflow-hidden font-sans">
              <div className="absolute top-0 right-10 -translate-y-1/2 px-3 py-1 bg-blue-500 text-black text-[9px] font-black uppercase tracking-widest font-mono">
                Step 2: Activation Key
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white leading-tight flex items-center space-x-2.5">
                <Lock className="w-5 h-5 text-blue-500" />
                <span>Activate Your ALCOIN Dashboard</span>
              </h3>
              <p className="text-xs text-white/60 mt-3 leading-relaxed">
                Unlock all integrated earning features, watch ads rewards, referral bonus allocations, trend prediction markets, and wallet payout transactions.
              </p>

              <div className="mt-8 space-y-6">
                {!isActivating ? (
                  <button 
                    onClick={startActivationProcess}
                    className="w-full py-4 bg-white hover:bg-blue-500 hover:text-white text-black text-xs font-black uppercase tracking-widest font-mono transition-colors flex items-center justify-center space-x-2"
                  >
                    <Key className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Deploy Rewards Access Activation Key</span>
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase">
                      <span className="text-blue-400 animate-pulse font-bold">Calibrating system credentials...</span>
                      <span className="font-black text-white">{activationProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#0A0A0A] border border-white/5 overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${activationProgress}%` }}></div>
                    </div>

                    <div className="p-4 bg-[#0A0A0A] border border-white/10 font-mono text-[9px] text-white/50 space-y-1.5 max-h-36 overflow-y-auto">
                      {activationLogs.map((log, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 pb-1 border-b border-white/5 last:border-none">
                          <span className="text-[#22C55E] font-black">✓</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 border-t border-white/5 pt-4 text-[10px] text-white/45 font-mono uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Encrypted deployment logs powered by ALTECH systems framework.</span>
              </div>
            </div>
          )}

          {/* Core Activated Workspace Screen */}
          {isSignedUp && isActivated && (
            <>
              {/* Tab: Overview (Landing Dashboard Panel) */}
              {currentTab === 'overview' && (
                <div id="tab_overview_panel" className="space-y-8 animate-fadeIn text-left">
                  
                  {/* Status Banner */}
                  <div className="p-6 bg-[#111111] border border-white/10 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black uppercase tracking-tighter text-white">Active simulated campaign portal</h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Maintain high screen-time consistency to boost your residual AL Coin rewards rate!</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setCurrentTab('ads')}
                        className="px-5 py-2.5 text-[10px] font-black font-mono tracking-widest uppercase text-black bg-white hover:bg-blue-500 hover:text-white transition-colors"
                      >
                        Watch Ads
                      </button>
                      <button 
                        onClick={() => setCurrentTab('predictions')}
                        className="px-5 py-2.5 text-[10px] font-black font-mono tracking-widest uppercase text-[#22C55E] bg-[#0A0A0A] border border-white/10 hover:bg-white/5 hover:text-white transition-all"
                      >
                        Trade Market
                      </button>
                    </div>
                  </div>

                  {/* Active Campaigns Checklist Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Live Earning Opportunities List */}
                    <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-lg">
                      <h4 className="text-[11px] font-black text-white hover:text-blue-400 mb-4 block font-mono border-b border-white/5 pb-2 uppercase tracking-widest">Launch Quick monetization</h4>
                      
                      <div className="space-y-4">
                        <div className="p-3.5 bg-[#0a0a0a] border border-white/5 rounded-xl flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                              <Tv className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <span className="text-xs font-black uppercase tracking-tight text-white block">Engage Advertisements</span>
                              <span className="text-[10px] text-white/40 block mt-0.5 font-normal">5s countdown watching views</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 text-[9px] font-mono font-black tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                            +12-25 ALC
                          </span>
                        </div>

                        <div className="p-3.5 bg-[#0a0a0a] border border-white/5 rounded-xl flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-[#22C55E]/10 rounded-lg flex items-center justify-center text-[#22C55E]">
                              <Layers className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <span className="text-xs font-black uppercase tracking-tight text-white block">Micro Surveys & Visits</span>
                              <span className="text-[10px] text-white/40 block mt-0.5 font-normal">Answer technology habit forms</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 text-[9px] font-mono font-black tracking-widest bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 uppercase">
                            +30-80 ALC
                          </span>
                        </div>

                        <div className="p-3.5 bg-[#0a0a0a] border border-white/5 rounded-xl flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                              <TrendingUp className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <span className="text-xs font-black uppercase tracking-tight text-white block">Trend Predictors</span>
                              <span className="text-[10px] text-white/40 block mt-0.5 font-normal">Predict live indices movements</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 text-[9px] font-mono font-black tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                            Up to 1.85x
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Live Wallet Snapshot & Swap Utility */}
                    <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                      <div>
                        <h4 className="text-[11px] font-black text-white mb-4 block font-mono border-b border-white/5 pb-2 uppercase tracking-widest">Fast Balance swap</h4>
                        <p className="text-[11px] text-white/60 mb-3 block leading-relaxed font-normal">
                          Convert Reward credits or Profit pools into exportable **Withdrawable** balance instantly.
                        </p>
                      </div>

                      <form onSubmit={handleSwapTokens} className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono tracking-widest uppercase">
                          <button
                            type="button"
                            onClick={() => setSwapForm(prev => ({ ...prev, from: 'reward' }))}
                            className={`p-2.5 rounded-none border text-center transition-all font-black ${swapForm.from === 'reward' ? 'bg-blue-500/10 border-blue-500 text-blue-400 animate-pulse' : 'bg-[#0A0A0A] border-white/5 text-white/40 hover:text-white'}`}
                          >
                            Rewards ➜ Withdr.
                          </button>
                          <button
                            type="button"
                            onClick={() => setSwapForm(prev => ({ ...prev, from: 'profit' }))}
                            className={`p-2.5 rounded-none border text-center transition-all font-black ${swapForm.from === 'profit' ? 'bg-blue-500/10 border-blue-500 text-blue-400 animate-pulse' : 'bg-[#0A0A0A] border-white/5 text-white/40 hover:text-white'}`}
                          >
                            Profits ➜ Withdr.
                          </button>
                        </div>

                        <div className="relative">
                          <input
                            type="number"
                            required
                            min="1"
                            step="any"
                            value={swapForm.amount}
                            onChange={(e) => setSwapForm(p => ({ ...p, amount: e.target.value }))}
                            placeholder="Amount e.g. 50 ALC"
                            className="w-full px-3 py-2.5 text-xs rounded-none bg-[#0a0a0a] border border-white/10 focus:outline-none focus:border-blue-500 text-white font-mono font-semibold"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-3 bg-white hover:bg-blue-500 hover:text-white text-black text-[10px] font-mono font-black uppercase tracking-widest transition-colors cursor-pointer"
                        >
                          Execute Settlement Exchanger
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Transaction History Logs Panel */}
                  <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-lg">
                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                      <h4 className="text-[11px] font-black text-white font-mono hover:text-[#22C55E] uppercase tracking-widest block">Simulated ledger activity</h4>
                      <Clock className="w-4 h-4 text-white/30" />
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-white/60">
                        <thead>
                          <tr className="border-b border-white/10 text-[9px] text-white/40 font-mono font-black uppercase tracking-widest">
                            <th className="py-2.5">TIMESTAMP</th>
                            <th className="py-2.5">CATEGORY</th>
                            <th className="py-2.5">DESCRIPTION / LOG</th>
                            <th className="py-2.5 text-right">AMOUNT VALUE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono text-xs">
                          {transactions.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-6 text-center text-white/30">
                                No reward entries logged yet. Participate in ads or tasks to write to ledger.
                              </td>
                            </tr>
                          ) : (
                            transactions.slice(0, 5).map((tx) => (
                              <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-3 font-medium text-white/40">{tx.timestamp}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-0.5 text-[9px] font-black font-mono tracking-widest uppercase ${
                                    tx.category === 'rewards' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                    tx.category === 'profit' ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20' :
                                    'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                                  }`}>
                                    {tx.category.toUpperCase()}
                                  </span>
                                </td>
                                <td className="py-3 font-medium text-white/80">{tx.description}</td>
                                <td className={`py-3 text-right font-extrabold ${tx.type === 'credit' ? 'text-[#22C55E]' : 'text-rose-400'}`}>
                                  {tx.type === 'credit' ? '+' : '-'}{tx.amount.toFixed(2)} ALC
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab: Advertisements */}
              {currentTab === 'ads' && (
                <div id="tab_ads_panel" className="space-y-6 animate-fadeIn text-left">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Earn From Advertisements</h3>
                    <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest mt-1.5 block">Watch sponsored microadvertisements to instantly credit high-purity reward strings into your wallet.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {allAds.map((ad) => (
                      <div 
                        id={`dashboard_ad_card_${ad.id}`}
                        key={ad.id} 
                        className="bg-[#111111] border border-white/10 rounded-2xl p-5 hover:border-white/30 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono font-black text-blue-400 uppercase tracking-widest rounded-none">{ad.category}</span>
                            <h4 className="text-base font-black uppercase text-white mt-2.5 tracking-tight">{ad.title}</h4>
                            <p className="text-xs text-white/60 mt-1 leading-relaxed font-normal">{ad.description}</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-white/40 flex items-center shrink-0">
                            <Clock className="w-3.5 h-3.5 mr-1 text-blue-400" />
                            {ad.duration}s
                          </span>
                        </div>

                        <div className="border-t border-white/5 pt-4 mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-white/40 font-mono font-black uppercase tracking-wide">
                            BY {ad.company.toUpperCase()}
                          </span>
                          <button
                            id={`watch_ad_submit_trigger_${ad.id}`}
                            onClick={() => triggerWatchAd(ad)}
                            className="px-4 py-2.5 bg-white hover:bg-blue-500 hover:text-white text-black text-xs font-black font-mono tracking-widest uppercase transition-colors duration-150 flex items-center space-x-1 border border-transparent cursor-pointer"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Claim +{ad.reward} ALC</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Watch Ad Countdown Overlay Modal */}
                  <AnimatePresence>
                    {activeAdWatching && (
                      <motion.div 
                        id="ad_watching_modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#000000]/95 backdrop-blur-md flex items-center justify-center p-4"
                      >
                        <motion.div 
                          initial={{ scale: 0.95, y: 10 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.95, y: 10 }}
                          className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-10 max-w-lg w-full text-center relative shadow-2xl overflow-hidden font-sans"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-1000"
                              style={{ width: `${((activeAdWatching.duration - adTimer) / activeAdWatching.duration) * 100}%` }}
                            ></div>
                          </div>

                          <div className="text-[9px] font-mono font-black text-blue-400 uppercase tracking-widest block mt-4">Simulated Sponsored Broadcast</div>
                          
                          {/* Simulated Interactive Ad Content UI */}
                          <div className="my-8 py-8 px-6 bg-[#0A0A0A] border border-white/5 rounded-2xl flex flex-col items-center justify-center relative">
                            <div className="w-14 h-14 rounded-full bg-blue-500/10 p-0.5 shadow-lg mb-4 flex items-center justify-center border border-blue-500/20">
                              <span className="text-sm font-black font-mono text-blue-400">AL</span>
                            </div>
                            <h4 className="text-lg font-black uppercase tracking-tight text-white">{activeAdWatching.title}</h4>
                            <p className="text-xs text-white/60 mt-2 max-w-sm leading-relaxed font-normal">{activeAdWatching.description}</p>
                            <span className="text-[8px] text-white/30 font-mono tracking-widest block mt-4 uppercase font-bold">ADVERTISER DISPATCHED VIA ALTECH CORE</span>
                          </div>

                          <div className="flex flex-col items-center justify-center space-y-4">
                            {!adFinished ? (
                              <div className="flex items-center space-x-2 text-white/55 font-mono text-[10px] uppercase font-bold tracking-widest">
                                <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                                <span>Generating rewards in: <strong className="text-[#22C55E] text-base font-black ml-1 font-mono">{adTimer}s</strong></span>
                              </div>
                            ) : (
                              <div className="space-y-4 w-full">
                                <div className="text-[#22C55E] font-black font-mono text-xs uppercase tracking-widest flex items-center justify-center space-x-1.5">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Reward string complete!</span>
                                </div>
                                <button 
                                  id="claim_ad_rewards_btn"
                                  onClick={claimAdRewards}
                                  className="w-full py-4 bg-[#22C55E] hover:bg-white text-black text-xs font-black tracking-widest uppercase font-mono transition-colors border border-transparent cursor-pointer"
                                >
                                  Claim +{activeAdWatching.reward} ALC Now
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Tab: Tasks & Campaigns */}
              {currentTab === 'tasks' && (
                <div id="tab_tasks_panel" className="space-y-6 animate-fadeIn text-left">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Complete Sponsored Tasks</h3>
                    <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest mt-1.5 block">Participate in simple client surveys, test micro websites, or simulate installations to claim maximum residual tokens.</p>
                  </div>

                  <div className="space-y-4">
                    {tasks.map((tk) => (
                      <div 
                        id={`dashboard_task_card_${tk.id}`}
                        key={tk.id} 
                        className="p-5 bg-[#111111] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                      >
                        <div className="space-y-1.5 max-w-2xl text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 text-[9px] font-black font-mono tracking-wider bg-[#0a0a0a] border border-white/10 text-[#22C55E] uppercase rounded-none">
                              {tk.category === 'survey' ? '📋 Survey Campaign' :
                               tk.category === 'visit' ? '🌐 Web Testing Visit' :
                               tk.category === 'install' ? '📱 Mobile App Install' : '🤝 WhatsApp Promo'}
                            </span>
                            {tk.isCompleted && (
                              <span className="px-2 py-0.5 text-[9px] font-black font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase rounded-none">
                                Completed Check
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-black uppercase text-white mt-1">{tk.title}</h4>
                          <p className="text-xs text-white/60 leading-relaxed font-normal">{tk.description}</p>
                        </div>

                        <div className="shrink-0 flex items-center space-x-4">
                          <span className="font-mono font-black text-[#22C55E] text-base tracking-tight">
                            +{tk.reward} ALC
                          </span>
                          {!tk.isCompleted ? (
                            <>
                              {tk.category === 'survey' && (
                                <button 
                                  id={`task_action_${tk.id}`}
                                  onClick={() => {
                                    setActiveSurvey(tk);
                                    setSurveyAnswers({});
                                    setSurveyStep(0);
                                  }}
                                  className="px-4 py-2.5 text-xs font-black bg-white hover:bg-blue-500 hover:text-white text-black transition-colors font-mono uppercase tracking-widest cursor-pointer"
                                >
                                  Begin Survey
                                </button>
                              )}
                              {tk.category === 'visit' && (
                                <button 
                                  id={`task_action_${tk.id}`}
                                  onClick={() => startVisitTask(tk)}
                                  className="px-4 py-2.5 text-xs font-black bg-white hover:bg-blue-500 hover:text-white text-black transition-colors font-mono uppercase tracking-widest cursor-pointer"
                                >
                                  Load Website
                                </button>
                              )}
                              {tk.category === 'install' && (
                                <button 
                                  id={`task_action_${tk.id}`}
                                  onClick={() => startInstallTask(tk)}
                                  className="px-4 py-2.5 text-xs font-black bg-white hover:bg-blue-500 hover:text-white text-black transition-colors font-mono uppercase tracking-widest cursor-pointer"
                                >
                                  Install Utility
                                </button>
                              )}
                              {tk.category === 'share' && (
                                <button 
                                  id={`task_action_${tk.id}`}
                                  onClick={() => simulateWhatsAppShare(tk)}
                                  className="px-4 py-2.5 text-xs font-black bg-white hover:bg-blue-500 hover:text-white text-black transition-colors font-mono uppercase tracking-widest cursor-pointer"
                                >
                                  Dispatch Share
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="w-8 h-8 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] border border-[#22C55E]/20">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Multi-Step Survey Overlay Modal */}
                  <AnimatePresence>
                    {activeSurvey && (
                      <div className="fixed inset-0 z-50 bg-[#000000]/95 backdrop-blur-md flex items-center justify-center p-4">
                        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-10 max-w-lg w-full text-left relative shadow-2xl font-sans">
                          <button 
                            onClick={() => setActiveSurvey(null)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>

                          <span className="text-[9px] uppercase font-mono tracking-widest text-blue-400 block font-black mb-1">📋 Interactive Survey</span>
                          <h4 className="text-lg font-black uppercase tracking-tight text-white mb-6 border-b border-white/5 pb-2">{activeSurvey.title}</h4>

                          {activeSurvey.questions && activeSurvey.questions[surveyStep] && (
                            <div className="space-y-5">
                              <div className="flex justify-between text-[9px] text-white/40 font-mono uppercase tracking-wider">
                                <span>Question {surveyStep + 1} of {activeSurvey.questions.length}</span>
                                <span>{Math.round(((surveyStep) / activeSurvey.questions.length) * 100)}% Complete</span>
                              </div>

                              <h5 className="text-sm font-black uppercase tracking-tight text-white leading-snug">
                                {activeSurvey.questions[surveyStep].question}
                              </h5>

                              <div className="space-y-2">
                                {activeSurvey.questions[surveyStep].options.map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => {
                                      const qId = activeSurvey.questions![surveyStep].id;
                                      setSurveyAnswers(prev => ({ ...prev, [qId]: option }));
                                    }}
                                    className={`w-full p-3.5 text-xs text-left rounded-none border font-black uppercase tracking-wide font-mono transition-all ${
                                      surveyAnswers[activeSurvey.questions![surveyStep].id] === option
                                        ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                                        : 'bg-[#0A0A0A] border-white/5 text-white/50 hover:bg-white/5 hover:text-white'
                                    }`}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>

                              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <button
                                  disabled={surveyStep === 0}
                                  onClick={() => setSurveyStep(s => s - 1)}
                                  className="px-3.5 py-1.5 text-[10px] uppercase tracking-widest font-mono font-black text-white/40 disabled:opacity-30 disabled:pointer-events-none hover:text-white"
                                >
                                  Previous
                                </button>
                                
                                {surveyStep < activeSurvey.questions.length - 1 ? (
                                  <button
                                    disabled={!surveyAnswers[activeSurvey.questions[surveyStep].id]}
                                    onClick={() => setSurveyStep(s => s + 1)}
                                    className="px-5 py-2.5 bg-white text-black font-black text-[10px] tracking-widest uppercase font-mono disabled:opacity-40 disabled:pointer-events-none hover:bg-blue-500 hover:text-white"
                                  >
                                    Next Question
                                  </button>
                                ) : (
                                  <button
                                    disabled={!surveyAnswers[activeSurvey.questions[surveyStep].id]}
                                    onClick={submitSurvey}
                                    className="px-6 py-2.5 bg-[#22C55E] text-black font-black text-[10px] tracking-widest uppercase font-mono disabled:opacity-40 disabled:pointer-events-none hover:bg-white"
                                  >
                                    Submit Survey Claim
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Website Visitor Modal */}
                  <AnimatePresence>
                    {activeVisitTask && (
                      <div className="fixed inset-0 z-50 bg-[#000000]/95 backdrop-blur-md flex items-center justify-center p-4">
                        <div className="bg-[#111111] border border-white/10 rounded-none p-6 sm:p-10 max-w-xl w-full text-center relative shadow-2xl overflow-hidden font-sans">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${((6 - visitTimer) / 6) * 100}%` }}></div>
                          </div>

                          <span className="text-[9px] text-blue-400 font-mono font-black tracking-widest block uppercase mt-4">Simulated Portal Redirection Sandbox</span>
                          <h4 className="text-lg font-black uppercase tracking-tighter text-white mt-1.5 border-b border-white/5 pb-2">{activeVisitTask.title}</h4>

                          <div className="my-8 py-10 px-6 bg-[#0A0A0A] border border-white/5 rounded-xl flex flex-col items-center justify-center">
                            <span className="text-3xl animate-bounce">🌐</span>
                            <span className="text-xs font-black uppercase text-white tracking-widest block mt-3.5">Mock Site Content: ALTECH Innovation Lab Diagnostics</span>
                            <p className="text-[10px] text-white/50 max-w-md mt-2 font-mono leading-relaxed">
                              Loaded sub-domain address: https://labs.altech.digital/credentials/ledger-demo?node_id=alc_3000
                            </p>
                          </div>

                          <div className="flex items-center justify-center space-x-2 text-[10px] font-mono tracking-widest uppercase text-white/50">
                            <Clock className="w-4 h-4 text-[#22C55E] animate-spin" />
                            <span>Claim yields within: <strong className="text-white text-sm font-black ml-1 font-mono">{visitTimer}s</strong></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* App Install Progress Modal */}
                  <AnimatePresence>
                    {activeInstallTask && (
                      <div className="fixed inset-0 z-50 bg-[#000000]/95 backdrop-blur-md flex items-center justify-center p-4">
                        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-10 max-w-lg w-full text-center relative shadow-2xl font-sans">
                          <span className="text-[9px] font-mono tracking-widest text-blue-400 font-black block uppercase">Launcher PWA deployment</span>
                          <h4 className="text-lg font-black uppercase tracking-tighter text-white mt-1.5 mb-8 border-b border-white/5 pb-2">{activeInstallTask.title}</h4>

                          <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl flex flex-col items-center justify-center mb-6">
                            <Smartphone className="w-10 h-10 text-blue-400 animate-pulse mb-3" />
                            <span className="text-xs font-black uppercase tracking-wide text-white">Mock installer package compiling...</span>
                            
                            <div className="w-full bg-[#111111] border border-white/5 h-2 rounded-none mt-4 overflow-hidden relative">
                              <div className="h-full bg-blue-500 absolute left-0" style={{ width: `${installProgress}%` }}></div>
                            </div>
                            <span className="text-[10px] text-blue-400 font-mono font-black mt-2">{installProgress}%</span>
                          </div>

                          <div className="text-[10px] text-white/40 uppercase font-mono tracking-widest">
                            Downloading secure system environment assets on simulated device...
                          </div>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Tab: Predictions */}
              {currentTab === 'predictions' && (
                <div id="tab_predictions_panel" className="space-y-6 animate-fadeIn text-left animate-fadeIn">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">AL Coin Prediction Market</h3>
                    <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest mt-1.5 block">Predict UP or DOWN directional movement in real-time, customize targets, lock stakes, and multiply your balanced profit pools.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Live Chart Canvas col */}
                    <div className="lg:col-span-8 space-y-4">
                      <LiveChart 
                        currentPrice={chartPrice} 
                        onPriceUpdate={setChartPrice} 
                        entryPrice={prediction.isActive ? prediction.entryPrice : undefined}
                        isActivePrediction={prediction.isActive}
                      />
                    </div>

                    {/* Placing Bet controls board */}
                    <div className="lg:col-span-4 bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-lg space-y-5">
                      <h4 className="text-[11px] font-black text-white font-mono block border-b border-white/5 pb-2 uppercase tracking-widest">Prediction Desk</h4>
                      
                      {/* Insufficient funds notification */}
                      {wallet.rewardBalance < prediction.stakeAmount && wallet.profitBalance < prediction.stakeAmount && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-none text-rose-400 text-[10px] sm:text-xs leading-normal font-mono flex items-start space-x-1.5 uppercase font-black">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                          <span>STAKE ALERTS: Low balance for prediction stake. Complete ad watching to recharge your balance.</span>
                        </div>
                      )}

                      {!prediction.isActive ? (
                        <div className="space-y-4 font-mono">
                          {/* Presets */}
                          <div>
                            <label className="text-[9px] text-white/40 font-black uppercase tracking-widest block mb-1.5">Configure Bet Stake</label>
                            <div className="grid grid-cols-4 gap-1.5 text-xs text-white">
                              {[10, 20, 50, 100].map((amt) => (
                                <button
                                  type="button"
                                  key={amt}
                                  onClick={() => setPrediction(prev => ({ ...prev, stakeAmount: amt }))}
                                  className={`py-2 rounded-none border text-center font-black transition-all ${prediction.stakeAmount === amt ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-[#0A0A0A] border-white/10 hover:border-white/30 text-white/40'}`}
                                >
                                  {amt} ALC
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Profit percentage target */}
                          <div>
                            <label className="text-[9px] text-white/40 font-black uppercase tracking-widest block mb-1.5">Profit Percentage target</label>
                            <div className="grid grid-cols-2 gap-1.5 text-xs text-white">
                              {[65, 80].map((pct) => (
                                <button
                                  type="button"
                                  key={pct}
                                  onClick={() => setPrediction(prev => ({ ...prev, profitPercentage: pct }))}
                                  className={`py-2 rounded-none border text-center font-black transition-all ${prediction.profitPercentage === pct ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-[#0A0A0A] border-white/10 hover:border-white/30 text-white/40'}`}
                                >
                                  {pct}% Profit
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-white/5 pt-3.5 space-y-3">
                            <button
                              id="predict_up_btn"
                              onClick={() => handlePlacePrediction('UP')}
                              className="w-full py-3.5 bg-[#22C55E] hover:bg-white text-black font-black text-xs tracking-widest uppercase transition-colors flex items-center justify-center space-x-1.5 rounded-none cursor-pointer"
                            >
                              <span>Predict UP 🟢</span>
                            </button>
                            <button
                              id="predict_down_btn"
                              onClick={() => handlePlacePrediction('DOWN')}
                              className="w-full py-3.5 bg-rose-500 hover:bg-white text-black font-black text-xs tracking-widest uppercase transition-colors flex items-center justify-center space-x-1.5 rounded-none cursor-pointer"
                            >
                              <span>Predict DOWN 🔴</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-[#0A0A0A] border border-white/10 rounded-none text-center space-y-4 font-mono">
                          <div className="w-12 h-12 rounded-full border border-orange-500/20 bg-orange-500/5 flex items-center justify-center text-orange-400 mx-auto animate-spin">
                            <Clock className="w-5 h-5" />
                          </div>
                          
                          <div>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest block font-black">Prediction Locked</span>
                            <span className="text-xs font-black text-white uppercase block mt-1.5">
                              Index Goal: <span className={prediction.direction === 'UP' ? 'text-[#22C55E]' : 'text-rose-400'}>{prediction.direction}</span>
                            </span>
                            <span className="text-[10px] text-white/50 block mt-1.5">
                              Entry index: ${prediction.entryPrice.toFixed(4)}
                            </span>
                          </div>

                          <div className="pt-2 border-t border-white/5 text-[10px] uppercase font-black tracking-widest">
                            <span>Resolving in: <strong className="text-orange-400 text-sm ml-1 font-mono">{prediction.remainingSeconds}s</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Referrals */}
              {currentTab === 'referrals' && (
                <div id="tab_referrals_panel" className="space-y-6 animate-fadeIn text-left animate-fadeIn">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Referral Program</h3>
                    <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest mt-1.5 block">Multiply your earnings through invitation residuals. Review tracking statistics instantly from this interface.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 bg-[#111111] border border-white/10 rounded-2xl text-left">
                      <span className="text-[9px] text-white/45 uppercase font-mono tracking-widest font-black block">Total Invited Friends</span>
                      <span className="text-2xl font-black font-mono text-white block mt-2">{referrals.length} Invitees</span>
                    </div>
                    <div className="p-5 bg-[#111111] border border-white/10 rounded-2xl text-left">
                      <span className="text-[9px] text-white/45 uppercase font-mono tracking-widest font-black block">Accumulated Referral Earnings</span>
                      <span className="text-2xl font-black font-mono text-[#22C55E] block mt-2">
                        {referrals.reduce((sum, r) => sum + r.earningsGenerated, 0)} ALC
                      </span>
                    </div>
                    <div className="p-5 bg-[#111111] border border-white/10 rounded-2xl text-left">
                      <span className="text-[9px] text-white/45 uppercase font-mono tracking-widest font-black block">Estimated Network Conversion</span>
                      <span className="text-2xl font-black font-mono text-blue-400 block mt-2">100.00%</span>
                    </div>
                  </div>

                  {/* Copy link actions widget */}
                  <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8 text-left">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-2 font-mono">Personal Promotion link code</h4>
                    <p className="text-xs text-white/60 leading-relaxed mb-4 font-normal">
                      When colleagues register using your personal sandbox url strings, you receive +25 ALC instantly into your reward ledger.
                    </p>

                    <div className="flex items-center space-x-2">
                      <div className="flex-1 px-4 py-3 bg-[#0A0A0A] border border-white/10 text-xs font-mono text-white/70 select-all font-semibold overflow-x-auto whitespace-nowrap">
                        https://alcoin.altech.com/join?ref=pilot_{signupForm.email.split('@')[0]}
                      </div>
                      <button
                        id="copy_referral_link_btn"
                        onClick={copyReferralLink}
                        className={`px-5 py-3 rounded-none font-mono text-xs font-black tracking-widest uppercase transition-all flex items-center space-x-1.5 cursor-pointer ${copiedLink ? 'bg-[#22C55E] text-black' : 'bg-white text-black hover:bg-blue-500 hover:text-white'}`}
                      >
                        {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedLink ? 'Copied Link' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Run safe demonstration to test automated network payouts:</span>
                      
                      <button
                        id="simulate_mock_referral_btn"
                        onClick={simulateFriendReferral}
                        className="px-4 py-2.5 text-xs font-black text-black bg-white hover:bg-blue-500 hover:text-white transition-colors uppercase tracking-widest rounded-none cursor-pointer"
                      >
                        Simulate Mock Invite Registration (+25 ALC)
                      </button>
                    </div>
                  </div>

                  {/* Referred Connections Ledger List */}
                  <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-lg animate-fadeIn">
                    <h4 className="text-[11px] font-black text-white mb-4 block font-mono border-b border-white/5 pb-2 uppercase tracking-widest">Tracked Network Ledger</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-white/60">
                        <thead>
                          <tr className="border-b border-white/10 text-[9px] text-white/45 font-mono font-black uppercase tracking-widest">
                            <th className="py-2.5">FRIEND IDENTIFIER</th>
                            <th className="py-2.5">JOIN DATE</th>
                            <th className="py-2.5">SIMULATED STATUS</th>
                            <th className="py-2.5 text-right">GENERATED YIELD</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono text-xs">
                          {referrals.map((ref) => (
                            <tr id={`ref_row_${ref.id}`} key={ref.id} className="hover:bg-[#0a0a0a] transition-colors">
                              <td className="py-3.5 font-bold text-white uppercase tracking-tight">{ref.name}</td>
                              <td className="py-3.5 text-white/50">{ref.joinedDate}</td>
                              <td className="py-3.5">
                                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-[#0A0A0A] border border-white/5 text-blue-400">
                                  {ref.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-3.5 text-right font-black text-[#22C55E]">+{ref.earningsGenerated.toFixed(2)} ALC</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Wallet & Pay */}
              {currentTab === 'wallet' && (
                <div id="tab_wallet_panel" className="space-y-6 animate-fadeIn text-left animate-fadeIn">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Secure Wallet Panel</h3>
                    <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest mt-1.5 block">Review ledger distribution strings, exchange metrics, and request settlement withdrawal payouts.</p>
                  </div>

                  {/* 3 Categories block */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 bg-[#111111] border border-white/10 rounded-2xl text-left relative">
                      <span className="text-[9px] font-black font-mono tracking-widest text-white/45 block uppercase mb-1.5">Reward Balance string</span>
                      <span className="text-2xl font-black font-mono text-blue-400 block">{wallet.rewardBalance.toFixed(2)} ALC</span>
                      <p className="text-[10px] text-white/50 mt-2 font-mono uppercase tracking-wider font-bold">Accumulated from watches and surveys</p>
                    </div>

                    <div className="p-5 bg-[#111111] border border-white/10 rounded-2xl text-left relative">
                      <span className="text-[9px] font-black font-mono tracking-widest text-white/45 block uppercase mb-1.5">Profit balance string</span>
                      <span className="text-2xl font-black font-mono text-[#22C55E] block">{wallet.profitBalance.toFixed(2)} ALC</span>
                      <p className="text-[10px] text-white/50 mt-2 font-mono uppercase tracking-wider font-bold">Accumulated from market predictors</p>
                    </div>

                    <div className="p-5 bg-[#111111] border border-white/10 rounded-2xl text-left relative">
                      <span className="text-[9px] font-black font-mono tracking-widest text-white/45 block uppercase mb-1.5">Withdrawable export ledger</span>
                      <span className="text-2xl font-black font-mono text-pink-500 block">{wallet.withdrawableBalance.toFixed(2)} ALC</span>
                      <p className="text-[10px] text-white/50 mt-2 font-mono uppercase tracking-wider font-bold">Allocated for payout withdrawals</p>
                    </div>
                  </div>

                  {/* Main Transfer Exchange Utilities split grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 font-sans">
                    
                    {/* Exchangers widget */}
                    <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-lg">
                      <h4 className="text-[11px] font-black text-white mb-3 font-mono border-b border-white/5 pb-2 uppercase tracking-widest">Exchange ledger settlement</h4>
                      <p className="text-xs text-white/60 leading-relaxed mb-4 font-normal">
                        To withdraw balance assets, convert Rewards or Profits to the exportable Withdrawable ledger category first.
                      </p>

                      <form onSubmit={handleSwapTokens} className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono uppercase tracking-wider">
                          <button
                            type="button"
                            onClick={() => setSwapForm(prev => ({ ...prev, from: 'reward' }))}
                            className={`p-2.5 rounded-none border text-center font-black transition-all ${swapForm.from === 'reward' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-extrabold' : 'bg-[#0A0A0A] border-white/5 text-white/40'}`}
                          >
                            Rewards Exch.
                          </button>
                          <button
                            type="button"
                            onClick={() => setSwapForm(prev => ({ ...prev, from: 'profit' }))}
                            className={`p-2.5 rounded-none border text-center font-black transition-all ${swapForm.from === 'profit' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-extrabold' : 'bg-[#0A0A0A] border-white/5 text-white/40'}`}
                          >
                            Profits Exch.
                          </button>
                        </div>

                        <div>
                          <label className="text-[9px] text-white/45 uppercase tracking-widest font-mono font-black block mb-1">Swap target amount</label>
                          <input 
                            type="number" 
                            required
                            min="1.0"
                            step="any"
                            value={swapForm.amount}
                            onChange={(e) => setSwapForm(p => ({ ...p, amount: e.target.value }))}
                            placeholder="e.g. 50"
                            className="w-full px-3.5 py-2.5 text-xs rounded-none bg-[#0A0A0A] border border-white/10 focus:outline-none focus:border-indigo-500 text-white font-semibold font-mono"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-white text-black hover:bg-indigo-500 hover:text-white text-xs font-mono font-black tracking-widest uppercase transition-colors rounded-none cursor-pointer"
                        >
                          Execute Settlement Swap (1:1 Rate)
                        </button>
                      </form>
                    </div>

                    {/* Withdrawal Request Forms parameters */}
                    <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-lg">
                      <h4 className="text-[11px] font-black text-white mb-3 font-mono border-b border-white/5 pb-2 uppercase tracking-widest">Request payout withdrawal</h4>
                      
                      <form onSubmit={handleWithdrawalRequest} className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-white/45 uppercase tracking-widest font-black font-mono block mb-1">Payout Channel</label>
                            <select 
                              value={withdrawForm.method}
                              onChange={(e) => setWithdrawForm(p => ({ ...p, method: e.target.value }))}
                              className="w-full px-2.5 py-2.5 text-xs rounded-none bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-emerald-500 font-bold uppercase tracking-wide font-mono"
                            >
                              <option>WhatsApp Transfer</option>
                              <option>MTN Mobile Money</option>
                              <option>Airtel Mobile Money</option>
                              <option>Bank Transfer Direct</option>
                              <option>Crypto USDT TRC20</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] text-white/45 uppercase tracking-widest font-black font-mono block mb-1">Payout Amount</label>
                            <input 
                              type="number" 
                              required
                              min="1"
                              step="any"
                              value={withdrawForm.amount}
                              onChange={(e) => setWithdrawForm(p => ({ ...p, amount: e.target.value }))}
                              placeholder="e.g. 150"
                              className="w-full px-3 py-2.5 text-xs rounded-none bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-emerald-500 font-mono font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] text-white/45 uppercase tracking-widest font-black font-mono block mb-1">Destination Address Coordinates</label>
                          <input 
                            type="text" 
                            required
                            value={withdrawForm.destination}
                            onChange={(e) => setWithdrawForm(p => ({ ...p, destination: e.target.value }))}
                            placeholder="e.g. Phone number, Bank account, or TRX wallet"
                            className="w-full px-3.5 py-2.5 text-xs rounded-none bg-[#0A0A0A] border border-white/10 text-white focus:outline-none focus:border-emerald-500 font-mono font-semibold"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-[#22C55E] hover:bg-white text-black text-xs font-mono font-black tracking-widest uppercase transition-colors rounded-none cursor-pointer"
                        >
                          Submit Withdrawal to Blockchain Node
                        </button>
                      </form>
                    </div>

                  </div>

                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Slide Out Simulated Notifications Center */}
      <AnimatePresence>
        {showNotificationCenter && (
          <div className="fixed inset-0 z-50 bg-[#000000]/70 backdrop-blur-sm flex justify-end" onClick={() => setShowNotificationCenter(false)}>
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#111111] border-l border-white/10 h-full p-6 flex flex-col justify-between shadow-2xl font-sans"
            >
              <div>
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/5">
                  <span className="text-xs font-black uppercase tracking-widest text-white font-mono flex items-center">
                    <Bell className="w-4 h-4 mr-2 text-blue-400" />
                    <span>Notification Center</span>
                  </span>
                  <button onClick={() => setShowNotificationCenter(false)} className="text-white/40 hover:text-white pb-0.5 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center text-xs text-white/30 font-mono uppercase tracking-widest py-12">
                      No system notifications generated yet.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="p-3.5 bg-[#0a0a0a] border border-white/5 rounded-none relative text-left">
                        <div className="flex justify-between items-start mb-1.5 font-mono">
                          <span className="text-xs font-black uppercase tracking-tight text-white block">
                            {notif.title}
                          </span>
                          <span className="text-[8px] text-white/40 block">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-white/60 leading-relaxed font-normal">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="text-[9px] text-white/30 text-center font-mono pt-4 border-t border-white/5 uppercase tracking-wider">
                Logged securely using ALTECH core telemetry telemetry.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
