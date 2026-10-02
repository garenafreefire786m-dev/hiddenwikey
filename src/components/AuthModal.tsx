import React, { useState } from 'react';
import { X, UserPlus, LogIn, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { activeModal, closeModals, loginUser, users, showToast } = useApp();
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  if (activeModal !== 'auth') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    if (!cleanEmail.endsWith('@gmail.com') && !cleanEmail.endsWith('@googlemail.com') && cleanEmail !== 'flaxy09z') {
      showToast('Real Gmail required: Address must end with @gmail.com (e.g. sahmambabu71@gmail.com)', 'error');
      return;
    }

    loginUser(name.trim() || cleanEmail.split('@')[0], cleanEmail);
  };

  const handleQuickDemoLogin = (userEmail: string, userName: string) => {
    loginUser(userName, userEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isRegister ? 'Create Account & 5-Digit ID' : 'Sign In to NextGenCard'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Automatic 5-Digit User ID Generation
              </p>
            </div>
          </div>
          <button
            onClick={closeModals}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>
                A unique permanent 5-digit User ID (e.g. #48291) will be assigned for wallet top-up and card tracking.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isRegister ? 'Generate 5-Digit ID & Join' : 'Sign In'}</span>
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New customer?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  Create Account (Get 5-Digit ID)
                </button>
              </span>
            )}
          </div>

          {/* Quick Demo Users */}
          <div className="pt-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2 text-center">
              Quick 1-Click Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('alex.rivera@nextgencard.io', 'Alex Rivera')}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-left"
              >
                <div className="font-semibold text-white truncate">Alex Rivera</div>
                <div className="text-[10px] text-cyan-400 font-mono">ID: #48291</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('vikram.cloud@techops.in', 'Vikram Singh')}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-left"
              >
                <div className="font-semibold text-white truncate">Vikram Singh</div>
                <div className="text-[10px] text-cyan-400 font-mono">ID: #10928</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
