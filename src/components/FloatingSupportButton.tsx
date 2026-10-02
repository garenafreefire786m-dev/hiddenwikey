import React from 'react';
import { Headphones, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingSupportButton: React.FC = () => {
  const { openSupportModal, supportMessages, currentUser } = useApp();

  // Count unread replies for current user
  const unreadReplies = supportMessages.filter(
    (m) => m.status === 'replied' && (currentUser ? m.userId === currentUser.id : true)
  ).length;

  return (
    <button
      onClick={openSupportModal}
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
      title="Live Customer Support 24/7"
    >
      <div className="relative">
        <Headphones className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
      </div>
      <span className="font-extrabold tracking-wide">Live Support</span>
      
      {unreadReplies > 0 && (
        <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-mono font-black text-[10px] flex items-center justify-center">
          {unreadReplies}
        </span>
      )}
    </button>
  );
};
