import React, { useState } from 'react';
import { Smartphone, Download, Check, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallModal } from './InstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'compact' | 'badge';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '',
  variant = 'header'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running in standalone PWA mode
  if (isInstalled) {
    if (variant === 'badge') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Installed as App</span>
        </span>
      );
    }
    return null;
  }

  const handleClick = async () => {
    // If native prompt is available (Android / Chromium)
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer ${
          isInstallable
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-emerald-500/20 font-bold'
            : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40'
        } ${className}`}
        title="Add to Phone / Install as Mobile App"
      >
        <Smartphone className="w-3.5 h-3.5 text-current animate-pulse" />
        <span>{isInstallable ? 'Install App' : 'Add to Phone'}</span>
        <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-slate-950/40 text-current">
          {isIOS ? 'iOS' : 'PWA'}
        </span>
      </button>

      <InstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
