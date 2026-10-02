import React from 'react';
import { 
  X, 
  Clock, 
  Server, 
  ShieldAlert, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderPendingApprovalModal: React.FC = () => {
  const { activeModal, closeModals, latestOrder, openMyOrders } = useApp();

  if (activeModal !== 'orderPendingApproval' || !latestOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden my-8">
        {/* Top Glow & Pending Banner */}
        <div className="p-6 bg-gradient-to-b from-amber-950/60 to-slate-950 border-b border-slate-800 text-center relative">
          <button
            onClick={closeModals}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-950 animate-pulse">
            <Clock className="w-8 h-8 text-amber-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>ORDER APPROVAL: WAITING</span>
          </div>

          <h3 className="text-2xl font-black text-white">Order Approval Wait</h3>
          <p className="text-xs text-amber-200/90 font-medium mt-1">
            Order #{latestOrder.id} has been placed. Waiting for administrator approval.
          </p>
        </div>

        {/* Card & Order Details */}
        <div className="p-6 space-y-5">
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Card Name:</span>
              <span className="font-bold text-white text-sm">{latestOrder.cardName}</span>
            </div>

            {latestOrder.serverRegion && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Server Region:</span>
                <span className="font-mono text-cyan-400 flex items-center gap-1">
                  <Server className="w-3.5 h-3.5" />
                  {latestOrder.serverRegion}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Account 5-Digit ID:</span>
              <span className="font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                #{latestOrder.userId}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Amount:</span>
              <span className="font-mono font-black text-emerald-400 text-base">
                ${latestOrder.amount.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
              <span className="text-slate-400">Payment Status:</span>
              <span className="font-mono text-amber-400 font-bold uppercase flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Waiting for Admin Approval
              </span>
            </div>
          </div>

          {/* Explanation notice */}
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200 leading-relaxed flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Your payment has been received in escrow. The administrator will review and approve your server allocation from the admin panel. Once approved, your activation code will be delivered into <strong>My Orders</strong>.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => {
                closeModals();
                openMyOrders();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-950 active:scale-98 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Track in My Orders</span>
            </button>
            <button
              onClick={closeModals}
              className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
