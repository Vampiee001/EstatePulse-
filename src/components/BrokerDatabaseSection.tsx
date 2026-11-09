import React, { useState, useMemo } from 'react';
import { 
  Building, 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Phone, 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  FileText, 
  Tag, 
  ArrowUpRight, 
  ShieldCheck, 
  X,
  ExternalLink,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { BrokerProperty, DealType, TenancyAlert, AlertUrgency } from '../types';

interface BrokerDatabaseSectionProps {
  properties: BrokerProperty[];
  onAddProperty: (property: BrokerProperty) => void;
  onUpdateProperty: (property: BrokerProperty) => void;
  onDeleteProperty: (id: string) => void;
}

export const BrokerDatabaseSection: React.FC<BrokerDatabaseSectionProps> = ({
  properties,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
}) => {
  // Current simulated local date for UAE (Mid-October 2026)
  const CURRENT_DATE = new Date('2026-10-14T00:00:00');

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'ALL' | 'RENT' | 'SALE' | 'ALERTS' | 'NEXT_YEAR' | 'VACANT'>('ALL');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('ALL');

  // Add Property Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProp, setNewProp] = useState<Partial<BrokerProperty>>({
    dealType: 'FOR_RENT',
    propertyType: 'Apartment',
    bedrooms: '1 Bedroom',
    bathrooms: 2,
    community: 'Dubai Marina',
    building: '',
    unitNumber: '',
    title: '',
    sizeSqft: 850,
    annualRentAED: 95000,
    chequesRequired: 4,
    securityDepositAED: 4750,
    rentalStatus: 'Vacant / Available Now',
    askingPriceAED: 1200000,
    titleDeedStatus: 'Title Deed Ready',
    occupancyStatus: 'Vacant on Transfer',
    landlordName: '',
    landlordPhone: '',
    exclusive: true,
    amenities: ['Gym', 'Pool', 'Covered Parking'],
    notes: '',
  });

  // Notice Generation Modal State
  const [activeNoticeModalProperty, setActiveNoticeModalProperty] = useState<BrokerProperty | null>(null);
  const [noticeType, setNoticeType] = useState<'RERA_90_DAY' | 'RELIST_MARKETING' | 'LANDLORD_ADVISORY'>('RERA_90_DAY');
  const [isGeneratingNotice, setIsGeneratingNotice] = useState(false);
  const [noticeOutput, setNoticeOutput] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Calculate Tenancy Alerts & Expiries
  const alerts: TenancyAlert[] = useMemo(() => {
    const list: TenancyAlert[] = [];

    properties.forEach((p) => {
      // Check properties with leaseEndDate
      if (p.leaseEndDate) {
        const endDate = new Date(p.leaseEndDate);
        const diffTime = endDate.getTime() - CURRENT_DATE.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const endYear = endDate.getFullYear();
        const isNextYear = endYear > CURRENT_DATE.getFullYear();

        if (diffDays <= 30 && diffDays >= 0) {
          list.push({
            propertyId: p.id,
            propertyTitle: p.title,
            community: p.community,
            unitNumber: p.unitNumber,
            urgency: 'URGENT',
            daysRemaining: diffDays,
            leaseEndDate: p.leaseEndDate,
            currentRentAED: p.currentRentAED || p.annualRentAED,
            annualRentAED: p.annualRentAED,
            tenantName: p.currentTenantName,
            tenantPhone: p.currentTenantPhone,
            landlordName: p.landlordName,
            landlordPhone: p.landlordPhone,
            headline: `Immediate Move-out / Renewal Due in ${diffDays} Days`,
            recommendation: `Tenant lease expires on ${p.leaseEndDate}. Conduct final handover inspection or immediately re-list on portals to prevent rental void.`,
          });
        } else if (diffDays > 30 && diffDays <= 95) {
          list.push({
            propertyId: p.id,
            propertyTitle: p.title,
            community: p.community,
            unitNumber: p.unitNumber,
            urgency: 'RERA_90_DAY',
            daysRemaining: diffDays,
            leaseEndDate: p.leaseEndDate,
            currentRentAED: p.currentRentAED || p.annualRentAED,
            annualRentAED: p.annualRentAED,
            tenantName: p.currentTenantName,
            tenantPhone: p.currentTenantPhone,
            landlordName: p.landlordName,
            landlordPhone: p.landlordPhone,
            headline: `RERA 90-Day Statutory Renewal Window (${diffDays} Days Left)`,
            recommendation: `Under Dubai Law 33/2008, landlords must serve notice 90 days before expiry to increase rent or amend lease conditions. Act now before the legal deadline closes!`,
          });
        } else if (isNextYear || p.rentalStatus === 'Available Next Year') {
          list.push({
            propertyId: p.id,
            propertyTitle: p.title,
            community: p.community,
            unitNumber: p.unitNumber,
            urgency: 'NEXT_YEAR',
            daysRemaining: diffDays,
            leaseEndDate: p.leaseEndDate,
            expectedAvailableDate: p.expectedAvailableDate || `Q${Math.floor(endDate.getMonth() / 3) + 1} ${endYear}`,
            currentRentAED: p.currentRentAED || p.annualRentAED,
            annualRentAED: p.annualRentAED,
            tenantName: p.currentTenantName,
            tenantPhone: p.currentTenantPhone,
            landlordName: p.landlordName,
            landlordPhone: p.landlordPhone,
            headline: `Upcoming Rent Next Year (${endYear})`,
            recommendation: `Lease will conclude in ${endYear}. Pre-market to high-profile executive tenants seeking planned 2027 relocation.`,
          });
        }
      } else if (p.rentalStatus === 'Vacant / Available Now') {
        list.push({
          propertyId: p.id,
          propertyTitle: p.title,
          community: p.community,
          unitNumber: p.unitNumber,
          urgency: 'VACANT',
          daysRemaining: 0,
          expectedAvailableDate: 'Available Immediately',
          annualRentAED: p.annualRentAED,
          landlordName: p.landlordName,
          landlordPhone: p.landlordPhone,
          headline: 'Vacant & Available for Immediate Move-in',
          recommendation: 'Actively generate leads on Bayut / Property Finder and WhatsApp broker networks.',
        });
      }
    });

    return list.sort((a, b) => {
      const order = { URGENT: 1, RERA_90_DAY: 2, VACANT: 3, NEXT_YEAR: 4 };
      return order[a.urgency] - order[b.urgency];
    });
  }, [properties]);

  // Unique Communities for dropdown
  const communities = useMemo(() => {
    const set = new Set(properties.map((p) => p.community));
    return ['ALL', ...Array.from(set)];
  }, [properties]);

  // Filtered Properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Community
      if (selectedCommunity !== 'ALL' && p.community !== selectedCommunity) return false;

      // Filter Tab
      if (filterTab === 'RENT' && p.dealType === 'FOR_SALE') return false;
      if (filterTab === 'SALE' && p.dealType === 'FOR_RENT') return false;
      if (filterTab === 'VACANT' && p.rentalStatus !== 'Vacant / Available Now' && p.occupancyStatus !== 'Vacant on Transfer') return false;
      if (filterTab === 'NEXT_YEAR') {
        const isNextYearRent = p.rentalStatus === 'Available Next Year' || (p.leaseEndDate && new Date(p.leaseEndDate).getFullYear() > 2026);
        if (!isNextYearRent) return false;
      }
      if (filterTab === 'ALERTS') {
        const hasAlert = alerts.some((a) => a.propertyId === p.id && (a.urgency === 'URGENT' || a.urgency === 'RERA_90_DAY'));
        if (!hasAlert) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.building.toLowerCase().includes(q) ||
          p.unitNumber.toLowerCase().includes(q) ||
          p.community.toLowerCase().includes(q) ||
          (p.currentTenantName && p.currentTenantName.toLowerCase().includes(q)) ||
          p.landlordName.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [properties, selectedCommunity, filterTab, searchQuery, alerts]);

  // Handle Add Form Submit
  const handleSaveNewProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.building || !newProp.unitNumber || !newProp.landlordName) {
      alert('Please fill in Building, Unit Number, and Landlord Name.');
      return;
    }

    const title = newProp.title || `${newProp.building} (${newProp.unitNumber})`;
    const fullProp: BrokerProperty = {
      id: `prop-broker-${Date.now()}`,
      title,
      building: newProp.building || 'Building',
      unitNumber: newProp.unitNumber || 'Unit',
      community: newProp.community || 'Dubai Marina',
      propertyType: newProp.propertyType as any || 'Apartment',
      bedrooms: newProp.bedrooms || '1 Bedroom',
      bathrooms: Number(newProp.bathrooms) || 2,
      sizeSqft: Number(newProp.sizeSqft) || 850,
      dealType: newProp.dealType || 'FOR_RENT',
      annualRentAED: Number(newProp.annualRentAED) || undefined,
      rentalStatus: newProp.rentalStatus as any || 'Vacant / Available Now',
      chequesRequired: Number(newProp.chequesRequired) || 4,
      securityDepositAED: Number(newProp.securityDepositAED) || undefined,
      currentTenantName: newProp.currentTenantName || undefined,
      currentTenantPhone: newProp.currentTenantPhone || undefined,
      currentRentAED: Number(newProp.currentRentAED) || undefined,
      leaseStartDate: newProp.leaseStartDate || undefined,
      leaseEndDate: newProp.leaseEndDate || undefined,
      expectedAvailableDate: newProp.expectedAvailableDate || undefined,
      askingPriceAED: Number(newProp.askingPriceAED) || undefined,
      saleStatus: newProp.saleStatus as any || 'Available',
      titleDeedStatus: newProp.titleDeedStatus as any || 'Title Deed Ready',
      occupancyStatus: newProp.occupancyStatus as any || 'Vacant on Transfer',
      landlordName: newProp.landlordName || 'Landlord',
      landlordPhone: newProp.landlordPhone || '',
      exclusive: Boolean(newProp.exclusive),
      amenities: newProp.amenities || ['Pool', 'Gym'],
      notes: newProp.notes || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddProperty(fullProp);
    setIsAddModalOpen(false);
    // Reset Form
    setNewProp({
      dealType: 'FOR_RENT',
      propertyType: 'Apartment',
      bedrooms: '1 Bedroom',
      bathrooms: 2,
      community: 'Dubai Marina',
      building: '',
      unitNumber: '',
      title: '',
      sizeSqft: 850,
      annualRentAED: 95000,
      chequesRequired: 4,
      securityDepositAED: 4750,
      rentalStatus: 'Vacant / Available Now',
      askingPriceAED: 1200000,
      titleDeedStatus: 'Title Deed Ready',
      occupancyStatus: 'Vacant on Transfer',
      landlordName: '',
      landlordPhone: '',
      exclusive: true,
      amenities: ['Gym', 'Pool'],
      notes: '',
    });
  };

  // Open Notice Generation Modal
  const handleOpenNoticeModal = (prop: BrokerProperty, defaultNoticeType: 'RERA_90_DAY' | 'RELIST_MARKETING' | 'LANDLORD_ADVISORY') => {
    setActiveNoticeModalProperty(prop);
    setNoticeType(defaultNoticeType);
    setNoticeOutput(null);
    handleGenerateNotice(prop, defaultNoticeType);
  };

  const handleGenerateNotice = async (prop: BrokerProperty, nType: string) => {
    setIsGeneratingNotice(true);
    try {
      const res = await fetch('/api/draft-tenancy-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyTitle: prop.title,
          unitNumber: prop.unitNumber,
          community: prop.community,
          tenantName: prop.currentTenantName || 'Tenant',
          tenantPhone: prop.currentTenantPhone || '',
          landlordName: prop.landlordName,
          currentRentAED: prop.currentRentAED || prop.annualRentAED,
          newProposedRentAED: prop.annualRentAED || (prop.currentRentAED ? prop.currentRentAED * 1.1 : 120000),
          leaseEndDate: prop.leaseEndDate || 'Upcoming Renewal',
          noticeType: nType,
          brokerName: 'Alexander Sterling',
          brokerAgency: 'EstatePulse Real Estate Brokerage',
        }),
      });

      if (!res.ok) throw new Error('Failed to generate notice');
      const data = await res.json();
      setNoticeOutput(data);
    } catch (err) {
      console.error(err);
      // Fallback in client
      const currRent = Number(prop.currentRentAED || prop.annualRentAED || 100000).toLocaleString();
      const newRent = Number(prop.annualRentAED || 115000).toLocaleString();

      setNoticeOutput({
        formalNoticeSubject: `Official Tenancy Renewal & Terms Revision: ${prop.title} (${prop.unitNumber}) - Expiry: ${prop.leaseEndDate}`,
        formalNoticeBody: `Dear ${prop.currentTenantName || 'Tenant'},\n\nRe: Tenancy Contract Renewal Notice for ${prop.title}, Unit ${prop.unitNumber}, ${prop.community}, Dubai.\n\nIn accordance with Dubai Law No. 26 of 2007 (as amended by Law No. 33 of 2008) regarding landlord and tenant relationships, please be advised that your current lease agreement will expire on ${prop.leaseEndDate}.\n\nUnder Article 14 requiring at least 90 days statutory notice prior to lease expiration, the landlord proposes the following renewal terms:\n• Annual Renewal Rent: AED ${newRent} (Current: AED ${currRent})\n• Payment Terms: ${prop.chequesRequired || 4} Cheques\n• Term: 12 Months from current lease expiry\n\nKindly confirm your renewal decision within 14 business days so that your Ejari contract may be prepared.\n\nSincerely,\nEstatePulse Real Estate Brokerage`,
        whatsappQuickNotice: `📌 *90-DAY LEASE RENEWAL NOTICE*\n\nDear *${prop.currentTenantName || 'Tenant'}*,\n\nYour tenancy contract for *${prop.title}* (*${prop.unitNumber}*) in *${prop.community}* is due for renewal on *${prop.leaseEndDate}*.\n\nUnder RERA 90-day statutory guidelines:\n• *Current Rent:* AED ${currRent}\n• *Proposed Renewal Rent:* AED ${newRent} (${prop.chequesRequired || 4} Cheques)\n\nPlease reply to confirm if you wish to renew for the upcoming year.\n\nThank you!`,
        reraComplianceNotes: 'Under Dubai Law 33/2008, failure to give at least 90 days written notice before lease expiry prevents any rental increase or contract modification.',
        relistingBroadcast: `🏢 *UPCOMING RENTAL | ${prop.community.toUpperCase()}* 🏢\n\n*${prop.title} (${prop.unitNumber})*\n📍 Location: ${prop.community}\n🔑 Availability: Available from ${prop.leaseEndDate}\n💰 Rent: AED ${newRent}/year (${prop.chequesRequired || 4} Cheques)\n✨ Size: ${prop.sizeSqft} sqft | ${prop.bedrooms}\n\n📲 Direct contact for early viewing arrangements.`,
      });
    } finally {
      setIsGeneratingNotice(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Portfolio Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-400" />
              Broker Property Portfolio & Upcoming Rent Radar
            </h2>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-medium">
              Secondary Market CRM
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Manage your personal secondary market inventory for rent and sale. Track active tenancies, automated <strong>RERA 90-day legal renewal windows</strong>, and advance alerts for properties becoming available next year.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Secondary Property
          </button>
        </div>
      </div>

      {/* RERA 90-DAY & UPCOMING RENT NOTIFICATION RADAR */}
      {alerts.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Upcoming Rent & Lease Expiry Notifications
              </h3>
              <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.2 rounded font-mono font-bold">
                {alerts.length} Action Items
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Simulated Date: <strong>October 14, 2026</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {alerts.slice(0, 3).map((alert, idx) => {
              const isUrgent = alert.urgency === 'URGENT';
              const isRera90 = alert.urgency === 'RERA_90_DAY';
              const isNextYear = alert.urgency === 'NEXT_YEAR';
              const prop = properties.find((p) => p.id === alert.propertyId);

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between text-xs space-y-2.5 transition-all ${
                    isUrgent
                      ? 'bg-rose-950/20 border-rose-600/40'
                      : isRera90
                      ? 'bg-amber-950/20 border-amber-600/40'
                      : isNextYear
                      ? 'bg-indigo-950/20 border-indigo-600/40'
                      : 'bg-emerald-950/20 border-emerald-600/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                          isUrgent
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : isRera90
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : isNextYear
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isUrgent && `⚠️ Expiring in ${alert.daysRemaining} Days`}
                        {isRera90 && `⏳ RERA 90-Day Window (${alert.daysRemaining}d)`}
                        {isNextYear && `📅 Available in 2027`}
                        {!isUrgent && !isRera90 && !isNextYear && `🟢 Vacant & Ready`}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{alert.unitNumber}</span>
                    </div>

                    <h4 className="font-bold text-white text-xs line-clamp-1">{alert.propertyTitle}</h4>
                    <p className="text-[11px] text-slate-300">{alert.community}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mt-1">
                      {alert.recommendation}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Current In-Place Rent:</span>
                      <strong className="text-amber-300 font-mono">
                        AED {alert.currentRentAED?.toLocaleString()}/yr
                      </strong>
                    </div>

                    {prop && (
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenNoticeModal(
                            prop,
                            isRera90 ? 'RERA_90_DAY' : isUrgent ? 'RELIST_MARKETING' : 'LANDLORD_ADVISORY'
                          )
                        }
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-all"
                      >
                        <Sparkles className="w-3 h-3" />
                        {isRera90 ? 'Serve Notice' : 'Draft Copy'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* KPI Ribbons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Portfolio</span>
          <span className="text-xl font-mono font-bold text-white">{properties.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">For Rent</span>
          <span className="text-xl font-mono font-bold text-emerald-400">
            {properties.filter((p) => p.dealType === 'FOR_RENT' || p.dealType === 'BOTH').length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] uppercase font-bold text-amber-400 block">For Sale</span>
          <span className="text-xl font-mono font-bold text-amber-400">
            {properties.filter((p) => p.dealType === 'FOR_SALE' || p.dealType === 'BOTH').length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] uppercase font-bold text-rose-400 block">RERA 90-Day Due</span>
          <span className="text-xl font-mono font-bold text-rose-400">
            {alerts.filter((a) => a.urgency === 'RERA_90_DAY' || a.urgency === 'URGENT').length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] uppercase font-bold text-indigo-400 block">Available Next Year</span>
          <span className="text-xl font-mono font-bold text-indigo-300">
            {alerts.filter((a) => a.urgency === 'NEXT_YEAR').length}
          </span>
        </div>
      </div>

      {/* Search, Filter Tabs & Community Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterTab === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({properties.length})
          </button>
          <button
            onClick={() => setFilterTab('RENT')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterTab === 'RENT' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            For Rent
          </button>
          <button
            onClick={() => setFilterTab('SALE')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterTab === 'SALE' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            For Sale
          </button>
          <button
            onClick={() => setFilterTab('ALERTS')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
              filterTab === 'ALERTS' ? 'bg-rose-600 text-white font-bold' : 'text-rose-400 hover:text-rose-300'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            90-Day Notices
          </button>
          <button
            onClick={() => setFilterTab('NEXT_YEAR')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterTab === 'NEXT_YEAR' ? 'bg-indigo-600 text-white font-bold' : 'text-indigo-400 hover:text-indigo-300'
            }`}
          >
            Next Year (2027)
          </button>
          <button
            onClick={() => setFilterTab('VACANT')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterTab === 'VACANT' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vacant
          </button>
        </div>

        {/* Search & Community Selector */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tower, unit, tenant..."
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-amber-400"
          >
            {communities.map((c, i) => (
              <option key={i} value={c}>
                {c === 'ALL' ? 'All Areas' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <Building className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">No properties matching filters</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or add a new property.</p>
          </div>
        ) : (
          filteredProperties.map((prop) => {
            const isForRent = prop.dealType === 'FOR_RENT' || prop.dealType === 'BOTH';
            const isForSale = prop.dealType === 'FOR_SALE' || prop.dealType === 'BOTH';

            // Check if alert exists
            const propAlert = alerts.find((a) => a.propertyId === prop.id);

            return (
              <div
                key={prop.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 text-xs"
              >
                {/* Card Top: Badges & Title */}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      {isForRent && (
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          FOR RENT
                        </span>
                      )}
                      {isForSale && (
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          FOR SALE
                        </span>
                      )}
                      {prop.exclusive && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                          EXCLUSIVE
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">{prop.unitNumber}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1">{prop.title}</h3>
                  <p className="text-slate-400 text-[11px]">{prop.building} • {prop.community}</p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-2">
                    <span>{prop.bedrooms}</span>
                    <span>•</span>
                    <span>{prop.bathrooms} Baths</span>
                    <span>•</span>
                    <span>{prop.sizeSqft} sqft</span>
                  </div>
                </div>

                {/* Financials & Lease Section */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  {isForRent && (
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Annual Rent:</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        AED {prop.annualRentAED?.toLocaleString()}/yr
                        <span className="text-[10px] font-normal text-slate-400 ml-1">
                          ({prop.chequesRequired || 4} Cheques)
                        </span>
                      </span>
                    </div>
                  )}

                  {isForSale && (
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Asking Price:</span>
                      <span className="font-mono font-bold text-amber-300 text-sm">
                        AED {prop.askingPriceAED?.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Tenancy & Expiry status */}
                  {prop.leaseEndDate && (
                    <div className="pt-1.5 border-t border-slate-850 flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        Lease Expiry:
                      </span>
                      <span className="font-mono font-semibold text-slate-200">{prop.leaseEndDate}</span>
                    </div>
                  )}

                  {/* Alert Tag Ribbon */}
                  {propAlert && (
                    <div
                      className={`p-1.5 rounded-lg border text-[10px] font-medium flex items-center justify-between ${
                        propAlert.urgency === 'URGENT'
                          ? 'bg-rose-950/60 border-rose-700/60 text-rose-300'
                          : propAlert.urgency === 'RERA_90_DAY'
                          ? 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                          : 'bg-indigo-950/60 border-indigo-700/60 text-indigo-300'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {propAlert.headline}
                      </span>
                    </div>
                  )}
                </div>

                {/* Landlord Contact Info */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{prop.landlordName}</span>
                  </div>
                  {prop.landlordPhone && (
                    <a
                      href={`https://wa.me/${prop.landlordPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-mono text-[10px] flex items-center gap-0.5"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      Contact
                    </a>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenNoticeModal(prop, prop.leaseEndDate ? 'RERA_90_DAY' : 'RELIST_MARKETING')}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-750 text-amber-400 font-semibold rounded-lg text-xs flex items-center justify-center gap-1 border border-slate-700 transition-all"
                  >
                    <Sparkles className="w-3 h-3" />
                    {prop.leaseEndDate ? 'Draft RERA Notice' : 'Draft Marketing'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteProperty(prop.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-all"
                    title="Delete property from database"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD SECONDARY PROPERTY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-400" />
                  Add Secondary Property to Broker Database
                </h3>
                <p className="text-xs text-slate-400">For Sale or Rent with Tenancy & Next Year Availability tracking</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 hover:text-white text-slate-400 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProperty} className="space-y-4 text-xs">
              {/* Deal Type Switcher */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Deal Listing Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewProp({ ...newProp, dealType: 'FOR_RENT' })}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      newProp.dealType === 'FOR_RENT'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    For Rent (Lease)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProp({ ...newProp, dealType: 'FOR_SALE' })}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      newProp.dealType === 'FOR_SALE'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    For Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProp({ ...newProp, dealType: 'BOTH' })}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      newProp.dealType === 'BOTH'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Both (Rent & Sale)
                  </button>
                </div>
              </div>

              {/* Building & Unit & Community */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Building / Tower Name *</label>
                  <input
                    type="text"
                    required
                    value={newProp.building}
                    onChange={(e) => setNewProp({ ...newProp, building: e.target.value })}
                    placeholder="e.g. Marina Gate II"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Unit Number *</label>
                  <input
                    type="text"
                    required
                    value={newProp.unitNumber}
                    onChange={(e) => setNewProp({ ...newProp, unitNumber: e.target.value })}
                    placeholder="e.g. Unit 1402"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Community</label>
                  <select
                    value={newProp.community}
                    onChange={(e) => setNewProp({ ...newProp, community: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Dubai Marina">Dubai Marina</option>
                    <option value="JVC (Jumeirah Village Circle)">JVC</option>
                    <option value="Business Bay">Business Bay</option>
                    <option value="Downtown Dubai">Downtown Dubai</option>
                    <option value="Dubai Creek Harbour">Dubai Creek Harbour</option>
                    <option value="Palm Jumeirah">Palm Jumeirah</option>
                    <option value="Dubai Hills Estate">Dubai Hills</option>
                    <option value="Sobha Hartland (MBR City)">Sobha Hartland</option>
                    <option value="Sharjah / Masaar">Sharjah / Masaar</option>
                  </select>
                </div>
              </div>

              {/* Beds, Baths, Size */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Bedrooms</label>
                  <input
                    type="text"
                    value={newProp.bedrooms}
                    onChange={(e) => setNewProp({ ...newProp, bedrooms: e.target.value })}
                    placeholder="e.g. 1 Bedroom, 2BR"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={newProp.bathrooms}
                    onChange={(e) => setNewProp({ ...newProp, bathrooms: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Size (Sq.Ft.)</label>
                  <input
                    type="number"
                    value={newProp.sizeSqft}
                    onChange={(e) => setNewProp({ ...newProp, sizeSqft: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* RENTAL DETAILS SECTION */}
              {(newProp.dealType === 'FOR_RENT' || newProp.dealType === 'BOTH') && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Rental & Tenancy Details (For Upcoming Rent Notifications)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Asking Rent (AED/yr)</label>
                      <input
                        type="number"
                        step="1000"
                        value={newProp.annualRentAED}
                        onChange={(e) => setNewProp({ ...newProp, annualRentAED: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-300 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Number of Cheques</label>
                      <select
                        value={newProp.chequesRequired}
                        onChange={(e) => setNewProp({ ...newProp, chequesRequired: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                      >
                        <option value={1}>1 Cheque</option>
                        <option value={2}>2 Cheques</option>
                        <option value={4}>4 Cheques</option>
                        <option value={6}>6 Cheques</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Rental Status</label>
                      <select
                        value={newProp.rentalStatus}
                        onChange={(e) => setNewProp({ ...newProp, rentalStatus: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                      >
                        <option value="Vacant / Available Now">Vacant / Available Now</option>
                        <option value="Rented (Active)">Rented (Active)</option>
                        <option value="Available Next Year">Available Next Year (2027)</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Current Tenant Name</label>
                      <input
                        type="text"
                        value={newProp.currentTenantName}
                        onChange={(e) => setNewProp({ ...newProp, currentTenantName: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Current Rent (AED/yr)</label>
                      <input
                        type="number"
                        value={newProp.currentRentAED}
                        onChange={(e) => setNewProp({ ...newProp, currentRentAED: Number(e.target.value) })}
                        placeholder="In-place rent"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Lease Expiry Date</label>
                      <input
                        type="date"
                        value={newProp.leaseEndDate}
                        onChange={(e) => setNewProp({ ...newProp, leaseEndDate: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SALE DETAILS SECTION */}
              {(newProp.dealType === 'FOR_SALE' || newProp.dealType === 'BOTH') && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    Secondary Sale Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Asking Price (AED)</label>
                      <input
                        type="number"
                        step="10000"
                        value={newProp.askingPriceAED}
                        onChange={(e) => setNewProp({ ...newProp, askingPriceAED: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Title Deed Status</label>
                      <select
                        value={newProp.titleDeedStatus}
                        onChange={(e) => setNewProp({ ...newProp, titleDeedStatus: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                      >
                        <option value="Title Deed Ready">Title Deed Ready</option>
                        <option value="Oqood">Oqood (Pre-Title)</option>
                        <option value="Under Mortgage">Under Mortgage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Occupancy</label>
                      <select
                        value={newProp.occupancyStatus}
                        onChange={(e) => setNewProp({ ...newProp, occupancyStatus: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                      >
                        <option value="Vacant on Transfer">Vacant on Transfer</option>
                        <option value="Rented">Rented</option>
                        <option value="Owner Occupied">Owner Occupied</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Landlord Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Landlord / Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={newProp.landlordName}
                    onChange={(e) => setNewProp({ ...newProp, landlordName: e.target.value })}
                    placeholder="e.g. Hussain Al Rostamani"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Landlord Phone (with WhatsApp)</label>
                  <input
                    type="text"
                    value={newProp.landlordPhone}
                    onChange={(e) => setNewProp({ ...newProp, landlordPhone: e.target.value })}
                    placeholder="e.g. +971 50 123 4567"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-750"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20"
                >
                  Save to Property Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RERA 90-DAY & LEASE NOTICE GENERATION MODAL */}
      {activeNoticeModalProperty && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Tenancy Renewal & Re-Listing Copilot
                </h3>
                <p className="text-xs text-slate-400">
                  {activeNoticeModalProperty.title} ({activeNoticeModalProperty.unitNumber}) • {activeNoticeModalProperty.community}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveNoticeModalProperty(null)}
                className="p-1.5 hover:text-white text-slate-400 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notice Category Switcher */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setNoticeType('RERA_90_DAY');
                  handleGenerateNotice(activeNoticeModalProperty, 'RERA_90_DAY');
                }}
                className={`py-2 px-3 rounded-xl font-bold transition-all ${
                  noticeType === 'RERA_90_DAY'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                RERA 90-Day Renewal Notice
              </button>
              <button
                type="button"
                onClick={() => {
                  setNoticeType('RELIST_MARKETING');
                  handleGenerateNotice(activeNoticeModalProperty, 'RELIST_MARKETING');
                }}
                className={`py-2 px-3 rounded-xl font-bold transition-all ${
                  noticeType === 'RELIST_MARKETING'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Upcoming Vacancy Broadcast
              </button>
              <button
                type="button"
                onClick={() => {
                  setNoticeType('LANDLORD_ADVISORY');
                  handleGenerateNotice(activeNoticeModalProperty, 'LANDLORD_ADVISORY');
                }}
                className={`py-2 px-3 rounded-xl font-bold transition-all ${
                  noticeType === 'LANDLORD_ADVISORY'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Landlord Market Advisory
              </button>
            </div>

            {/* Notice Output Area */}
            {isGeneratingNotice ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <RotateCcw className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
                <p className="text-xs">Generating legal RERA notice and communication drafts...</p>
              </div>
            ) : noticeOutput ? (
              <div className="space-y-3 text-xs">
                {/* RERA Law banner */}
                <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3 text-amber-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Dubai Law No. 33 of 2008 & Decree No. 43 of 2013 Guidance
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {noticeOutput.reraComplianceNotes}
                  </p>
                </div>

                {/* Formal Email / Courier Notice */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-850">
                    <span className="font-bold text-white uppercase text-[10px] text-amber-400">
                      Formal Written Notice (Email / Notary / Registered Post)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          `SUBJECT: ${noticeOutput.formalNoticeSubject}\n\n${noticeOutput.formalNoticeBody}`,
                          'formal'
                        )
                      }
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700"
                    >
                      {copiedKey === 'formal' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === 'formal' ? 'Copied' : 'Copy Notice'}
                    </button>
                  </div>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans text-xs">
                    {noticeOutput.formalNoticeBody}
                  </p>
                </div>

                {/* WhatsApp Fast Copy */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-850">
                    <span className="font-bold text-white uppercase text-[10px] text-emerald-400">
                      WhatsApp Quick Notification
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(noticeOutput.whatsappQuickNotice, 'wa_notice')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1"
                    >
                      {copiedKey === 'wa_notice' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === 'wa_notice' ? 'Copied' : 'Copy WhatsApp'}
                    </button>
                  </div>
                  <div className="bg-[#0b141a] p-3 rounded-lg border border-emerald-950 text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {noticeOutput.whatsappQuickNotice}
                  </div>
                </div>

                {/* Pre-Relisting Broadcast */}
                {noticeOutput.relistingBroadcast && (
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-850">
                      <span className="font-bold text-white uppercase text-[10px] text-indigo-400">
                        Advance Re-Listing WhatsApp Broadcast (Find New Tenant)
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(noticeOutput.relistingBroadcast, 'relist')}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1"
                      >
                        {copiedKey === 'relist' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'relist' ? 'Copied' : 'Copy Broadcast'}
                      </button>
                    </div>
                    <div className="bg-[#0b141a] p-3 rounded-lg border border-indigo-950 text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {noticeOutput.relistingBroadcast}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
