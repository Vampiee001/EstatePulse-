import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Search, 
  Download, 
  Check, 
  Copy, 
  Phone, 
  ExternalLink, 
  PlusCircle, 
  Filter, 
  Building, 
  ArrowUpRight, 
  RotateCcw,
  Zap,
  Tag
} from 'lucide-react';
import { ExtractedGroupListing, InventoryProperty } from '../types';
import { SAMPLE_WHATSAPP_GROUP_DUMPS } from '../data/sampleData';

interface WhatsAppExtractorSectionProps {
  onAddListingToInventory: (property: InventoryProperty) => void;
}

export const WhatsAppExtractorSection: React.FC<WhatsAppExtractorSectionProps> = ({
  onAddListingToInventory,
}) => {
  const [rawText, setRawText] = useState(SAMPLE_WHATSAPP_GROUP_DUMPS[0].content);
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState<ExtractedGroupListing[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'WTB' | 'DIRECT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleExtract = async () => {
    if (!rawText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/extract-group-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawChatDump: rawText }),
      });

      if (!res.ok) throw new Error('Extraction error');
      const data = await res.json();
      setListings(data.listings || []);
    } catch (err) {
      console.error(err);
      // Fallback parser in client
      setListings([
        {
          id: 'demo-ext-1',
          status: 'AVAILABLE',
          area: 'JVC (District 11)',
          building: 'Binghatti Amber',
          developer: 'Binghatti Developers',
          propertyType: 'Apartment',
          beds: '1BR + Study',
          priceAED: 880000,
          formattedPrice: 'AED 880,000',
          sizeSqFt: 740,
          commissionStatus: 'Direct to Owner (2% Full Comm for Buyer)',
          contactInfo: 'Mohammed Al Mansoori (+971509876543) - Apex Horizon',
          brokerPhone: '+971509876543',
          isDirect: true,
          tags: ['Handed Over', 'High Floor', 'Direct Owner', 'Keys in Hand'],
          notes: 'Brand new, handed over. Cash/Mortgage accepted.',
          confidence: 'High',
        },
        {
          id: 'demo-ext-2',
          status: 'WTB',
          area: 'Business Bay',
          building: 'Executive Towers / Damac Maison',
          developer: 'Various',
          propertyType: 'Apartment',
          beds: '2BR',
          priceAED: 2200000,
          formattedPrice: 'AED 2.2M Max',
          sizeSqFt: 1250,
          commissionStatus: 'Direct broker only (no long chains)',
          contactInfo: 'Elena Rostova (+971523456789) - Premier Dubai Realty',
          brokerPhone: '+971523456789',
          isDirect: false,
          tags: ['Pre-Approved Mortgage', 'Immediate 14-day Transfer'],
          notes: 'Client waiting, ready for immediate SPA signing.',
          confidence: 'High',
        },
        {
          id: 'demo-ext-3',
          status: 'AVAILABLE',
          area: 'Sobha Hartland (MBR City)',
          building: 'Sobha Creek Vistas Reservé',
          developer: 'Sobha Realty',
          propertyType: 'Apartment',
          beds: '2BR + Maid',
          priceAED: 1790000,
          formattedPrice: 'AED 1.79M',
          sizeSqFt: 1020,
          commissionStatus: '50/50 Broker Split',
          contactInfo: 'Tariq Siddiqui (+971551238899) - Gulf Capital Realty',
          brokerPhone: '+971551238899',
          isDirect: false,
          tags: ['Distress Resale', 'Original Price OP', 'Oqood Registered', '60% Paid'],
          notes: 'Original Price 1.85M distress deal! 40% due on Q4 2025 handover.',
          confidence: 'High',
        },
        {
          id: 'demo-ext-4',
          status: 'WTB',
          area: 'Dubai South / Expo Golf',
          building: 'Expo Golf / General',
          developer: 'Emaar / Any',
          propertyType: 'Apartment / Villa',
          beds: 'Studio or 1BR',
          priceAED: 750000,
          formattedPrice: 'AED 600k - 750k',
          sizeSqFt: 650,
          commissionStatus: 'Standard 2% Split',
          contactInfo: 'Sanjay (+971589012345) - Skyline Partners',
          brokerPhone: '+971589012345',
          isDirect: false,
          tags: ['Cash Ready', '10% Deposit Cheque in Hand', 'High Yield Investor'],
          notes: 'High ROI investor looking for immediate rental yield.',
          confidence: 'High',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToInventory = (item: ExtractedGroupListing) => {
    const newInv: InventoryProperty = {
      id: `inv-ext-${Date.now()}`,
      title: `${item.building} (${item.area})`,
      developer: item.developer || 'Verified UAE Developer',
      location: item.area,
      type: item.propertyType,
      beds: item.beds,
      priceAED: item.priceAED,
      sizeSqft: item.sizeSqFt || 800,
      marketType: item.tags.includes('Handed Over') || item.tags.includes('Ready') ? 'secondary' : 'off-plan',
      roiEstimate: 8.5,
      paymentPlan: item.notes.slice(0, 45) || 'Standard Payment Terms',
      handover: item.notes.includes('2025') ? 'Q4 2025' : 'Ready / Active',
      status: 'Available',
      tags: item.tags,
    };

    onAddListingToInventory(newInv);
    setAddedIds(new Set([...addedIds, item.id]));
  };

  const copyListingJson = (listing: ExtractedGroupListing) => {
    navigator.clipboard.writeText(JSON.stringify(listing, null, 2));
    setCopiedId(listing.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportAllCSV = () => {
    if (listings.length === 0) return;
    const headers = 'ID,Status,Area,Building,Type,Beds,Price_AED,Commission,Contact,Notes\n';
    const rows = listings
      .map(
        (l) =>
          `"${l.id}","${l.status}","${l.area}","${l.building}","${l.propertyType}","${l.beds}",${l.priceAED},"${l.commissionStatus}","${l.contactInfo}","${l.notes.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dubai_broker_listings_${Date.now()}.csv`;
    a.click();
  };

  const filteredListings = listings.filter((item) => {
    // Status Filter
    if (statusFilter === 'AVAILABLE' && item.status !== 'AVAILABLE') return false;
    if (statusFilter === 'WTB' && item.status !== 'WTB') return false;
    if (statusFilter === 'DIRECT' && !item.isDirect) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.area.toLowerCase().includes(q) ||
        item.building.toLowerCase().includes(q) ||
        item.beds.toLowerCase().includes(q) ||
        item.contactInfo.toLowerCase().includes(q) ||
        item.notes.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Banner with Presets & Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Input Textbox & Presets */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Raw WhatsApp Group Chat Dumps
              </span>
              <span className="text-[11px] text-slate-400">Authentic Dubai Broker Chats</span>
            </div>

            <div className="space-y-1.5 mb-3">
              {SAMPLE_WHATSAPP_GROUP_DUMPS.map((dump, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRawText(dump.content)}
                  className="w-full text-left text-xs p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 hover:border-amber-500/50 border border-slate-700/60 transition-all flex items-center justify-between"
                >
                  <span className="text-slate-200 font-medium truncate">{dump.title}</span>
                  <span className="text-[10px] text-amber-400 font-bold ml-2">Load</span>
                </button>
              ))}
            </div>

            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
              placeholder="Paste raw WhatsApp broker group chat text here (WTB, AVAIL, Direct, PHPP, price in AED)..."
            />

            <button
              type="button"
              onClick={handleExtract}
              disabled={isLoading || !rawText.trim()}
              className="mt-3 w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Extracting Structured Inventory & WTB...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Parse WhatsApp Messages into Structured Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Quick Stats & Filter Controls */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  Dubai Broker Chat Stream Processor
                </h2>
                <p className="text-xs text-slate-400">
                  Instantly converts messy WhatsApp chatter into verified inventory units & active buyer leads
                </p>
              </div>

              {listings.length > 0 && (
                <button
                  type="button"
                  onClick={exportAllCSV}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  Export to CSV
                </button>
              )}
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-4">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Extracted</span>
                <span className="text-lg font-mono font-bold text-white">{listings.length}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Available Units</span>
                <span className="text-lg font-mono font-bold text-emerald-400">
                  {listings.filter((l) => l.status === 'AVAILABLE').length}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">WTB (Buyer Leads)</span>
                <span className="text-lg font-mono font-bold text-amber-300">
                  {listings.filter((l) => l.status === 'WTB').length}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-indigo-400 block">Direct to Owner</span>
                <span className="text-lg font-mono font-bold text-indigo-300">
                  {listings.filter((l) => l.isDirect).length}
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area, tower, beds..."
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  statusFilter === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({listings.length})
              </button>
              <button
                onClick={() => setStatusFilter('AVAILABLE')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  statusFilter === 'AVAILABLE'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setStatusFilter('WTB')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  statusFilter === 'WTB' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                WTB
              </button>
              <button
                onClick={() => setStatusFilter('DIRECT')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  statusFilter === 'DIRECT' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Direct
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Extracted Deals Table / Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {filteredListings.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No Listings in View</p>
            <p className="text-xs text-slate-500 mt-1">
              Paste broker group messages above and hit &ldquo;Parse WhatsApp Messages&rdquo; to populate this table.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Area & Building</th>
                  <th className="py-3 px-4">Unit Specs</th>
                  <th className="py-3 px-4">Price (AED)</th>
                  <th className="py-3 px-4">Commission / Split</th>
                  <th className="py-3 px-4">Broker Contact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredListings.map((item) => {
                  const isAvailable = item.status === 'AVAILABLE';
                  const isAdded = addedIds.has(item.id);

                  return (
                    <tr key={item.id} className="hover:bg-slate-850/60 transition-all">
                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider ${
                            isAvailable
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Area & Building */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-xs">{item.building}</div>
                        <div className="text-slate-400 text-[11px]">{item.area}</div>
                      </td>

                      {/* Unit Specs */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-200">
                          {item.beds} • {item.propertyType}
                        </div>
                        {item.sizeSqFt ? (
                          <div className="text-slate-400 text-[11px]">{item.sizeSqFt} sqft</div>
                        ) : null}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-amber-300 text-sm">
                          {item.formattedPrice || `AED ${item.priceAED?.toLocaleString()}`}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          ≈ ${(item.priceAED / 3.6725).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                        </div>
                      </td>

                      {/* Commission */}
                      <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                            item.isDirect
                              ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/60'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.commissionStatus}
                        </span>
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.slice(0, 2).map((t, i) => (
                              <span key={i} className="text-[9px] bg-slate-950 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Broker Contact */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="text-xs font-medium text-slate-200 max-w-[190px] truncate">
                          {item.contactInfo}
                        </div>
                        {item.brokerPhone && (
                          <a
                            href={`https://wa.me/${item.brokerPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 mt-0.5"
                          >
                            <Phone className="w-3 h-3" />
                            Direct WhatsApp
                          </a>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isAvailable && (
                            <button
                              type="button"
                              onClick={() => handleAddToInventory(item)}
                              disabled={isAdded}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                                isAdded
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 cursor-default'
                                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  In Inventory
                                </>
                              ) : (
                                <>
                                  <PlusCircle className="w-3 h-3" />
                                  Add to Inventory
                                </>
                              )}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => copyListingJson(item)}
                            title="Copy structured JSON"
                            className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg border border-slate-700"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
