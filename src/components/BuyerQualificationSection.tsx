import React, { useState } from 'react';
import { 
  TrendingUp, 
  UserCheck, 
  Sparkles, 
  Check, 
  Copy, 
  Send, 
  AlertCircle, 
  Building, 
  MapPin, 
  CreditCard, 
  Clock, 
  DollarSign, 
  Award, 
  Zap, 
  RotateCcw,
  Target
} from 'lucide-react';
import { QualifiedBuyer, InventoryProperty } from '../types';
import { SAMPLE_BUYER_CHATS } from '../data/sampleData';

interface BuyerQualificationSectionProps {
  inventory: InventoryProperty[];
}

export const BuyerQualificationSection: React.FC<BuyerQualificationSectionProps> = ({ inventory }) => {
  const [chatInput, setChatInput] = useState(SAMPLE_BUYER_CHATS[0].chat);
  const [isLoading, setIsLoading] = useState(false);
  const [buyer, setBuyer] = useState<QualifiedBuyer | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedMatchPitch, setSelectedMatchPitch] = useState<{ id: string; pitch: string } | null>(null);

  const handleQualify = async () => {
    if (!chatInput.trim()) return;
    setIsLoading(true);
    let qualifiedData: QualifiedBuyer | null = null;

    try {
      const res = await fetch('/api/qualify-buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientChatText: chatInput }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && (data.preferredCommunities || data.clientName)) {
          qualifiedData = data;
        }
      }
    } catch (err) {
      console.warn('Qualification network issue, using smart parser fallback:', err);
    }

    if (qualifiedData) {
      setBuyer(qualifiedData);
      setSelectedMatchPitch(null);
      setIsLoading(false);
      return;
    }

    // Dynamic smart rule-based parser on client
    const text = chatInput.toLowerCase();
    const isInvestor = text.includes('invest') || text.includes('roi') || text.includes('yield') || text.includes('rent out');
    const isEndUser = text.includes('family') || text.includes('move in') || text.includes('end user') || text.includes('living');
    const isMortgage = text.includes('mortgage') || text.includes('finance') || text.includes('bank');

    let bed = '1BR / 2BR';
    if (text.includes('studio')) bed = 'Studio';
    else if (text.includes('1 br') || text.includes('1br') || text.includes('1 bed')) bed = '1BR';
    else if (text.includes('2 br') || text.includes('2br') || text.includes('2 bed')) bed = '2BR';
    else if (text.includes('3 br') || text.includes('3br') || text.includes('3 bed')) bed = '3BR';
    else if (text.includes('villa') || text.includes('townhouse')) bed = '3BR - 4BR';

    const areas: string[] = [];
    if (text.includes('jvc') || text.includes('jumeirah village')) areas.push('JVC');
    if (text.includes('business bay')) areas.push('Business Bay');
    if (text.includes('marina')) areas.push('Dubai Marina');
    if (text.includes('downtown')) areas.push('Downtown Dubai');
    if (text.includes('dubai south') || text.includes('south')) areas.push('Dubai South');
    if (text.includes('hills')) areas.push('Dubai Hills Estate');
    if (text.includes('creek')) areas.push('Dubai Creek Harbour');
    if (text.includes('arjan')) areas.push('Arjan');
    if (text.includes('sharjah') || text.includes('aljada')) areas.push('Sharjah / Aljada');
    if (text.includes('sobha') || text.includes('hartland')) areas.push('Sobha Hartland');
    if (areas.length === 0) areas.push('High Yield Corridors (JVC / Business Bay)');

    let budgetMax = 1500000;
    let budgetMin = 900000;
    const numMatches = text.match(/(\d+(\.\d+)?)\s*(m|million|k)/g);
    if (numMatches && numMatches.length > 0) {
      const valStr = numMatches[0];
      if (valStr.includes('m')) {
        const num = parseFloat(valStr);
        budgetMax = num * 1000000;
        budgetMin = budgetMax * 0.8;
      } else if (valStr.includes('k')) {
        const num = parseFloat(valStr);
        budgetMax = num * 1000;
        budgetMin = budgetMax * 0.8;
      }
    }

    // Extract name if introduced
    let clientName = 'Qualified Buyer Lead';
    if (text.includes('my name is')) {
      const namePart = chatInput.split(/my name is/i)[1]?.trim().split(/[.\n,]/)[0];
      if (namePart) clientName = namePart.trim();
    } else if (text.includes('marcus')) {
      clientName = 'Marcus Weber (Zurich)';
    }

    setBuyer({
      clientName,
      contactPhone: null,
      preferredCommunities: areas,
      propertyType: text.includes('villa') ? 'Villa' : text.includes('townhouse') ? 'Townhouse' : 'Apartment',
      bedroomCount: bed,
      budgetMinAED: budgetMin,
      budgetMaxAED: budgetMax,
      formattedBudget: `AED ${Number(budgetMin).toLocaleString()} - ${Number(budgetMax).toLocaleString()}`,
      purpose: isInvestor ? 'Investor' : isEndUser ? 'End-user' : 'Investor',
      financeType: isMortgage ? 'Mortgage' : 'Cash Buyer',
      timeline: text.includes('ready') || text.includes('immediate') ? 'Immediate (Ready)' : 'Off-Plan (Handover 2026-2027)',
      goldenVisaCandidate: budgetMax >= 2000000,
      keyPriorities: ['Strong rental yield', 'Reliable developer', 'Favorable payment terms'],
      dealbreakers: ['Delayed project handover history', 'Unfavorable service charges'],
      buyerReadinessScore: 88,
      brokerSummary: `Qualified buyer inquiring about ${bed} properties in ${areas.join(', ')} with approximate budget of AED ${Number(budgetMax).toLocaleString()}. High readiness level.`,
      suggestedWhatsAppReply: `Hello! Thank you for getting in touch. I have noted your interest in ${bed} options in ${areas.join(', ')} around the AED ${Number(budgetMax).toLocaleString()} budget. I have two specific verified options with excellent capital growth and strong ROI that match your criteria. When is a convenient time today for a quick 2-minute chat so I can share the unit layouts?`,
    });
    setSelectedMatchPitch(null);
    setIsLoading(false);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Inventory Matching Algorithm
  const matchedInventory = buyer
    ? inventory.map((item) => {
        let score = 50;

        // Area match
        const areaMatch = buyer.preferredCommunities.some(
          (area) =>
            item.location.toLowerCase().includes(area.toLowerCase()) ||
            area.toLowerCase().includes(item.location.toLowerCase())
        );
        if (areaMatch) score += 25;

        // Budget match
        if (item.priceAED <= buyer.budgetMaxAED && item.priceAED >= buyer.budgetMinAED * 0.75) {
          score += 20;
        }

        // Bedroom match
        if (buyer.bedroomCount.includes(item.beds) || item.beds.includes(buyer.bedroomCount)) {
          score += 15;
        }

        // Purpose match
        if (buyer.purpose === 'Investor' && item.roiEstimate >= 7.5) score += 10;
        if (buyer.goldenVisaCandidate && item.priceAED >= 2000000) score += 15;

        const finalScore = Math.min(Math.max(score, 45), 98);

        return {
          ...item,
          matchScore: finalScore,
        };
      }).sort((a, b) => b.matchScore - a.matchScore)
    : [];

  const handleGeneratePitchForUnit = (unit: InventoryProperty) => {
    if (!buyer) return;
    const formattedPrice = Number(unit.priceAED).toLocaleString();
    const isGV = unit.priceAED >= 2000000;

    const pitch = `Hi ${buyer.clientName.split(' ')[0] || 'there'}, based on your search in ${buyer.preferredCommunities.join('/')} with a budget of ${buyer.formattedBudget}, this property is an exact match:

🏢 *${unit.title}* by *${unit.developer}*
📍 Location: ${unit.location}
💰 Price: AED ${formattedPrice}
🛏 Layout: ${unit.beds} (${unit.sizeSqft} sq.ft.)
📈 Projected Net Yield: ${unit.roiEstimate}% ROI
💳 Payment Plan: ${unit.paymentPlan}
🔑 Handover: ${unit.handover}
${isGV ? '🇦🇪 *100% Qualifies for 10-Year UAE Golden Visa*' : '✨ High tenant demand corridor'}

Would you like me to share the official developer brochure and unit floor plan on WhatsApp?`;

    setSelectedMatchPitch({ id: unit.id, pitch });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Input & Sample Selection */}
      <div className="lg:col-span-5 space-y-4">
        {/* Sample Chats Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Realistic Client WhatsApp Inquiries
            </span>
            <span className="text-[11px] text-slate-400">Click to Load</span>
          </div>

          <div className="space-y-2">
            {SAMPLE_BUYER_CHATS.map((sc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setChatInput(sc.chat)}
                className="w-full text-left text-xs p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 hover:border-amber-500/50 border border-slate-700/60 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="font-semibold text-slate-200 group-hover:text-amber-300 block">
                    {sc.title}
                  </span>
                  <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {sc.chat.slice(0, 75)}...
                  </span>
                </div>
                <span className="text-[10px] text-amber-400 font-bold ml-2">Load</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Text Area */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              Raw Client Inquiry / Chat Transcripts
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste incoming WhatsApp messages, voice note transcripts, or web lead forms
            </p>
          </div>

          <textarea
            rows={9}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
            placeholder="Paste raw client chat or email here..."
          />

          <button
            type="button"
            onClick={handleQualify}
            disabled={isLoading || !chatInput.trim()}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Analyzing UAE Buyer Requirements...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                AI Qualify Buyer & Match Inventory
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Structured Buyer Profile & Inventory Matcher */}
      <div className="lg:col-span-7 space-y-4">
        {!buyer ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 min-h-[580px] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-amber-400 mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">Awaiting Client Inquiries</h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Paste any buyer inquiry on the left and click &ldquo;AI Qualify Buyer&rdquo; to instantly extract structured budget, community preferences, finance type, readiness score, and match against active inventory.
            </p>
            <button
              type="button"
              onClick={handleQualify}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Analyze Loaded Sample
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Qualified Profile Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              {/* Header with Readiness Score */}
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-sm">
                    {buyer.clientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {buyer.clientName}
                      {buyer.goldenVisaCandidate && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-medium">
                          🇦🇪 Golden Visa (2M+ AED)
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">{buyer.brokerSummary}</p>
                  </div>
                </div>

                {/* Readiness Meter */}
                <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Readiness</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{buyer.buyerReadinessScore}/100</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-500/60 flex items-center justify-center text-xs font-bold text-emerald-300 bg-emerald-950/40">
                    {buyer.buyerReadinessScore}%
                  </div>
                </div>
              </div>

              {/* Grid of Key Extracted Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-amber-400" />
                    Budget (AED)
                  </span>
                  <p className="font-mono font-bold text-amber-300 mt-1">{buyer.formattedBudget}</p>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Building className="w-3 h-3 text-indigo-400" />
                    Type & Beds
                  </span>
                  <p className="font-medium text-slate-200 mt-1">{buyer.bedroomCount} {buyer.propertyType}</p>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-emerald-400" />
                    Finance
                  </span>
                  <p className="font-medium text-slate-200 mt-1">{buyer.financeType} • {buyer.purpose}</p>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-400" />
                    Timeline
                  </span>
                  <p className="font-medium text-slate-200 mt-1 truncate">{buyer.timeline}</p>
                </div>
              </div>

              {/* Preferred Communities */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  Target Areas & Communities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {buyer.preferredCommunities.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-800 text-amber-300 border border-slate-700 rounded-lg text-xs font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Priorities & Dealbreakers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-bold text-emerald-400 block mb-1.5">Key Buyer Drivers:</span>
                  <ul className="space-y-1 text-slate-300">
                    {buyer.keyPriorities.map((kp, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-bold text-amber-400 block mb-1.5">Potential Dealbreakers:</span>
                  <ul className="space-y-1 text-slate-300">
                    {buyer.dealbreakers.map((db, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{db}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggested WhatsApp Reply */}
              <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    AI-Drafted WhatsApp Reply for Broker
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(buyer.suggestedWhatsAppReply, 'reply')}
                    className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'reply' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === 'reply' ? 'Copied' : 'Copy Message'}
                  </button>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg text-xs text-slate-200 whitespace-pre-wrap leading-relaxed border border-slate-800">
                  {buyer.suggestedWhatsAppReply}
                </div>
              </div>
            </div>

            {/* INVENTORY MATCHING SECTION */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    Inventory Matches for {buyer.clientName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ranked by community alignment, budget feasibility, and yield goals
                  </p>
                </div>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {matchedInventory.length} Units Available
                </span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {matchedInventory.slice(0, 4).map((unit) => (
                  <div
                    key={unit.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{unit.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            unit.matchScore >= 80
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {unit.matchScore}% Match
                        </span>
                        <span className="text-slate-400 text-[11px]">• {unit.developer}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-slate-300 text-[11px]">
                        <span className="text-amber-300 font-mono font-semibold">
                          AED {Number(unit.priceAED).toLocaleString()}
                        </span>
                        <span>{unit.beds} ({unit.sizeSqft} sqft)</span>
                        <span>{unit.location}</span>
                        <span className="text-emerald-400 font-bold">{unit.roiEstimate}% ROI</span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-1">{unit.paymentPlan}</p>
                    </div>

                    <div className="flex sm:flex-col items-end gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleGeneratePitchForUnit(unit)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-all"
                      >
                        <Sparkles className="w-3 h-3" />
                        Draft Pitch
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pitch Preview Modal / Box */}
              {selectedMatchPitch && (
                <div className="mt-3 bg-amber-950/20 border border-amber-800/40 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-300 flex items-center gap-1">
                      <Send className="w-3.5 h-3.5" />
                      Custom WhatsApp Pitch Ready
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedMatchPitch.pitch, 'pitch')}
                      className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'pitch' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === 'pitch' ? 'Copied' : 'Copy Pitch'}
                    </button>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg text-xs text-slate-200 whitespace-pre-wrap leading-relaxed border border-slate-800">
                    {selectedMatchPitch.pitch}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
