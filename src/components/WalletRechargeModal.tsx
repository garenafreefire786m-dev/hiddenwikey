import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight, 
  QrCode, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Lock,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { 
  useApp, 
  BINANCE_PAY_ID, 
  OFFICIAL_UPI_ID, 
  USD_TO_INR_RATE, 
  MIN_DEPOSIT_INR 
} from '../context/AppContext';
import { UpiQrCard } from './UpiQrCard';

export const WalletRechargeModal: React.FC = () => {
  const { 
    activeModal, 
    closeModals, 
    currentUser, 
    openAuth, 
    openMyOrders, 
    showToast, 
    submitDepositRequest 
  } = useApp();

  const [method, setMethod] = useState<'upi' | 'binance'>('upi');
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [copiedBinance, setCopiedBinance] = useState<boolean>(false);
  const [depositAmountInr, setDepositAmountInr] = useState<string>('500');
  const [binanceAmountUsd, setBinanceAmountUsd] = useState<string>('15');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  if (activeModal !== 'walletRecharge') return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center text-white space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mx-auto">
            <Wallet className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold">Please Sign In First</h3>
          <p className="text-xs text-slate-400">
            Sign in with Gmail to obtain your permanent 5-digit User ID and manage wallet deposits.
          </p>
          <div className="flex gap-3">
            <button
              onClick={closeModals}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={openAuth}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const amtNumInr = parseFloat(depositAmountInr) || 500;
  const binanceUsd = parseFloat(binanceAmountUsd) || 15;
  const binanceInrValue = Math.round(binanceUsd * USD_TO_INR_RATE);

  const copyUserId = () => {
    navigator.clipboard.writeText(currentUser.id);
    setCopiedId(true);
    showToast(`User ID #${currentUser.id} copied!`, 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyBinanceId = () => {
    navigator.clipboard.writeText(BINANCE_PAY_ID);
    setCopiedBinance(true);
    showToast(`Binance Pay ID copied: ${BINANCE_PAY_ID}`, 'info');
    setTimeout(() => setCopiedBinance(false), 2000);
  };

  const handleDepositVerification = (e: React.FormEvent) => {
    e.preventDefault();

    if (method === 'upi') {
      if (isNaN(amtNumInr) || amtNumInr < MIN_DEPOSIT_INR) {
        showToast(`Minimum deposit is ₹${MIN_DEPOSIT_INR}. Please enter ₹${MIN_DEPOSIT_INR} or more.`, 'error');
        return;
      }

      const finalUtr = utrNumber.trim() || Math.floor(400000000000 + Math.random() * 500000000000).toString();
      setIsVerifying(true);
      setTimeout(() => {
        submitDepositRequest(amtNumInr, finalUtr, 'upi');
        setIsVerifying(false);
        setUtrNumber('');
      }, 1000);
    } else {
      if (isNaN(binanceUsd) || binanceUsd < 10) {
        showToast(`Minimum deposit is $10 USDT.`, 'error');
        return;
      }

      const finalTx = utrNumber.trim() || 'BNP' + Math.floor(100000000 + Math.random() * 900000000);
      setIsVerifying(true);
      setTimeout(() => {
        submitDepositRequest(binanceUsd, finalTx, 'binance');
        setIsVerifying(false);
        setUtrNumber('');
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Deposit to 5-Digit Wallet</h3>
              <p className="text-[11px] text-slate-400">
                Direct UPI QR (Rupees) or Binance Pay (USDT) Gateway
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
        <div className="p-5 sm:p-6 space-y-4">
          {/* User ID & Current Balance Box in Rupees */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-cyan-500/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Your 5-Digit User ID
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-2xl font-black text-cyan-300">
                  #{currentUser.id}
                </span>
                <button
                  type="button"
                  onClick={copyUserId}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Copy 5-digit User ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-xs text-slate-400 mt-0.5 block">{currentUser.name}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Wallet Balance (₹)
              </span>
              <span className="font-mono text-2xl font-black text-emerald-400">
                ₹{currentUser.walletBalance.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400 block">Instant auto-credit on verification</span>
            </div>
          </div>

          {/* Deposit Method Tabs (UPI QR vs Binance) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setMethod('upi')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                method === 'upi'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>UPI QR Deposit (Rupees ₹)</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('binance')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                method === 'binance'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Binance Pay (ID: {BINANCE_PAY_ID})</span>
            </button>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: UPI QR DEPOSIT IN RUPEES (₹)                        */}
          {/* ========================================================= */}
          {method === 'upi' && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/50 space-y-4 shadow-xl">
              {/* Preset Amount Selector in Rupees */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                    Select Amount to Deposit (₹ Rupees):
                  </label>
                  <span className="font-mono text-xs text-cyan-400 font-bold">
                    ₹{amtNumInr.toLocaleString('en-IN')} INR
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {['500', '1000', '2000', '5000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmountInr(amt)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                        depositAmountInr === amt
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-950'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      ₹{parseInt(amt).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Custom UPI QR Card Component matching uploaded image */}
              <UpiQrCard
                amountInr={amtNumInr}
                note={`Deposit User ${currentUser.id}`}
                showDetails={true}
              />

              {/* Form Input */}
              <form onSubmit={handleDepositVerification} className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <label className="font-semibold text-slate-300">
                      12-Digit UPI UTR / Transaction Reference Number:
                    </label>
                    <button
                      type="button"
                      onClick={() => setUtrNumber(Math.floor(400000000000 + Math.random() * 500000000000).toString())}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Sample UTR
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter 12-digit UTR from GPay / PhonePe / Paytm"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-950 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Submitting Deposit Request...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>Submit UPI Deposit (₹{amtNumInr.toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: BINANCE PAY DEPOSIT                                 */}
          {/* ========================================================= */}
          {method === 'binance' && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Official Binance Pay ID:</span>
                    <span className="font-mono font-black text-lg text-amber-400">
                      {BINANCE_PAY_ID}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={copyBinanceId}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-mono font-bold"
                  >
                    {copiedBinance ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-200">
                  Binance Pay se direct <strong>${binanceUsd} USDT</strong> send karein. Aapke wallet me <strong>₹{binanceInrValue.toLocaleString('en-IN')} INR</strong> credit ho jayega!
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {['10', '15', '25', '50'].map((usd) => (
                  <button
                    key={usd}
                    type="button"
                    onClick={() => setBinanceAmountUsd(usd)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                      binanceAmountUsd === usd
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    ${usd}
                  </button>
                ))}
              </div>

              <form onSubmit={handleDepositVerification} className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <label className="font-semibold text-slate-300">
                      Binance Order ID / TxID:
                    </label>
                    <button
                      type="button"
                      onClick={() => setUtrNumber('BNP' + Math.floor(100000000 + Math.random() * 900000000))}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      Sample TxID
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BNP284910284"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-950 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Submitting Binance Deposit...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>Submit Binance Deposit (${binanceUsd} ≈ ₹{binanceInrValue.toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
