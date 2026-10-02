import { CardCategory, CardItem, ServerRegion } from '../types';

export const SERVER_REGIONS: ServerRegion[] = [
  'US-East (N. Virginia)',
  'EU-Central (Frankfurt)',
  'AP-South (Mumbai)',
  'SG-Global (Singapore)',
  'JP-East (Tokyo)',
  'Global Anycast',
];

export const CATEGORIES: CardCategory[] = [
  'Cloud Servers',
  'Gaming Vouchers',
  'Developer Sandbox',
  'AI Compute',
  'Streaming OTT',
  'Digital Prepaid',
];

const GRADIENTS = [
  'from-cyan-900/90 via-slate-900 to-indigo-950',
  'from-emerald-950 via-slate-900 to-teal-950',
  'from-violet-950 via-purple-900/50 to-slate-950',
  'from-blue-950 via-sky-900/50 to-slate-900',
  'from-amber-950 via-stone-900 to-orange-950',
  'from-rose-950 via-slate-900 to-red-950',
];

const CHIP_TYPES: ('Gold' | 'Platinum' | 'Titanium' | 'Holo-Emerald')[] = [
  'Gold',
  'Platinum',
  'Titanium',
  'Holo-Emerald',
];

const BASE_TEMPLATES = [
  {
    name: 'NextGen Alpha Core Pass',
    category: 'Cloud Servers' as CardCategory,
    price: 499, // starting price strictly ₹499!
    tier: 'Starter' as const,
    features: ['High-speed 1Gbps Uplink', 'Instant Root Activation', 'DDoS Shield 100Gbps', '24/7 Dedicated Server'],
  },
  {
    name: 'Vortex Cloud High-Compute Voucher',
    category: 'Cloud Servers' as CardCategory,
    price: 699,
    tier: 'Starter' as const,
    features: ['4 vCPU Intel Xeon', '8GB DDR4 ECC RAM', 'SSD NVMe Ultra Cache', 'Auto-backup enabled'],
  },
  {
    name: 'Quantum Edge Developer Sandbox',
    category: 'Developer Sandbox' as CardCategory,
    price: 499,
    tier: 'Starter' as const,
    features: ['Full API Playground Access', 'Unlimited Sandbox Tokens', 'Webhook Testing Node', 'Stripe & PayPal Mock test'],
  },
  {
    name: 'CyberGaming Pro Elite Pass',
    category: 'Gaming Vouchers' as CardCategory,
    price: 499,
    tier: 'Starter' as const,
    features: ['Low Ping <15ms Guaranteed', 'Anti-Cheat Bypass Firewall', 'Multi-Region Matchmaking', 'Priority Voice Server'],
  },
  {
    name: 'DeepNeural AI Inference Card',
    category: 'AI Compute' as CardCategory,
    price: 999,
    tier: 'Pro' as const,
    features: ['NVIDIA H100 Instance Time', 'Zero-Queue Priority Execution', 'PyTorch & vLLM Preloaded', 'REST API Token Pool'],
  },
  {
    name: 'StreamMax Global Ultra Pass',
    category: 'Streaming OTT' as CardCategory,
    price: 499,
    tier: 'Starter' as const,
    features: ['4K Ultra HD HDR Bitrate', 'Simultaneous 4 Screen Support', 'Spatial Audio Streaming', 'Ad-Free High Speed CDN'],
  },
  {
    name: 'Titanium VPS Dedicated Node',
    category: 'Cloud Servers' as CardCategory,
    price: 1299,
    tier: 'Pro' as const,
    features: ['Dedicated Clean IPv4 & IPv6', 'Unlimited Unmetered Bandwidth', 'BGP Anycast Routing', 'Custom ISO Installation'],
  },
  {
    name: 'Nexus Secure Digital Prepaid Card',
    category: 'Digital Prepaid' as CardCategory,
    price: 499,
    tier: 'Starter' as const,
    features: ['Instant Online Activation', 'Zero Foreign Exchange Fee', 'One-Time Security Token', 'Accepted on 500+ Platforms'],
  },
  {
    name: 'HyperDrive Gaming Ultimate Token',
    category: 'Gaming Vouchers' as CardCategory,
    price: 1499,
    tier: 'Pro' as const,
    features: ['Direct In-Game Crediting', 'Global Discord VIP Role', 'Double EXP Multiplier', 'Premium Server Access'],
  },
  {
    name: 'Enterprise Matrix Cloud Cluster',
    category: 'Cloud Servers' as CardCategory,
    price: 2499,
    tier: 'Enterprise' as const,
    features: ['32 Core AMD EPYC Nodes', '64GB RAM Dedicated Pool', 'Hardware Raid-10 NVMe', '99.999% SLA Uptime Guarantee'],
  },
  {
    name: 'Apex AI LLM GPU Booster',
    category: 'AI Compute' as CardCategory,
    price: 2999,
    tier: 'Enterprise' as const,
    features: ['A100 80GB SXM4 Access', 'FP8 Acceleration Engine', 'Direct Model Weights Cache', 'Dedicated High Memory'],
  },
  {
    name: 'Black Titanium VIP Omniverse Card',
    category: 'Digital Prepaid' as CardCategory,
    price: 3999,
    tier: 'Ultra' as const,
    features: ['VIP Concierge Support', 'Unlimited Monthly Bandwidth', 'Permanent High Priority Server', 'Zero Transaction Fees'],
  },
  {
    name: 'Quantum H100 GPU Dedicated Cluster',
    category: 'AI Compute' as CardCategory,
    price: 6999,
    tier: 'Ultra' as const,
    features: ['8x NVIDIA H100 80GB SXM5', 'InfiniBand 3.2Tbps Interconnect', 'Bare-Metal Slurm Access', 'Direct PyTorch vLLM Cluster'],
  },
  {
    name: 'Hyperscale Global Cloud Infrastructure Node',
    category: 'Cloud Servers' as CardCategory,
    price: 8999,
    tier: 'Enterprise' as const,
    features: ['128 vCPU AMD Genoa Server', '512GB ECC DDR5 RAM', '100Gbps Dedicated Uplink', 'Anycast Tier-IV Redundancy'],
  },
];

