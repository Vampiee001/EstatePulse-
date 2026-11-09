import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  RotateCcw, 
  HelpCircle, 
  ShieldCheck, 
  Building, 
  DollarSign, 
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const CopilotAssistantDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Marhaba! I am your **EstatePulse UAE Broker Copilot**.\n\nI can assist you with:\n• **DLD & RERA Regulations:** Title Deeds, Oqood registration, Escrow Law No. 8 of 2007, and NOC procedures\n• **UAE 10-Year Golden Visa:** Requirements, mortgage equity conditions & developer rules\n• **Rental Tenancy Laws:** Law 26 of 2007 / Law 33 of 2008 365-day notary eviction notices & RERA rental index\n• **Deal Positioning:** ROI yield breakdowns, objection handling & closing scripts for HNW investors\n\nHow can I help you close your next deal today?`,
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    'Golden Visa AED 2M requirements for off-plan?',
    'How does Escrow Law No. 8 protect investor deposits?',
    'What is the legal eviction notice rule in Dubai?',
    'JVC vs Business Bay: rental yields & capital growth comparison',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (!res.ok) throw new Error('Copilot response error');
      const data = await res.json();

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Apologies, could not process that real estate query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: `### 🇦🇪 UAE Broker Copilot Quick Intelligence\n\nRegarding **"${textToSend}"**:\n\n• **DLD / RERA Compliance:** Standard transfer fee is 4% paid to Dubai Land Department. Off-plan payments are safeguarded in authorized Escrow Accounts linked to RERA project tracking.\n• **Golden Visa Rule:** Properties must equal or exceed AED 2,000,000 in purchase value (whether ready or off-plan from approved master developers).\n• **Broker Strategy:** Position the 0% personal tax, high gross yields (7-9%), and transparent investor legal framework.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 font-bold rounded-2xl shadow-2xl shadow-amber-500/40 border border-amber-300 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-black uppercase tracking-wider text-slate-950">AI Broker Copilot</span>
            <span className="block text-[10px] text-slate-900 font-medium">Dubai & UAE Intelligence</span>
          </div>
        </button>
      )}

      {/* Slide-over / Modal Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
            isExpanded
              ? 'w-[95vw] md:w-[720px] h-[85vh]'
              : 'w-[95vw] sm:w-[420px] h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  EstatePulse AI Copilot
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h4>
                <p className="text-[11px] text-slate-400">Dubai & Sharjah Real Estate Knowledge Base</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm leading-relaxed whitespace-pre-wrap font-sans ${
                      isAssistant
                        ? 'bg-slate-900 border border-slate-800 text-slate-200'
                        : 'bg-amber-500 text-slate-950 font-medium'
                    }`}
                  >
                    {m.text}
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        isAssistant ? 'text-slate-500' : 'text-slate-800'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Consulting Dubai real estate legal & market database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-amber-300 rounded-full border border-slate-700/60 transition-all"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about DLD laws, Golden Visa, rental index, or closing tips..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
