import React, { useState } from 'react';
import {
  Navigation,
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Globe,
  Flame,
  Moon
} from 'lucide-react';
import { Player, UserRole } from '../types';

interface TeleportViewProps {
  players: Player[];
  userRole: UserRole;
  onExecuteTeleport: (sourcePlayer: string, target: string, isCoords: boolean) => Promise<void>;
  isLoading: boolean;
}

export const TeleportView: React.FC<TeleportViewProps> = ({
  players,
  userRole,
  onExecuteTeleport,
  isLoading,
}) => {
  const onlinePlayers = players.filter((p) => p.online);

  // Player to Player state
  const [playerA, setPlayerA] = useState<string>(onlinePlayers[0]?.username || '');
  const [playerB, setPlayerB] = useState<string>(onlinePlayers[1]?.username || '');

  // Player to Coords state
  const [targetPlayer, setTargetPlayer] = useState<string>(onlinePlayers[0]?.username || '');
  const [coordX, setCoordX] = useState<string>('0');
  const [coordY, setCoordY] = useState<string>('70');
  const [coordZ, setCoordZ] = useState<string>('0');
  const [dimension, setDimension] = useState<string>('minecraft:overworld');

  const waypoints = [
    { name: 'Spawn Hub', x: 0, y: 72, z: 0, dim: 'Overworld', icon: Globe },
    { name: 'PvP Warzone Arena', x: 1250, y: 64, z: -800, dim: 'Overworld', icon: Sparkles },
    { name: 'Nether Highway Hub', x: 0, y: 120, z: 0, dim: 'Nether', icon: Flame },
    { name: 'End Portal / Stronghold', x: 1420, y: 32, z: -1100, dim: 'Overworld', icon: Moon },
    { name: 'Community Mega Farm', x: -450, y: 68, z: 620, dim: 'Overworld', icon: MapPin },
  ];

  const handlePlayerToPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerA || !playerB) return;
    await onExecuteTeleport(playerA, playerB, false);
  };

  const handlePlayerToCoords = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPlayer) return;
    const coordsStr = `${coordX} ${coordY} ${coordZ}`;
    await onExecuteTeleport(targetPlayer, coordsStr, true);
  };

  const handleWaypointClick = async (wp: typeof waypoints[0]) => {
    if (!targetPlayer && onlinePlayers.length > 0) {
      setTargetPlayer(onlinePlayers[0].username);
    }
    const playerToTp = targetPlayer || onlinePlayers[0]?.username;
    if (!playerToTp) return;
    await onExecuteTeleport(playerToTp, `${wp.x} ${wp.y} ${wp.z}`, true);
  };

  return (
    <div className="space-y-6">
      {/* 2 Main Teleport Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Player to Player */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Player to Player Teleport</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">Instantly transport one player to another player's location</p>

            <form onSubmit={handlePlayerToPlayer} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Select Player to Move (Player A)
                </label>
                <select
                  aria-label="Select Player A"
                  value={playerA}
                  onChange={(e) => setPlayerA(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white outline-none focus:border-emerald-500"
                >
                  <option value="" disabled>Select Player</option>
                  {onlinePlayers.map((p) => (
                    <option key={p.uuid} value={p.username} className="bg-[#0d0f12]">
                      {p.username} ({p.x}, {p.y}, {p.z})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center my-1">
                <div className="p-1.5 rounded-full bg-white/5 text-slate-500">
                  <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Destination Target (Player B)
                </label>
                <select
                  aria-label="Select Target Player B"
                  value={playerB}
                  onChange={(e) => setPlayerB(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white outline-none focus:border-emerald-500"
                >
                  <option value="" disabled>Select Target</option>
                  {onlinePlayers.map((p) => (
                    <option key={p.uuid} value={p.username} className="bg-[#0d0f12]">
                      {p.username} ({p.x}, {p.y}, {p.z})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading || !playerA || !playerB || playerA === playerB}
                className="w-full mt-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                <span>Execute /tp {playerA || '...'} {playerB || '...'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Panel 2: Player to Coordinates */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <MapPin className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Teleport to World Coordinates</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">Teleport any player to precise X, Y, Z coordinates</p>

            <form onSubmit={handlePlayerToCoords} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Select Target Player
                </label>
                <select
                  aria-label="Select Target Player for Coordinates"
                  value={targetPlayer}
                  onChange={(e) => setTargetPlayer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white outline-none focus:border-violet-500"
                >
                  <option value="" disabled>Select Player</option>
                  {onlinePlayers.map((p) => (
                    <option key={p.uuid} value={p.username} className="bg-[#0d0f12]">
                      {p.username} (Current: {p.x}, {p.y}, {p.z})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">X Coordinate</label>
                  <input
                    type="number"
                    value={coordX}
                    onChange={(e) => setCoordX(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:border-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Y Coordinate (Alt)</label>
                  <input
                    type="number"
                    value={coordY}
                    onChange={(e) => setCoordY(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:border-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Z Coordinate</label>
                  <input
                    type="number"
                    value={coordZ}
                    onChange={(e) => setCoordZ(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:border-violet-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !targetPlayer}
                className="w-full mt-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                <span>Teleport to ({coordX}, {coordY}, {coordZ})</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Quick Server Waypoints */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Pre-Configured Server Waypoints
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {waypoints.map((wp) => {
            const Icon = wp.icon;
            return (
              <button
                key={wp.name}
                type="button"
                onClick={() => handleWaypointClick(wp)}
                disabled={isLoading || !targetPlayer}
                className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/40 text-left transition-all group cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white truncate">{wp.name}</span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  {wp.x}, {wp.y}, {wp.z} ({wp.dim})
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
