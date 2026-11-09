import React, { useState } from 'react';
import { 
  Layers, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  Calendar, 
  HelpCircle, 
  Building2, 
  PieChart,
  ArrowRight,
  Flame
} from 'lucide-react';

export const RoiCalculatorSection: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(1400000);
  const [sizeSqft, setSizeSqft] = useState<number>(850);
  const [serviceChargePerSqft, setServiceChargePerSqft] = useState<number>(16);
  const [expectedAnnualRent, setExpectedAnnualRent] = useState<number>(115000);
  const [shortTermNightlyRate, setShortTermNightlyRate] = useState<number>(550);
  const [shortTermOccupancy, setShortTermOccupancy] = useState<number>(75);
  const [shortTermManagementFeePercent, setShortTermManagementFeePercent] = useState<number>(18);
  const [paymentPlanType, setPaymentPlanType] = useState<'60_40' | '70_30' | '1_percent' | 'ready'>('70_30');

  // Calculations
  const dldFee = purchasePrice * 0.04;
  const dldAdmin = 580;
  const trusteeFee = 4200; // 4000 + 5% VAT
  const agencyCommission = purchasePrice * 0.021; // 2% + 5% VAT
  const miscFees = 2000; // NOC / valuation / admin
  const totalClosingCosts = dldFee + dldAdmin + trusteeFee + agencyCommission + miscFees;
  const totalInvestmentRequired = purchasePrice + totalClosingCosts;

  // Long-Term Yield
  const annualServiceCharges = sizeSqft * serviceChargePerSqft;
  const longTermGrossYield = (expectedAnnualRent / purchasePrice) * 100;
  const longTermNetIncome = expectedAnnualRent - annualServiceCharges;
  const longTermNetYield = (longTermNetIncome / purchasePrice) * 100;

  // Short-Term (Holiday Home / Airbnb) Yield
  const daysOccupied = Math.round(365 * (shortTermOccupancy / 100));
  const shortTermGrossRevenue = daysOccupied * shortTermNightlyRate;
  const managementExpense = shortTermGrossRevenue * (shortTermManagementFeePercent / 100);
  const tourismDirhamTax = daysOccupied * 15; // standard AED 15/night DTCM fee for Deluxe
  const utilitiesAndWifi = 12000; // estimated DEWA + Chiller + Internet / yr
  const shortTermNetIncome = shortTermGrossRevenue - managementExpense - annualServiceCharges - tourismDirhamTax - utilitiesAndWifi;
  const shortTermNetYield = (shortTermNetIncome / purchasePrice) * 100;

  // Golden Visa Check
  const isGoldenVisaEligible = purchasePrice >= 2000000;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Dubai Real Estate ROI & Closing Cost Engine
            </h2>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-medium">
              RERA Compliant
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Calculate true net returns accounting for Dubai Land Department (DLD 4%) transfer fees, trustee charges, community service charges, and Long-Term vs Short-Term Holiday Home comparisons.
          </p>
        </div>

        {isGoldenVisaEligible ? (
          <div className="bg-amber-950/60 border border-amber-600/60 rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-amber-300">
            <span className="text-lg">🇦🇪</span>
            <div>
              <strong className="block font-bold">Golden Visa Eligible</strong>
              <span className="text-[11px] text-amber-400">Purchase ≥ AED 2,000,000</span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400">
            <span>Golden Visa Threshold:</span>
            <strong className="block text-slate-200 font-mono">
              AED {(2000000 - purchasePrice).toLocaleString()} more needed
            </strong>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 pb-2 border-b border-slate-800">
            <DollarSign className="w-4 h-4 text-amber-400" />
            Asset & Cost Inputs
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Purchase Price (AED)
            </label>
            <input
              type="number"
              step="50000"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full text-sm bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              ≈ ${(purchasePrice / 3.6725).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Property Size (Sq.Ft.)
              </label>
              <input
                type="number"
                value={sizeSqft}
                onChange={(e) => setSizeSqft(Number(e.target.value))}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Service Charge (AED/sqft)
              </label>
              <input
                type="number"
                step="1"
                value={serviceChargePerSqft}
                onChange={(e) => setServiceChargePerSqft(Number(e.target.value))}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Total: AED {annualServiceCharges.toLocaleString()}/yr
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-850">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
              Annual Rental Projections (Long-Term)
            </span>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Expected Annual Rent (AED)
              </label>
              <input
                type="number"
                step="5000"
                value={expectedAnnualRent}
                onChange={(e) => setExpectedAnnualRent(Number(e.target.value))}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-emerald-300 font-mono font-bold"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-850">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-2">
              Holiday Home / Short-Term Variables (Airbnb)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Avg Daily Rate (AED)
                </label>
                <input
                  type="number"
                  step="50"
                  value={shortTermNightlyRate}
                  onChange={(e) => setShortTermNightlyRate(Number(e.target.value))}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Occupancy Rate (%)
                </label>
                <input
                  type="number"
                  step="5"
                  value={shortTermOccupancy}
                  onChange={(e) => setShortTermOccupancy(Number(e.target.value))}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Preset Buttons for Dubai Communities */}
          <div className="pt-2 border-t border-slate-850">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
              Community Benchmarks (Click to Apply)
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setPurchasePrice(920000);
                  setSizeSqft(750);
                  setServiceChargePerSqft(15);
                  setExpectedAnnualRent(78000);
                  setShortTermNightlyRate(450);
                }}
                className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-slate-300 text-center"
              >
                JVC 1BR
              </button>
              <button
                type="button"
                onClick={() => {
                  setPurchasePrice(2100000);
                  setSizeSqft(1100);
                  setServiceChargePerSqft(20);
                  setExpectedAnnualRent(155000);
                  setShortTermNightlyRate(750);
                }}
                className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-slate-300 text-center"
              >
                Business Bay 2BR
              </button>
              <button
                type="button"
                onClick={() => {
                  setPurchasePrice(2950000);
                  setSizeSqft(1350);
                  setServiceChargePerSqft(18);
                  setExpectedAnnualRent(190000);
                  setShortTermNightlyRate(950);
                }}
                className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-slate-300 text-center"
              >
                Marina 2BR
              </button>
            </div>
          </div>
        </div>

        {/* Right Financial Results & Comparison */}
        <div className="lg:col-span-7 space-y-4">
          {/* Yield Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Long-Term Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Long-Term Tenancy (Ejari)
                </span>
                <span className="text-[10px] text-slate-400">Stable 1-Year Cheques</span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Yield</span>
                  <div className="text-2xl font-mono font-bold text-emerald-400">
                    {longTermNetYield.toFixed(2)}%
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Yield</span>
                  <div className="text-sm font-mono text-slate-300 font-semibold">
                    {longTermGrossYield.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Gross Rent:</span>
                  <span className="font-mono font-semibold">AED {expectedAnnualRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Service Charges:</span>
                  <span className="font-mono text-rose-400">- AED {annualServiceCharges.toLocaleString()}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-800 flex justify-between font-bold text-white">
                  <span>Net Annual Cashflow:</span>
                  <span className="font-mono text-emerald-400">AED {longTermNetIncome.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Short-Term Holiday Home Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Holiday Home (Airbnb / DTCM)
                </span>
                <span className="text-[10px] text-slate-400">{shortTermOccupancy}% Occupancy</span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Yield</span>
                  <div className="text-2xl font-mono font-bold text-indigo-400">
                    {shortTermNetYield.toFixed(2)}%
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Revenue</span>
                  <div className="text-sm font-mono text-slate-300 font-semibold">
                    AED {shortTermGrossRevenue.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Gross ADR Booking:</span>
                  <span className="font-mono font-semibold">AED {shortTermGrossRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Operator Mgmt ({shortTermManagementFeePercent}%):</span>
                  <span className="font-mono text-rose-400">- AED {Math.round(managementExpense).toLocaleString()}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-800 flex justify-between font-bold text-white">
                  <span>Net Annual Cashflow:</span>
                  <span className="font-mono text-indigo-400">AED {Math.round(shortTermNetIncome).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dubai Secondary / Purchase Closing Costs Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Dubai Government & Brokerage Closing Costs Breakdown
              </h4>
              <span className="text-xs font-mono text-slate-400">
                ~{((totalClosingCosts / purchasePrice) * 100).toFixed(2)}% of Asset Price
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>DLD Transfer Fee (4%):</span>
                  <span className="font-mono font-bold text-amber-300">AED {dldFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>DLD Admin / Knowledge Fee:</span>
                  <span className="font-mono">AED {dldAdmin}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Registration Trustee Fee (with VAT):</span>
                  <span className="font-mono">AED {trusteeFee}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Agency Commission (2% + 5% VAT):</span>
                  <span className="font-mono font-bold text-emerald-400">
                    AED {Math.round(agencyCommission).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>NOC / Admin Developer Estimate:</span>
                  <span className="font-mono">AED {miscFees.toLocaleString()}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-800 flex justify-between font-bold text-amber-400">
                  <span>Total Acquisition Overhead:</span>
                  <span className="font-mono">AED {Math.round(totalClosingCosts).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="text-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Cash Required to Close Deal:</span>
                <span className="text-sm font-mono font-bold text-white">
                  AED {Math.round(totalInvestmentRequired).toLocaleString()}
                </span>
              </div>
              <span className="text-[11px] font-mono text-amber-300">
                ≈ ${(totalInvestmentRequired / 3.6725).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
