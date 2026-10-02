import { KeyPlan, AccessKey, KeyRequest } from '../types';

export const KEY_PLANS: KeyPlan[] = [
  { 
    id: 'plan-3min', 
    name: '3 Minutes Access', 
    durationMinutes: 3, 
    isLifetime: false, 
    priceInr: 15, 
    badge: 'Quick Test' 
  },
  { 
    id: 'plan-5min', 
    name: '5 Minutes Access', 
    durationMinutes: 5, 
    isLifetime: false, 
    priceInr: 20 
  },
  { 
    id: 'plan-10min', 
    name: '10 Minutes Access', 
    durationMinutes: 10, 
    isLifetime: false, 
    priceInr: 30, 
    badge: 'Popular' 
  },
  { 
    id: 'plan-30min', 
    name: '30 Minutes Access', 
    durationMinutes: 30, 
    isLifetime: false, 
    priceInr: 50 
  },
  { 
    id: 'plan-lifetime', 
    name: 'Life Time Access', 
    durationMinutes: 0, 
    isLifetime: true, 
    priceInr: 499, 
    badge: 'Best Value ♾️' 
  },
];

export function generateRandomKey(prefix = 'HW'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}-${part1}-${part2}`;
}

export const INITIAL_ACCESS_KEYS: AccessKey[] = [
  {
    id: 'KEY-001',
    keyString: 'HW-DEMO-3MIN-9821',
    planId: 'plan-3min',
    planName: '3 Minutes Access',
    durationMinutes: 3,
    isLifetime: false,
    status: 'active',
    createdAt: '2026-10-01 00:10',
  },
  {
    id: 'KEY-002',
    keyString: 'HW-LIFE-MASTER-9999',
    planId: 'plan-lifetime',
    planName: 'Life Time Access',
    durationMinutes: 0,
    isLifetime: true,
    status: 'active',
    createdAt: '2026-10-01 00:01',
  },
];

export const INITIAL_KEY_REQUESTS: KeyRequest[] = [
  {
    id: 'KR-901',
    customerName: 'Aman Verma',
    customerContact: 'aman.verma@gmail.com',
    planId: 'plan-10min',
    planName: '10 Minutes Access',
    priceInr: 30,
    durationMinutes: 10,
    isLifetime: false,
    utrNumber: '928371928301',
    screenshotUrl: '',
    status: 'pending',
    requestTimestamp: 'Today, 03:20 PM',
  },
  {
    id: 'KR-902',
    customerName: 'Sunil Rao',
    customerContact: 'sunil.crypto@gmail.com',
    planId: 'plan-lifetime',
    planName: 'Life Time Access',
    priceInr: 499,
    durationMinutes: 0,
    isLifetime: true,
    utrNumber: '102938475612',
    screenshotUrl: '',
    status: 'approved',
    generatedKey: 'HW-LIFE-7729-QK11',
    requestTimestamp: 'Today, 02:15 PM',
    approvedTimestamp: 'Today, 02:18 PM',
  }
];

// Persistent Device Fingerprint for Single Phone/Device Lock
export function getOrCreateDeviceId(): string {
  let devId = localStorage.getItem('hw_device_id');
  if (!devId) {
    devId = 'DEV-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
    localStorage.setItem('hw_device_id', devId);
  }
  return devId;
}
