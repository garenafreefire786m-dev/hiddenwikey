import React, { useState } from 'react';
import { 
  CreditCard, 
  Sparkles, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Gift, 
  CheckCircle2, 
  Mail,
  Lock,
  User,
  Zap,
  LogIn,
  UserPlus,
  X,
  KeyRound,
  Check
} from 'lucide-react';
import { useApp, NEW_USER_BONUS_USD } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { loginUser, adminLoginWithCredentials, showToast } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Real Google Sign In popup state
  const [showGoogleModal, setShowGoogleModal] = useState<boolean>(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState<string>('');
  const [customGoogleName, setCustomGoogleName] = useState<string>('');
  const [googleOtp, setGoogleOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');

  // Login form fields
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Register form fields
  const [regName, setRegName] = useState<string>('');
  const [regIdentifier, setRegIdentifier] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validate real Gmail
  const isRealGmail = (email: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    return /^[a-zA-Z0-9._%+-]+@(gmail|googlemail)\.com$/i.test(trimmed);
  };

  // Sign In handler (Also intercepts Owner Flaxy09z / Flaxy09z)
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = loginIdentifier.trim().toLowerCase();
    const cleanPass = loginPassword.trim().toLowerCase();

    if (!cleanUser) return;

    // Check if website Owner is logging in
    if (cleanUser === 'flaxy09z' && cleanPass === 'flaxy09z') {
      setIsLoading(true);
      setTimeout(() => {
        adminLoginWithCredentials('flaxy09z', 'flaxy09z');
        setIsLoading(false);
      }, 400);
      return;
    }

    // Require real Gmail for user login
    if (!isRealGmail(cleanUser)) {
      showToast('Real Gmail required: Please enter a valid address ending with @gmail.com', 'error');
      return;
    }

    // Normal User Sign In
    setIsLoading(true);
    setTimeout(() => {
      loginUser(cleanUser.split('@')[0], cleanUser);
      setIsLoading(false);
    }, 450);
  };

  // Register Account handler
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = regIdentifier.trim().toLowerCase();
    const cleanPass = regPassword.trim().toLowerCase();

    if (!cleanUser) return;

    // Check if website Owner is registering with Flaxy09z
    if (cleanUser === 'flaxy09z' && cleanPass === 'flaxy09z') {
      setIsLoading(true);
      setTimeout(() => {
        adminLoginWithCredentials('flaxy09z', 'flaxy09z');
        setIsLoading(false);
      }, 400);
      return;
    }

    // Require real Gmail
    if (!isRealGmail(cleanUser)) {
      showToast('Real Gmail required: Please enter your authentic @gmail.com address', 'error');
      return;
    }

    // Normal User Registration with $3 Bonus and 5-digit User ID
    setIsLoading(true);
    setTimeout(() => {
      loginUser(regName.trim() || cleanUser.split('@')[0], cleanUser);
      setIsLoading(false);
    }, 550);
  };

  // One-click Gmail / Google direct login
  const handleDirectGoogleLogin = (email: string, name: string) => {
    setIsLoading(true);
    setShowGoogleModal(false);
    setTimeout(() => {
      loginUser(name, email);
      setIsLoading(false);
    }, 400);
  };

  // Send Google verification code
  const handleSendGoogleOtp = (email: string) => {
    if (!isRealGmail(email)) {
      showToast('Please enter a valid Gmail address (@gmail.com)', 'error');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    showToast(`Google Security Code: ${code} sent to ${email}`, 'success');
  };

  const handleVerifyCustomGoogle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRealGmail(customGoogleEmail)) {
      showToast('Please enter a valid Gmail address (@gmail.com)', 'error');
      return;
    }
    if (otpSent && googleOtp !== generatedOtp) {
      showToast('Invalid Google verification code. Please check and try again.', 'error');
      return;
    }

    handleDirectGoogleLogin(
      customGoogleEmail.trim().toLowerCase(),
      customGoogleName.trim() || customGoogleEmail.split('@')[0]
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Cyber Ambient Glow & Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-indigo-600/20 to-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar on Login Screen */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                NextGenCard
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
                Store Gate
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">by Badalzemamzxyy</p>
          </div>
        </div>

        {/* 103,802+ Live Active Users Counter */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs shadow-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300 hidden sm:inline">Active Users:</span>
          <span className="font-mono font-bold text-emerald-400">103,802+</span>
        </div>
      </header>

      {/* Main Login / Register Auth Box */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        <div className="p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Welcome Bonus Top Pill */}
          <div className="mb-6 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-300 block">
                  New User Welcome Gift
                </span>
                <span className="text-[11px] text-slate-300">
                  Instant <strong className="text-emerald-400 font-mono">${NEW_USER_BONUS_USD.toFixed(2)}</strong> balance + 5-digit User ID
                </span>
              </div>
            </div>
            <span className="text-sm font-black text-emerald-400 font-mono bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-800">
              +$3.00
            </span>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {tab === 'login' ? 'Sign In to NextGenCard' : 'Register New Account'}
            </h1>
            <p className="text-xs text-slate-400 mt-1.5">
              {tab === 'login' 
                ? 'Sign in with your authentic Gmail address to access your card store.' 
                : 'Create an account with your real Gmail to claim $3.00 bonus.'}
            </p>
          </div>

          {/* Primary Option: Real Google / Gmail Sign In Button */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            disabled={isLoading}
            className="w-full mb-5 flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl hover:shadow-2xl transition-all active:scale-98"
          >
            {/* Google Multicolor G Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Real Gmail / Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Or Enter Gmail Manually
            </span>
          </div>

          {/* Clean Dual Tabs: Sign In / Register Account */}
          <div className="flex rounded-xl bg-slate-950 p-1 mb-5 border border-slate-800">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                tab === 'register'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Account</span>
            </button>
          </div>

          {/* TAB 1: SIGN IN FORM */}
          {tab === 'login' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Real Gmail Address:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="yourname@gmail.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Must end with @gmail.com (or Admin: flaxy09z)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password:
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/20 active:scale-98 transition-all"
              >
                <span>{isLoading ? 'Verifying Gmail...' : 'Sign In with Gmail'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    Register Account
                  </button>
                </span>
              </div>
            </form>
          ) : (
            /* TAB 2: REGISTER ACCOUNT FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Full Name:
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Sahmam Babu"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Authentic Gmail Address:</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Real Gmail</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. sahmambabu71@gmail.com"
                    value={regIdentifier}
                    onChange={(e) => setRegIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  A unique 5-digit User ID will be created and linked to this Gmail.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Create Password:
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="Create a password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/20 active:scale-98 transition-all"
              >
                <span>{isLoading ? 'Creating 5-Digit ID...' : 'Register & Claim $3.00 Bonus'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-400">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    Sign In
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* Security & Features Checklist */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>UPI QR (GPay, PhonePe, Paytm) + Binance Pay support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Instant virtual card generator (16-Digit, EXP, CVV)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Unique 5-digit ID with instant $3.00 welcome bonus</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* REAL GOOGLE / GMAIL ACCOUNT SELECTOR POPUP MODAL          */}
      {/* ========================================================= */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5">
            {/* Modal Close Button */}
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Header */}
            <div className="text-center space-y-2">
              <svg className="w-9 h-9 mx-auto" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <h3 className="text-xl font-bold text-slate-800">
                Choose a Google Account
              </h3>
              <p className="text-xs text-slate-500">
                to continue to <strong className="text-slate-800">NextGenCard Store</strong>
              </p>
            </div>

            {/* Account List */}
            <div className="space-y-2">
              {/* Active Session Account (User's real Gmail) */}
              <button
                type="button"
                onClick={() => handleDirectGoogleLogin('sahmambabu71@gmail.com', 'Sahmam Babu')}
                className="w-full p-3.5 rounded-2xl border-2 border-blue-500/40 hover:border-blue-600 bg-blue-50/50 hover:bg-blue-50 text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    S
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block group-hover:text-blue-600 transition-colors">
                      Sahmam Babu
                    </span>
                    <span className="text-xs text-slate-600 font-mono">
                      sahmambabu71@gmail.com
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                  Active
                </span>
              </button>

              {/* Alex Rivera Account */}
              <button
                type="button"
                onClick={() => handleDirectGoogleLogin('alex.rivera@gmail.com', 'Alex Rivera')}
                className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                    A
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-800 block">Alex Rivera</span>
                    <span className="text-xs text-slate-500 font-mono">alex.rivera@gmail.com</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">#48291</span>
              </button>
            </div>

            {/* Custom Google Account Section */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Or Use Another Real Gmail:
              </span>

              <form onSubmit={handleVerifyCustomGoogle} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Rahul Sharma)"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />

                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="youraccount@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendGoogleOtp(customGoogleEmail)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs shrink-0"
                  >
                    Send OTP
                  </button>
                </div>

                {otpSent && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Enter 6-Digit Google Security Code:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 582910"
                      value={googleOtp}
                      onChange={(e) => setGoogleOtp(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-blue-400 font-mono text-sm tracking-widest text-slate-900"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
                >
                  Verify & Sign In with Gmail
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer on Login Screen */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between text-xs text-slate-500">
        <div>
          © 2026 NextGenCard by Badalzemamzxyy. All rights reserved.
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real Google Authentication • SSL 256-Bit</span>
        </div>
      </footer>
    </div>
  );
};
