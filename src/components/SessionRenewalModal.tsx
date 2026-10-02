import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Zap, 
  Clock, 
  Wallet, 
  QrCode, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { 
  useApp, 
  OFFICIAL_UPI_ID, 
  USD_TO_INR_RATE 
} from '../context/AppContext';

export const SessionRenewalModal: React.FC = () => {
  const { 
    activeModal, 
    closeModals, 
    currentUser, 
    sessionKey, 
    sessionSecondsRemaining, 
    renewSessionKey, 
    openWalletRecharge,
    browserNotificationPermission,
    requestBrowserNotificationPermission,
    showToast 
  } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<'30m' | '24h' | '7d'>('24h');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (activeModal !== 'sessionRenewal') return null;

  const minutes = Math.floor(sessionSecondsRemaining / 60);
  const seconds = sessionSecondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const plans = [
    {
      id: '30m' as const,
      name: 'Quick Key Extension',
      duration: '+30 Minutes',
      mins: 30,
      priceInr: 199,
      desc: 'Extend current server cluster for temporary sandbox testing',
      popular: false
    },
    {
      id: '24h' as const,
      name: 'Standard 24-Hour Key Pass',
      duration: '+24 Hours',
      mins: 1440,
      priceInr: 499,
      desc: 'Full day unthrottled access with dedicated server thread',
      popular: true
    },
    {
      id: '7d' as const,
      name: 'Enterprise Ultra Key Pass',
      duration: '+7 Days',
      mins: 10080,
      priceInr: 1299,
      desc: 'Priority queue, multi-cluster failover & unlimited renewal lease',
      popular: false
    }
  ];

  const currentPlan = plans.find((p) => p.id === selectedPlan) || plans[1];

  const copySessionKey = () => {
    navigator.clipboard.writeText(sessionKey);
    setCopiedKey(true);
    showToast('Session Key copied to clipboard!', 'info');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleExecuteRenewal = () => {
    if (!currentUser) return;

    if (currentUser.walletBalance < currentPlan.priceInr) {
      showToast(`Wallet balance (₹${currentUser.walletBalance.toLocaleString('en-IN')}) is insufficient for ₹${currentPlan.priceInr}. Please top up via UPI QR.`, 'error');
      closeModals();
      openWalletRecharge();
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      // Deduct balance and extend session
      renewSessionKey(currentPlan.mins);
      setIsProcessing(false);
      showToast(`Session key successfully renewed for ${currentPlan.duration}!`, 'success');
      closeModals();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-950 border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-950/40 text-white overflow-hidden my-6">
        {/* Top Urgent Alert Banner */}
        <div className="p-6 bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-950 border-b border-amber-500/30 text-center relative">
          <button
            onClick={closeModals}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold mb-3 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>CRITICAL LEASE EXPIRY WARNING</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Purchase Session Key Renewal
          </h3>

          <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
            Your active cloud pass session key has less than 2 minutes remaining. Renew now to avoid cluster de-provisioning and service interruption.
          </p>

          {/* Live Remaining Time Badge */}
          <div className="mt-4 inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-950 border-2 border-rose-500/60 shadow-lg shadow-rose-950/50">
            <Clock className="w-5 h-5 text-rose-400 animate-spin" />
            <div className="text-left font-mono">
              <span className="text-[10px] text-slate-400 block uppercase leading-none">Time Remaining</span>
              <span className="text-2xl font-black text-rose-400 leading-none">{timeFormatted}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Active Session Key Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 uppercase">Active Session Key:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Hardware Locked
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <code className="font-mono text-xs font-bold text-cyan-300 tracking-wider truncate">
                {sessionKey}
              </code>
              <button
                type="button"
                onClick={copySessionKey}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 shrink-0"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Renewal Package Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Select Renewal Package:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {plans.map((p) => {
                const isSelected = selectedPlan === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-400 text-white shadow-lg shadow-amber-950'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                        Recommended
                      </span>
                    )}
                    <div>
                      <span className="font-extrabold text-xs block text-slate-100">{p.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold block mt-0.5">
                        {p.duration}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                      <span className="font-mono text-lg font-black text-cyan-300">₹{p.priceInr.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] font-mono text-slate-400">INR</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Wallet Balance Verification */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-mono">User Wallet Balance (#{currentUser?.id}):</span>
                <span className="font-mono text-sm font-bold text-white">
                  ₹{currentUser?.walletBalance.toLocaleString('en-IN') || '0.00'} INR
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                closeModals();
                openWalletRecharge();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs font-mono transition-colors"
            >
              + Deposit via UPI
            </button>
          </div>

          {/* Browser Notifications Permission Bar */}
          {browserNotificationPermission !== 'granted' && (
            <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-200">
                <BellRing className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-[11px]">Enable browser desktop alerts for critical session expiry warnings</span>
              </div>
              <button
                type="button"
                onClick={requestBrowserNotificationPermission}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shrink-0"
              >
                Enable Alerts
              </button>
            </div>
          )}

          {/* Renewal Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleExecuteRenewal}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Renewing Session Lease...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>Purchase Renewal ({currentPlan.duration} • ₹{currentPlan.priceInr.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
