import React from 'react';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-emerald-500/30 bg-emerald-950/80 text-emerald-300';
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-400';
        let glowShadow = 'shadow-[0_10px_30px_rgba(16,185,129,0.2)]';

        if (toast.type === 'error') {
          borderClass = 'border-red-500/30 bg-red-950/80 text-red-300';
          Icon = AlertCircle;
          iconColor = 'text-red-400';
          glowShadow = 'shadow-[0_10px_30px_rgba(239,68,68,0.2)]';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/30 bg-amber-950/80 text-amber-300';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
          glowShadow = 'shadow-[0_10px_30px_rgba(245,158,11,0.2)]';
        } else if (toast.type === 'info') {
          borderClass = 'border-violet-500/30 bg-violet-950/80 text-violet-300';
          Icon = Info;
          iconColor = 'text-violet-400';
          glowShadow = 'shadow-[0_10px_30px_rgba(139,92,246,0.2)]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 transform translate-y-0 ${borderClass} ${glowShadow}`}
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white tracking-tight leading-tight">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
