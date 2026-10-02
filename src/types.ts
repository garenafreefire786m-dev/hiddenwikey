export type ServerRegion = 'US-East (N. Virginia)' | 'EU-Central (Frankfurt)' | 'AP-South (Mumbai)' | 'SG-Global (Singapore)' | 'JP-East (Tokyo)' | 'Global Anycast';

export type CardCategory = 'Cloud Servers' | 'Gaming Vouchers' | 'Developer Sandbox' | 'AI Compute' | 'Streaming OTT' | 'Digital Prepaid';

export interface CardItem {
  id: string;
  name: string;
  category: CardCategory;
  serverRegion: ServerRegion;
  price: number; // Starting at $15
  originalPrice: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  chipType: 'Gold' | 'Platinum' | 'Titanium' | 'Holo-Emerald';
  cardMask: string;
  features: string[];
  tier: 'Starter' | 'Pro' | 'Enterprise' | 'Ultra';
  gradient: string;
  isPopular?: boolean;
  instantDelivery: boolean;
  creditBalance: number; // Digital compute/service voucher credit value (e.g. $100, $250)
}

export interface User {
  id: string; // 5-digit ID, e.g. "48201"
  name: string;
  email: string;
  walletBalance: number;
  createdAt: string;
  role: 'user' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  type: 'deposit' | 'card_purchase';
  cardId?: string;
  cardName: string;
  amount: number;
  serverRegion?: string;
  paymentMethod: 'binance' | 'upi' | 'wallet' | 'usdt';
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  timestamp: string;
  utrNumber?: string;
  voucherCode?: string;
  rejectionReason?: string;
  cardNumber?: string;
  cardExp?: string;
  cardCvv?: string;
  cardHolderName?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  badge: string;
  comment: string;
  cardPurchased: string;
  verified: boolean;
}

export interface SupportMessage {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied';
  reply?: string;
  replyTimestamp?: string;
}

