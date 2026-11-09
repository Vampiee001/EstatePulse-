import React from 'react';
import { Building2, Sparkles, ShieldCheck, DollarSign, MessageSquare, TrendingUp, Layers } from 'lucide-react';

import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  inventoryCount: number;
  alertCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, inventoryCount, alertCount }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-40 text-slate-100">
      {/* Top Dubai Real Estate Status Bar */}
      <div className="border-b border-slate-850 px-4 py-1.5 text-xs bg-slate-900/60 flex flex-wrap items-center justify-between text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Dubai & UAE Real Estate Copilot
          </span>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-amber-400" />
            USD / AED Peg: <strong className="text-slate-300">3.6725</strong>
          </span>
          <span className="hidden md:inline-block text-slate-600">|</span>
          <span className="hidden md:inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            DLD Escrow Law No. 8 & RERA Aligned
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <span className="hidden lg:inline-block bg-amber-950/60 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded font-mono font-medium">
            🇦🇪 Golden Visa: AED 2,000,000+
          </span>
          <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded font-mono font-medium">
            Active Inventory: {inventoryCount}
          </span>
          <PWAInstallButton />
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-600 p-0.5 shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                EstatePulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">UAE</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                AI Broker Copilot
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Dubai & Sharjah Brokerage Intelligence • Leads, Qualification & Milestone Notices
            </p>
          </div>
        </div>

        {/* Function Switcher Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('leadgen')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'leadgen'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Marketing & Ads</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${activeTab === 'leadgen' ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
              Fn A
            </span>
          </button>

          <button
            onClick={() => setActiveTab('buyer')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'buyer'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Buyer Qualification</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${activeTab === 'buyer' ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
              Fn B
            </span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Group Extractor</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${activeTab === 'whatsapp' ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
              Fn C
            </span>
          </button>

          <button
            onClick={() => setActiveTab('milestone')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'milestone'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Escrow Payment Reminders</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${activeTab === 'milestone' ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
              Fn D
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap relative ${
              activeTab === 'portfolio'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>My Properties & Rent Alerts</span>
            {alertCount !== undefined && alertCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === 'portfolio' ? 'bg-rose-600 text-white' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {alertCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ROI Calculator</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
