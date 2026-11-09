import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  AlertTriangle, 
  Building, 
  Calendar, 
  FileText, 
  BadgeDollarSign, 
  CheckCircle2, 
  RotateCcw,
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';
import { MilestoneReminderData, MilestoneReminderOutput } from '../types';
import { SAMPLE_PAYMENT_MILESTONES } from '../data/sampleData';

export const MilestoneReminderSection: React.FC = () => {
  const [formData, setFormData] = useState<MilestoneReminderData>({
    projectName: 'Creek Waters Tower 1',
    developer: 'Emaar Properties',
    unitNumber: 'CW-1402',
    investorName: 'Dr. Arthur Pendelton',
    milestonePercent: 10,
    amountAED: 185000,
    dueDate: 'November 20, 2026',
    escrowBank: 'Emirates NBD',
    escrowAccountNumber: '0145-882910-001',
    escrowIban: 'AE29 0260 0001 4588 2910 001',
    constructionMilestone: '40% Structural Concrete Works Completed (RERA Inspection Verified)',
    brokerName: 'Alexander Sterling',
    brokerAgency: 'EstatePulse Real Estate Brokerage',
    channel: 'both',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<MilestoneReminderOutput | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeFormat, setActiveFormat] = useState<'email' | 'whatsapp' | 'escrow'>('email');

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/draft-milestone-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to draft milestone notice');
      const data = await res.json();
      setOutput(data);
    } catch (err) {
      console.error(err);
      // Resilient fallback in client
      const formattedAmount = Number(formData.amountAED).toLocaleString();
      setOutput({
        emailSubject: `Official Payment Milestone Notice: ${formData.projectName} | ${formData.unitNumber} | ${formData.milestonePercent}% Due`,
        formalEmailBody: `Dear ${formData.investorName},\n\nWe hope this email finds you well.\n\nOn behalf of ${formData.brokerAgency}, we are contacting you to provide an important update regarding your off-plan property investment in ${formData.projectName} (${formData.unitNumber}), developed by ${formData.developer}.\n\nIn accordance with your Sale and Purchase Agreement (SPA) payment schedule and recent construction milestones (${formData.constructionMilestone}), your upcoming payment instalment of ${formData.milestonePercent}% is now scheduled for remittance.\n\nPAYMENT DETAILS:\n• Project: ${formData.projectName}\n• Unit Number: ${formData.unitNumber}\n• Milestone: ${formData.milestonePercent}% Milestone\n• Amount Payable: AED ${formattedAmount}\n• Due Date: ${formData.dueDate}\n\nOFFICIAL PROJECT ESCROW ACCOUNT DETAILS:\nIn strict compliance with Dubai Law No. 8 of 2007 regarding Escrow Accounts for Real Estate Development in Dubai, all payments MUST be remitted directly to the authorized project escrow account:\n• Bank Name: ${formData.escrowBank}\n• Account Title: ${formData.developer} - ${formData.projectName} Escrow Account\n• Escrow Account Number: ${formData.escrowAccountNumber}\n• IBAN: ${formData.escrowIban}\n• Reference / Memo: ${formData.unitNumber} / ${formData.investorName}\n\nRECOMMENDED INVESTOR ACTION:\n1. Verify Escrow Account: You can independently confirm the project construction progress and authorized escrow bank via the official Dubai REST App (under Project Tracking).\n2. Deposit Verification: Transfer only into the authorized escrow account specified above.\n3. Confirmation: Forward your bank wire / transfer slip to our office so we can expedite your official developer receipt and Oqood ledger update.\n\nShould you require any assistance, please do not hesitate to contact me directly.\n\nSincerely,\n\n${formData.brokerName}\nSenior Investment Advisor\n${formData.brokerAgency}\nDubai, United Arab Emirates`,
        whatsappQuickNotice: `📌 *OFFICIAL PAYMENT MILESTONE NOTICE*\n\nDear *${formData.investorName}*,\n\nKindly note your upcoming payment milestone for *${formData.projectName}* (*${formData.unitNumber}*):\n\n💰 *Amount Due:* AED ${formattedAmount} (${formData.milestonePercent}%)\n📅 *Due Date:* ${formData.dueDate}\n🏗 *Milestone:* ${formData.constructionMilestone}\n\n🔒 *Project Escrow Bank Details (Law No. 8/2007):*\n• *Bank:* ${formData.escrowBank}\n• *IBAN:* \`${formData.escrowIban}\`\n• *Account:* ${formData.escrowAccountNumber}\n• *Ref:* ${formData.unitNumber}\n\n⚠️ *Security Notice:* Please deposit solely into the designated RERA project escrow account above. Once transferred, please share the wire confirmation for ledger clearance.\n\nBest regards,\n*${formData.brokerName}* | ${formData.brokerAgency}`,
        escrowVerificationChecklist: [
          'Verify project status & escrow account title in the Dubai REST app before sending funds.',
          `Ensure beneficiary name strictly shows: "${formData.developer} - ${formData.projectName} Escrow".`,
          `Include Unit Number (${formData.unitNumber}) in the wire transfer memo field.`,
          'Obtain developer confirmation receipt to ensure your Oqood pre-title deed statement is kept up to date.',
        ],
        dldComplianceAdvice:
          'Under Dubai Law No. 8 of 2007, off-plan developers are legally restricted from accessing buyer funds except for direct construction works approved by RERA-certified inspection engineers.',
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
      {/* Left Input Configuration */}
      <div className="lg:col-span-5 space-y-4">
        {/* Preset Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Off-Plan Landlord Milestone Scenarios
            </span>
            <span className="text-[11px] text-slate-400">Click to Load</span>
          </div>

          <div className="space-y-1.5">
            {SAMPLE_PAYMENT_MILESTONES.map((sm, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFormData({ ...formData, ...sm })}
                className="w-full text-left text-xs p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 hover:border-amber-500/50 border border-slate-700/60 transition-all flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-slate-200 block">
                    {sm.projectName} ({sm.unitNumber})
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {sm.milestonePercent}% Due (AED {sm.amountAED.toLocaleString()}) • {sm.developer}
                  </span>
                </div>
                <span className="text-[10px] text-amber-400 font-bold ml-2">Load</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Off-Plan Milestone Details
            </h2>
            <p className="text-xs text-slate-400">
              Generate Escrow Law No. 8 compliant payment notices for your investors
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Project Name</label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Developer</label>
              <input
                type="text"
                value={formData.developer}
                onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Unit Number</label>
              <input
                type="text"
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Investor Name</label>
              <input
                type="text"
                value={formData.investorName}
                onChange={(e) => setFormData({ ...formData, investorName: e.target.value })}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Milestone %</label>
              <input
                type="number"
                value={formData.milestonePercent}
                onChange={(e) => setFormData({ ...formData, milestonePercent: Number(e.target.value) })}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <BadgeDollarSign className="w-3 h-3 text-amber-400" />
                Amount Due (AED)
              </label>
              <input
                type="number"
                value={formData.amountAED}
                onChange={(e) => setFormData({ ...formData, amountAED: Number(e.target.value) })}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              Due Date
            </label>
            <input
              type="text"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Construction Status / Milestone Trigger
            </label>
            <input
              type="text"
              value={formData.constructionMilestone}
              onChange={(e) => setFormData({ ...formData, constructionMilestone: e.target.value })}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Official Escrow Bank Details */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Official RERA Project Escrow Account
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Escrow Bank</label>
                <input
                  type="text"
                  value={formData.escrowBank}
                  onChange={(e) => setFormData({ ...formData, escrowBank: e.target.value })}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Account Number</label>
                <input
                  type="text"
                  value={formData.escrowAccountNumber}
                  onChange={(e) => setFormData({ ...formData, escrowAccountNumber: e.target.value })}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Escrow IBAN</label>
              <input
                type="text"
                value={formData.escrowIban}
                onChange={(e) => setFormData({ ...formData, escrowIban: e.target.value })}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-amber-300 font-mono font-semibold"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Drafting Compliance Notice...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Draft Milestone Notice & Escrow Instructions
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Output Notices */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl min-h-[580px] flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Milestone Notice Drafts
              </h3>
              <p className="text-xs text-slate-400">
                Official corporate email & instant WhatsApp notice with Escrow Law safeguards
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
              <button
                onClick={() => setActiveFormat('email')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeFormat === 'email' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Investor Email
              </button>
              <button
                onClick={() => setActiveFormat('whatsapp')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeFormat === 'whatsapp'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                WhatsApp Notice
              </button>
              <button
                onClick={() => setActiveFormat('escrow')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeFormat === 'escrow'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Escrow Checklist
              </button>
            </div>
          </div>

          <div className="flex-1 py-4">
            {!output ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-800 rounded-xl my-4">
                <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-amber-400 mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">Payment Notice Generator</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Draft institutional payment notices for your off-plan clients with verified RERA escrow account instructions, Dubai REST audit steps, and Oqood balance tracking.
                </p>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Draft Notice Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* INVESTOR EMAIL FORMAT */}
                {activeFormat === 'email' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Formal investor communication format</span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(`SUBJECT: ${output.emailSubject}\n\n${output.formalEmailBody}`, 'email')
                        }
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700"
                      >
                        {copiedKey === 'email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'email' ? 'Copied' : 'Copy Full Email'}
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                      <div className="pb-2 border-b border-slate-850">
                        <span className="text-[10px] uppercase font-bold text-amber-400 block">Subject Line</span>
                        <div className="text-sm font-bold text-white mt-0.5">{output.emailSubject}</div>
                      </div>

                      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                        {output.formalEmailBody}
                      </div>
                    </div>
                  </div>
                )}

                {/* WHATSAPP NOTICE FORMAT */}
                {activeFormat === 'whatsapp' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Quick mobile broadcast format</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={getWhatsAppShareUrl(output.whatsappQuickNotice)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Send WhatsApp
                        </a>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(output.whatsappQuickNotice, 'wanotice')}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700"
                        >
                          {copiedKey === 'wanotice' ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          {copiedKey === 'wanotice' ? 'Copied' : 'Copy Message'}
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#0b141a] p-4 rounded-xl border border-emerald-950 font-sans shadow-inner">
                      <div className="bg-[#005c4b] text-slate-100 p-3.5 rounded-lg max-w-xl text-xs leading-relaxed whitespace-pre-wrap font-sans shadow">
                        {output.whatsappQuickNotice}
                      </div>
                    </div>
                  </div>
                )}

                {/* ESCROW CHECKLIST & DLD LAW SUMMARY */}
                {activeFormat === 'escrow' && (
                  <div className="space-y-4">
                    <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Dubai Escrow Law No. 8 of 2007 Protection Notice
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{output.dldComplianceAdvice}</p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                        Mandatory Investor Due Diligence Checklist:
                      </span>
                      <div className="space-y-2 text-xs">
                        {output.escrowVerificationChecklist.map((step, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2.5 text-slate-300"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
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
