import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Sliders,
  Shield,
  Eye,
  Zap,
  Sparkles,
  Loader2
} from 'lucide-react';
import { ServerConfigSettings, UserRole } from '../types';

interface SettingsViewProps {
  settings: ServerConfigSettings;
  userRole: UserRole;
  onSaveSettings: (newSettings: ServerConfigSettings) => Promise<void>;
  isLoading: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  userRole,
  onSaveSettings,
  isLoading,
}) => {
  const [formData, setFormData] = useState<ServerConfigSettings>(settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSettings(formData);
  };

  // Convert Minecraft color codes (e.g. §a, §b, §l, etc.) to styled spans
  const renderMinecraftMotd = (motd: string) => {
    const colorMap: Record<string, string> = {
      '0': '#000000',
      '1': '#0000AA',
      '2': '#00AA00',
      '3': '#00AAAA',
      '4': '#AA0000',
      '5': '#AA00AA',
      '6': '#FFAA00',
      '7': '#AAAAAA',
      '8': '#555555',
      '9': '#5555FF',
      'a': '#55FF55',
      'b': '#55FFFF',
      'c': '#FF5555',
      'd': '#FF55FF',
      'e': '#FFFF55',
      'f': '#FFFFFF',
    };

    const parts = motd.split(/(§[0-9a-fk-or])/gi);
    let currentColor = '#FFFFFF';
    let isBold = false;

    return (
      <div className="font-mono text-sm bg-black/90 p-3 rounded-xl border border-white/10 select-text flex flex-wrap items-center">
        {parts.map((part, index) => {
          if (part.startsWith('§')) {
            const code = part.charAt(1).toLowerCase();
            if (colorMap[code]) {
              currentColor = colorMap[code];
            } else if (code === 'l') {
              isBold = true;
            } else if (code === 'r') {
              currentColor = '#FFFFFF';
              isBold = false;
            }
            return null;
          }
          return (
            <span
              key={index}
              style={{
                color: currentColor,
                fontWeight: isBold ? 'bold' : 'normal',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">server.properties & Core Configuration</h3>
            <p className="text-xs text-slate-400">Manage runtime gameplay, world limits, and network parameters</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || userRole === 'Moderator'}
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.3)]"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Grid of Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: General & MOTD */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            General Server Identity
          </h4>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Server Name</label>
            <input
              type="text"
              value={formData.serverName}
              onChange={(e) => setFormData({ ...formData, serverName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Message of the Day (MOTD with § codes)
            </label>
            <input
              type="text"
              value={formData.motd}
              onChange={(e) => setFormData({ ...formData, motd: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:border-emerald-500 outline-none"
            />
          </div>

          {/* MOTD Live Preview */}
          <div className="pt-2">
            <span className="text-[10px] text-slate-500 font-mono block mb-1.5 flex items-center gap-1">
              <Eye className="w-3 h-3 text-emerald-400" /> In-Game Server List Preview:
            </span>
            {renderMinecraftMotd(formData.motd)}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Max Players</label>
              <input
                type="number"
                min={1}
                max={500}
                value={formData.maxPlayers}
                onChange={(e) => setFormData({ ...formData, maxPlayers: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Default Gamemode</label>
              <select
                aria-label="Default Gamemode"
                value={formData.defaultGamemode}
                onChange={(e) => setFormData({ ...formData, defaultGamemode: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-emerald-500 outline-none capitalize"
              >
                <option value="survival" className="bg-[#0d0f12]">Survival</option>
                <option value="creative" className="bg-[#0d0f12]">Creative</option>
                <option value="adventure" className="bg-[#0d0f12]">Adventure</option>
                <option value="spectator" className="bg-[#0d0f12]">Spectator</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Difficulty & World Performance */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-400" />
            Gameplay & Performance
          </h4>

          {/* Difficulty selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-2">World Difficulty</label>
            <div className="grid grid-cols-4 gap-2">
              {(['peaceful', 'easy', 'normal', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: diff })}
                  className={`py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    formData.difficulty === diff
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">View Distance (Chunks)</label>
              <input
                type="number"
                min={4}
                max={32}
                value={formData.viewDistance}
                onChange={(e) => setFormData({ ...formData, viewDistance: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:border-violet-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Simulation Distance</label>
              <input
                type="number"
                min={3}
                max={16}
                value={formData.simulationDistance}
                onChange={(e) => setFormData({ ...formData, simulationDistance: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:border-violet-500 outline-none"
              />
            </div>
          </div>

          {/* Gameplay Toggles */}
          <div className="pt-3 border-t border-white/5 space-y-3">
            {[
              { key: 'pvp', label: 'Player vs Player (PvP)' },
              { key: 'commandBlocks', label: 'Enable Command Blocks' },
              { key: 'onlineMode', label: 'Online Mode (Mojang Authentication)' },
              { key: 'whitelist', label: 'Server Whitelist' },
              { key: 'spawnMonsters', label: 'Spawn Hostile Mobs' },
              { key: 'spawnAnimals', label: 'Spawn Passive Animals' },
              { key: 'allowFlight', label: 'Allow Survival Flight' },
              { key: 'allowNether', label: 'Allow Nether Dimension' },
            ].map((item) => {
              const val = (formData as any)[item.key];
              return (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, [item.key]: !val })}
                    className={`w-11 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                      val ? 'bg-emerald-500' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-black transition-transform ${
                        val ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
};
