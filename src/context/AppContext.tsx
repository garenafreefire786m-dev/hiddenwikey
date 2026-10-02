import React, { createContext, useContext, useEffect, useState } from 'react';
import { CardItem, Order, User, SupportMessage } from '../types';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  orders: Order[];
  supportMessages: SupportMessage[];
  isAdmin: boolean;
  activeModal: 'checkout' | 'admin' | 'auth' | 'walletRecharge' | 'orderSuccess' | 'myOrders' | 'orderPendingApproval' | 'support' | 'sessionRenewal' | null;
  selectedCard: CardItem | null;
  latestOrder: Order | null;
  toasts: ToastState[];
  sessionKey: string;
  sessionSecondsRemaining: number;
  sessionExpiryTimestamp: number;
  isSessionExpiringSoon: boolean;
  sessionExpired: boolean;
  isWarningDismissed: boolean;
  browserNotificationPermission: NotificationPermission | 'unsupported';
  renewSessionKey: (additionalMinutes?: number) => void;
  setSessionToWarningDemo: () => void;
  requestBrowserNotificationPermission: () => Promise<string>;
  dismissExpiryWarning: () => void;
  openRenewalModal: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: number) => void;
  openCheckout: (card: CardItem) => void;
  openAdmin: () => void;
  openAuth: () => void;
  openWalletRecharge: () => void;
  openMyOrders: () => void;
  openSupportModal: () => void;
  sendSupportMessage: (message: string) => void;
  adminReplySupportMessage: (messageId: string, replyText: string) => void;
  adminDeleteSupportMessage: (messageId: string) => void;
  closeModals: () => void;
  loginUser: (name: string, email: string) => void;
  logoutUser: () => void;
  adminLogin: (passcode: string) => boolean;
  adminLoginWithCredentials: (username: string, pass: string) => boolean;
  adminLogout: () => void;
  adminAddBalance: (targetUserId: string, amount: number) => { success: boolean; message: string };
  submitDepositRequest: (amount: number, utrNumber: string, method?: 'binance' | 'upi') => Order;
  adminApproveDeposit: (orderId: string) => { success: boolean; message: string };
  adminRejectDeposit: (orderId: string, reason?: string) => { success: boolean; message: string };
  adminApproveCardPurchase: (orderId: string) => { success: boolean; message: string };
  adminRejectCardPurchase: (orderId: string, reason?: string) => { success: boolean; message: string };
  processPayment: (
    card: CardItem,
    paymentMethod: 'upi' | 'wallet' | 'usdt' | 'binance',
    utrNumber?: string
  ) => Promise<{ success: boolean; order?: Order; message?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate random 5-digit user ID
export function generate5DigitUserId(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export const BINANCE_PAY_ID = '1279687280';
export const OFFICIAL_UPI_ID = 'flaxy09z@okaxis';
export const USD_TO_INR_RATE = 86.5;
export const MIN_DEPOSIT_INR = 200;
export const MIN_DEPOSIT_USD = 10;
export const NEW_USER_BONUS_INR = 250.0;
export const NEW_USER_BONUS_USD = 250.0; // Alias for backward compatibility

// Generate realistic virtual card credentials (16 digits, EXP MM/YY, 3-digit CVV)
export function generateVirtualCardDetails(userName: string) {
  const prefixes = ['4532', '4111', '5243', '5512', '4916'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const p2 = Math.floor(1000 + Math.random() * 9000).toString();
  const p3 = Math.floor(1000 + Math.random() * 9000).toString();
  const p4 = Math.floor(1000 + Math.random() * 9000).toString();
  const cardNumber = `${prefix} ${p2} ${p3} ${p4}`;

  const month = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
  const year = (29 + Math.floor(Math.random() * 4)).toString();
  const cardExp = `${month}/${year}`;

  const cardCvv = Math.floor(100 + Math.random() * 900).toString();

  return {
    cardNumber,
    cardExp,
    cardCvv,
    cardHolderName: (userName || 'NEXTGEN MEMBER').toUpperCase(),
  };
}

const INITIAL_USERS: User[] = [
  {
    id: '48291',
    name: 'Alex Rivera',
    email: 'alex.rivera@gmail.com',
    walletBalance: 1250.0, // Initial balance in Rupees
    createdAt: '2026-09-28',
    role: 'user',
  },
  {
    id: '10928',
    name: 'Vikram Singh',
    email: 'vikram.cloud@gmail.com',
    walletBalance: 850.0,
    createdAt: '2026-09-25',
    role: 'user',
  },
  {
    id: '73412',
    name: 'Sarah Chen',
    email: 'sarah.c@gmail.com',
    walletBalance: 2450.0,
    createdAt: '2026-09-27',
    role: 'user',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    userId: '48291',
    userEmail: 'alex.rivera@gmail.com',
    type: 'card_purchase',
    cardId: 'CARD-1',
    cardName: 'NextGen Alpha Core Pass #0101',
    amount: 499,
    serverRegion: 'US-East (N. Virginia)',
    paymentMethod: 'wallet',
    status: 'delivered',
    timestamp: '2026-09-30 21:14:02',
    voucherCode: 'NGC-ALPHA-9821-X992-KLA7',
    cardNumber: '4532 8921 5410 9821',
    cardExp: '10/30',
    cardCvv: '741',
    cardHolderName: 'ALEX RIVERA',
  },
];

export const INITIAL_SUPPORT_MESSAGES: SupportMessage[] = [
  {
    id: 'MSG-8801',
    userId: '48291',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@gmail.com',
    message: 'Hello, I deposited $25 USDT on Binance Pay ID 1279687280 with TxID #987216345. Please check and credit my wallet.',
    timestamp: 'Today, 02:40 PM',
    status: 'replied',
    reply: 'Your deposit was verified and ₹2,163 has been credited to your 5-digit wallet #48291. Thank you!',
    replyTimestamp: 'Today, 02:45 PM',
  },
  {
    id: 'MSG-8802',
    userId: '10928',
    userName: 'Vikram Singh',
    userEmail: 'vikram.cloud@gmail.com',
    message: 'Sir I want to purchase the ₹999 Pro Tier with ₹15,000 balance. Will the token key activate immediately?',
    timestamp: 'Today, 03:10 PM',
    status: 'unread',
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start logged out if no saved session, so login page appears first
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ngc_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ngc_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ngc_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>(() => {
    const saved = localStorage.getItem('ngc_support_messages');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_MESSAGES;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('ngc_is_admin') === 'true';
  });

  const [activeModal, setActiveModal] = useState<
    'checkout' | 'admin' | 'auth' | 'walletRecharge' | 'orderSuccess' | 'myOrders' | 'orderPendingApproval' | 'support' | 'sessionRenewal' | null
  >(null);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Sync users to localStorage
  useEffect(() => {
    localStorage.setItem('ngc_users', JSON.stringify(users));
  }, [users]);

  // Sync currentUser to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ngc_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ngc_current_user');
    }
  }, [currentUser]);

  // Sync orders
  useEffect(() => {
    localStorage.setItem('ngc_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync support messages
  useEffect(() => {
    localStorage.setItem('ngc_support_messages', JSON.stringify(supportMessages));
  }, [supportMessages]);

  // Sync admin state
  useEffect(() => {
    localStorage.setItem('ngc_is_admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  // Active session key & timer tracking
  const [sessionKey, setSessionKey] = useState<string>(() => {
    const saved = localStorage.getItem('ngc_session_key');
    return saved || 'NGC-SESS-48291-K992';
  });

  const [sessionExpiryTimestamp, setSessionExpiryTimestamp] = useState<number>(() => {
    const saved = localStorage.getItem('ngc_session_expiry');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed > Date.now()) return parsed;
    }
    // Default 15 minutes (900 seconds)
    const initialExpiry = Date.now() + 15 * 60 * 1000;
    localStorage.setItem('ngc_session_expiry', initialExpiry.toString());
    return initialExpiry;
  });

  const [sessionSecondsRemaining, setSessionSecondsRemaining] = useState<number>(() => {
    return Math.max(0, Math.floor((sessionExpiryTimestamp - Date.now()) / 1000));
  });

  const [isWarningDismissed, setIsWarningDismissed] = useState<boolean>(false);
  const [hasNotifiedBrowser, setHasNotifiedBrowser] = useState<boolean>(false);
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const isSessionExpiringSoon = sessionSecondsRemaining <= 120 && sessionSecondsRemaining > 0;
  const sessionExpired = sessionSecondsRemaining <= 0;

  // Request browser notification permission
  const requestBrowserNotificationPermission = async (): Promise<string> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('Browser notifications are not supported in this environment', 'info');
      return 'unsupported';
    }
    try {
      const perm = await Notification.requestPermission();
      setBrowserNotificationPermission(perm);
      if (perm === 'granted') {
        showToast('Browser notifications enabled! Alert will fire when session key < 2 min remaining.', 'success');
        try {
          new Notification('NextGenCard Security Vault', {
            body: 'Browser alerts activated! We will notify you when session key has < 2 min left.',
            icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
          });
        } catch {}
      } else {
        showToast('Notification permission was not granted.', 'info');
      }
      return perm;
    } catch {
      return 'denied';
    }
  };

  // Dispatch real browser notification
  const triggerBrowserExpiryNotification = (secs: number) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification('⚠️ NextGenCard: Session Key Expiring Soon!', {
          body: `Your active session key (${sessionKey}) has less than 2 minutes remaining (${secs}s left). Click to purchase a renewal pass now!`,
          icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
          tag: 'session-expiry-warning',
          requireInteraction: true,
        });
        notif.onclick = () => {
          window.focus();
          setActiveModal('sessionRenewal');
        };
      } catch (err) {
        console.error('Notification dispatch error:', err);
      }
    }
  };

  // 1-Second session heartbeat
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((sessionExpiryTimestamp - Date.now()) / 1000));
      setSessionSecondsRemaining(remaining);

      // Trigger browser notification when less than 2 minutes (120 seconds)
      if (remaining <= 120 && remaining > 0 && !hasNotifiedBrowser) {
        setHasNotifiedBrowser(true);
        triggerBrowserExpiryNotification(remaining);
        showToast(`⚠️ Session Key Expiring in ${Math.floor(remaining / 60)}m ${remaining % 60}s! Purchase a renewal to avoid disconnection.`, 'error');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionExpiryTimestamp, hasNotifiedBrowser, sessionKey]);

  const renewSessionKey = (additionalMinutes = 30) => {
    const newExpiry = Date.now() + additionalMinutes * 60 * 1000;
    const newKey = `NGC-SESS-${currentUser?.id || '48291'}-${Math.floor(1000 + Math.random() * 9000)}`;
    setSessionExpiryTimestamp(newExpiry);
    setSessionKey(newKey);
    localStorage.setItem('ngc_session_expiry', newExpiry.toString());
    localStorage.setItem('ngc_session_key', newKey);
    setHasNotifiedBrowser(false);
    setIsWarningDismissed(false);
    setActiveModal(null);
    showToast(`Session key successfully renewed! +${additionalMinutes}m added. Active Key: ${newKey}`, 'success');
  };

  const setSessionToWarningDemo = () => {
    // Set to 110s (less than 2 minutes)
    const demoExpiry = Date.now() + 110 * 1000;
    setSessionExpiryTimestamp(demoExpiry);
    localStorage.setItem('ngc_session_expiry', demoExpiry.toString());
    setHasNotifiedBrowser(false);
    setIsWarningDismissed(false);
    showToast('Session key set to 1m 50s remaining! (< 2 min alert triggered)', 'info');
  };

  const dismissExpiryWarning = () => {
    setIsWarningDismissed(true);
  };

  const openRenewalModal = () => {
    setActiveModal('sessionRenewal');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openCheckout = (card: CardItem) => {
    setSelectedCard(card);
    setActiveModal('checkout');
  };

  const openAdmin = () => {
    setActiveModal('admin');
  };

  const openAuth = () => {
    setActiveModal('auth');
  };

  const openWalletRecharge = () => {
    setActiveModal('walletRecharge');
  };

  const openSupportModal = () => {
    setActiveModal('support');
  };

  const sendSupportMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: SupportMessage = {
      id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser?.id || 'GUEST',
      userName: currentUser?.name || 'Customer',
      userEmail: currentUser?.email || 'customer@gmail.com',
      message: text.trim(),
      timestamp: `Today, ${timeStr}`,
      status: 'unread',
    };
    setSupportMessages((prev) => [newMsg, ...prev]);
    showToast('Customer support message sent! Showing live in Admin Panel.', 'success');
  };

  const adminReplySupportMessage = (messageId: string, replyText: string) => {
    if (!replyText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSupportMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              status: 'replied',
              reply: replyText.trim(),
              replyTimestamp: `Today, ${timeStr}`,
            }
          : m
      )
    );
    showToast('Reply dispatched to customer ticket!', 'success');
  };

  const adminDeleteSupportMessage = (messageId: string) => {
    setSupportMessages((prev) => prev.filter((m) => m.id !== messageId));
    showToast('Message deleted from records', 'info');
  };

  const closeModals = () => {
    setActiveModal(null);
  };

  // Gmail Login / Registration with ₹250 welcome bonus & 5-digit User ID
  const loginUser = (name: string, email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      setCurrentUser(existing);
      showToast(`Welcome back, ${existing.name}! (User ID: ${existing.id})`, 'success');
    } else {
      const newUserId = generate5DigitUserId();
      const newUser: User = {
        id: newUserId,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        walletBalance: NEW_USER_BONUS_INR, // ₹250 bonus for new user
        createdAt: new Date().toISOString().split('T')[0],
        role: 'user',
      };
      setUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
      showToast(`Welcome! You received a ₹${NEW_USER_BONUS_INR} bonus. Your 5-digit User ID is #${newUserId}`, 'success');
    }
    setActiveModal(null);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Signed out of NextGenCard', 'info');
  };

  // Admin / Owner login with username Flaxy09z and pass Flaxy09z (case-insensitive)
  const adminLoginWithCredentials = (username: string, pass: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim().toLowerCase();

    if (cleanUser === 'flaxy09z' && cleanPass === 'flaxy09z') {
      setIsAdmin(true);
      const adminUser: User = {
        id: '00001',
        name: 'Website Owner (Flaxy09z)',
        email: 'flaxy09z@owner.panel',
        walletBalance: 99999.00,
        createdAt: new Date().toISOString().split('T')[0],
        role: 'admin',
      };
      setCurrentUser(adminUser);
      setActiveModal('admin');
      showToast('Welcome Owner Flaxy09z! Loading Master Website Data...', 'success');
      return true;
    }
    showToast('Invalid credentials. Check your username and password.', 'error');
    return false;
  };

  // Admin login with passcode or ID flaxy09z
  const adminLogin = (passcode: string): boolean => {
    if (passcode.trim() === 'flaxy09z' || passcode.trim() === '08') {
      setIsAdmin(true);
      showToast('Admin access granted', 'success');
      return true;
    }
    showToast('Incorrect Admin passcode/ID. Use flaxy09z', 'error');
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    showToast('Admin session locked', 'info');
  };

  // Admin adds balance to any 5-digit user ID
  const adminAddBalance = (targetUserId: string, amount: number) => {
    const cleanId = targetUserId.trim();
    if (!cleanId) {
      return { success: false, message: 'Please enter a 5-digit User ID' };
    }

    if (isNaN(amount) || amount <= 0) {
      return { success: false, message: 'Please specify a valid positive amount (₹)' };
    }

    const userIndex = users.findIndex((u) => u.id === cleanId);
    if (userIndex === -1) {
      return { success: false, message: `No user found with 5-digit ID: ${cleanId}` };
    }

    const updatedUsers = [...users];
    const targetUser = updatedUsers[userIndex];
    const newBalance = +(targetUser.walletBalance + amount).toFixed(2);
    updatedUsers[userIndex] = {
      ...targetUser,
      walletBalance: newBalance,
    };
    setUsers(updatedUsers);

    // If current logged-in user is the target, update their session balance immediately
    if (currentUser && currentUser.id === cleanId) {
      setCurrentUser({
        ...currentUser,
        walletBalance: newBalance,
      });
    }

    showToast(`Added ₹${amount.toLocaleString('en-IN')} to User ID #${cleanId}!`, 'success');
    return {
      success: true,
      message: `Credited ₹${amount.toLocaleString('en-IN')} to ${targetUser.name} (#${cleanId}). New Balance: ₹${newBalance.toLocaleString('en-IN')}`,
    };
  };

  const openMyOrders = () => {
    setActiveModal('myOrders');
  };

  // Submit Deposit Request (UPI QR or Binance) into Pending state
  const submitDepositRequest = (
    amount: number, 
    utrNumber: string, 
    method: 'binance' | 'upi' = 'upi'
  ): Order => {
    if (!currentUser) {
      throw new Error('User must be logged in to deposit');
    }

    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    // If UPI: amount is direct INR (₹). If Binance: amount in USD converted to INR (₹)
    const finalAmountInr = method === 'binance' ? Math.round(amount * USD_TO_INR_RATE) : amount;

    const newDepositOrder: Order = {
      id: `DEP-${orderNumber}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      type: 'deposit',
      cardName: method === 'upi' ? `UPI QR Deposit (₹${finalAmountInr.toLocaleString('en-IN')})` : `Binance USDT Deposit ($${amount} ≈ ₹${finalAmountInr.toLocaleString('en-IN')})`,
      amount: finalAmountInr,
      paymentMethod: method,
      status: 'pending', // Pending admin verification
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      utrNumber,
    };

    setOrders((prev) => [newDepositOrder, ...prev]);
    setLatestOrder(newDepositOrder);
    setActiveModal('myOrders');
    showToast(
      `Deposit request for ₹${finalAmountInr.toLocaleString('en-IN')} (${method.toUpperCase()}) submitted! Status: Pending Admin Verification`,
      'info'
    );
    return newDepositOrder;
  };

  // Admin accepts deposit -> Automatically adds USDT / $ to user's 5-digit User ID wallet!
  const adminApproveDeposit = (orderId: string) => {
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      return { success: false, message: 'Order not found' };
    }

    const targetOrder = orders[orderIndex];
    if (targetOrder.status === 'approved') {
      return { success: false, message: 'Deposit has already been approved' };
    }

    // 1. Mark order as approved
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = {
      ...targetOrder,
      status: 'approved',
    };
    setOrders(updatedOrders);

    // 2. Automatically credit funds to user's 5-digit User ID wallet
    const userIndex = users.findIndex((u) => u.id === targetOrder.userId);
    if (userIndex !== -1) {
      const targetUser = users[userIndex];
      const newBal = +(targetUser.walletBalance + targetOrder.amount).toFixed(2);
      const updatedUsers = [...users];
      updatedUsers[userIndex] = {
        ...targetUser,
        walletBalance: newBal,
      };
      setUsers(updatedUsers);

      if (currentUser && currentUser.id === targetOrder.userId) {
        setCurrentUser({
          ...currentUser,
          walletBalance: newBal,
        });
      }
    }

    showToast(
      `Deposit ${targetOrder.id} ACCEPTED! Added ₹${targetOrder.amount.toLocaleString('en-IN')} to User ID #${targetOrder.userId}`,
      'success'
    );

    return {
      success: true,
      message: `Deposit accepted. Credited ₹${targetOrder.amount.toLocaleString('en-IN')} to User ID #${targetOrder.userId}.`,
    };
  };

  // Admin rejects deposit request
  const adminRejectDeposit = (orderId: string, reason = 'Payment verification failed / invalid UTR') => {
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      return { success: false, message: 'Order not found' };
    }

    const targetOrder = orders[orderIndex];
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = {
      ...targetOrder,
      status: 'rejected',
      rejectionReason: reason,
    };
    setOrders(updatedOrders);

    showToast(`Deposit ${targetOrder.id} REJECTED`, 'error');

    return {
      success: true,
      message: `Deposit ${targetOrder.id} rejected.`,
    };
  };

  // Admin approves card purchase -> Generates and delivers voucher code!
  const adminApproveCardPurchase = (orderId: string) => {
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      return { success: false, message: 'Order not found' };
    }

    const targetOrder = orders[orderIndex];
    if (targetOrder.status === 'delivered') {
      return { success: false, message: 'Order is already approved & delivered' };
    }

    const orderNumber = targetOrder.id.replace('ORD-', '');
    const voucherRandom = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedVoucher = `NGC-APPROVED-${orderNumber}-${voucherRandom}-${targetOrder.cardId || 'CRD'}`;
    const cardCreds = generateVirtualCardDetails(targetOrder.userEmail.split('@')[0]);

    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = {
      ...targetOrder,
      status: 'delivered',
      voucherCode: targetOrder.voucherCode || generatedVoucher,
      cardNumber: targetOrder.cardNumber || cardCreds.cardNumber,
      cardExp: targetOrder.cardExp || cardCreds.cardExp,
      cardCvv: targetOrder.cardCvv || cardCreds.cardCvv,
      cardHolderName: targetOrder.cardHolderName || cardCreds.cardHolderName,
    };
    setOrders(updatedOrders);

    showToast(
      `Order ${targetOrder.id} APPROVED! Card delivered to User ID #${targetOrder.userId}`,
      'success'
    );

    return {
      success: true,
      message: `Order ${targetOrder.id} approved. Card voucher delivered to User ID #${targetOrder.userId}.`,
    };
  };

  // Admin rejects card purchase -> Refunds balance to user if paid via wallet!
  const adminRejectCardPurchase = (orderId: string, reason = 'Order verification failed / Server node unavailable') => {
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      return { success: false, message: 'Order not found' };
    }

    const targetOrder = orders[orderIndex];
    if (targetOrder.status === 'rejected') {
      return { success: false, message: 'Order is already rejected' };
    }

    // If user paid from wallet balance, refund their funds immediately
    if (targetOrder.paymentMethod === 'wallet') {
      const userIndex = users.findIndex((u) => u.id === targetOrder.userId);
      if (userIndex !== -1) {
        const targetUser = users[userIndex];
        const refundedBal = +(targetUser.walletBalance + targetOrder.amount).toFixed(2);
        const updatedUsers = [...users];
        updatedUsers[userIndex] = {
          ...targetUser,
          walletBalance: refundedBal,
        };
        setUsers(updatedUsers);

        if (currentUser && currentUser.id === targetOrder.userId) {
          setCurrentUser({
            ...currentUser,
            walletBalance: refundedBal,
          });
        }
      }
    }

    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = {
      ...targetOrder,
      status: 'rejected',
      rejectionReason: reason,
    };
    setOrders(updatedOrders);

    showToast(`Order ${targetOrder.id} REJECTED and refunded`, 'error');

    return {
      success: true,
      message: `Order ${targetOrder.id} rejected and refunded.`,
    };
  };

  // Process purchase - Generates random card number, exp, cvv and successfully delivers!
  const processPayment = async (
    card: CardItem,
    paymentMethod: 'upi' | 'wallet' | 'usdt' | 'binance',
    refNumber?: string
  ): Promise<{ success: boolean; order?: Order; message?: string }> => {
    if (!currentUser) {
      setActiveModal('auth');
      return { success: false, message: 'Please login with your real Gmail first.' };
    }

    if (paymentMethod === 'wallet') {
      if (currentUser.walletBalance < card.price) {
        return {
          success: false,
          message: `Insufficient wallet balance (₹${currentUser.walletBalance.toLocaleString('en-IN')}). Card price is ₹${card.price.toLocaleString('en-IN')}. Please deposit funds via UPI QR or Binance ID ${BINANCE_PAY_ID}.`,
        };
      }

      // Deduct balance in Rupees
      const updatedBalance = +(currentUser.walletBalance - card.price).toFixed(2);
      const updatedUser = { ...currentUser, walletBalance: updatedBalance };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }

    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const voucherRandom = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedVoucher = `NGC-${card.tier.toUpperCase()}-${orderNumber}-${voucherRandom}`;
    const cardCreds = generateVirtualCardDetails(currentUser.name);

    // Virtual card delivered immediately with credentials (Number, EXP, CVV)
    const newOrder: Order = {
      id: `ORD-${orderNumber}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      type: 'card_purchase',
      cardId: card.id,
      cardName: card.name,
      amount: card.price,
      serverRegion: card.serverRegion,
      paymentMethod,
      status: 'delivered', // Delivered!
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      utrNumber: refNumber || (paymentMethod === 'wallet' ? 'WALLET-DEBIT' : undefined),
      voucherCode: generatedVoucher,
      cardNumber: cardCreds.cardNumber,
      cardExp: cardCreds.cardExp,
      cardCvv: cardCreds.cardCvv,
      cardHolderName: cardCreds.cardHolderName,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    setActiveModal('orderSuccess');
    showToast(`Order #${newOrder.id} Successful! Card generated with Number, EXP & CVV.`, 'success');

    return { success: true, order: newOrder };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        orders,
        supportMessages,
        isAdmin,
        activeModal,
        selectedCard,
        latestOrder,
        toasts,
        sessionKey,
        sessionSecondsRemaining,
        sessionExpiryTimestamp,
        isSessionExpiringSoon,
        sessionExpired,
        isWarningDismissed,
        browserNotificationPermission,
        renewSessionKey,
        setSessionToWarningDemo,
        requestBrowserNotificationPermission,
        dismissExpiryWarning,
        openRenewalModal,
        showToast,
        removeToast,
        openCheckout,
        openAdmin,
        openAuth,
        openWalletRecharge,
        openMyOrders,
        openSupportModal,
        sendSupportMessage,
        adminReplySupportMessage,
        adminDeleteSupportMessage,
        closeModals,
        loginUser,
        logoutUser,
        adminLogin,
        adminLoginWithCredentials,
        adminLogout,
        adminAddBalance,
        submitDepositRequest,
        adminApproveDeposit,
        adminRejectDeposit,
        adminApproveCardPurchase,
        adminRejectCardPurchase,
        processPayment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
