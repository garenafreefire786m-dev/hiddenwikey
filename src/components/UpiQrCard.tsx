import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, QrCode, ShieldCheck, Smartphone, Sparkles } from 'lucide-react';
import { OFFICIAL_UPI_ID } from '../context/AppContext';

interface UpiQrCardProps {
  amountInr: number;
  note?: string;
  showDetails?: boolean;
}

export const UpiQrCard: React.FC<UpiQrCardProps> = ({
  amountInr,
  note = 'NextGenCard Pass',
  showDetails = true,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  const cleanNote = note.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 20);
  const upiUri = `upi://pay?pa=${OFFICIAL_UPI_ID}&pn=NextGen%20Card%20Store&am=${amountInr}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;

  useEffect(() => {
    // Generate crisp QR code matching the uploaded design
    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 1,
      color: {
        dark: '#ffffff', // White modules as in user uploaded QR image
        light: '#141418', // Deep dark container matching uploaded QR
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code', err));
  }, [upiUri]);

  const copyUpiId = () => {
    navigator.clipboard.writeText(OFFICIAL_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="flex flex-col items-center">
      {/* ============================================================== */}
      {/* EXACT FRAME MATCHING THE USER'S UPLOADED QR CODE (IMG WA0004)  */}
      {/* Dark square container with Cyan top border & Deep Blue bottom  */}
      {/* ============================================================== */}
      <div className="relative p-2.5 sm:p-3 rounded-[28px] bg-gradient-to-b from-[#00b4d8] via-[#101018] to-[#0d2a75] shadow-2xl shadow-cyan-950/60 transition-transform duration-300 hover:scale-[1.02]">
        {/* Inner black card housing */}
        <div className="bg-[#141418] rounded-[22px] p-3 sm:p-4 flex flex-col items-center border border-white/10 shadow-inner">
          {/* Top subtle branding indicator */}
          <div className="flex items-center justify-between w-full mb-2.5 px-1">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              OFFICIAL UPI QR
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
              ● SCAN & PAY
            </span>
          </div>

          {/* QR Canvas / Image matching uploaded image style */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-xl overflow-hidden bg-[#141418] flex items-center justify-center p-2 border border-slate-800">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Scan UPI QR"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                Generating QR...
              </div>
            )}
          </div>

          {/* Amount In Rupees Banner */}
          <div className="w-full mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between px-1">
            <span className="text-[11px] text-slate-400 font-mono">Total Payable:</span>
            <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-tight flex items-baseline gap-1">
              <span className="text-cyan-400 text-base">₹</span>
              <span>{amountInr.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-400 font-normal">INR</span>
            </span>
          </div>
        </div>
      </div>

      {/* Copy UPI ID & Supported Apps */}
      {showDetails && (
        <div className="w-full max-w-sm mt-3.5 space-y-2 text-xs">
          {/* UPI ID Pill */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex flex-col text-left truncate">
              <span className="text-[9px] text-slate-400 uppercase font-mono">Official UPI ID:</span>
              <span className="font-mono text-xs sm:text-sm font-extrabold text-cyan-300 truncate">
                {OFFICIAL_UPI_ID}
              </span>
            </div>

            <button
              type="button"
              onClick={copyUpiId}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
            >
              {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
            </button>
          </div>

          {/* Supported UPI Apps Bar */}
          <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <Smartphone className="w-3 h-3 text-cyan-400" />
              Pay with any UPI app:
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <span className="hover:text-cyan-400">PhonePe</span> • 
              <span className="hover:text-cyan-400">GPay</span> • 
              <span className="hover:text-cyan-400">Paytm</span> • 
              <span className="hover:text-cyan-400">BHIM</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
