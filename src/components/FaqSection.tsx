import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  KeyRound, 
  CreditCard, 
  ShieldAlert, 
  Smartphone, 
  Search, 
  Sparkles,
  MessageSquare,
  QrCode,
  Lock,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FaqItem {
  id: string;
  category: 'redemption' | 'payments' | 'device_lock' | 'account';
  question: string;
  answer: string;
  badge?: string;
}

const FAQ_ITEMS: FaqItem[] = [
  // Key Redemption
  {
    id: 'faq-1',
    category: 'redemption',
    question: 'How do I redeem my generated digital voucher key and virtual card credentials?',
    badge: 'Popular',
    answer: 'Immediately upon checkout via UPI QR, User Wallet, or Binance Pay, your order is provisioned in real time. You will receive a 16-digit Virtual Card Number (e.g. 4532 •••• •••• 9821), expiration date (MM/YY), 3-digit security CVV, and an alphanumeric activation voucher token (e.g. NGC-PRO-XXXX-XXXX). You can copy these credentials directly into your target cloud platform, server console, or digital terminal to unlock your allocated compute, sandbox, or voucher balance instantly. All credentials remain permanently accessible in your "My Orders" tab.',
  },
  {
    id: 'faq-2',
    category: 'redemption',
    question: 'Are digital voucher keys reusable or transferable between accounts?',
    answer: 'No. For maximum cryptographic security and fraud prevention, every generated voucher token is single-use and permanently tied to your 5-digit User ID. Once redeemed on a cloud server cluster or sandbox node, the key transitions to an "ACTIVE & CONSUMED" state on the distributed ledger. If you wish to gift a voucher to another member, you can purchase the card pass directly to their 5-digit User ID during checkout.',
  },
  {
    id: 'faq-3',
    category: 'redemption',
    question: 'What if my voucher key fails to activate or displays an error on the target platform?',
    answer: 'Every voucher and virtual card pass is freshly minted from clean, verified server clusters at the time of purchase. If a third-party host experiences temporary API latency or rejects your token, click the floating 24/7 Live Support button or open a ticket from your account. The platform administrator (Flaxy09z) will verify your Order ID and re-mint a fresh replacement key or issue a full wallet refund within minutes.',
  },

  // Payment Methods
  {
    id: 'faq-4',
    category: 'payments',
    question: 'How does the dynamic UPI QR Code payment system work?',
    badge: 'Instant QR',
    answer: 'When you select "UPI QR" at checkout or wallet deposit, our payment gateway computes the exact price in Indian Rupees (INR) at a live exchange rate (1 USD = ₹86.5) and generates a dynamic high-resolution UPI QR code. You can scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, BHIM, Cred, or Amazon Pay) or transfer to our official UPI ID: flaxy09z@okaxis. Once paid, paste your 12-digit UPI UTR / Transaction Reference ID, and your virtual card credentials (Number, EXP, CVV) are rendered immediately!',
  },
  {
    id: 'faq-5',
    category: 'payments',
    question: 'What is Binance Pay and how do I deposit USDT to my 5-digit User ID?',
    answer: 'Binance Pay is a secure crypto payment rail supporting USDT transfers. To deposit, open your Binance app, navigate to Binance Pay, and send funds to our official Binance Pay ID: 1279687280. The minimum deposit is $15 USD. After sending, copy your Binance Order ID / TxID and submit it via the "Deposit to Wallet" modal. Deposits are verified and credited directly to your permanent 5-digit User ID balance.',
  },
  {
    id: 'faq-6',
    category: 'payments',
    question: 'Can I purchase digital cards directly using my stored 5-digit User ID Wallet balance?',
    answer: 'Yes! Every user account includes an encrypted digital wallet tied to their permanent 5-digit ID (e.g. #48291). New registered users automatically receive a $3.00 welcome bonus. You can recharge your wallet via UPI QR or Binance Pay at any time, and use the stored balance for zero-latency, 1-click card checkouts without having to scan a payment QR code each time.',
  },

  // Device Locking Policy
  {
    id: 'faq-7',
    category: 'device_lock',
    question: 'What is NextGenCard’s Device Locking Policy?',
    badge: 'Security Policy',
    answer: 'To protect your digital passes and cloud server vouchers from credential stuffing, brute-forcing, and multi-tenant unauthorized sharing, NextGenCard enforces a strict Device & Node Lock policy. Upon initial activation of your card voucher on a terminal or server node, the token cryptographically anchors to the hardware fingerprint (MAC/CPU ID) and primary subnet. The voucher cannot be simultaneously initialized across multiple distinct IP addresses without explicit clearance.',
  },
  {
    id: 'faq-8',
    category: 'device_lock',
    question: 'Can I transfer my card pass or reset the device lock to a new machine?',
    answer: 'Yes. If you upgrade your workstation, re-deploy your server node, or rotate your IP address, you can request an instant Device Lock Reset. Simply open the 24/7 Customer Support chat, provide your 5-digit User ID and Order ID, and select "Device Lock Reset". Our support engineers verify your registered Gmail identity and unbind the prior hardware fingerprint within 5 to 15 minutes at zero extra charge.',
  },
  {
    id: 'faq-9',
    category: 'device_lock',
    question: 'What occurs if suspicious or unauthorized concurrent logins are detected?',
    answer: 'If our anomaly detection detects simultaneous redemption attempts from geographically contradictory subnets (e.g. Frankfurt and Tokyo concurrently), the card pass enters a temporary security hold. An automated authorization alert is routed to your verified Gmail address. The pass can be instantly unlocked once you confirm ownership through your registered Gmail session.',
  },

  // Account & Identity
  {
    id: 'faq-10',
    category: 'account',
    question: 'Why is an authentic Google / Gmail address required for account registration?',
    answer: 'To safeguard user wallet balances, enable two-factor recovery, and prevent disposable bot accounts, NextGenCard requires authentication via authentic @gmail.com or Google Workspace credentials. We also offer 1-click Google Sign-In with real account selection and 6-digit Google security code verification.',
  },
  {
    id: 'faq-11',
    category: 'account',
    question: 'How quickly are the 16-digit card number, expiration, and CVV generated?',
    answer: 'Delivery is 100% automated and takes less than 2 seconds. The moment your transaction is confirmed (via Wallet, UPI QR, or Binance Pay), our cryptographic vault generates a random 16-digit card number, valid expiration date (MM/YY), and 3-digit CVV, displayed immediately on a holographic card pass preview with 1-click copy buttons and receipt download.',
  }
];

