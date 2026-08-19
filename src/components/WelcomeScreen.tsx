import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, CheckCircle2, ChevronRight, Activity, Zap } from 'lucide-react';
import { sound } from '../utils/sound';

interface WelcomeScreenProps {
  serverName: string;
  isOnline: boolean;
  onFinish: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  serverName = 'Valkyrie MC',
  isOnline = true,
  onFinish,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Play subtle entrance chime
    sound.playSuccess();

    // Progress bar fill over 1.6s
    const startTime = Date.now();
    const duration = 1600;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          onFinish();
        }, 350);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onFinish]);

  const handleSkip = () => {
    sound.playClick();
    setIsFadingOut(true);
    setTimeout(() => {
      onFinish();
    }, 200);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#050608] text-white cursor-pointer select-none overflow-hidden transition-all duration-400 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Cinematic Ambient Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse duration-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/3 w-[450px] h-[450px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg px-6">
        {/* Animated Brand Emblem */}
        <div className="relative mb-6 group">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#0e131b] via-[#090b0e] to-black border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden">
            {/* Subtle internal ring */}
            <div className="absolute inset-0 border border-emerald-500/20 rounded-3xl" />
            <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
          </div>

          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-black/90 border border-white/10 text-[10px] font-mono text-emerald-400 flex items-center gap-1 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>1.20.4</span>
          </div>
        </div>

        {/* Brand Name & Headline */}
        <div className="space-y-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono text-slate-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <span>{isOnline ? 'SERVER ONLINE' : 'SERVER STANDBY'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Welcome to <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Valkyrie MC</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-normal tracking-wide">
            Your server. Your world. Your control.
          </p>
        </div>

        {/* Minimal Progress Line */}
        <div className="w-48 sm:w-56 mt-6 space-y-2">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-violet-500 rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Synchronizing daemon</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Skip Prompt */}
        <div className="mt-8 text-[11px] font-mono text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 cursor-pointer">
          <span>Click anywhere to enter</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
