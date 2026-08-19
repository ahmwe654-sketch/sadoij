import React from 'react';
import {
  LayoutDashboard,
  Users,
  Box,
  Terminal,
  MessageSquare,
  Navigation,
  Skull,
  CalendarClock,
  FolderTree,
  Settings,
  Shield,
  X,
  Zap,
  Volume2,
  VolumeX,
  Code2
} from 'lucide-react';
import { NavTab, UserRole } from '../types';
import { sound } from '../utils/sound';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isOnline: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onOpenApiBridge: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  userRole,
  onRoleChange,
  isOnline,
  isOpenMobile,
  onCloseMobile,
  isAudioMuted,
  onToggleAudio,
  onOpenApiBridge,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'mods-worlds', label: 'Plugins & Backups', icon: Box },
    { id: 'console', label: 'Console', icon: Terminal },
    { id: 'chat', label: 'In-Game Chat', icon: MessageSquare },
    { id: 'teleport', label: 'Teleport Hub', icon: Navigation },
    { id: 'deaths', label: 'Death Logs', icon: Skull },
    { id: 'scheduler', label: 'Schedules', icon: CalendarClock },
    { id: 'files', label: 'File Manager', icon: FolderTree },
    { id: 'settings', label: 'Server Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-60 border-r border-white/[0.05] bg-[#050608]/95 backdrop-blur-2xl flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isOpenMobile ? 'translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.9)]' : '-translate-x-full'}
      `}>
        {/* Brand Header: Clean & Minimal */}
        <div className="p-6 flex items-center justify-between border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-sm tracking-tight">Valkyrie MC</h1>
              <p className="text-[10px] text-slate-500 font-mono">Java 1.20.4</p>
            </div>
          </div>

          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-white/[0.06] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* API Bridge shortcut */}
        <div className="px-3 mb-2">
          <button
            type="button"
            onClick={onOpenApiBridge}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] text-slate-300 text-xs font-medium transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-violet-400" />
              <span>RCON & API</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Docs</span>
          </button>
        </div>

        {/* Role & Audio Controls Footer */}
        <div className="p-3.5 border-t border-white/[0.04] bg-black/40 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-400 text-xs shrink-0">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <select
                aria-label="Switch User Role"
                value={userRole}
                onChange={(e) => {
                  sound.playClick();
                  onRoleChange(e.target.value as UserRole);
                }}
                className="bg-transparent text-xs font-medium text-slate-300 outline-none cursor-pointer hover:text-white"
              >
                <option value="Owner" className="bg-[#050608] text-white">Owner</option>
                <option value="Admin" className="bg-[#050608] text-white">Admin</option>
                <option value="Moderator" className="bg-[#050608] text-white">Moderator</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleAudio}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isAudioMuted
                ? 'bg-white/[0.02] border-white/5 text-slate-600 hover:text-slate-400'
                : 'bg-white/[0.04] border-white/10 text-emerald-400'
            }`}
            title={isAudioMuted ? 'Unmute UI Sound' : 'Mute UI Sound'}
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </aside>
    </>
  );
};
