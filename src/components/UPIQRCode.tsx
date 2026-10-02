import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface UPIQRCodeProps {
  amountInr?: number;
  upiId?: string;
  payeeName?: string;
  size?: number;
}

export const UPIQRCode: React.FC<UPIQRCodeProps> = ({
  amountInr,
  upiId = 'flaxy09z@fam',
  payeeName = 'hideenwikky Pay',
  size = 220,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    const upiUri = amountInr 
      ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amountInr}&cu=INR`
      : `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=INR`;

    QRCode.toDataURL(upiUri, {
      width: size * 2,
      margin: 2,
      color: {
        dark: '#ffffff',
        light: '#0a0f1d',
      },
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [amountInr, upiId, payeeName, size]);

  return (
    <div className="relative inline-block p-3 rounded-2xl bg-slate-900 border-2 border-slate-700/80 shadow-2xl overflow-hidden group">
      {/* Corner Cyber Targets */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

      {dataUrl ? (
        <img
          src={dataUrl}
          alt="UPI QR Code"
          style={{ width: size, height: size }}
          className="rounded-xl object-contain mx-auto transition-transform group-hover:scale-[1.02]"
        />
      ) : (
        <div 
          style={{ width: size, height: size }} 
          className="flex items-center justify-center bg-slate-950 text-slate-500 font-mono text-xs rounded-xl"
        >
          Generating QR Code...
        </div>
      )}
    </div>
  );
};
