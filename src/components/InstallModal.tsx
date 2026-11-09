import React, { useState } from 'react';
import { 
  Smartphone, 
  Share2, 
  PlusSquare, 
  Check, 
  Copy, 
  X, 
  Download, 
  Apple, 
  QrCode, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, install, isIOS, isInstalled } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'qr'>(isIOS ? 'ios' : 'android');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-nirhwqjx3nvet5d7qrnk3d-579441318571.europe-west3.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-amber-500/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-md shadow-amber-500/20 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Add EstatePulse UAE to Phone
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Mobile PWA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Install as a standalone native app on iPhone, iPad, or Android
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 px-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'ios'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iPhone / iOS (Safari)</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 px-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'android'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android (Chrome)</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 px-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'qr'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR / Share Link</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-300 text-xs">
          {/* iOS Safari Guide */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  Safari allows any web app to be installed directly without the App Store!
                </span>
              </div>

              <div className="space-y-3 font-normal">
                {/* Step 1 */}
                <div className="flex items-start gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-850">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-100">Open in Safari Browser</p>
                    <p className="text-slate-400">
                      Ensure you are viewing this page inside Apple <strong>Safari</strong> on your iPhone or iPad (not inside an in-app browser like Instagram or LinkedIn).
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-850">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    2
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-100">Tap the Share Button</p>
                      <span className="p-1 rounded bg-slate-800 text-amber-400 inline-flex items-center">
                        <Share2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <p className="text-slate-400">
                      Tap the <strong>Share</strong> icon (the square with an arrow pointing upward) located at the bottom center of the Safari screen.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-850">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    3
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-100">Select "Add to Home Screen"</p>
                      <span className="p-1 rounded bg-slate-800 text-emerald-400 inline-flex items-center">
                        <PlusSquare className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <p className="text-slate-400">
                      Scroll down the options list and tap <strong>Add to Home Screen</strong>.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-850">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    4
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-100">Tap "Add" in Top-Right</p>
                    <p className="text-slate-400">
                      Confirm the title <strong>"EstatePulse"</strong> and tap <strong>Add</strong>. The luxury gold & green icon will immediately appear on your iPhone home screen!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Android Guide */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              {isInstallable ? (
                <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-center space-y-3">
                  <p className="text-emerald-300 font-medium">
                    Your browser supports 1-click instant installation!
                  </p>
                  <button
                    onClick={handleNativeInstall}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-emerald-500 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install EstatePulse App on Android</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    Install in Google Chrome in under 10 seconds with automatic updates!
                  </span>
                </div>
              )}

              <div className="space-y-3 font-normal">
                {/* Step 1 */}
                <div className="flex items-start gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-850">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-100">Open in Google Chrome</p>
                    <p className="text-slate-400">
                      Open this URL in Google Chrome on your Android smartphone.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-850">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-100">Tap Three Dots (⋮) Menu</p>
                    <p className="text-slate-400">
                      Tap the three vertical dots located in the top-right corner of Chrome.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-850">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    3
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-100">Tap "Install App" or "Add to Home screen"</p>
                    <p className="text-slate-400">
                      Chrome will prompt you to install <strong>EstatePulse UAE</strong>. Confirm the installation.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-850">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    4
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-100">Launch Standalone</p>
                    <p className="text-slate-400">
                      The app launches without browser bars, runs offline, and saves your secondary properties directly to device storage!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QR Code / Share Link */}
          {activeTab === 'qr' && (
            <div className="space-y-4 text-center">
              <p className="text-slate-300">
                Scan this QR code with your phone's camera to open EstatePulse directly on your device:
              </p>

              {/* QR Code Card */}
              <div className="inline-block p-4 bg-white rounded-2xl shadow-xl border border-amber-500/30">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`}
                  alt="EstatePulse App QR Code"
                  className="w-44 h-44 object-contain mx-auto"
                />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <p className="text-[11px] text-slate-400">
                  Or copy and send this URL to your phone via WhatsApp / Telegram:
                </p>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="bg-transparent flex-1 text-slate-300 text-xs outline-none px-2 truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile App Advantages */}
          <div className="border-t border-slate-800 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-2 p-2 bg-slate-950/50 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Full-screen native experience</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-950/50 rounded-lg">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Offline property catalog</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-950/50 rounded-lg">
              <Smartphone className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>Fast 1-tap launch from home screen</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Zero App Store downloads required</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
