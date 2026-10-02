import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Server, 
  ShieldCheck, 
  Download, 
  Sparkles,
  CreditCard,
  Eye,
  EyeOff,
  ShoppingBag,
  Zap,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderSuccessModal: React.FC = () => {
  const { activeModal, closeModals, latestOrder, openMyOrders, showToast } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCvv, setShowCvv] = useState<boolean>(true);

  if (activeModal !== 'orderSuccess' || !latestOrder) return null;

  const copyField = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`${label} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyAllDetails = () => {
    const text = `NextGenCard Digital Pass Details:
Card Name: ${latestOrder.cardName}
Card Number: ${latestOrder.cardNumber || 'N/A'}
Expiration: ${latestOrder.cardExp || 'N/A'}
CVV: ${latestOrder.cardCvv || 'N/A'}
Cardholder: ${latestOrder.cardHolderName || latestOrder.userEmail.split('@')[0].toUpperCase()}
Token Key: ${latestOrder.voucherCode || 'N/A'}
Order ID: #${latestOrder.id}
Server Region: ${latestOrder.serverRegion || 'Global'}
Amount: ₹${latestOrder.amount.toLocaleString('en-IN')}`;

    navigator.clipboard.writeText(text);
    setCopiedKey('all');
    showToast('All Card Details (Number, Exp, CVV) copied!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = () => {
    const text = `================================================
           NEXTGEN DIGITAL CARD PASS
================================================
Order ID: #${latestOrder.id}
Date: ${latestOrder.timestamp}
User ID: #${latestOrder.userId}
Card Item: ${latestOrder.cardName}
Region: ${latestOrder.serverRegion || 'Global Anycast'}

---------------- CARD CREDENTIALS ---------------
CARD NUMBER : ${latestOrder.cardNumber || '4532 8921 5410 9821'}
EXPIRATION  : ${latestOrder.cardExp || '10/30'}
SECURITY CVV: ${latestOrder.cardCvv || '741'}
CARDHOLDER  : ${latestOrder.cardHolderName || latestOrder.userEmail.split('@')[0].toUpperCase()}
VOUCHER KEY : ${latestOrder.voucherCode || 'NGC-ACTIVE-KEY'}
STATUS      : DELIVERED & ACTIVE
================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NextGenCard_${latestOrder.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Card credentials saved as text file!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden my-6">
        {/* Top Glow & Success Banner */}
        <div className="p-6 bg-gradient-to-b from-emerald-950/70 via-slate-900 to-slate-950 border-b border-slate-800 text-center relative">
          <button
            onClick={closeModals}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] mx-auto mb-3 shadow-xl shadow-emerald-950">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-400 animate-bounce" />
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-mono text-[11px] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            ORDER SUCCESSFUL & PROVISIONED
          </span>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Card Pass Generated!
          </h3>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Order #{latestOrder.id} has been delivered. Aapka random card number, expiry aur CVV ready hai:
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Virtual Card Visual Display */}
          <div className="relative rounded-2xl p-5 bg-gradient-to-tr from-slate-900 via-slate-850 to-indigo-950 border border-cyan-500/50 shadow-2xl shadow-cyan-950/40 overflow-hidden text-white">
            {/* Hologram sheen pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.06)_50%,transparent_75%)] bg-[length:250%_250%] pointer-events-none" />
            
            {/* Card Brand Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <span className="font-extrabold text-xs tracking-wider block text-white">NEXTGEN PASS</span>
                  <span className="text-[9px] text-cyan-400 font-mono">DIGITAL CORE</span>
                </div>
              </div>

              {/* EMV Microchip */}
              <div className="w-10 h-7 rounded bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 border border-yellow-200 shadow-sm flex items-center justify-center">
                <div className="w-7 h-4 border border-amber-800/40 rounded-sm grid grid-cols-2" />
              </div>
            </div>

            {/* 16-Digit Card Number */}
            <div className="mb-4 relative z-10">
              <span className="text-[9px] text-slate-400 uppercase font-mono block mb-1">
                Virtual Card Number
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-lg sm:text-2xl font-black text-cyan-300 tracking-wider">
                  {latestOrder.cardNumber || '4532 8921 5410 9821'}
                </span>
                <button
                  onClick={() => copyField(latestOrder.cardNumber || '4532 8921 5410 9821', 'Card Number')}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy 16-Digit Number"
                >
                  {copiedKey === 'Card Number' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Cardholder, EXP and CVV Row */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 relative z-10 text-xs font-mono">
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">Cardholder</span>
                <span className="font-bold text-white uppercase truncate block">
                  {latestOrder.cardHolderName || latestOrder.userEmail.split('@')[0]}
                </span>
              </div>

              <div>
                <span className="text-[9px] text-slate-400 uppercase block">Expires</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-emerald-400">
                    {latestOrder.cardExp || '10/30'}
                  </span>
                  <button
                    onClick={() => copyField(latestOrder.cardExp || '10/30', 'EXP')}
                    className="text-slate-400 hover:text-white"
                    title="Copy Expiry"
                  >
                    {copiedKey === 'EXP' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[9px] text-slate-400 uppercase block">CVV</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-amber-400">
                    {showCvv ? latestOrder.cardCvv || '741' : '•••'}
                  </span>
                  <button
                    onClick={() => setShowCvv(!showCvv)}
                    className="text-slate-400 hover:text-white"
                    title="Show/Hide CVV"
                  >
                    {showCvv ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => copyField(latestOrder.cardCvv || '741', 'CVV')}
                    className="text-slate-400 hover:text-white ml-0.5"
                    title="Copy CVV"
                  >
                    {copiedKey === 'CVV' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Copy Credentials Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={copyAllDetails}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 transition-all active:scale-95"
            >
              {copiedKey === 'all' ? <CheckCheck className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>Copy All Card Credentials</span>
            </button>

            <button
              onClick={handleDownload}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Download Card Pass (.txt)</span>
            </button>
          </div>

          {/* Voucher Activation Key Box */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase">
              <span>Token Activation Key:</span>
              <span className="text-emerald-400 font-bold">100% UNLOCKED</span>
            </div>
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80">
              <code className="font-mono text-xs font-bold text-cyan-300 truncate">
                {latestOrder.voucherCode}
              </code>
              <button
                onClick={() => copyField(latestOrder.voucherCode || '', 'Token Key')}
                className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 shrink-0"
              >
                {copiedKey === 'Token Key' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>
          </div>

          {/* Order Specs Breakdown */}
          <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Card Item:</span>
              <span className="font-bold text-white">{latestOrder.cardName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Server Region:</span>
              <span className="font-mono text-cyan-400 flex items-center gap-1">
                <Server className="w-3 h-3" />
                {latestOrder.serverRegion}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Amount Paid:</span>
              <span className="font-mono font-black text-emerald-400">
                ₹{latestOrder.amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Payment Channel:</span>
              <span className="font-mono text-slate-300 uppercase">
                {latestOrder.paymentMethod}
              </span>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => {
                closeModals();
                openMyOrders();
              }}
              className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>View in My Orders</span>
            </button>

            <button
              onClick={closeModals}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-950 transition-all active:scale-95"
            >
              Done / Return to Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
