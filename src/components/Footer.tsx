import React from 'react';
import { CreditCard, ShieldCheck, Users, QrCode, Lock, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { openAdmin, currentUser } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-base text-white tracking-tight">
                  NextGenCard
                </span>
                <span className="text-[10px] text-cyan-400 font-mono ml-2">
                  Badalzemamzxyy Edition
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              Dynamic card catalog starting at $15 with instant UPI auto-verification, 103,802+ active global users, 10,000+ random server node inventory, and 5-digit user wallet management.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>103,802+ Active Users Verified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a href="#catalog-section" className="hover:text-cyan-400 transition-colors">
                  Dynamic Catalog ($15+)
                </a>
              </li>
              <li>
                <a href="#servers-section" className="hover:text-cyan-400 transition-colors">
                  10,000+ Server Nodes
                </a>
              </li>
              <li>
                <a href="#reviews-section" className="hover:text-cyan-400 transition-colors">
                  Customer Reviews
                </a>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-cyan-400 transition-colors">
                  FAQ & Policies
                </a>
              </li>
              <li>
                <span className="text-emerald-400 font-mono text-[11px]">UPI QR & Binance Pay Active</span>
              </li>
            </ul>
          </div>

          {/* Security & Guarantees */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Security & Deposit</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              All deposits via Binance Pay (ID: 1279687280) are cryptographically validated against the user's permanent 5-digit ID.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit Ledger Verification</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 NextGenCard (Badalzemamzxyy). All rights reserved. Starting from $15.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-amber-400 font-mono">
              Binance Pay ID: 1279687280 (Min $15)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500">
              UPI QR (Coming Soon)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
