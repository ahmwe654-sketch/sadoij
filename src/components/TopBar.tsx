import React, { useState } from 'react';
import {
  Menu,
  Copy,
  Check,
  Bell,
  Activity,
  Users,
  Wifi,
  Sparkles,
  ChevronDown,
  Code2
} from 'lucide-react';
import { ServerStatus, ToastMessage, UserRole } from '../types';
import { sound } from '../utils/sound';

interface TopBarProps {
  serverStatus: ServerStatus;
  userRole: UserRole;
  onOpenMobileSidebar: () => void;
  recentNotifications: ToastMessage[];
  onClearNotifications: () => void;
  onCopyIp: () => void;
  isCopied: boolean;
  onOpenApiBridge?: () => void;
  isAudioMuted?: boolean;
  onToggleAudio?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  serverStatus,
  userRole,
  onOpenMobileSidebar,
  recentNotifications,
  onClearNotifications,
  onCopyIp,
  isCopied,
  onOpenApiBridge,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 border-b border-white/[0.04] px-4 sm:px-8 flex items-center justify-between bg-[#050608]/90 backdrop-blur-2xl sticky top-0 z-30">
      {/* Left items */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => {
            sound.playClick();
            onOpenMobileSidebar();
          }}
          className="lg:hidden p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-white cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${serverStatus.online ? 'bg-emerald-400' : 'bg-red-500'}`} />
          <span className="text-xs font-mono text-slate-400">
            {serverStatus.online ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* IP Pill with Copy */}
        <button 
          type="button"
          onClick={() => {
            sound.playClick();
            onCopyIp();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] text-slate-300 transition-all cursor-pointer group"
          title="Click to copy Server IP"
        >
          <span className="text-xs font-mono text-slate-300">{serverStatus.ip}</span>
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          )}
        </button>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-3">
        {/* Quick stats pills */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>{serverStatus.playersOnline}/{serverStatus.maxPlayers} players</span>
          <span>•</span>
          <span>{serverStatus.tps.toFixed(1)} TPS</span>
          <span>•</span>
          <span>{serverStatus.ping}ms</span>
        </div>

        {/* API Bridge button */}
        {onOpenApiBridge && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenApiBridge();
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] text-slate-300 text-xs font-mono transition-all cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-violet-400" />
            <span>API</span>
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowNotifications(!showNotifications);
            }}
            className="relative p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {recentNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#090b0e] border border-white/10 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">System Events</h4>
                </div>
                {recentNotifications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onClearNotifications();
                    }}
                    className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                {recentNotifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No recent notifications
                  </div>
                ) : (
                  recentNotifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs hover:bg-white/[0.04] transition-colors"
                    >
                      <p className="font-semibold text-slate-200">{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
