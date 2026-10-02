import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  PlusCircle, 
  Search, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText,
  LogOut,
  AlertCircle,
  TrendingUp,
  Inbox,
  ShoppingBag,
  CreditCard,
  Copy,
  ArrowRight,
  Headphones,
  MessageSquare,
  MessageCircle,
  Send,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminPanelModal: React.FC = () => {
  const { 
    activeModal, 
    closeModals, 
    isAdmin, 
    adminLogin,
    adminLoginWithCredentials,
    adminLogout, 
    users, 
    orders, 
    supportMessages,
    sendSupportMessage,
    adminReplySupportMessage,
    adminDeleteSupportMessage,
    adminAddBalance,
    adminApproveDeposit,
    adminRejectDeposit,
    adminApproveCardPurchase,
    adminRejectCardPurchase,
    currentUser,
    showToast 
  } = useApp();

  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [passcode, setPasscode] = useState<string>('');
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [topUpAmount, setTopUpAmount] = useState<string>('25');
  const [searchUserQuery, setSearchUserQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'users' | 'deposits' | 'purchases' | 'support' | 'wallet'>('users');
  const [depositFilter, setDepositFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [purchaseFilter, setPurchaseFilter] = useState<'all' | 'pending' | 'delivered' | 'rejected'>('all');
  const [replyInputMap, setReplyInputMap] = useState<{ [id: string]: string }>({});

  if (activeModal !== 'admin') return null;

  const handleAdminCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername.trim() && adminPassword.trim()) {
      adminLoginWithCredentials(adminUsername, adminPassword);
    } else if (passcode.trim()) {
      adminLogin(passcode);
    }
  };

  const handleCreditBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(topUpAmount);
    if (!targetUserId.trim()) {
      showToast('Please enter a 5-digit User ID', 'error');
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid amount (₹)', 'error');
      return;
    }

    const res = adminAddBalance(targetUserId, amountNum);
    if (res.success) {
      setTopUpAmount('500');
    }
  };

  const handleQuickSelectUser = (id: string) => {
    setTargetUserId(id);
    setActiveTab('wallet');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`, 'success');
  };

  // Filtered dataset slices
  const depositOrders = orders.filter((o) => o.type === 'deposit');
  const cardPurchaseOrders = orders.filter((o) => o.type === 'card_purchase');
  const pendingOrders = orders.filter((o) => o.status === 'pending');

  const filteredDeposits = depositOrders.filter((d) => {
    if (depositFilter === 'all') return true;
    return d.status === depositFilter;
  });

  const filteredPurchases = cardPurchaseOrders.filter((p) => {
    if (purchaseFilter === 'all') return true;
    return p.status === purchaseFilter;
  });

  const filteredUsers = users.filter(
    (u) =>
      u.id.includes(searchUserQuery) ||
      u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  const totalFundedUsd = users.reduce((acc, u) => acc + u.walletBalance, 0);
  const totalDepositsAmount = depositOrders
    .filter((d) => d.status === 'approved')
    .reduce((acc, d) => acc + d.amount, 0);
  const totalPurchasesAmount = cardPurchaseOrders
    .filter((p) => p.status === 'delivered')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden my-6">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-600 p-[1px] shadow-lg shadow-rose-950">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Master Admin Portal</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300">
                  ID: flaxy09z
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Live Data Monitor: Kon-Kon Login Kiya • Kon-Kon Deposit Kiya • Kon-Kon Buy Kiya
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={adminLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white"
                title="Lock admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout Admin</span>
              </button>
            )}
            <button
              onClick={closeModals}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authorized: Login Prompt for username flaxy09z and pass flaxy09z */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-rose-400" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">Admin Authentication Required</h4>
              <p className="text-xs text-slate-400">
                Enter admin credentials (<strong className="text-rose-400 font-mono">flaxy09z</strong>) to view all login data, deposits, and orders.
              </p>
            </div>

            {/* Quick Fill Button */}
            <button
              type="button"
              onClick={() => {
                setAdminUsername('flaxy09z');
                setAdminPassword('flaxy09z');
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-rose-950/40 border border-rose-800/60 hover:bg-rose-950/70 text-[11px] font-mono text-rose-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Click to Autofill:</span>
              <span className="font-bold underline">flaxy09z / flaxy09z</span>
            </button>

            <form onSubmit={handleAdminCredentialsSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Admin Username / ID:
                </label>
                <input
                  type="text"
                  placeholder="flaxy09z"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm text-rose-300 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Admin Password:
                </label>
                <input
                  type="password"
                  placeholder="flaxy09z"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm text-rose-300 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-950 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Open Admin Dashboard</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authorized Admin View with All Data requested */
          <div className="p-6 space-y-6">
            {/* Quick Overview Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div 
                onClick={() => setActiveTab('users')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  activeTab === 'users' ? 'bg-cyan-950/40 border-cyan-500 shadow-lg' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Kon Login Kiya</span>
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-lg font-black text-white font-mono">{users.length} Users</span>
                <span className="text-[9px] text-cyan-400 block mt-0.5">Click to view list</span>
              </div>

              <div 
                onClick={() => setActiveTab('deposits')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  activeTab === 'deposits' ? 'bg-amber-950/40 border-amber-500 shadow-lg' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Kon Deposit Kiya</span>
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-lg font-black text-amber-400 font-mono">
                  {depositOrders.length} Deposits
                </span>
                <span className="text-[9px] text-amber-400/80 block mt-0.5 font-mono">
                  ₹{totalDepositsAmount.toLocaleString('en-IN')} Approved
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('purchases')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  activeTab === 'purchases' ? 'bg-indigo-950/40 border-indigo-500 shadow-lg' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Kon Buy Kiya</span>
                  <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-lg font-black text-indigo-300 font-mono">
                  {cardPurchaseOrders.length} Cards
                </span>
                <span className="text-[9px] text-indigo-400/80 block mt-0.5 font-mono">
                  ₹{totalPurchasesAmount.toLocaleString('en-IN')} Done
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('support')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  activeTab === 'support' ? 'bg-teal-950/40 border-teal-500 shadow-lg' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Customer Support</span>
                  <Headphones className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <span className="text-lg font-black text-teal-300 font-mono">
                  {supportMessages.length} Messages
                </span>
                <span className="text-[9px] text-teal-400 block mt-0.5 font-mono">
                  {supportMessages.filter(m => m.status === 'unread').length} Unread New
                </span>
              </div>

              <div 
                onClick={() => {
                  if (pendingOrders.some(o => o.type === 'deposit')) {
                    setActiveTab('deposits');
                  } else {
                    setActiveTab('purchases');
                  }
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  pendingOrders.length > 0 
                    ? 'bg-rose-950/50 border-rose-500 shadow-lg' 
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Pending Actions</span>
                  <Clock className={`w-3.5 h-3.5 ${pendingOrders.length > 0 ? 'text-rose-400 animate-spin' : 'text-slate-500'}`} />
                </div>
                <span className={`text-lg font-black font-mono ${pendingOrders.length > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
                  {pendingOrders.length} Waiting
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  {pendingOrders.length > 0 ? 'Needs action' : 'All clear'}
                </span>
              </div>
            </div>

            {/* Navigation Tabs explicitly matching user prompt */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
              {/* TAB 1: KON-KON LOGIN KIYA */}
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Kon-Kon Login Kiya ({users.length})</span>
              </button>

              {/* TAB 2: KON-KON DEPOSIT KIYA */}
              <button
                onClick={() => setActiveTab('deposits')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'deposits'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Kon-Kon Deposit Kiya ({depositOrders.length})</span>
                {depositOrders.filter(d => d.status === 'pending').length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-[10px] flex items-center justify-center">
                    {depositOrders.filter(d => d.status === 'pending').length}
                  </span>
                )}
              </button>

              {/* TAB 3: KON-KON BUY KIYA */}
              <button
                onClick={() => setActiveTab('purchases')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'purchases'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-indigo-400" />
                <span>Kon-Kon Buy Kiya ({cardPurchaseOrders.length})</span>
                {cardPurchaseOrders.filter(p => p.status === 'pending').length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-mono font-black text-[10px] flex items-center justify-center">
                    {cardPurchaseOrders.filter(p => p.status === 'pending').length}
                  </span>
                )}
              </button>

              {/* TAB 4: CUSTOMER SUPPORT */}
              <button
                onClick={() => setActiveTab('support')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'support'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Headphones className="w-4 h-4 text-teal-400" />
                <span>Customer Support ({supportMessages.length})</span>
                {supportMessages.filter(m => m.status === 'unread').length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-teal-400 text-slate-950 font-mono font-black text-[10px] flex items-center justify-center animate-pulse">
                    {supportMessages.filter(m => m.status === 'unread').length}
                  </span>
                )}
              </button>

              {/* TAB 5: MANUAL ADD BALANCE */}
              <button
                onClick={() => setActiveTab('wallet')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'wallet'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Add $ to 5-Digit ID</span>
              </button>
            </div>

            {/* ======================================================== */}
            {/* VIEW 1: KON-KON LOGIN KIYA (USERS DIRECTORY & LOGINS)    */}
            {/* ======================================================== */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span>Logins & Registered User Accounts ({users.length} Users)</span>
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Sabhi users jinhone login kiya hai, unka permanent 5-digit ID, Gmail, join date aur current balance yahan live dikhta hai.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search ID, Name or Email..."
                      value={searchUserQuery}
                      onChange={(e) => setSearchUserQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/95 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">5-Digit User ID</th>
                          <th className="p-3.5">User Name</th>
                          <th className="p-3.5">Gmail / Account</th>
                          <th className="p-3.5">Wallet Balance (₹)</th>
                          <th className="p-3.5">Joined / Login Date</th>
                          <th className="p-3.5 text-center">Status</th>
                          <th className="p-3.5 text-right">Quick Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                        {filteredUsers.map((u) => {
                          const userDeposits = depositOrders.filter(d => d.userId === u.id);
                          const userPurchases = cardPurchaseOrders.filter(p => p.userId === u.id);

                          return (
                            <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-cyan-400">
                                <span className="bg-cyan-950 px-2 py-1 rounded border border-cyan-800">
                                  #{u.id}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <span className="font-bold text-white block">{u.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {userPurchases.length} Buys • {userDeposits.length} Deposits
                                </span>
                              </td>
                              <td className="p-3.5 text-slate-300 font-mono text-xs">{u.email}</td>
                              <td className="p-3.5 font-mono font-extrabold text-emerald-400 text-sm">
                                ₹{u.walletBalance.toLocaleString('en-IN')}
                              </td>
                              <td className="p-3.5 text-slate-400 font-mono text-[11px]">{u.createdAt}</td>
                              <td className="p-3.5 text-center">
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Active
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => handleQuickSelectUser(u.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700 hover:border-emerald-400 text-emerald-300 font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all"
                                >
                                  + Add Balance
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 2: KON-KON DEPOSIT KIYA (BINANCE USDT & QR DEPOSITS)*/}
            {/* ======================================================== */}
            {activeTab === 'deposits' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Kon-Kon Deposit Kiya (Binance USDT Deposits)</span>
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Accept karne par automatically us user ke 5-digit ID par USDT/USD add ho jayega. Reject karne par cancel ho jayega.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <button
                      onClick={() => setDepositFilter('all')}
                      className={`px-2.5 py-1 rounded-lg ${depositFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}
                    >
                      All ({depositOrders.length})
                    </button>
                    <button
                      onClick={() => setDepositFilter('pending')}
                      className={`px-2.5 py-1 rounded-lg ${depositFilter === 'pending' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Pending ({depositOrders.filter(d => d.status === 'pending').length})
                    </button>
                    <button
                      onClick={() => setDepositFilter('approved')}
                      className={`px-2.5 py-1 rounded-lg ${depositFilter === 'approved' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Accepted ({depositOrders.filter(d => d.status === 'approved').length})
                    </button>
                    <button
                      onClick={() => setDepositFilter('rejected')}
                      className={`px-2.5 py-1 rounded-lg ${depositFilter === 'rejected' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Rejected ({depositOrders.filter(d => d.status === 'rejected').length})
                    </button>
                  </div>
                </div>

                {filteredDeposits.length === 0 ? (
                  <div className="py-14 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <CheckCircle2 className="w-9 h-9 text-slate-500 mx-auto" />
                    <p className="text-sm font-bold text-slate-300">No deposits found under "{depositFilter}" filter.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredDeposits.map((dep) => (
                      <div
                        key={dep.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          dep.status === 'pending'
                            ? 'bg-amber-950/20 border-amber-500/50 shadow-xl'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-sm text-white">{dep.id}</span>
                            <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                              User ID: #{dep.userId}
                            </span>
                            <span className="text-xs text-slate-300 font-medium">({dep.userEmail})</span>
                            
                            {dep.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500 text-amber-300 animate-pulse">
                                <Clock className="w-3 h-3" />
                                Payment Pending Approval
                              </span>
                            )}
                            {dep.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300">
                                <CheckCircle2 className="w-3 h-3" />
                                Accepted & Credited
                              </span>
                            )}
                            {dep.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500 text-rose-300">
                                <XCircle className="w-3 h-3" />
                                Rejected
                              </span>
                            )}
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 font-mono text-xs flex flex-wrap items-center gap-4 sm:gap-6">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Deposit Amount:</span>
                              <span className="text-base font-black text-emerald-400">
                                ₹{dep.amount.toLocaleString('en-IN')} {dep.paymentMethod === 'binance' ? '(USDT Converted)' : '(UPI INR)'}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-500 block">Binance Pay TxID / UTR:</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-amber-400 font-bold">{dep.utrNumber || 'N/A'}</span>
                                {dep.utrNumber && (
                                  <button
                                    onClick={() => copyToClipboard(dep.utrNumber || '', 'TxID')}
                                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-500 block">Binance Destination:</span>
                              <span className="text-slate-300">Pay ID: 1279687280</span>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-500 block">Requested At:</span>
                              <span className="text-slate-400">{dep.timestamp}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          {dep.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => adminRejectDeposit(dep.id)}
                                className="px-3.5 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
                              >
                                <XCircle className="w-4 h-4 text-rose-400" />
                                <span>Reject</span>
                              </button>

                              <button
                                onClick={() => adminApproveDeposit(dep.id)}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-950 transition-all active:scale-95 flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Accept (+${dep.amount.toFixed(2)})</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-500 font-mono">
                              {dep.status === 'approved' ? '✓ Credited to User Wallet' : '✗ Request Declined'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 3: KON-KON BUY KIYA (ALL CARD PURCHASES & ORDERS)   */}
            {/* ======================================================== */}
            {activeTab === 'purchases' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-indigo-400" />
                      <span>Kon-Kon Buy Kiya (Digital Card Purchases & Approval)</span>
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      User ne buy kiya to "Order Approval Wait" me aayega. Admin approve karega tab digital voucher code deliver hoga.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <button
                      onClick={() => setPurchaseFilter('all')}
                      className={`px-2.5 py-1 rounded-lg ${purchaseFilter === 'all' ? 'bg-indigo-500 text-white font-bold' : 'bg-slate-900 text-slate-400'}`}
                    >
                      All ({cardPurchaseOrders.length})
                    </button>
                    <button
                      onClick={() => setPurchaseFilter('pending')}
                      className={`px-2.5 py-1 rounded-lg ${purchaseFilter === 'pending' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Approval Wait ({cardPurchaseOrders.filter(p => p.status === 'pending').length})
                    </button>
                    <button
                      onClick={() => setPurchaseFilter('delivered')}
                      className={`px-2.5 py-1 rounded-lg ${purchaseFilter === 'delivered' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Delivered ({cardPurchaseOrders.filter(p => p.status === 'delivered').length})
                    </button>
                    <button
                      onClick={() => setPurchaseFilter('rejected')}
                      className={`px-2.5 py-1 rounded-lg ${purchaseFilter === 'rejected' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Rejected ({cardPurchaseOrders.filter(p => p.status === 'rejected').length})
                    </button>
                  </div>
                </div>

                {filteredPurchases.length === 0 ? (
                  <div className="py-14 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <CheckCircle2 className="w-9 h-9 text-slate-500 mx-auto" />
                    <p className="text-sm font-bold text-slate-300">No card purchases found under "{purchaseFilter}" filter.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredPurchases.map((ord) => (
                      <div
                        key={ord.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          ord.status === 'pending'
                            ? 'bg-amber-950/20 border-amber-500/50 shadow-xl'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-sm text-white">{ord.id}</span>
                            <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                              Buyer ID: #{ord.userId}
                            </span>
                            <span className="text-xs text-slate-300 font-medium">({ord.userEmail})</span>

                            {ord.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500 text-amber-300 animate-pulse">
                                <Clock className="w-3 h-3" />
                                Order Approval Wait
                              </span>
                            )}
                            {ord.status === 'delivered' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300">
                                <CheckCircle2 className="w-3 h-3" />
                                Approved & Delivered
                              </span>
                            )}
                            {ord.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500 text-rose-300">
                                <XCircle className="w-3 h-3" />
                                Rejected & Refunded
                              </span>
                            )}
                          </div>

                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{ord.cardName}</span>
                            {ord.serverRegion && (
                              <span className="text-[11px] font-normal text-cyan-400 font-mono">
                                • {ord.serverRegion}
                              </span>
                            )}
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 font-mono text-xs flex flex-wrap items-center gap-4 sm:gap-6">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Price Paid:</span>
                              <span className="text-base font-black text-emerald-400">
                                ₹{ord.amount.toLocaleString('en-IN')}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-500 block">Payment Source:</span>
                              <span className="text-cyan-400 font-bold uppercase">{ord.paymentMethod}</span>
                            </div>

                            {ord.voucherCode && (
                              <div>
                                <span className="text-[10px] text-slate-500 block">Voucher Pass Code:</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-emerald-300 font-bold">{ord.voucherCode}</span>
                                  <button
                                    onClick={() => copyToClipboard(ord.voucherCode || '', 'Voucher Code')}
                                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {ord.cardNumber && (
                              <div>
                                <span className="text-[10px] text-slate-500 block">Virtual Card (No. / EXP / CVV):</span>
                                <div className="flex items-center gap-1.5 font-mono text-cyan-300 font-bold text-xs">
                                  <span>{ord.cardNumber}</span>
                                  <span className="text-emerald-400">Exp: {ord.cardExp}</span>
                                  <span className="text-amber-400">CVV: {ord.cardCvv}</span>
                                </div>
                              </div>
                            )}

                            <div>
                              <span className="text-[10px] text-slate-500 block">Order Timestamp:</span>
                              <span className="text-slate-400">{ord.timestamp}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          {ord.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => adminRejectCardPurchase(ord.id)}
                                className="px-3.5 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
                                title="Reject order and refund user wallet"
                              >
                                <XCircle className="w-4 h-4 text-rose-400" />
                                <span>Reject & Refund</span>
                              </button>

                              <button
                                onClick={() => adminApproveCardPurchase(ord.id)}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-950 transition-all active:scale-95 flex items-center gap-1.5"
                                title="Approve order and deliver card voucher code"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Approve & Deliver Card</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-500 font-mono">
                              {ord.status === 'delivered' ? '✓ Card Delivered' : '✗ Cancelled & Refunded'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 4: CUSTOMER SUPPORT & LIVE INQUIRIES               */}
            {/* ======================================================== */}
            {activeTab === 'support' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-teal-400" />
                      <span>Customer Support Inquiries & Tickets ({supportMessages.length})</span>
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Customers jo bhi message bhejte hain, yahan real-time live show hota hai. Aap unke ticket ka direct reply bhej sakte hain.
                    </p>
                  </div>

                  <span className="font-mono text-xs text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-800">
                    {supportMessages.filter(m => m.status === 'unread').length} New Unread Messages
                  </span>
                </div>

                {supportMessages.length === 0 ? (
                  <div className="py-14 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <CheckCircle2 className="w-9 h-9 text-slate-500 mx-auto" />
                    <p className="text-sm font-bold text-slate-300">No support inquiries right now.</p>
                    <p className="text-xs text-slate-500">Jab koi user support chat par message karega, yahan turant display hoga.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {supportMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                          msg.status === 'unread'
                            ? 'bg-teal-950/20 border-teal-500/50 shadow-xl'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        {/* Top Message Meta */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-white">{msg.id}</span>
                            <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                              User ID: #{msg.userId}
                            </span>
                            <span className="font-bold text-slate-200 text-xs">{msg.userName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">({msg.userEmail})</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                            {msg.status === 'unread' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-teal-950 border border-teal-500 text-teal-300 animate-pulse">
                                <Clock className="w-3 h-3" />
                                Unread Inquiry
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300">
                                <CheckCircle2 className="w-3 h-3" />
                                Replied
                              </span>
                            )}
                            <button
                              onClick={() => adminDeleteSupportMessage(msg.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                              title="Delete message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Customer Message Bubble */}
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-medium leading-relaxed">
                          <span className="text-[10px] text-teal-400 font-mono uppercase block mb-1 font-bold">
                            Customer Message:
                          </span>
                          {msg.message}
                        </div>

                        {/* Existing Admin Reply if already replied */}
                        {msg.reply && (
                          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono font-semibold">
                              <span>✓ Desk Sent Reply:</span>
                              <span>{msg.replyTimestamp}</span>
                            </div>
                            <p className="text-emerald-200 font-medium">{msg.reply}</p>
                          </div>
                        )}

                        {/* Admin Reply Input Box */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Type official reply to this customer..."
                            value={replyInputMap[msg.id] || ''}
                            onChange={(e) => setReplyInputMap({ ...replyInputMap, [msg.id]: e.target.value })}
                            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                          />
                          <button
                            onClick={() => {
                              const text = (replyInputMap[msg.id] || '').trim();
                              if (text) {
                                adminReplySupportMessage(msg.id, text);
                                setReplyInputMap({ ...replyInputMap, [msg.id]: '' });
                              }
                            }}
                            disabled={!(replyInputMap[msg.id] || '').trim()}
                            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-bold text-xs transition-all flex items-center gap-1.5 shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Reply</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 5: MANUAL ADD $ TO USER WALLET BY 5-DIGIT ID        */}
            {/* ======================================================== */}
            {activeTab === 'wallet' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-white">Manual Add Funds (₹) to User Wallet by 5-Digit ID</h4>
                    <p className="text-[11px] text-slate-400">
                      Enter the 5-digit User ID. Funds will be credited immediately to their balance in Rupees (₹).
                    </p>
                  </div>

                  <form onSubmit={handleCreditBalance} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Target 5-Digit User ID:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 48291"
                        value={targetUserId}
                        onChange={(e) => setTargetUserId(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-base text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                      {currentUser && currentUser.id === targetUserId && (
                        <span className="text-[10px] text-emerald-400 mt-1 block">
                          ✓ This matches your current session ({currentUser.name})!
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Amount to Credit (₹ Rupees):
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-400">₹</span>
                        <input
                          type="number"
                          step="1"
                          placeholder="500"
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-base text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        {['250', '500', '1000', '2500'].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setTopUpAmount(amt)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-slate-300"
                          >
                            +₹{amt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950 active:scale-98 transition-all flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Credit ${parseFloat(topUpAmount || '0').toFixed(2)} to User ID</span>
                    </button>
                  </form>
                </div>

                <div className="md:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Quick Select Active User
                  </span>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {users.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => handleQuickSelectUser(u.id)}
                        className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between ${
                          targetUserId === u.id
                            ? 'bg-cyan-950/40 border-cyan-500'
                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{u.name}</span>
                            <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                              ID: #{u.id}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">{u.email}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-xs text-emerald-400 block">
                            ${u.walletBalance.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-cyan-400 hover:underline">Select & Top-up</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
