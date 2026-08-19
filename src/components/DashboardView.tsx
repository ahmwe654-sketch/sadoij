import React, { useState } from 'react';
import {
  Server,
  Activity,
  Cpu,
  HardDrive,
  Users,
  Power,
  RotateCcw,
  Square,
  Shield,
  Clock,
  Sparkles,
  Zap,
  Radio,
  Send,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  Flame,
  ArrowUpRight,
  TrendingUp,
  Sliders,
  Terminal,
  Layers,
  FileCode2,
  CalendarClock
} from 'lucide-react';
import { ServerStatus, UserRole } from '../types';
import { sound } from '../utils/sound';

interface DashboardViewProps {
  serverStatus: ServerStatus;
  userRole: UserRole;
  onStartServer: () => void;
  onStopServer: () => void;
  onRestartServer: () => void;
  onSaveWorld: () => void;
  onClearLag: () => void;
  onToggleWhitelist: () => void;
  onQuickBroadcast: (message: string) => void;
  isLoadingAction: boolean;
  onNavigateTab?: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  serverStatus,
  userRole,
  onStartServer,
  onStopServer,
  onRestartServer,
  onSaveWorld,
  onClearLag,
  onToggleWhitelist,
  onQuickBroadcast,
  isLoadingAction,
  onNavigateTab,
}) => {
  const [broadcastInput, setBroadcastInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const formatUptime = (totalSeconds: number) => {
    const d = Math.floor(totalSeconds / (3600 * 24));
    const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastInput.trim()) return;
    sound.playSuccess();
    onQuickBroadcast(broadcastInput.trim());
    setBroadcastInput('');
  };

  const copyServerIP = () => {
    sound.playClick();
    navigator.clipboard.writeText(`${serverStatus.ip}:${serverStatus.port}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const ramPercentage = Math.round((serverStatus.ramUsedMB / serverStatus.ramTotalMB) * 100);
  const isOptimalTps = serverStatus.tps >= 19.5;

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* 1. Header Hero Area: Minimal, High Hierarchy */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.08]">
              <span className={`w-2 h-2 rounded-full ${serverStatus.online ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`} />
              <span className="text-xs font-mono font-bold tracking-wider text-slate-300">
                {serverStatus.online ? 'ONLINE' : 'STOPPED'}
              </span>
            </div>

            <span className="text-xs font-mono text-slate-500">•</span>

            <span className="text-xs font-mono text-slate-400">
              {serverStatus.software}
            </span>

            <span className="text-xs font-mono text-slate-500">•</span>

            <span className="text-xs font-mono text-slate-400">
              v{serverStatus.version}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {serverStatus.name}
          </h1>

          <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-xl">
            MOTD: <span className="text-emerald-400/90">{serverStatus.motd}</span>
          </p>
        </div>

        {/* IP Badge & Main Power Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copyServerIP}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-slate-200 transition-all cursor-pointer group"
          >
            <span className="text-slate-400">IP:</span>
            <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
              {serverStatus.ip}:{serverStatus.port}
            </span>
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />}
          </button>

          {serverStatus.online ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playAlert();
                  onRestartServer();
                }}
                disabled={isLoadingAction || userRole === 'Moderator'}
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
              >
                {isLoadingAction ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />}
                <span>Restart</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playAlert();
                  onStopServer();
                }}
                disabled={isLoadingAction || userRole === 'Moderator'}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
              >
                <Square className="w-3.5 h-3.5 text-red-400" />
                <span>Stop</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onStartServer();
              }}
              disabled={isLoadingAction || userRole === 'Moderator'}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-40 cursor-pointer"
            >
              {isLoadingAction ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Power className="w-3.5 h-3.5" />}
              <span>Start Server</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Key Metrics: Minimal & Spacious (No overly-heavy boxed cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Metric 1: TPS */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tick Rate</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {serverStatus.tps.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-500">/ 20 TPS</span>
          </div>
          <div className="w-full bg-white/[0.04] h-1 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${(serverStatus.tps / 20) * 100}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Players */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Online Players</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {serverStatus.playersOnline}
            </span>
            <span className="text-xs font-mono text-slate-500">/ {serverStatus.maxPlayers} slots</span>
          </div>
          <div className="w-full bg-white/[0.04] h-1 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${(serverStatus.playersOnline / serverStatus.maxPlayers) * 100}%` }}
            />
          </div>
        </div>

        {/* Metric 3: RAM Memory */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <HardDrive className="w-3.5 h-3.5 text-violet-400" />
            <span>RAM Memory</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {(serverStatus.ramUsedMB / 1024).toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-500">/ {(serverStatus.ramTotalMB / 1024).toFixed(0)} GB</span>
          </div>
          <div className="w-full bg-white/[0.04] h-1 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-violet-400 rounded-full transition-all duration-500"
              style={{ width: `${ramPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 4: CPU Load */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            <span>CPU Allocation</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {serverStatus.cpuPercent}%
            </span>
            <span className="text-xs font-mono text-slate-500">8 vCores</span>
          </div>
          <div className="w-full bg-white/[0.04] h-1 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${serverStatus.cpuPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Essential Actions & Broadcast (Spacious 2-column layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Quick Operations Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Quick Server Operations
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Uptime: {formatUptime(serverStatus.uptimeSeconds)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onSaveWorld();
              }}
              disabled={isLoadingAction || !serverStatus.online}
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/20 text-left transition-all cursor-pointer disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 mb-2" />
              <p className="text-xs font-bold text-white">Force Save World</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Flush chunks to disk</p>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onClearLag();
              }}
              disabled={isLoadingAction || !serverStatus.online}
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/20 text-left transition-all cursor-pointer disabled:opacity-40"
            >
              <Flame className="w-4 h-4 text-amber-400 mb-2" />
              <p className="text-xs font-bold text-white">Clear Lag Entities</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Purge ground items</p>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onToggleWhitelist();
              }}
              disabled={userRole === 'Moderator'}
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/20 text-left transition-all cursor-pointer disabled:opacity-40"
            >
              <Shield className="w-4 h-4 text-violet-400 mb-2" />
              <p className="text-xs font-bold text-white">Whitelist Toggle</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {serverStatus.whitelistEnabled ? 'Restricted' : 'Open'}
              </p>
            </button>

            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.04] text-left">
              <TrendingUp className="w-4 h-4 text-teal-400 mb-2" />
              <p className="text-xs font-bold text-white">Host Node</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Frankfurt • 10Gbps</p>
            </div>
          </div>
        </div>

        {/* Live Broadcast to In-Game Players */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-violet-400" />
              In-Game Player Broadcast
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Live chat broadcast</span>
          </div>

          <form onSubmit={handleBroadcastSubmit} className="space-y-3">
            <textarea
              rows={3}
              value={broadcastInput}
              onChange={(e) => setBroadcastInput(e.target.value)}
              placeholder="Type message to broadcast to all players in-game..."
              className="w-full p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:border-violet-500/50 outline-none resize-none transition-colors"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">Prefix: [ANNOUNCEMENT]</span>
              <button
                type="submit"
                disabled={!broadcastInput.trim() || !serverStatus.online}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Broadcast</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
