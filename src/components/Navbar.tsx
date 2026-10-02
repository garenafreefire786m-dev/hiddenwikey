import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  ShieldCheck, 
  Users, 
  Wallet, 
  PlusCircle, 
  LogIn, 
  LogOut, 
  Sparkles,
  Server,
  Star,
  ShoppingBag,
  Headphones,
  HelpCircle,
  Clock
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    isAdmin, 
    openAdmin, 
    openAuth, 
    openWalletRecharge, 
    openMyOrders,
    openSupportModal,
    openRenewalModal,
    sessionSecondsRemaining,
    isSessionExpiringSoon,
    logoutUser 
  } = useApp();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Live User Ticker */}
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-cyan-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  NextGenCard
                </span>
                <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wide">
                by Badalzemamzxyy
              </p>
            </div>
          </a>

          {/* 103,802+ Live Active Users Indicator as explicitly requested */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-medium">Active Users:</span>
            <span className="font-mono font-bold text-emerald-400">103,802+</span>
          </div>
        </div>

        {/* Center Quick Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-300">
          <button 
            onClick={() => scrollToSection('catalog-section')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Cards (₹499+)</span>
          </button>
          <button 
            onClick={() => scrollToSection('servers-section')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Server className="w-4 h-4 text-purple-400" />
            <span>10,000+ Servers</span>
          </button>
          <button 
            onClick={() => scrollToSection('reviews-section')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>Verified Reviews</span>
          </button>
          <button 
            onClick={() => scrollToSection('faq-section')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>FAQ</span>
          </button>
        </nav>

        {/* Right Action Bar: User Info, Wallet, Admin Portal */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* 5-Digit User ID Pill */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] text-slate-400 font-mono">User ID</span>
                <span className="font-mono font-bold text-xs text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  #{currentUser.id}
                </span>
              </div>

              {/* Session Key Lease Indicator Pill */}
              <button
                type="button"
                onClick={openRenewalModal}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  isSessionExpiringSoon
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 animate-pulse shadow-md shadow-amber-950'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
                title="Active Session Key Lease - Click to Renew"
              >
                <Clock className={`w-3.5 h-3.5 ${isSessionExpiringSoon ? 'text-amber-400' : 'text-cyan-400'}`} />
                <span className="font-bold">
                  {String(Math.floor(sessionSecondsRemaining / 60)).padStart(2, '0')}:{String(sessionSecondsRemaining % 60).padStart(2, '0')}
                </span>
                {isSessionExpiringSoon && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase animate-bounce">
                    Renew
                  </span>
                )}
              </button>

              {/* Wallet Balance & Quick Recharge */}
              <div 
                onClick={openWalletRecharge}
                className="cursor-pointer group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-sm shadow-emerald-950"
                title="Click to recharge wallet via Admin or UPI"
              >
                <Wallet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-bold leading-none">Wallet</span>
                  <span className="font-mono font-extrabold text-sm text-emerald-400 leading-tight">
                    ₹{currentUser.walletBalance.toLocaleString('en-IN')}
                  </span>
                </div>
                <PlusCircle className="w-3.5 h-3.5 text-emerald-500 group-hover:text-emerald-300 ml-1" />
              </div>

              {/* My Orders Button */}
              <button
                onClick={openMyOrders}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-sm"
                title="View My Orders & Deposits"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">My Orders</span>
              </button>

              {/* Customer Support Button */}
              <button
                onClick={openSupportModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-teal-500/60 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-sm"
                title="Live Customer Support 24/7"
              >
                <Headphones className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Support</span>
              </button>

              {/* Admin Portal Button (when logged in as admin) */}
              {isAdmin && (
                <button
                  onClick={openAdmin}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-950 to-slate-900 border border-rose-500/60 hover:border-rose-400 text-rose-200 text-xs font-bold transition-all shadow-md shadow-rose-950"
                  title="Master Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  <span>Admin Panel</span>
                </button>
              )}

              {/* Logout button */}
              <button
                onClick={logoutUser}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white text-sm font-semibold transition-all"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>Login / 5-Digit ID</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
