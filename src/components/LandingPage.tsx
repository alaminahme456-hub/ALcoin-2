import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PiggyBank, 
  ArrowRight, 
  Monitor, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Coins, 
  Award, 
  HelpCircle, 
  PhoneCall, 
  Layers, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  VolumeX, 
  CheckCircle2, 
  Compass, 
  Activity, 
  TrendingUp, 
  Check,
  SmartphoneIcon,
  LaptopIcon,
  TabletIcon
} from 'lucide-react';

interface LandingPageProps {
  onEnterPortal: () => void;
}

export default function LandingPage({ onEnterPortal }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const steps = [
    {
      num: '01',
      title: 'Create an Account',
      desc: 'Sign up using your email and password to create your secure ALCOIN account dashboard.',
    },
    {
      num: '02',
      title: 'Activate Your Account',
      desc: 'Activate your account to safely unlock all earning features, referral metrics, and predictions.',
    },
    {
      num: '03',
      title: 'Start Earning',
      desc: 'Access multiple direct streams: watching ads, sponsored tasks, special promotions, and prediction multipliers.',
    },
    {
      num: '04',
      title: 'Grow Your Earnings',
      desc: 'Build your balance daily through high-loyalty platform engagement, consistency multipliers, and activity streaks.',
    },
    {
      num: '05',
      title: 'Request Withdrawals',
      desc: 'Manage your earnings and request secure instant withdrawals directly to your preferred payout method from your wallet.',
    },
  ];

  const features = [
    {
      icon: <Coins className="w-6 h-6 text-emerald-400" />,
      title: 'Earn From Advertisements',
      desc: 'Watch high-paying sponsored video or banner advertisements and earn reward credits instantly into your integrated wallet.',
    },
    {
      icon: <Layers className="w-6 h-6 text-teal-400" />,
      title: 'Complete Sponsored Tasks',
      desc: 'Participate in simple activities such as micro-surveys, quick website testing visits, App installs, and structured viral promotional campaigns.',
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      title: 'Referral Program',
      desc: 'Build a secondary residual income. Share your personalized invitation link, view complete tracking logs, and generate referral earnings.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-orange-400" />,
      title: 'AL Coin Prediction Market',
      desc: 'Predict UP or DOWN trends in real-time, customize your target profit multiplier percentages, lock stakes, and earn on successful predictions.',
    },
    {
      icon: <PiggyBank className="w-6 h-6 text-pink-400" />,
      title: 'Secure Wallet Management',
      desc: 'Control separate Reward, Profit and Withdrawable balances. Review transaction ledger strings complete with full request approvals.',
    },
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: 'Real-Time Notifications',
      desc: 'Stay informed with instant alerts regarding direct account updates, system announcements, profit trends, and withdrawal releases.',
    },
  ];

  const faqs = [
    {
      q: 'What is ALCOIN?',
      a: 'ALCOIN is a modern, digital rewards and opportunity ecosystem powered by ALTECH. It is built to empower individuals to translate spare cycles of screen time into persistent earnings.'
    },
    {
      q: 'How do I start?',
      a: 'Getting started is straightforward. Create a secure account inside the App Portal, click the "Activate" sequence to deploy your earning pipeline, and immediately begin completing tasks, watching advertisements, or setting up coin prediction stakes.'
    },
    {
      q: 'How can I earn?',
      a: 'You can earn through multiple avenues tailored to your preference: interactive sponsored media advertisements, target surveys, simple digital installs, sharing referral campaigns, and predicting live trend movements in the AL Coin prediction market.'
    },
    {
      q: 'Can I use ALCOIN on my phone?',
      a: 'Absolutely! ALCOIN has been built cross-device from day one. It is highly optimized with custom CSS layout grids that responsive-fit Android, iPhone, tablets, and desktops alike.'
    },
    {
      q: 'Is ALCOIN secure?',
      a: 'Yes, platform security and absolute integrity of earnings are top priorities. ALCOIN leverages ALTECH modern encryption frameworks to preserve account data, transaction integrity and prevent unauthorized activity.'
    },
    {
      q: 'Who owns ALCOIN?',
      a: 'ALCOIN is wholly owned, developed, and systematically operated under the technical backing of ALTECH, a leading digital solutions enterprise.'
    }
  ];

  const coreValues = [
    {
      title: 'Transparency',
      desc: 'We operate with visible logs, honest reward distributions, and a transparent system audit trail.',
      color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
    },
    {
      title: 'Innovation',
      desc: 'Continuously refining modern opportunities to expand digital earning horizons through technology.',
      color: 'border-teal-500/20 bg-teal-500/5 text-teal-400'
    },
    {
      title: 'Security',
      desc: 'Adopting highly secure digital protocols to ensure player metrics and balances remain locked.',
      color: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400'
    },
    {
      title: 'Growth',
      desc: 'Devoted to helping our interactive users scale their residual earnings and succeed continuously.',
      color: 'border-amber-500/20 bg-amber-500/5 text-amber-400'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-blue-500 selection:text-black overflow-x-hidden border-[8px] md:border-[12px] border-[#1A1A1A] box-border">
      
      {/* Header Banner - Coming Soon / Turn Your Spare Time Into Real Earnings */}
      <div className="w-full bg-[#1A1A1A] text-center py-2.5 px-4 text-xs tracking-widest uppercase font-extrabold text-blue-400 border-b border-white/5 flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
        <span>Coming Soon: ALCOIN – Turn Your Spare Time Into Real Earnings</span>
        <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
      </div>

      {/* Primary Navigation Glassmorphism */}
      <nav id="landing_nav" className="sticky top-0 z-40 bg-[#0A0A0A] border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <span className="text-2xl font-black tracking-tighter text-white block">ALCOIN<span className="text-blue-500">.</span></span>
              <span className="text-[8px] font-mono tracking-[0.25em] text-white/40 block uppercase -mt-0.5 font-bold">POWERED BY ALTECH</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-widest font-extrabold text-white/60">
            <a href="#how-it-works" className="hover:text-blue-500 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-500 transition-colors">About Us</a>
            <a href="#why-choose" className="hover:text-blue-500 transition-colors">Why Choose</a>
            <a href="#faqs" className="hover:text-blue-500 transition-colors">FAQs</a>
            <a href="#contact" className="hover:text-blue-500 transition-colors">Support</a>
          </div>

          <div>
            <button
              id="nav_engage_portal_btn"
              onClick={onEnterPortal}
              className="bg-white text-black hover:bg-blue-500 hover:text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95"
            >
              Launch App Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-28 overflow-hidden">
        {/* Decorative Grid and Lights - clean subtle contrast */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A1A1A_1px,transparent_1px),linear-gradient(to_bottom,#1A1A1A_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)]"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[650px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-[10px] sm:text-xs font-black uppercase tracking-widest text-blue-400 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Digital Earning Ecosystem for Everyone</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-[100px] font-black uppercase tracking-tighter mb-6 leading-[0.85] max-w-5xl mx-auto"
          >
            SPARE TIME <br />
            <span className="text-blue-500 font-black uppercase">REAL EARNINGS</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-tight font-medium"
          >
            Welcome to <strong className="text-white">ALCOIN</strong>, a digital rewards platform powered by <strong className="text-white">ALTECH</strong>. Engage, complete tasks, and grow your digital wallet effortlessly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20"
          >
            <button
              id="hero_get_started_btn"
              onClick={onEnterPortal}
              className="w-full sm:w-auto bg-white text-black hover:bg-blue-500 hover:text-white px-8 py-4 font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 text-center"
            >
              Get Started Now
            </button>
            <a
              id="hero_how_it_works_btn"
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/5 border border-white/20 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 text-center"
            >
              Learn How It Works
            </a>
          </motion.div>

          {/* Clean Bento Layout Display Mock */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-[#111111] p-6 sm:p-8 shadow-2xl relative"
          >
            <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-blue-500/80"></span>
                <span className="text-xs text-white/40 font-mono pl-2">CONSOLE://ALCOIN_DEMO_PREVIEW</span>
              </div>
              <div className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/25 text-[10px] text-blue-400 font-mono uppercase font-black tracking-widest">
                SYSTEM STATE: ACTIVE
              </div>
            </div>

            {/* Simulated Desktop Preview Cards - aligned to theme */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              
              <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl shadow-xl transform md:rotate-1 hover:rotate-0 transition-transform duration-300 flex flex-col justify-between min-h-[200px]">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 font-mono">Wallet Preview</div>
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                  <div className="text-3xl font-black tracking-tighter text-white mb-1">1,845.00 ALC</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Available Balance</div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <div className="text-[9px] uppercase opacity-50 font-mono">Tasks</div>
                    <div className="font-bold text-white text-xs">$84.20</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg">
                    <div className="text-[9px] uppercase opacity-50 font-mono">Referral</div>
                    <div className="font-bold text-white text-xs">$112.10</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl shadow-xl transform md:-rotate-1 hover:rotate-0 transition-transform duration-300 flex flex-col justify-between min-h-[200px]">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] font-mono">Prediction Market</div>
                    <div className="text-[9px] px-2 py-0.5 bg-[#22C55E]/10 text-[#22C55E] rounded font-mono font-bold uppercase">LIVE</div>
                  </div>
                  <div className="flex gap-2.5 items-center mb-4">
                    <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-xs font-black font-mono">AL</div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-tight">AL Directional</div>
                      <div className="text-[9px] opacity-40 font-mono">Closes in 04:22s</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/20 py-2 rounded-xl font-black text-[10px] uppercase font-mono tracking-wider transition-colors">Up</button>
                  <button className="bg-red-500/10 hover:bg-red-500/20 text-red-450 border border-red-500/20 py-2 rounded-xl font-black text-[10px] uppercase font-mono tracking-wider transition-colors">Down</button>
                </div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl shadow-xl transform md:rotate-2 hover:rotate-0 transition-transform duration-300 flex flex-col justify-between min-h-[200px]">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-purple-400 font-mono">Task Pipeline</div>
                    <div className="text-[9px] text-[#22C55E] font-mono font-bold uppercase">4 ACTIVE</div>
                  </div>
                  <p className="text-xs font-semibold text-white/80 leading-snug">ALTECH Consumer Survey Campaign & Media tasks</p>
                </div>
                <div className="border-t border-white/5 pt-3 mt-4 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-white/40">Potential return:</span>
                  <span className="text-blue-400 font-black">+220 ALC</span>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-4 flex justify-center border-t border-white/10">
              <button 
                id="interactive_demo_btn_inside_mock"
                onClick={onEnterPortal}
                className="bg-white hover:bg-blue-500 hover:text-white text-black text-xs font-black uppercase tracking-wider py-2.5 px-6 transition-all active:scale-95 flex items-center space-x-2"
              >
                <span>Launch Interactive Earning Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 border-t border-white/10 relative bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black text-blue-500 uppercase tracking-widest font-mono">Direct 5-Step Pipeline</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white mt-1">How It Works</h2>
            <p className="text-white/60 mt-4 leading-normal font-medium">
              Step into the ALCOIN digital reward experience with these simple procedures. Follow our onboarding framework to secure and scale rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {/* Connecting lines for step pipeline on desktop */}
            <div className="hidden md:block absolute top-[4.5rem] left-8 right-8 h-[2px] bg-white/10 z-0"></div>

            {steps.map((st, i) => (
              <div 
                id={`how_it_works_step_${i + 1}`}
                key={st.num}
                className="relative bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group z-10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-3xl font-black font-mono text-blue-500">{st.num}</span>
                    <span className="px-2 py-0.5 text-[9px] font-bold text-white/50 uppercase tracking-widest bg-[#0A0A0A] rounded font-mono border border-white/5">Step</span>
                  </div>
                  <h3 className="text-sm font-black uppercase text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors">{st.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-normal">{st.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="mt-4 md:hidden flex justify-center">
                    <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest font-mono">▼ Next Stage</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              id="steps_portal_launch_btn"
              onClick={onEnterPortal}
              className="bg-white text-black hover:bg-blue-500 hover:text-white border border-transparent font-black text-xs uppercase tracking-wider py-3.5 px-8 transition-all duration-200 active:scale-95 inline-flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Simulate Onboarding Journey Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#0A0A0A] border-t border-white/10 relative">
        <div className="absolute top-1/2 left-0 right-0 h-96 bg-blue-500/5 pointer-events-none blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black text-blue-500 uppercase tracking-widest font-mono">Unmatched Rewards Capabilities</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white mt-1">Core Features</h2>
            <p className="text-white/60 mt-4 leading-normal font-medium">
              Explore the rich landscape of digital reward mechanism features curated diligently under the ALTECH technologies umbrella.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div 
                id={`feature_card_${idx}`}
                key={idx}
                className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-[#151515] transition-all duration-300 shadow-md group relative overflow-hidden"
              >
                <div className="p-3 bg-[#0A0A0A] rounded-xl inline-block mb-4 shadow border border-white/5">
                  {feat.icon}
                </div>
                <h3 className="text-base font-black uppercase text-white mb-2.5 tracking-tight group-hover:text-blue-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Device Mockups Responsive Prompt */}
          <div className="mt-16 bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-left">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-mono font-black tracking-widest uppercase inline-flex mb-4">
                <Smartphone className="w-3.5 h-3.5" />
                <span>MOBILE-FRIENDLY & RESPONSIVE READY</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Complete Mobile Experience</h3>
              <p className="text-xs text-white/60 mt-3 leading-relaxed">
                Enjoy a sleek operational experience on Android, iPhone, tablet, and desktops alike. Install ALCOIN directly on your dynamic workspace screen as a super fast Web Progressive launcher shortcut.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-6 text-[10px] uppercase font-black text-white/50 font-mono">
                <span className="flex items-center space-x-1.5 bg-[#0A0A0A] px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Android Supported</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-[#0A0A0A] px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                  <span>iPhone Optimized</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-[#0A0A0A] px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>Tablet Scaled</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-[#0A0A0A] px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                  <span>Desktop Native</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-[#0A0A0A] border border-white/10 rounded-xl text-center min-w-[240px]">
              <div className="w-12 h-12 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400 mb-3 animate-pulse">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <span className="text-[9px] text-[#22C55E] block uppercase tracking-widest font-black font-mono">PROMPT STATUS</span>
              <span className="text-xs text-white font-bold block mt-1 uppercase">Ready for Device Install</span>
              <button 
                id="landing_mock_install_button"
                onClick={onEnterPortal}
                className="mt-4 w-full bg-white text-black hover:bg-blue-500 hover:text-white py-2.5 px-4 font-black text-[10px] uppercase tracking-wider transition-all"
              >
                Launch & Install
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 border-t border-white/10 bg-[#0E0E0E] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-left">
              <span className="text-xs font-black text-blue-500 uppercase tracking-widest font-mono">Ecosystem Credentials</span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white mt-1 leading-[0.9]">About ALCOIN</h2>
              <span className="text-[10px] text-white/40 font-mono tracking-widest font-bold uppercase mt-1 block">POWERED BY ALTECH</span>
              
              <div className="mt-6 space-y-4 text-white/70 text-sm leading-relaxed">
                <p>
                  ALCOIN is a modern digital rewards ecosystem created specifically to assist active individuals in transforming screen cycles and spare cycles into credible earning opportunities.
                </p>
                <p>
                  The solution blends sponsored advertisement engagement pipelines, micro-sponsored survey campaigns, recursive user refer-a-friend trackers, and trend predictive channels into a secure sandbox architecture.
                </p>
                <p>
                  Our comprehensive ambition is to host an digital micro-economy where global audience participants can benefit securely from daily online engagement while commercial business audiences associate cleanly with verified physical people.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="p-5 bg-[#111111] rounded-2xl border border-white/10">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#22C55E] block font-black">Our Vision</span>
                  <p className="text-xs text-white/60 mt-2 leading-relaxed font-normal">
                    To scale as Africa's most prominent and highly reliable digital rewards engagement and transparency directory for online screen cycles.
                  </p>
                </div>
                <div className="p-5 bg-[#111111] rounded-2xl border border-white/10">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-blue-500 block font-black">Our Mission</span>
                  <p className="text-xs text-white/60 mt-2 leading-relaxed font-normal">
                    To deliver transparent, technology-enabled, secure micro-earning services, fostering accessibility, and financial inclusion worldwide.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Core Values */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8 relative">
              <h3 className="text-lg font-black uppercase text-white mb-6 text-left tracking-tight">Our Core Values</h3>
              <div className="space-y-4 text-left">
                {coreValues.map((val, idx) => (
                  <div key={idx} className="p-4 bg-[#0A0A0A] rounded-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                    <h4 className="font-black uppercase text-white hover:text-blue-400 transition-colors text-sm block tracking-wider">{val.title}</h4>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed font-normal">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="why-choose" className="py-24 border-t border-white/10 bg-[#0A0A0A] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono">Ecosystem Merits</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white mt-2">Why Choose ALCOIN</h2>
            <p className="text-white/60 mt-4 leading-normal font-medium">
              Discover what differentiates this platform as the preferred rewards destination powered securely under long-term development parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { title: 'Easy To Use', text: 'An incredibly streamlined, humble, clean interface built specifically so anyone can utilize it instantly.' },
              { title: 'Multiple Streams', text: 'Offers more than one method to earn. Swap between ads, prediction models, installs, and referral multipliers.' },
              { title: 'Secure Environment', text: 'Built utilizing secure application standards, tracking balances with cryptographic safety.' },
              { title: 'Community Driven', text: 'A constantly developing collaborative ecosystem supported heavily by real interactive user pools.' },
              { title: 'Powered By ALTECH', text: 'Rigorously supported by veteran developers, transparent algorithms, and future stability roadmaps.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#111111] border border-white/10 rounded-2xl p-5 hover:border-blue-500/50 hover:bg-[#151515] transition-all flex flex-col justify-between text-left">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-mono font-black mb-3 border border-blue-500/20">
                    {idx + 1}
                  </div>
                  <h3 className="text-xs font-black uppercase text-white mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-normal">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-24 border-t border-white/10 bg-[#0E0E0E] relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-black text-[#22C55E] uppercase tracking-widest font-mono">Answers to Common Inquiries</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  id={`faq_block_${idx}`}
                  key={idx} 
                  className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 flex items-center justify-between text-white font-black uppercase text-xs sm:text-sm tracking-wide focus:outline-none"
                  >
                    <div className="flex items-center space-x-3 pr-4">
                      <HelpCircle className="w-5 h-5 text-blue-500 shrink-0" />
                      <span>{faq.q}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-blue-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-blue-500 shrink-0" />}
                  </button>

                  <div 
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? 'max-h-60 border-t border-white/5 p-5 bg-[#0A0A0A]/50' : 'max-h-0'
                    }`}
                  >
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 p-5 rounded-2xl bg-[#111111] border border-white/10 text-center text-xs text-white/40">
            <span>Have an inquiry that isn't answered here? Please scroll to our support parameters below.</span>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-24 border-t border-white/10 bg-[#0A0A0A] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 sm:p-12 relative shadow-2xl">
            <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-blue-500 text-black text-[10px] font-black uppercase tracking-widest font-mono">
              Direct Contact
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="text-left">
                <span className="text-xs font-black text-blue-500 uppercase tracking-widest font-mono">Support Parameters</span>
                <h3 className="text-2xl sm:text-4xl font-black uppercase text-white mt-1 leading-tight tracking-tight">Contact Us</h3>
                <p className="text-xs text-white/60 mt-3 leading-relaxed">
                  Need any systematic assistance, encountered an issue with your simulation activation, or have inquiries regarding payouts? Our customer success desk is ready to support you.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3.5 p-4 bg-[#0A0A0A] border border-white/10 rounded-2xl text-blue-400 hover:border-blue-500/20 transition-all">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                      <PhoneCall className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 font-bold block uppercase tracking-widest font-mono">WhatsApp Support Desk</span>
                      <a href="https://wa.me/2349044084763" target="_blank" rel="noopener noreferrer" className="text-sm font-black text-white hover:text-blue-400 transition-colors block">
                        +234 904 408 4763
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Simulated Message Form */}
              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 sm:p-6">
                <h4 className="text-[10px] font-black text-white mb-4 block uppercase tracking-widest font-mono border-b border-white/10 pb-2">Send Instant Memo</h4>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Mock Memo dispatched! Message sent successfully to ALTECH support desk.");
                  }}
                  className="space-y-3 text-left"
                >
                  <div>
                    <label className="text-[9px] text-white/40 font-black uppercase tracking-widest font-mono block mb-1">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg bg-[#111111] border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-white/40 font-black uppercase tracking-widest font-mono block mb-1">Message Memo</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="How can ALTECH support you today?"
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg bg-[#111111] border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-white text-black hover:bg-blue-500 hover:text-white text-xs font-black font-mono transition-all uppercase tracking-wider"
                  >
                    Dispatch Memo
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="landing_footer" className="w-full bg-[#0A0A0A] border-t border-white/10 py-16 text-xs font-mono text-white/40 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-base font-black text-white tracking-tighter uppercase mb-0.5">ALCOIN<span className="text-blue-500 font-extrabold">.</span></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span className="text-[10px] font-bold tracking-wider text-white/60">Powered By ALTECH Group</span>
          </div>
          <p className="max-w-xl mx-auto text-[10px] tracking-wide leading-relaxed">
            ALCOIN digital platform, products, and services are engineered by ALTECH. Use of our training simulation sandbox is governed by operational safety parameters.
          </p>
          <div className="text-[9px] tracking-widest text-white/30 uppercase block">
            © {new Date().getFullYear()} ALCOIN. All Rights Reserved. Turn Your Spare Time Into Real Earnings.
          </div>
        </div>
      </footer>

    </div>
  );
}