export const FaqSection: React.FC = () => {
  const { openSupportModal } = useApp();
  const [activeCategory, setActiveCategory] = useState<'all' | 'redemption' | 'payments' | 'device_lock' | 'account'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-4', 'faq-7']);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenIds(FAQ_ITEMS.map((item) => item.id));
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  // Filtered FAQ items based on category and search
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="faq-section" className="py-20 bg-slate-950 relative overflow-hidden border-b border-slate-850">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>KNOWLEDGE BASE & SUPPORT GUIDE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Everything you need to know about instant digital card generation, key redemption, UPI QR and Binance payments, and our strict device locking security policy.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search questions (e.g. key redemption, UPI QR, device lock)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Expand / Collapse Controls */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center text-xs">
              <button
                onClick={expandAll}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                activeCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Questions ({FAQ_ITEMS.length})</span>
            </button>

            <button
              onClick={() => setActiveCategory('redemption')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                activeCategory === 'redemption'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Key Redemption</span>
            </button>

            <button
              onClick={() => setActiveCategory('payments')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                activeCategory === 'payments'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Payment Methods</span>
            </button>

            <button
              onClick={() => setActiveCategory('device_lock')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                activeCategory === 'device_lock'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Device Locking Policy</span>
            </button>

            <button
              onClick={() => setActiveCategory('account')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                activeCategory === 'account'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Account & Security</span>
            </button>
          </div>
        </div>

        {/* Accordion Questions List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No matching questions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any questions matching "{searchQuery}". Try searching for keywords like "UPI", "voucher", "CVV", or "device".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl transition-all duration-200 overflow-hidden border ${
                    isOpen 
                      ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-black/40' 
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  {/* Accordion Trigger */}
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 select-none focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen 
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                          : 'bg-slate-800/80 text-slate-400'
                      }`}>
                        {faq.category === 'redemption' && <KeyRound className="w-4 h-4" />}
                        {faq.category === 'payments' && <QrCode className="w-4 h-4" />}
                        {faq.category === 'device_lock' && <Lock className="w-4 h-4" />}
                        {faq.category === 'account' && <Sparkles className="w-4 h-4" />}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-slate-100 leading-snug">
                          {faq.question}
                        </span>
                        {faq.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                            {faq.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-400 bg-cyan-950/50' : 'text-slate-500'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 pt-3">
                      <p className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still Have Questions CTA Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h4 className="font-extrabold text-base sm:text-lg text-white">
                Still have questions or need assistance?
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Our support engineers and platform admin (Flaxy09z) are active 24/7 to assist with key redemption and device unlocks.
              </p>
            </div>
          </div>

          <button
            onClick={openSupportModal}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950 active:scale-95 transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open 24/7 Live Support</span>
          </button>
        </div>
      </div>
    </section>
  );
};
