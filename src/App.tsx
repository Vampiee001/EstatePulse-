import React, { useState } from 'react';
import { Header } from './components/Header';
import { LeadGenSection } from './components/LeadGenSection';
import { BuyerQualificationSection } from './components/BuyerQualificationSection';
import { WhatsAppExtractorSection } from './components/WhatsAppExtractorSection';
import { MilestoneReminderSection } from './components/MilestoneReminderSection';
import { RoiCalculatorSection } from './components/RoiCalculatorSection';
import { BrokerDatabaseSection } from './components/BrokerDatabaseSection';
import { CopilotAssistantDrawer } from './components/CopilotAssistantDrawer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { INITIAL_INVENTORY } from './data/mockInventory';
import { INITIAL_BROKER_PROPERTIES } from './data/mockBrokerProperties';
import { InventoryProperty, BrokerProperty } from './types';
import { 
  Building2, 
  Sparkles, 
  TrendingUp, 
  MessageSquare, 
  ShieldCheck, 
  Layers, 
  CheckCircle,
  HelpCircle,
  Globe2,
  Bell
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('portfolio');
  const [inventory, setInventory] = useState<InventoryProperty[]>(INITIAL_INVENTORY);
  const [notification, setNotification] = useState<string | null>(null);

  // Broker Database with localStorage persistence
  const [brokerProperties, setBrokerProperties] = useState<BrokerProperty[]>(() => {
    try {
      const saved = localStorage.getItem('estatepulse_broker_properties');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BROKER_PROPERTIES;
  });

  const saveProperties = (props: BrokerProperty[]) => {
    setBrokerProperties(props);
    try {
      localStorage.setItem('estatepulse_broker_properties', JSON.stringify(props));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddBrokerProperty = (prop: BrokerProperty) => {
    const updated = [prop, ...brokerProperties];
    saveProperties(updated);
    setNotification(`Property "${prop.title}" added to your personal database.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdateBrokerProperty = (prop: BrokerProperty) => {
    const updated = brokerProperties.map((p) => (p.id === prop.id ? prop : p));
    saveProperties(updated);
    setNotification(`Property "${prop.title}" updated.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDeleteBrokerProperty = (id: string) => {
    const updated = brokerProperties.filter((p) => p.id !== id);
    saveProperties(updated);
    setNotification('Property removed from broker portfolio.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Calculate Urgent / 90-Day RERA Alerts for Header Badge
  const CURRENT_DATE = new Date('2026-10-14T00:00:00');
  const activeAlertCount = brokerProperties.filter((p) => {
    if (!p.leaseEndDate) return false;
    const diffDays = Math.ceil(
      (new Date(p.leaseEndDate).getTime() - CURRENT_DATE.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 95 && diffDays >= 0;
  }).length;

  const handleAddListingToInventory = (newProperty: InventoryProperty) => {
    setInventory((prev) => [newProperty, ...prev]);
    setNotification(`Added "${newProperty.title}" to active brokerage inventory.`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed top-14 right-6 z-50 bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main App Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inventoryCount={inventory.length}
        alertCount={activeAlertCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dynamic Context Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                {activeTab === 'portfolio' && 'Broker CRM • Property Database & Rent Alerts'}
                {activeTab === 'leadgen' && 'Function A • Marketing Engine'}
                {activeTab === 'buyer' && 'Function B • Lead Qualification'}
                {activeTab === 'whatsapp' && 'Function C • WhatsApp Stream Extractor'}
                {activeTab === 'milestone' && 'Function D • Escrow Payment Notices'}
                {activeTab === 'calculator' && 'Financial Tool • Dubai Yield Simulator'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Dubai & Sharjah Freehold Hub</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {activeTab === 'portfolio' && 'Secondary Market Database, Tenancies & Upcoming Rent Radar'}
              {activeTab === 'leadgen' && 'Lead Generation & Multi-Channel Marketing'}
              {activeTab === 'buyer' && 'Buyer Qualification & Intelligent Inventory Matching'}
              {activeTab === 'whatsapp' && 'WhatsApp Group Chat Listing & WTB Parser'}
              {activeTab === 'milestone' && 'Off-Plan Landlord Payment Milestones & Escrow Notices'}
              {activeTab === 'calculator' && 'Dubai Net ROI, Closing Costs & Holiday Home Comparison'}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'portfolio'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Properties</span>
              {activeAlertCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'portfolio' ? 'bg-slate-950 text-amber-300' : 'bg-rose-600 text-white'}`}>
                  {activeAlertCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('leadgen')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'leadgen'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fn A
            </button>
            <button
              onClick={() => setActiveTab('buyer')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'buyer'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fn B
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'whatsapp'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fn C
            </button>
            <button
              onClick={() => setActiveTab('milestone')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'milestone'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fn D
            </button>
          </div>
        </div>

        {/* Section View Switching */}
        {activeTab === 'portfolio' && (
          <BrokerDatabaseSection
            properties={brokerProperties}
            onAddProperty={handleAddBrokerProperty}
            onUpdateProperty={handleUpdateBrokerProperty}
            onDeleteProperty={handleDeleteBrokerProperty}
          />
        )}

        {activeTab === 'leadgen' && (
          <LeadGenSection onAddListingToInventory={handleAddListingToInventory} />
        )}

        {activeTab === 'buyer' && (
          <BuyerQualificationSection inventory={inventory} />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppExtractorSection onAddListingToInventory={handleAddListingToInventory} />
        )}

        {activeTab === 'milestone' && (
          <MilestoneReminderSection />
        )}

        {activeTab === 'calculator' && (
          <RoiCalculatorSection />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">
              EstatePulse UAE • Real Estate AI Brokerage Copilot
            </span>
          </div>

          <p className="text-slate-400 text-center md:text-right text-[11px]">
            Designed for licensed UAE real estate professionals. Compliant with RERA, Law No. 8 of 2007 (Escrow Accounts), and Dubai Land Department standards.
          </p>
        </div>
      </footer>

      {/* Interactive AI Broker Copilot Assistant Drawer */}
      <CopilotAssistantDrawer />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
