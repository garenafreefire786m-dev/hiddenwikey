import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Zap, 
  X, 
  ShieldCheck, 
  BellRing, 
  Sparkles, 
  RefreshCw,
  Sliders,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SessionExpiryBanner: React.FC = () => {
  const { 
    currentUser,
    sessionKey, 
    sessionSecondsRemaining, 
    isSessionExpiringSoon, 
    sessionExpired,
    isWarningDismissed, 
    dismissExpiryWarning, 
    openRenewalModal,
    setSessionToWarningDemo,
    renewSessionKey,
    browserNotificationPermission,
    requestBrowserNotificationPermission 
  } = useApp();

  const [isWidgetMinimized, setIsWidgetMinimized] = useState<boolean>(false);

  // If user is not logged in, don't show session banner
  if (!currentUser) return null;

  const minutes = Math.floor(sessionSecondsRemaining / 60);
  const seconds = sessionSecondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <>
      {/* ========================================================= */}
      {/* 1. TOP STICKY CRITICAL ALERT BAR (< 2 MINUTES REMAINING)  */}
      {/* ========================================================= */}
      {isSessionExpiringSoon && !isWarningDismissed && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-rose-950 via-amber-950 to-rose-950 border-b-2 border-amber-500 shadow-2xl shadow-rose-950/80 animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-white">
            {/* Alert Message & Countdown */}
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0 animate-bounce">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                  <span className="font-black text-xs sm:text-sm tracking-wide text-amber-300 uppercase">
                    Session Key Expiring Soon ({timeFormatted} remaining)
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-950/80 border border-amber-500/40 text-cyan-300 font-bold">
                    Key: {sessionKey.slice(0, 16)}...
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 hidden sm:block">
                  Your active cloud lease has less than 2 minutes remaining. Purchase a renewal pass now to prevent server cluster termination.
                </p>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex items-center gap-2 shrink-0">
              {browserNotificationPermission !== 'granted' && (
                <button
                  type="button"
                  onClick={requestBrowserNotificationPermission}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-amber-300 flex items-center gap-1 transition-colors"
                  title="Enable desktop browser notifications"
                >
                  <BellRing className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Enable Alerts</span>
                </button>
              )}

              <button
                type="button"
                onClick={openRenewalModal}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md shadow-amber-950 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-slate-950" />
                <span>Purchase Renewal</span>
              </button>

              <button
                type="button"
                onClick={dismissExpiryWarning}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors ml-1"
                title="Dismiss warning"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. FLOATING SESSION MONITOR & DEMO TESTING CONTROLLER      */}
      {/* ========================================================= */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className="rounded-2xl bg-slate-950/90 border border-slate-800/90 shadow-2xl backdrop-blur-md overflow-hidden text-white transition-all max-w-xs">
          {/* Header */}
          <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800/70 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                sessionExpired 
                  ? 'bg-rose-500' 
                  : isSessionExpiringSoon 
                  ? 'bg-amber-400 animate-ping' 
                  : 'bg-emerald-400 animate-pulse'
              }`} />
              <span className="font-mono font-bold text-[11px] text-slate-200">
                Session Lease
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className={`font-black text-xs ${
                isSessionExpiringSoon ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
              }`}>
                {timeFormatted}
              </span>
              <button
                type="button"
                onClick={() => setIsWidgetMinimized(!isWidgetMinimized)}
                className="p-0.5 text-slate-400 hover:text-white transition-colors"
                title={isWidgetMinimized ? 'Expand' : 'Collapse'}
              >
                {isWidgetMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Expanded Session Controls & Tester */}
          {!isWidgetMinimized && (
            <div className="p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Active Key:</span>
                <span className="text-cyan-300 font-bold truncate max-w-[150px]">
                  {sessionKey}
                </span>
              </div>

              <div className="pt-1 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={openRenewalModal}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                >
                  <Zap className="w-3 h-3" />
                  <span>Renew Key</span>
                </button>

                <button
                  type="button"
                  onClick={setSessionToWarningDemo}
                  className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-semibold transition-colors shrink-0"
                  title="Simulate < 2 min expiry warning immediately"
                >
                  ⚡ Test &lt; 2m Alert
                </button>
              </div>

              {/* Browser Notification Status indicator */}
              <div className="pt-1 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                <span>Browser Alerts:</span>
                <span className={`font-mono font-bold ${
                  browserNotificationPermission === 'granted' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {browserNotificationPermission === 'granted' ? '● Enabled' : '○ Not Enabled'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
