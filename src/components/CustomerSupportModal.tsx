import React, { useState } from 'react';
import { 
  X, 
  Headphones, 
  Send, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  HelpCircle,
  Sparkles,
  Bot
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomerSupportModal: React.FC = () => {
  const { 
    activeModal, 
    closeModals, 
    currentUser, 
    supportMessages, 
    sendSupportMessage 
  } = useApp();

  const [messageText, setMessageText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  if (activeModal !== 'support') return null;

  // Filter messages for current user (or show all if guest/demo)
  const myMessages = supportMessages.filter((m) => 
    currentUser ? m.userId === currentUser.id || m.userEmail === currentUser.email : true
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      sendSupportMessage(messageText.trim());
      setMessageText('');
      setIsSending(false);
    }, 350);
  };

  const handleQuickChip = (text: string) => {
    setMessageText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Headphones className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Customer Support Desk</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live 24/7
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {currentUser ? `User: ${currentUser.name} (ID: #${currentUser.id})` : 'Instant Help Desk • Directly connected to Admin'}
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

        {/* Message Thread History */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 min-h-[220px]">
          {/* Welcome Alert */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-800/50 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-cyan-300 block">Welcome to Live Support</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Aap yahan kuch bhi query, deposit confirmation, ya card delivery ke bare me message bhej sakte hain. Har message turant <strong className="text-white">Admin Panel</strong> me live update hoga!
              </p>
            </div>
          </div>

          {/* Previous Messages */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
              Your Support History ({myMessages.length})
            </span>

            {myMessages.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs rounded-xl bg-slate-900/40 border border-slate-800/80">
                <MessageSquare className="w-7 h-7 mx-auto mb-1.5 text-slate-600" />
                <p>No messages sent yet. Type your query below!</p>
              </div>
            ) : (
              myMessages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  {/* User Question Bubble */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 ml-4 text-xs space-y-1 shadow-md">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="text-cyan-400 font-bold">You (ID #{msg.userId})</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-100 font-medium">{msg.message}</p>
                    <div className="text-right">
                      {msg.status === 'unread' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                          <Clock className="w-2.5 h-2.5" />
                          Sent to Admin (Pending Response)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Replied by Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Admin Reply Bubble if available */}
                  {msg.reply && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/40 mr-4 text-xs space-y-1 shadow-md">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Admin Desk Official Reply
                        </span>
                        <span>{msg.replyTimestamp || 'Just now'}</span>
                      </div>
                      <p className="text-emerald-200 font-medium">{msg.reply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2 bg-slate-900/60 border-t border-slate-800/80 shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1.5">
            Quick Topics:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => handleQuickChip('Checking my UPI QR payment / 12-digit UTR. Please verify.')}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 text-[11px] whitespace-nowrap transition-colors"
            >
              ⚡ UPI QR Deposit Check
            </button>
            <button
              type="button"
              onClick={() => handleQuickChip('Checking my deposit on Binance Pay ID 1279687280. Please verify.')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap transition-colors"
            >
              💰 Binance Deposit Check
            </button>
            <button
              type="button"
              onClick={() => handleQuickChip('When will my card order be approved and voucher delivered?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap transition-colors"
            >
              💳 Card Order Approval Status
            </button>
            <button
              type="button"
              onClick={() => handleQuickChip('Need help with my 5-digit wallet balance.')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap transition-colors"
            >
              ⚡ Wallet Balance Help
            </button>
          </div>
        </div>

        {/* Input Message Form */}
        <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800 shrink-0 space-y-2">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              required
              placeholder="Type any message for Admin Desk..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isSending || !messageText.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>{isSending ? 'Sending...' : 'Send'}</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 font-mono">
            <span>Direct Admin Connection • Realtime Sync</span>
            <span>ID: #{currentUser?.id || 'GUEST'}</span>
          </div>
        </form>
      </div>
    </div>
  );
};
