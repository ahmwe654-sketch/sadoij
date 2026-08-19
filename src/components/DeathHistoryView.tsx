import React, { useState } from 'react';
import {
  Skull,
  Search,
  Filter,
  Flame,
  Swords,
  MapPin,
  Clock,
  PackageX,
  Sparkles
} from 'lucide-react';
import { DeathRecord, UserRole } from '../types';

interface DeathHistoryViewProps {
  deaths: DeathRecord[];
  userRole: UserRole;
}

export const DeathHistoryView: React.FC<DeathHistoryViewProps> = ({ deaths }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWorld, setFilterWorld] = useState<string>('ALL');

  const filteredDeaths = deaths.filter((d) => {
    const matchesSearch = 
      d.player.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.killer.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterWorld !== 'ALL' && d.world !== filterWorld) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by player, killer, or cause..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500">Filter Dimension:</span>
          <select
            aria-label="Filter Death Dimension"
            value={filterWorld}
            onChange={(e) => setFilterWorld(e.target.value)}
            className="bg-black/40 border border-white/10 text-xs font-mono text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Dimensions</option>
            <option value="Overworld">Overworld</option>
            <option value="Nether">Nether</option>
            <option value="The End">The End</option>
          </select>
        </div>
      </div>

      {/* Deaths Table */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-slate-400 font-mono">
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Player</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Cause of Death</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Killer Entity</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Dimension</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Coordinates (XYZ)</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Items Lost</th>
                <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-right">Occurred</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDeaths.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No death records found.
                  </td>
                </tr>
              ) : (
                filteredDeaths.map((record) => (
                  <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={`https://mc-heads.net/avatar/${record.player}/32`}
                          alt={record.player}
                          className="w-6 h-6 rounded-md bg-black/40 border border-white/10"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://mc-heads.net/avatar/MHF_Steve/32';
                          }}
                        />
                        <span>{record.player}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-red-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Skull className="w-3.5 h-3.5 shrink-0" />
                        <span>{record.cause}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-300 font-mono">{record.killer}</td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        record.world === 'Nether' 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : record.world === 'The End'
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {record.world}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-400">
                      {record.coords.x}, {record.coords.y}, {record.coords.z}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-400">
                      {record.itemsLostCount > 0 ? (
                        <span className="text-amber-400 flex items-center gap-1">
                          <PackageX className="w-3.5 h-3.5" /> {record.itemsLostCount} items
                        </span>
                      ) : (
                        <span className="text-slate-600">None (0)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono text-slate-500">
                      {record.timestamp}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
