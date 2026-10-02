import React from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Wallet, 
  ArrowUpRight, 
  RefreshCw, 
  ExternalLink,
  ShieldAlert,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyOrdersModal: React.FC = () => {
  const { activeModal, closeModals, currentUser, orders, openWalletRecharge, showToast } = useApp();

  if (activeModal !== 'myOrders' || !currentUser) return null;

  // Filter orders for the current user
  const userOrders = orders.filter((o) => o.userId === currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">My Orders & Deposits</h3>
                <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  ID: #{currentUser.id}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Live Status of USDT Deposits & Card Purchases
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
          {/* Quick Balance Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-emerald-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Current Wallet Balance
                </span>
                <span className="font-mono text-2xl font-black text-emerald-400">
                  ₹{currentUser.walletBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                closeModals();
                openWalletRecharge();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <span>+ New Deposit</span>
            </button>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Order History ({userOrders.length})
              </span>
              <span className="text-[11px] text-slate-500">Live Auto-Syncing</span>
            </div>

            {userOrders.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                <p className="text-slate-300 font-semibold text-sm">No orders or deposits placed yet.</p>
                <p className="text-slate-500 text-xs">
                  Deposit via UPI QR or Binance Pay (ID: 1279687280) to fund your wallet.
                </p>
                <button
                  onClick={() => {
                    closeModals();
                    openWalletRecharge();
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Make First Deposit (Min ₹200)
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-white">{order.id}</span>
                        {/* Status Badges */}
                        {order.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/60 text-amber-300 animate-pulse">
                            <Clock className="w-3 h-3 text-amber-400" />
                            {order.type === 'card_purchase' ? 'Waiting for Order Approval' : 'Deposit Pending Review'}
                          </span>
                        )}
                        {order.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Approved & Added
                          </span>
                        )}
                        {order.status === 'delivered' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Order Approved & Delivered
                          </span>
                        )}
                        {order.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/60 text-rose-300">
                            <XCircle className="w-3 h-3 text-rose-400" />
                            {order.type === 'card_purchase' ? 'Rejected & Refunded' : 'Rejected'}
                          </span>
                        )}
                      </div>

                      <h4 className="font-semibold text-sm text-slate-100">{order.cardName}</h4>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
                        {order.utrNumber && (
                          <span>Ref: <strong className="text-slate-300">{order.utrNumber}</strong></span>
                        )}
                        <span>{order.timestamp}</span>
                      </div>

                      {order.type === 'card_purchase' && order.status === 'pending' && (
                        <p className="text-[11px] text-amber-300/90 bg-amber-950/40 p-2 rounded-lg border border-amber-900/50 mt-1">
                          ⏳ Waiting for administrator order approval. Your activation key will unlock here as soon as approved.
                        </p>
                      )}

                      {order.status === 'rejected' && order.rejectionReason && (
                        <p className="text-[11px] text-rose-400 mt-1">
                          Reason: {order.rejectionReason}
                        </p>
                      )}

                      {order.cardNumber && order.status === 'delivered' && (
                        <div className="mt-2.5 p-3 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono font-bold">
                            <span>VIRTUAL CARD PASS CREDENTIALS</span>
                            <span className="text-emerald-400">● ACTIVE</span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                            <div>
                              <span className="text-[9px] text-slate-500 block uppercase">Card Number</span>
                              <span className="text-cyan-300 font-bold tracking-wider">{order.cardNumber}</span>
                            </div>

                            <div className="flex items-center gap-4">
                              <div>
                                <span className="text-[9px] text-slate-500 block uppercase">EXP</span>
                                <span className="text-emerald-400 font-bold">{order.cardExp}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-500 block uppercase">CVV</span>
                                <span className="text-amber-400 font-bold">{order.cardCvv}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${order.cardNumber} | ${order.cardExp} | ${order.cardCvv}`);
                                showToast('Card Number, EXP & CVV copied!', 'success');
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                            >
                              Copy Details
                            </button>
                          </div>
                        </div>
                      )}

                      {order.voucherCode && order.status === 'delivered' && (
                        <div className="pt-1.5 flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 uppercase font-mono">Token Key:</span>
                          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                            {order.voucherCode}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-right sm:self-center shrink-0">
                      <span className={`font-mono text-lg font-black block ${
                        order.type === 'card_purchase' ? 'text-cyan-400' : 'text-emerald-400'
                      }`}>
                        {order.type === 'card_purchase' ? `-₹${order.amount.toLocaleString('en-IN')}` : `+₹${order.amount.toLocaleString('en-IN')}`}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">
                        {order.paymentMethod === 'binance' ? 'Binance USDT' : order.paymentMethod}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
