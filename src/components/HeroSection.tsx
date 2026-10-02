import React from 'react';
import { 
  Users, 
  Sparkles, 
  ArrowRight, 
  Server, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode,
  Zap,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroSection: React.FC = () => {
  const { currentUser, openAuth, openMyOrders } = useApp();

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:py-20 bg-radial from-slate-900 via-slate-950 to-black">
      {/* Background Cyber Glow & Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/15 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Badges, CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* 103,802+ Users Banner */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 shadow-lg shadow-cyan-950/50 backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">
                Trusted by <span className="text-emerald-400 font-mono font-bold">103,802+ Active Users</span> Worldwide
              </span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="hidden sm:inline text-[11px] font-mono text-cyan-300">
                10,000+ Cards Available
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              Dynamic Digital Cards & Servers{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Starting at ₹499
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explore 10,000+ dynamically generated server passes, developer sandbox keys, and gaming voucher cards in Indian Rupees (₹). Instant auto-verified UPI payments with custom QR, 5-digit user wallet management, and Binance Pay deposits.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Starting at ₹499</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>₹250 Welcome Bonus</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <span>UPI QR & Binance ID</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={scrollToCatalog}
                className="group relative flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
                <span>Card Purchase & Catalog</span>
                <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
              </button>

              {!currentUser ? (
                <button
                  onClick={openAuth}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold text-sm transition-all"
                >
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Get 5-Digit User ID</span>
                </button>
              ) : (
                <button
                  onClick={openMyOrders}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                  <span>My Orders & Deposits</span>
                </button>
              )}
            </div>

            {/* Live Metrics strip */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-slate-400 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Instant Code Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>100% Uptime SLA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Holographic 3D Interactive Card Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md group">
              {/* Glow backdrops */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>

              {/* Physical Virtual Card */}
              <div className="relative rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-cyan-500/40 shadow-2xl backdrop-blur-xl text-white overflow-hidden">
                {/* Holographic Chip & Server Indicator */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    {/* Simulated Smart Metallic Chip */}
                    <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-amber-300/80 p-1 flex flex-col justify-between shadow-inner">
                      <div className="w-full h-0.5 bg-amber-700/40 rounded-full" />
                      <div className="w-full h-0.5 bg-amber-700/40 rounded-full" />
                      <div className="w-full h-0.5 bg-amber-700/40 rounded-full" />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                      SECURE NFC
                    </span>
                  </div>

                  {/* Starting Price Pill */}
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting At / Balance</span>
                    <span className="text-xl font-black text-emerald-400 font-mono leading-none">
                      ₹499 / ₹5,000 Bal
                    </span>
                  </div>
                </div>

                {/* Card Number Mask */}
                <div className="my-6">
                  <div className="font-mono text-xl sm:text-2xl tracking-widest text-slate-100 font-bold drop-shadow-md">
                    4820 •••• •••• 9102
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-slate-400">
                    <span>REGION: US-EAST</span>
                    <span>EXP: 09/29</span>
                    <span className="text-cyan-400 font-semibold">TOKEN: VERIFIED</span>
                  </div>
                </div>

                {/* Bottom Row of Card */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
                      HOLDER / USER ID
                    </span>
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {currentUser ? `USR-${currentUser.id}` : 'USR-48291'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
                      TIER
                    </span>
                    <span className="font-bold text-xs text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                      ALPHA PRO
                    </span>
                  </div>
                </div>

                {/* Server Region Tag */}
                <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Global Random Server Node</span>
                  </div>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Instant Stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
