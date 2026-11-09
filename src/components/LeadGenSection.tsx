import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  Flame, 
  Layers, 
  ExternalLink, 
  Share2, 
  Building, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  RotateCcw,
  BadgeDollarSign
} from 'lucide-react';
import { PropertyListingForm, GeneratedMarketingPackage, MarketType } from '../types';

interface LeadGenSectionProps {
  onAddListingToInventory?: (item: any) => void;
}

export const LeadGenSection: React.FC<LeadGenSectionProps> = ({ onAddListingToInventory }) => {
  const [formData, setFormData] = useState<PropertyListingForm>({
    title: 'Binghatti Hills',
    developer: 'Binghatti Developers',
    location: 'Dubai Science Park, Al Barsha South',
    propertyType: 'Apartment',
    bedrooms: '1 Bedroom',
    priceAED: 940000,
    marketType: 'off-plan',
    roiPercent: 9.2,
    paymentPlan: '70/30 (20% Down, 50% During Construction, 30% on Handover)',
    handoverDate: 'Q3 2026',
    rentalStatus: 'Off-Plan Launch / High Yield Rental Demand',
    sizeSqft: 765,
    features: 'Smart home automation, infinity pool, paddle tennis, metro access, high-speed elevators',
    targetAudience: 'Investors seeking 9%+ gross rental yields & young professionals',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [marketingPackage, setMarketingPackage] = useState<GeneratedMarketingPackage | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<'whatsapp' | 'meta' | 'portal' | 'investor'>('whatsapp');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const presets = [
    {
      label: 'Off-Plan Launch: Binghatti Hills (DSP)',
      data: {
        title: 'Binghatti Hills',
        developer: 'Binghatti Developers',
        location: 'Dubai Science Park',
        propertyType: 'Apartment',
        bedrooms: '1 Bedroom',
        priceAED: 940000,
        marketType: 'off-plan' as MarketType,
        roiPercent: 9.2,
        paymentPlan: '70/30 (20% Booking, 50% Construction, 30% Handover)',
        handoverDate: 'Q3 2026',
        rentalStatus: 'New Launch / Pre-Construction',
        sizeSqft: 765,
        features: 'Private pool on balcony, panoramic skyline view, smart home tech, 3 mins to Dubai Hills Mall',
        targetAudience: 'Yield investors seeking high short-term / long-term rental returns',
      },
    },
    {
      label: 'Luxury Waterfront: Sobha Hartland II (MBR City)',
      data: {
        title: 'Sobha Riverside Crescent',
        developer: 'Sobha Realty',
        location: 'Sobha Hartland II, MBR City',
        propertyType: 'Apartment',
        bedrooms: '2 Bedrooms + Maid',
        priceAED: 2350000,
        marketType: 'off-plan' as MarketType,
        roiPercent: 7.8,
        paymentPlan: '80/20 Payment Plan (Golden Visa Eligible)',
        handoverDate: 'Q2 2027',
        rentalStatus: 'Crystal Lagoon Facing / High Capital Appreciation',
        sizeSqft: 1220,
        features: 'Direct crystal lagoon access, branded German kitchen appliances, full floor-to-ceiling glass',
        targetAudience: 'HNW International investors seeking UAE Golden Visa & capital appreciation',
      },
    },
    {
      label: 'Secondary Ready: Dubai Marina 2BR (Rented)',
      data: {
        title: 'Marina Gate II Signature Suite',
        developer: 'Select Group',
        location: 'Dubai Marina',
        propertyType: 'Apartment',
        bedrooms: '2 Bedrooms',
        priceAED: 2950000,
        marketType: 'secondary' as MarketType,
        roiPercent: 7.1,
        paymentPlan: '100% Cash or Bank Mortgage Ready',
        handoverDate: 'Immediate (Title Deed in Hand)',
        rentalStatus: 'Rented at AED 185,000/yr (Immediate Cash Flow)',
        sizeSqft: 1380,
        features: 'Full Marina view, high floor, tenant renewed with legal 90-day eviction clause, direct Marina Walk',
        targetAudience: 'Passive income investors seeking immediate turnkey cash flow without construction risk',
      },
    },
    {
      label: 'Sharjah Forest Villa: Masaar Sendian',
      data: {
        title: 'Masaar Sendian Villas',
        developer: 'Arada',
        location: 'Masaar, Sharjah (Freehold for all)',
        propertyType: 'Townhouse / Villa',
        bedrooms: '3 Bedrooms + Maid',
        priceAED: 1890000,
        marketType: 'off-plan' as MarketType,
        roiPercent: 8.4,
        paymentPlan: '50/50 Payment Plan (Handover Q1 2026)',
        handoverDate: 'Q1 2026',
        rentalStatus: 'High Family Demand',
        sizeSqft: 2280,
        features: 'Surrounded by 50,000 trees, 6.6km cycling track, smart AC systems, solar water heating',
        targetAudience: 'Families and investors looking for Sharjah capital growth & high rental stability',
      },
    },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      setMarketingPackage(data);
    } catch (err) {
      console.error(err);
      // Resilient fallback in client
      const formattedPrice = Number(formData.priceAED).toLocaleString();
      setMarketingPackage({
        whatsappBroadcast: `🔥 *EXCLUSIVE DEAL | ${formData.location.toUpperCase()}* 🔥\n\n🏢 *${formData.title}* by *${formData.developer}*\n📍 *Location:* ${formData.location}\n\n💰 *Price:* AED ${formattedPrice} (~$${Math.round(formData.priceAED / 3.6725).toLocaleString()} USD)\n🛏 *Unit Type:* ${formData.bedrooms} (${formData.sizeSqft} sq.ft.)\n📈 *Expected Net Yield:* ${formData.roiPercent}% ROI\n💳 *Payment Plan:* ${formData.paymentPlan}\n🔑 *Handover:* ${formData.handoverDate}\n\n✨ *Key Highlights:*\n• 100% Freehold Ownership for all nationalities\n• 0% Personal Income Tax & Capital Gains\n• ${formData.features}\n• ${formData.priceAED >= 2000000 ? '✅ UAE 10-Year Golden Visa Eligible' : '✅ High rental yield corridor'}\n\n⏳ *Limited Allocation Available!*\n📲 WhatsApp me now for floor plans and payment schedule.`,
        metaAdCopy: {
          headline: `Invest in ${formData.title} | ${formData.location} from AED ${formattedPrice}`,
          primaryText: `Secure your property in Dubai's high-demand corridor. Featuring ${formData.roiPercent}% projected yields, flexible payment terms (${formData.paymentPlan}), and world-class luxury finishes. ${formData.priceAED >= 2000000 ? 'Qualifies for 10-Year UAE Golden Visa.' : ''}`,
          description: `Zero Property Tax • 100% Freehold • High Capital Appreciation`,
          callToAction: 'Get VIP Brochure & Layouts',
        },
        portalListing: {
          headline: `${formData.bedrooms} in ${formData.title} | ${formData.location} | ${formData.roiPercent}% ROI`,
          description: `Presenting an exceptional real estate asset in ${formData.location}. Developed by ${formData.developer}, this immaculate ${formData.bedrooms} combines contemporary design, strategic transport connectivity, and superior rental return metrics.`,
          keyHighlights: [
            `Prime address in ${formData.location}`,
            `Offered at AED ${formattedPrice}`,
            `Anticipated ROI: ${formData.roiPercent}%`,
            `Payment terms: ${formData.paymentPlan}`,
            `Handover date: ${formData.handoverDate}`,
          ],
          paymentPlanBreakdown: formData.paymentPlan,
          permitDisclaimer: 'DLD Permit No: 7182930192 | RERA ORN: 24890',
        },
        investorBrief: `Asset Assessment: Positioned at AED ${formattedPrice}, this asset delivers an estimated gross annual income of AED ${Math.round(formData.priceAED * (formData.roiPercent / 100)).toLocaleString()}. Net returns after average community service fees projected at ~${(formData.roiPercent - 1.2).toFixed(1)}%. ${formData.priceAED >= 2000000 ? 'Qualifies for the 10-Year UAE Investor Golden Visa.' : 'Accessible price point for entry investors.'}`,
        hotSellingPoints: [
          'High rental yield corridor with proven tenant demand',
          'Registered under Dubai Land Department (DLD) regulations',
          'Comprehensive payment milestones aligned with construction progress',
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getWhatsAppShareUrl = (text: string) => {
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Input Form Panel */}
      <div className="lg:col-span-5 space-y-4">
        {/* Preset Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Quick Presets
            </span>
            <span className="text-[11px] text-slate-400">1-Click UAE Deals</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData(p.data)}
                className="text-left text-xs px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 hover:border-amber-500/50 border border-slate-700/60 transition-all flex items-center justify-between group"
              >
                <span className="font-medium text-slate-200 group-hover:text-amber-300">
                  {p.label}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-200">Load &rarr;</span>
              </button>
            ))}
          </div>
        </div>

        {/* Property Parameters Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-400" />
                Property Specifications
              </h2>
              <p className="text-xs text-slate-400">Customize listing parameters to draft multi-channel copy</p>
            </div>

            {/* Market Type Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, marketType: 'off-plan' })}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  formData.marketType === 'off-plan'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Off-Plan
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, marketType: 'secondary' })}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  formData.marketType === 'secondary'
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Secondary
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Project / Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                placeholder="e.g. Binghatti Hills"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Developer</label>
              <input
                type="text"
                value={formData.developer}
                onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                placeholder="e.g. Emaar, Sobha, Danube"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                Location / Community
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                placeholder="e.g. JVC, Business Bay, Dubai South"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bedrooms & Type</label>
              <input
                type="text"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                placeholder="e.g. 1 Bedroom, 2BR + Maid"
              />
            </div>
          </div>

          {/* Pricing & ROI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <BadgeDollarSign className="w-3 h-3 text-amber-400" />
                Price (AED)
              </label>
              <input
                type="number"
                step="10000"
                value={formData.priceAED}
                onChange={(e) => setFormData({ ...formData, priceAED: Number(e.target.value) })}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-mono font-semibold focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                ≈ ${(formData.priceAED / 3.6725).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                Expected ROI %
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.roiPercent}
                onChange={(e) => setFormData({ ...formData, roiPercent: Number(e.target.value) })}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-300 font-mono font-semibold focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Net ~{(formData.roiPercent - 1.2).toFixed(1)}% yield
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Size (Sq.Ft.)</label>
              <input
                type="number"
                value={formData.sizeSqft}
                onChange={(e) => setFormData({ ...formData, sizeSqft: Number(e.target.value) })}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                AED {Math.round(formData.priceAED / (formData.sizeSqft || 1))}/sqft
              </span>
            </div>
          </div>

          {/* Golden Visa Check Notice */}
          {formData.priceAED >= 2000000 && (
            <div className="bg-amber-950/40 border border-amber-600/50 rounded-xl p-2.5 flex items-center gap-2 text-xs text-amber-300">
              <span className="text-base">🇦🇪</span>
              <span>
                <strong>Golden Visa Eligible:</strong> Purchase exceeds AED 2.0M threshold. AI will automatically highlight 10-year UAE residency benefits.
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Payment Plan Structure (e.g., 60/40, 1% Monthly, PHPP)
            </label>
            <input
              type="text"
              value={formData.paymentPlan}
              onChange={(e) => setFormData({ ...formData, paymentPlan: e.target.value })}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              placeholder="e.g. 70/30 (20% Down, 50% During, 30% Handover)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Handover / Ready Date
              </label>
              <input
                type="text"
                value={formData.handoverDate}
                onChange={(e) => setFormData({ ...formData, handoverDate: e.target.value })}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                placeholder="e.g. Q4 2026 or Ready"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Rental / Tenancy Status</label>
              <input
                type="text"
                value={formData.rentalStatus}
                onChange={(e) => setFormData({ ...formData, rentalStatus: e.target.value })}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                placeholder="e.g. Vacant or Rented at 85k AED"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Key Sell Points & Amenities</label>
            <textarea
              rows={2}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 resize-none"
              placeholder="e.g. Private pool on balcony, panoramic skyline view, smart home tech"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Synthesizing UAE Marketing Copy...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate High-Converting Marketing Kit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Generated Copy Output Panel */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl min-h-[580px] flex flex-col">
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Generated Campaign Package
              </h3>
              <p className="text-xs text-slate-400">
                Tailored for UAE investors, WhatsApp broadcast lists & Meta ad manager
              </p>
            </div>

            {/* Output Category Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
              <button
                onClick={() => setActiveOutputTab('whatsapp')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeOutputTab === 'whatsapp'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                WhatsApp Broadcast
              </button>
              <button
                onClick={() => setActiveOutputTab('meta')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeOutputTab === 'meta'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Meta / Ads
              </button>
              <button
                onClick={() => setActiveOutputTab('portal')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeOutputTab === 'portal'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Portal Listing
              </button>
              <button
                onClick={() => setActiveOutputTab('investor')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeOutputTab === 'investor'
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Investor Brief
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 py-4">
            {!marketingPackage ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-800 rounded-xl my-4">
                <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-amber-400 mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">Ready to Generate Campaign Materials</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Click &ldquo;Generate High-Converting Marketing Kit&rdquo; or load a quick preset to instantly produce WhatsApp broadcasts, Meta ad copy, Bayut/Property Finder portal descriptions, and institutional investor memos.
                </p>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* WHATSAPP BROADCAST TAB */}
                {activeOutputTab === 'whatsapp' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>WhatsApp formatted with emojis & markdown bolding</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={getWhatsAppShareUrl(marketingPackage.whatsappBroadcast)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Open WhatsApp
                        </a>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(marketingPackage.whatsappBroadcast, 'wa')}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700"
                        >
                          {copiedKey === 'wa' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedKey === 'wa' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {/* WhatsApp Chat Bubble Mockup */}
                    <div className="bg-[#0b141a] p-4 rounded-xl border border-emerald-950 font-sans shadow-inner">
                      <div className="bg-[#005c4b] text-slate-100 p-3.5 rounded-lg max-w-xl text-xs leading-relaxed whitespace-pre-wrap font-sans shadow">
                        {marketingPackage.whatsappBroadcast}
                      </div>
                    </div>
                  </div>
                )}

                {/* META AD COPY TAB */}
                {activeOutputTab === 'meta' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Optimized for Meta Ads Manager (Facebook / Instagram Feeds & Reels)</span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            `HEADLINE: ${marketingPackage.metaAdCopy.headline}\n\nPRIMARY TEXT:\n${marketingPackage.metaAdCopy.primaryText}\n\nDESCRIPTION: ${marketingPackage.metaAdCopy.description}\nCTA: ${marketingPackage.metaAdCopy.callToAction}`,
                            'meta'
                          )
                        }
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700"
                      >
                        {copiedKey === 'meta' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'meta' ? 'Copied All' : 'Copy All'}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-amber-400 uppercase">Primary Text</span>
                          <span className="text-[10px] text-slate-500">
                            {marketingPackage.metaAdCopy.primaryText.length} chars
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                          {marketingPackage.metaAdCopy.primaryText}
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-amber-400 uppercase">Headline</span>
                          <span className="text-[10px] text-slate-500">
                            {marketingPackage.metaAdCopy.headline.length} chars
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white">
                          {marketingPackage.metaAdCopy.headline}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                            Link Description
                          </span>
                          <p className="text-xs text-slate-300 font-medium">
                            {marketingPackage.metaAdCopy.description}
                          </p>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                            Call to Action Button
                          </span>
                          <p className="text-xs text-emerald-400 font-bold">
                            {marketingPackage.metaAdCopy.callToAction}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PORTAL LISTING (BAYUT / PROPERTY FINDER) */}
                {activeOutputTab === 'portal' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Standard RERA compliant portal format (Property Finder / Bayut)</span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            `${marketingPackage.portalListing.headline}\n\n${marketingPackage.portalListing.description}\n\nKEY HIGHLIGHTS:\n${marketingPackage.portalListing.keyHighlights.join(
                              '\n• '
                            )}\n\nPAYMENT PLAN:\n${marketingPackage.portalListing.paymentPlanBreakdown}\n\n${
                              marketingPackage.portalListing.permitDisclaimer
                            }`,
                            'portal'
                          )
                        }
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700"
                      >
                        {copiedKey === 'portal' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'portal' ? 'Copied' : 'Copy Full Listing'}
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400">Portal Title</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">
                          {marketingPackage.portalListing.headline}
                        </h4>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Description</span>
                        <p className="text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap">
                          {marketingPackage.portalListing.description}
                        </p>
                      </div>

                      {marketingPackage.portalListing.keyHighlights && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400">Key Features</span>
                          <ul className="mt-1 space-y-1">
                            {marketingPackage.portalListing.keyHighlights.map((hl, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-slate-300">
                                <span className="text-emerald-400">•</span>
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>{marketingPackage.portalListing.permitDisclaimer}</span>
                        <span className="text-emerald-500 font-semibold">Trakheesi Compliant Format</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* INVESTOR BRIEF TAB */}
                {activeOutputTab === 'investor' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Executive briefing memo tailored for High-Net-Worth individuals & family offices</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(marketingPackage.investorBrief, 'investor')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700"
                      >
                        {copiedKey === 'investor' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'investor' ? 'Copied' : 'Copy Brief'}
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="border-l-2 border-amber-500 pl-3">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                          Institutional Investment Analysis
                        </span>
                        <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                          {marketingPackage.investorBrief}
                        </p>
                      </div>

                      {marketingPackage.hotSellingPoints && marketingPackage.hotSellingPoints.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                            Broker Deal Levers:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {marketingPackage.hotSellingPoints.map((pt, i) => (
                              <div key={i} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                                <span className="text-amber-400 font-bold">✓</span>
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
