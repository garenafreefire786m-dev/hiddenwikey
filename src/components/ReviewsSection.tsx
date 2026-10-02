import React from 'react';
import { Star, ShieldCheck, CheckCircle, ArrowRight, ShoppingBag, MessageSquareQuote } from 'lucide-react';
import { REVIEWS_DATA } from '../data/reviewsData';
import { useApp } from '../context/AppContext';

export const ReviewsSection: React.FC = () => {
  const { openCheckout } = useApp();

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="reviews-section" className="py-20 bg-slate-900/60 border-t border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>4.9 / 5.0 RATED BY 103,802+ ACTIVE USERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Customer Reviews & Verified Experiences
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            See genuine feedback from developers, gamers, and server administrators who purchase and verify cards daily through our instant UPI auto-verification system.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {REVIEWS_DATA.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg shadow-black/40"
            >
              <div>
                {/* Header: Avatar, Name, Rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-100">{review.author}</h4>
                      <span className="text-[11px] text-slate-500">{review.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Footer: Purchased Product Tag & Verified Badge */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-cyan-400 font-mono font-medium truncate max-w-[180px]">
                  {review.cardPurchased}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                  <CheckCircle className="w-3 h-3" />
                  {review.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Requested Feature: After reading reviews, a prominent "Card Purchase" CTA button */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-cyan-500/30 text-center max-w-2xl mx-auto shadow-2xl shadow-cyan-950/30 mb-12">
          <MessageSquareQuote className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Ready to Get Your Digital Card?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-md mx-auto">
            Click the button below to browse 10,000+ random server cards starting at just ₹499 with instant auto-verification.
          </p>

          <button
            onClick={scrollToCatalog}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Card Purchase & Catalog (Starting ₹499)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* User Comment Box Section (With hidden admin trigger written in white bold color) */}
        <div className="max-w-2xl mx-auto bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 text-cyan-400" />
              <span>Verified Customer Discussion & Comment Box</span>
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
              Live Feed
            </span>
          </div>

          {/* Comment Box Input (Simulated) */}
          <div className="relative">
            <input 
              type="text"
              readOnly
              placeholder="Leave a verified review or transaction feedback..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 placeholder-slate-500 focus:outline-none cursor-default"
            />
          </div>

          {/* Pinned Moderation Note */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <span>
              Pinned Notice: All card purchases and USDT deposits on Binance ID 1279687280 are checked securely by the verification desk. Once approved, digital voucher keys unlock directly in your My Orders panel.
            </span>
          </div>

          <div className="text-center text-[11px] text-slate-500">
            <span>Feedback verified daily • SSL 256-Bit Ledger Guard</span>
          </div>
        </div>
      </div>
    </section>
  );
};
