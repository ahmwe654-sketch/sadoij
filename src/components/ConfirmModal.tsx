import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { ModalState } from '../types';

interface ConfirmModalProps {
  modalState: ModalState;
  onClose: () => void;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  modalState,
  onClose,
  isLoading = false,
}) => {
  if (!modalState.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#0d0f12]/95 border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all transform scale-100 z-10">
        {/* Glow ambient */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 ${modalState.isDanger ? 'bg-red-500/20' : 'bg-emerald-500/20'} rounded-full blur-2xl pointer-events-none`} />

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${modalState.isDanger ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight">{modalState.title}</h3>
              <button 
                onClick={onClose}
                disabled={isLoading}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              {modalState.description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all disabled:opacity-50 cursor-pointer"
          >
            {modalState.cancelText || 'Cancel'}
          </button>
          
          <button
            type="button"
            onClick={async () => {
              await modalState.onConfirm();
            }}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              modalState.isDanger
                ? 'bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                : 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{modalState.confirmText || 'Confirm Action'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
