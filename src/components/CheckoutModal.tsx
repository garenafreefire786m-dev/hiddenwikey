import React, { useState } from 'react';
import { 
  X, 
  Check, 
  QrCode, 
  Wallet, 
  Copy, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  Zap, 
  Server, 
  ArrowRight, 
  Smartphone, 
  CreditCard 
} from 'lucide-react';
import { 
  useApp, 
  BINANCE_PAY_ID, 
  OFFICIAL_UPI_ID, 
  USD_TO_INR_RATE 
} from '../context/AppContext';
import { UpiQrCard } from './UpiQrCard';

export const CheckoutModal: React.FC = () => {
  const { 
    selectedCard, 
    activeModal, 
    closeModals, 
    currentUser, 
    processPayment, 
    openAuth,
    openWalletRecharge,
    showToast 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'wallet' | 'binance'>('upi');
  const [upiUtr, setUpiUtr] = useState<string>('');
  const [binanceTxId, setBinanceTxId] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyStep, setVerifyStep] = useState<string>('');
  const [copiedBinanceId, setCopiedBinanceId] = useState<boolean>(false);

  if (activeModal !== 'checkout' || !selectedCard) return null;

  const cardPriceInr = selectedCard.price;
  const cardPriceUsd = Math.round(cardPriceInr / USD_TO_INR_RATE) || 10;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBinanceId(true);
    showToast(`Copied Binance Pay ID: ${text}`, 'info');
    setTimeout(() => setCopiedBinanceId(false), 2000);
  };

  const handleFillSampleUpi = () => {
    const sample = Math.floor(400000000000 + Math.random() * 500000000000).toString();
    setUpiUtr(sample);
    showToast('Sample 12-Digit UTR loaded', 'info');
  };

  const handleFillDemoTxId = () => {
    const demoTx = 'BNP' + Math.floor(100000000 + Math.random() * 900000000).toString();
    setBinanceTxId(demoTx);
  };

  const handleAutoVerifyPayment = async () => {
    if (!currentUser) {
      openAuth();
      return;
    }

    if (paymentMethod === 'upi') {
      const finalUtr = upiUtr.trim() || Math.floor(400000000000 + Math.random() * 500000000000).toString();
      setIsVerifying(true);
      setVerifyStep('Connecting to UPI Gateway & NPCI Network...');

      setTimeout(() => {
        setVerifyStep(`Verifying ₹${cardPriceInr.toLocaleString('en-IN')} transfer to ${OFFICIAL_UPI_ID}...`);
      }, 700);

      setTimeout(() => {
        setVerifyStep('Payment Confirmed! Minting 16-Digit Card, EXP & CVV...');
      }, 1400);

      setTimeout(async () => {
        setIsVerifying(false);
        setVerifyStep('');
        await processPayment(selectedCard, 'upi', finalUtr);
      }, 2100);
    } else if (paymentMethod === 'wallet') {
      setIsVerifying(true);
      setVerifyStep('Deducting from 5-Digit User Wallet...');
      setTimeout(async () => {
        setIsVerifying(false);
        setVerifyStep('');
        await processPayment(selectedCard, 'wallet');
      }, 600);
    } else if (paymentMethod === 'binance') {
      const finalTx = binanceTxId.trim() || 'BNP' + Math.floor(100000000 + Math.random() * 900000000).toString();
      setIsVerifying(true);
      setVerifyStep(`Checking transfer on Binance Pay ID ${BINANCE_PAY_ID}...`);
      setTimeout(async () => {
        setIsVerifying(false);
        setVerifyStep('');
        await processPayment(selectedCard, 'usdt', finalTx);
      }, 1600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden my-6">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Instant Card Checkout</h3>
              <p className="text-[11px] text-slate-400">
                Official Virtual Card Provisioning in Indian Rupees (₹)
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

        <div className="p-5 sm:p-6 space-y-4">
          {/* Selected Card Overview */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                {selectedCard.tier} Tier Pass
              </span>
              <h4 className="font-bold text-sm text-white">{selectedCard.name}</h4>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <Server className="w-3 h-3 text-cyan-400" />
                <span>{selectedCard.serverRegion}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-cyan-300 font-mono block">
                ₹{cardPriceInr.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-mono text-slate-400">
                (≈ ${cardPriceUsd} USDT)
              </span>
            </div>
          </div>

          {/* User ID & Wallet Indicator */}
          {currentUser && (
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Account:</span>
                <span className="font-bold text-white">{currentUser.name}</span>
                <span className="font-mono text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  #{currentUser.id}
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 font-mono font-bold">
                <Wallet className="w-3.5 h-3.5" />
                <span>₹{currentUser.walletBalance.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Purchase / Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* UPI QR Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  paymentMethod === 'upi'
                    ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-400 text-white shadow-lg shadow-cyan-950'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-extrabold text-xs text-cyan-300 font-mono flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                    UPI QR
                  </span>
                  {paymentMethod === 'upi' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <div>
                  <span className="font-bold text-xs block text-slate-100">Pay ₹{cardPriceInr.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-cyan-400 font-semibold">GPay, PhonePe, Paytm</span>
                </div>
              </button>

              {/* Wallet Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  paymentMethod === 'wallet'
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-xs text-emerald-400 flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" />
                    WALLET
                  </span>
                  {paymentMethod === 'wallet' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div>
                  <span className="font-bold text-xs block text-slate-100">User Wallet</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ₹{currentUser?.walletBalance.toLocaleString('en-IN') || '0.00'}
                  </span>
                </div>
              </button>

              {/* Binance Pay Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('binance')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  paymentMethod === 'binance'
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg shadow-amber-950'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-extrabold text-xs text-amber-400 font-mono">BINANCE</span>
                  {paymentMethod === 'binance' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <div>
                  <span className="font-bold text-xs block text-slate-100">${cardPriceUsd} USDT</span>
                  <span className="text-[10px] text-amber-400/90 font-mono">ID: {BINANCE_PAY_ID}</span>
                </div>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* BODY: UPI QR PAYMENT WITH USER'S CUSTOM QR FRAME           */}
          {/* ========================================================= */}
          {paymentMethod === 'upi' && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/50 space-y-4 shadow-xl">
              {/* UpiQrCard component matching the uploaded image */}
              <UpiQrCard
                amountInr={cardPriceInr}
                note={`Card ${selectedCard.name.slice(0, 15)}`}
                showDetails={true}
              />

              {/* UTR Input Form */}
              <div className="space-y-1.5 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-200">
                    12-Digit UPI UTR / Transaction Reference ID:
                  </label>
                  <button
                    type="button"
                    onClick={handleFillSampleUpi}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Sample UTR
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 428198739102"
                  value={upiUtr}
                  onChange={(e) => setUpiUtr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-400 font-mono block">
                  Scan QR, pay ₹{cardPriceInr.toLocaleString('en-IN')} aur UTR enter karein. Card Number, EXP & CVV turant mil jayega!
                </span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* BODY: WALLET PAYMENT                                      */}
          {/* ========================================================= */}
          {paymentMethod === 'wallet' && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Available Wallet Balance:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ₹{currentUser?.walletBalance.toLocaleString('en-IN') || '0.00'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Card Price:</span>
                <span className="font-mono font-bold text-white text-sm">
                  ₹{cardPriceInr.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Remaining Balance:</span>
                <span className={`font-mono font-bold text-sm ${
                  (currentUser?.walletBalance || 0) >= cardPriceInr ? 'text-cyan-400' : 'text-rose-400'
                }`}>
                  ₹{Math.max(0, (currentUser?.walletBalance || 0) - cardPriceInr).toLocaleString('en-IN')}
                </span>
              </div>

              {(currentUser?.walletBalance || 0) < cardPriceInr && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      Insufficient wallet balance (₹{currentUser?.walletBalance.toLocaleString('en-IN')}).
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-300">
                      Top up your wallet via UPI QR or Binance:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        closeModals();
                        openWalletRecharge();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
                    >
                      + Deposit Funds
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* BODY: BINANCE PAY                                         */}
          {/* ========================================================= */}
          {paymentMethod === 'binance' && (
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
                    onClick={() => copyToClipboard(BINANCE_PAY_ID)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-mono font-bold"
                  >
                    {copiedBinanceId ? 'Copied' : 'Copy ID'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Send <strong>${cardPriceUsd} USDT</strong> directly to Binance Pay ID <strong>{BINANCE_PAY_ID}</strong> and submit your Binance Order ID / TxID below.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-200">
                    Binance Order ID / TxID:
                  </label>
                  <button
                    type="button"
                    onClick={handleFillDemoTxId}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Sample TxID
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. BNP284910284"
                  value={binanceTxId}
                  onChange={(e) => setBinanceTxId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* Verification Loader Progress */}
          {isVerifying && (
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-2">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs font-bold text-cyan-300">{verifyStep}</p>
              <p className="text-[10px] text-slate-400">Minting 16-Digit Card Number, EXP & CVV...</p>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-1">
            <button
              type="button"
              disabled={isVerifying || (paymentMethod === 'wallet' && (currentUser?.walletBalance || 0) < cardPriceInr)}
              onClick={handleAutoVerifyPayment}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-98 ${
                paymentMethod === 'upi'
                  ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
                  : paymentMethod === 'wallet'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Processing & Minting Card...</span>
                </>
              ) : paymentMethod === 'upi' ? (
                <>
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  <span>Pay ₹{cardPriceInr.toLocaleString('en-IN')} via UPI QR & Generate Card</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              ) : paymentMethod === 'wallet' ? (
                <>
                  <Wallet className="w-4 h-4 text-slate-950" />
                  <span>Pay ₹{cardPriceInr.toLocaleString('en-IN')} with Wallet & Generate Card</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Verify Binance Pay (${cardPriceUsd}) & Deliver Card</span>
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
