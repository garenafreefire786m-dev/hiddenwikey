import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Server, 
  Star, 
  Check, 
  ArrowUpDown, 
  Layers, 
  Zap, 
  RefreshCw,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CardCategory, CardItem, ServerRegion } from '../types';
import { CATEGORIES, generateCardList, SERVER_REGIONS, TOTAL_INVENTORY_COUNT } from '../data/mockCards';
import { useApp } from '../context/AppContext';

export type PriceRange = '499-starter' | '700-popular' | '2000-enterprise' | 'all';

export const CardCatalog: React.FC = () => {
  const { openCheckout } = useApp();

  const [seedOffset, setSeedOffset] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(24);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  // Card prices strictly in Indian Rupees (₹), starting at ₹499
  const [priceFilter, setPriceFilter] = useState<PriceRange>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'popular' | 'rating'>('price-asc');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Generate cards dynamically based on current offset and batch size
  const allLoadedCards = useMemo(() => {
    return generateCardList(96, seedOffset);
  }, [seedOffset]);

  // Compute counts for price range dropdown & pills in Rupees (₹)
  const priceRangeCounts = useMemo(() => {
    return {
      starter499: allLoadedCards.filter((c) => c.price >= 499 && c.price < 700).length,
      popular: allLoadedCards.filter((c) => c.price >= 700 && c.price < 2000).length,
      enterprise: allLoadedCards.filter((c) => c.price >= 2000).length,
      all: allLoadedCards.length,
    };
  }, [allLoadedCards]);

  // Filtered & sorted cards
  const filteredCards = useMemo(() => {
    let result = [...allLoadedCards];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.serverRegion.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.tier.toLowerCase().includes(q) ||
          c.cardMask.includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // Region filter
    if (selectedRegion !== 'All') {
      result = result.filter((c) => c.serverRegion.includes(selectedRegion));
    }

    // Price range filter in Rupees (₹)
    if (priceFilter === '499-starter') {
      result = result.filter((c) => c.price >= 499 && c.price < 700);
    } else if (priceFilter === '700-popular') {
      result = result.filter((c) => c.price >= 700 && c.price < 2000);
    } else if (priceFilter === '2000-enterprise') {
      result = result.filter((c) => c.price >= 2000);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [allLoadedCards, searchQuery, selectedCategory, selectedRegion, priceFilter, sortBy]);

  // Paginated slice for current page
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
  const currentCards = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCards.slice(start, start + pageSize);
  }, [filteredCards, currentPage, pageSize]);

  // Shuffle / load new random batch from 10,000+ pool
  const handleShufflePool = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSeedOffset((prev) => (prev + 37) % (TOTAL_INVENTORY_COUNT - 100));
      setCurrentPage(1);
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <section id="catalog-section" className="py-16 sm:py-24 bg-slate-950 text-white relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DYNAMIC POOL: {TOTAL_INVENTORY_COUNT.toLocaleString()}+ CARDS IN STOCK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Dynamic Card & Voucher Catalog
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Every card is provisioned with high-speed random server nodes, instant delivery, and auto-verified UPI checkout. <strong className="text-emerald-400">Starting prices at ₹499</strong> across all server clusters.
            </p>
          </div>

          {/* Quick Stats Pill & Shuffle Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShufflePool}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm active:scale-95"
              title="Generate new random server card batch from 10,000+ pool"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Random Server Batch</span>
            </button>

            <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Prices: ₹499 - ₹8,999+</span>
            </div>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by card name, server region, ID, or tier..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
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

            {/* Price Range Filter Dropdown */}
            <div className="lg:col-span-3">
              <select
                value={priceFilter}
                onChange={(e) => {
                  setPriceFilter(e.target.value as PriceRange);
                  setCurrentPage(1);
                }}
                aria-label="Filter cards by price range"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 font-medium focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              >
                <option value="all">💰 All Price Ranges (₹499 – ₹8,999+) ({priceRangeCounts.all})</option>
                <option value="499-starter">⚡ ₹499 Starter Tier (₹5,000 Bal) ({priceRangeCounts.starter499})</option>
                <option value="700-popular">💳 ₹699 - ₹1,499 Popular Tier (₹15,000 Bal) ({priceRangeCounts.popular})</option>
                <option value="2000-enterprise">🚀 ₹2,000+ Enterprise Tier (₹35,000+ Bal) ({priceRangeCounts.enterprise})</option>
              </select>
            </div>

            {/* Server Region Filter */}
            <div className="lg:col-span-3">
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by Server Region"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              >
                <option value="All">🌐 All Server Regions</option>
                {SERVER_REGIONS.map((region) => (
                  <option key={region} value={region.split(' ')[0]}>
                    📍 {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort cards by"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated (★)</option>
              </select>
            </div>
          </div>

          {/* Quick Price Range Quick-Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              Price & Balance:
            </span>
            <button
              onClick={() => {
                setPriceFilter('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                priceFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              All Tiers ({priceRangeCounts.all})
            </button>
            <button
              onClick={() => {
                setPriceFilter('499-starter');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                priceFilter === '499-starter'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              ⚡ ₹499 Starter Pass
            </button>
            <button
              onClick={() => {
                setPriceFilter('700-popular');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                priceFilter === '700-popular'
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              💳 ₹699 - ₹1,499 Popular
            </button>
            <button
              onClick={() => {
                setPriceFilter('2000-enterprise');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                priceFilter === '2000-enterprise'
                  ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              🚀 ₹2,000+ Enterprise
            </button>

            {priceFilter !== 'all' && (
              <button
                onClick={() => {
                  setPriceFilter('all');
                  setCurrentPage(1);
                }}
                className="text-[11px] text-cyan-400 hover:underline ml-2"
              >
                Reset Price
              </button>
            )}
          </div>

          {/* Category Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all font-semibold ${
                selectedCategory === 'All'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Categories ({allLoadedCards.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = allLoadedCards.filter((c) => c.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all font-semibold ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Active Filters Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
          <span>
            Showing <strong className="text-white font-mono">{currentCards.length}</strong> of{' '}
            <strong className="text-cyan-400 font-mono">{filteredCards.length}</strong> matching cards
            (Total Database: <span className="font-mono text-emerald-400">10,480+</span>)
          </span>
          <span className="font-mono text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Cards Responsive Grid with Smooth Layout Transitions */}
        {currentCards.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {currentCards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="group relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden"
                >
                  {/* Popular / Starting Price Top Ribbon */}
                  {card.price === 499 && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30">
                        <Zap className="w-3 h-3 fill-slate-950" />
                        Min ₹499 Tier
                      </span>
                    </div>
                  )}

                  {/* Card Physical Header Preview */}
                  <div className={`relative p-5 bg-gradient-to-br ${card.gradient} border-b border-slate-800/60 overflow-hidden`}>
                    {/* Metallic Hologram Chip & Balance Pill */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-9 h-7 rounded-md p-1 flex flex-col justify-between shadow-inner ${
                            card.chipType === 'Gold'
                              ? 'bg-gradient-to-tr from-amber-400 to-yellow-200 border border-amber-300'
                              : card.chipType === 'Titanium'
                              ? 'bg-gradient-to-tr from-slate-400 to-slate-200 border border-slate-300'
                              : card.chipType === 'Holo-Emerald'
                              ? 'bg-gradient-to-tr from-emerald-400 to-teal-200 border border-emerald-300'
                              : 'bg-gradient-to-tr from-cyan-300 to-blue-200 border border-cyan-200'
                          }`}
                        >
                          <div className="w-full h-0.5 bg-black/30 rounded-full" />
                          <div className="w-full h-0.5 bg-black/30 rounded-full" />
                          <div className="w-full h-0.5 bg-black/30 rounded-full" />
                        </div>
                        <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">
                          {card.tier}
                        </span>
                      </div>

                      {/* Prominent Balance Pill on Physical Card */}
                      <span className="text-[11px] font-mono font-black text-emerald-300 bg-slate-950/85 px-2.5 py-1 rounded-lg border border-emerald-500/40 shadow-sm">
                        Balance: ₹{card.creditBalance.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Card Number Mask */}
                    <div className="font-mono text-sm tracking-widest text-slate-200 font-semibold mb-2">
                      {card.cardMask}
                    </div>

                    {/* Server Region & Stock */}
                    <div className="flex items-center justify-between text-[11px] text-cyan-300/90 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                        <span className="truncate max-w-[130px]">{card.serverRegion}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{card.stock} in stock</span>
                    </div>
                  </div>

                  {/* Card Details Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                        <span className="font-medium text-slate-400">{card.category}</span>
                        <div className="flex items-center gap-1 text-amber-400 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{card.rating}</span>
                          <span className="text-slate-500 font-normal">({card.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Card Title */}
                      <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {card.name}
                      </h3>

                      {/* Included Digital Voucher Balance Box */}
                      <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-950 to-indigo-950/60 border border-emerald-500/30 flex items-center justify-between font-mono text-xs">
                        <span className="text-slate-300 font-sans text-[11px] flex items-center gap-1.5 font-semibold">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          Included Balance:
                        </span>
                        <span className="font-black text-emerald-400 text-sm">
                          ₹{card.creditBalance.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Feature Bullet Points */}
                      <ul className="mt-3 space-y-1.5 text-xs text-slate-400">
                        {card.features.slice(0, 3).map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing & Buy Button Footer */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                            ₹{card.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-500 line-through font-mono">
                            ₹{card.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[10px] text-cyan-300 font-mono font-bold block">
                          Gets ₹{card.creditBalance.toLocaleString('en-IN')} Balance
                        </span>
                      </div>

                      {/* Card Purchase Button */}
                      <button
                        onClick={() => openCheckout(card)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Card Purchase</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-300">No cards match the selected criteria.</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting filters or searching for another term.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedRegion('All');
                setPriceFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 hover:bg-slate-700 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold font-mono transition-all ${
                    currentPage === pageNum
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
