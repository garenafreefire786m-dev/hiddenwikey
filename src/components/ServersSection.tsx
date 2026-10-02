import React, { useState } from 'react';
import { Server, Activity, ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react';
import { SERVER_REGIONS } from '../data/mockCards';

export const ServersSection: React.FC = () => {
  const [activeServer, setActiveServer] = useState<string>(SERVER_REGIONS[0]);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const serverStats: Record<string, { ping: string; load: string; nodes: number }> = {
    'US-East (N. Virginia)': { ping: '24ms', load: '38%', nodes: 2840 },
    'EU-Central (Frankfurt)': { ping: '31ms', load: '42%', nodes: 1950 },
    'AP-South (Mumbai)': { ping: '12ms', load: '55%', nodes: 2420 },
    'SG-Global (Singapore)': { ping: '18ms', load: '32%', nodes: 1680 },
    'JP-East (Tokyo)': { ping: '45ms', load: '28%', nodes: 940 },
    'Global Anycast': { ping: '8ms', load: '61%', nodes: 650 },
  };

  return (
    <section id="servers-section" className="py-20 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-mono mb-3">
              <Globe className="w-3.5 h-3.5" />
              <span>RANDOM SERVER TOPOLOGY: 10,480+ ACTIVE NODES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Global Random Server Clusters
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Every card purchased is dynamically attached to an active high-bandwidth server instance with enterprise DDoS protection.
            </p>
          </div>

          <button
            onClick={scrollToCatalog}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-bold text-white hover:text-cyan-300 transition-all self-start md:self-auto"
          >
            <span>Browse Cards by Region</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Server Clusters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVER_REGIONS.map((region) => {
            const stat = serverStats[region] || { ping: '20ms', load: '35%', nodes: 1200 };
            const isSelected = activeServer === region;

            return (
              <div
                key={region}
                onClick={() => setActiveServer(region)}
                className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/40'
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                      <Server className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{region}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">Tier-IV Datacenter</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {stat.ping}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/60 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Available Nodes:</span>
                    <span className="font-mono font-bold text-white">{stat.nodes.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Cluster Load:</span>
                    <span className="font-mono font-bold text-cyan-400">{stat.load}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