// Deterministic random generator for smooth consistent cards up to 10,000+
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate pool of initial 48 richly detailed cards, and dynamic total count of 10,480 cards
export const TOTAL_INVENTORY_COUNT = 10480;

export function generateCardList(limit = 48, offset = 0): CardItem[] {
  const cards: CardItem[] = [];

  for (let i = 0; i < limit; i++) {
    const index = offset + i;
    const base = BASE_TEMPLATES[index % BASE_TEMPLATES.length];
    const r1 = pseudoRandom(index * 13 + 7);
    const r2 = pseudoRandom(index * 29 + 11);
    const r3 = pseudoRandom(index * 47 + 19);

    // Calculate dynamic price starting strictly at ₹499 in Rupees!
    let price = base.price;
    if (index % 11 === 0) {
      // High range (e.g. ₹4,500 - ₹8,999)
      price = Math.round(4500 + r1 * 4000);
    } else if (index % 7 === 0) {
      // Mid-high range (e.g. ₹1,499 - ₹3,499)
      price = Math.round(1499 + r1 * 1800);
    } else if (index % 4 === 0) {
      // Popular range (e.g. ₹699 - ₹1,299)
      price = Math.round(699 + r1 * 600);
    } else if (index % 5 === 0) {
      // Starter price strictly ₹499
      price = 499;
    } else {
      price = Math.max(499, Math.round(base.price + (index % 6) * 100));
    }

    const region = SERVER_REGIONS[Math.floor(r1 * SERVER_REGIONS.length)];
    const gradient = GRADIENTS[index % GRADIENTS.length];
    const chip = CHIP_TYPES[Math.floor(r2 * CHIP_TYPES.length)];
    
    // Card mask format like 4820 •••• •••• 9102
    const lastDigits = Math.floor(1000 + r3 * 9000);
    const prefix = 4000 + ((index * 37) % 5000);
    const cardMask = `${prefix} •••• •••• ${lastDigits}`;

    const originalPrice = Math.round(price * 1.5);
    const stock = Math.floor(20 + r1 * 480);
    const rating = +(4.6 + r2 * 0.4).toFixed(1);
    const reviewsCount = Math.floor(40 + r3 * 820);

    const suffixNumber = (index + 101).toString().padStart(4, '0');
    const name = `${base.name} #${suffixNumber}`;

    // Compute digital compute voucher balance according to price in Rupees:
    let creditBalance = 5000;
    if (price <= 699) {
      creditBalance = 5000;
    } else if (price <= 1499) {
      creditBalance = 15000;
    } else if (price <= 3500) {
      creditBalance = 35000;
    } else {
      creditBalance = 75000;
    }

    cards.push({
      id: `CARD-${index + 1}`,
      name,
      category: base.category,
      serverRegion: region,
      price,
      originalPrice,
      stock,
      rating,
      reviewsCount,
      chipType: chip,
      cardMask,
      features: base.features,
      tier: base.tier,
      gradient,
      isPopular: index % 6 === 0,
      instantDelivery: true,
      creditBalance,
    });
  }

  return cards;
}
