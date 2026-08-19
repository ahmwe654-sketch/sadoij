import React, { useState } from 'react';
import {
  Users,
  Search,
  Shield,
  Heart,
  Utensils,
  MapPin,
  Clock,
  Zap,
  Slash,
  UserX,
  UserCheck,
  Compass,
  Sparkles,
  X,
  ShieldAlert,
  ChevronRight,
  UserPlus,
  Info,
  Check
} from 'lucide-react';
import { Player, UserRole } from '../types';
import { sound } from '../utils/sound';

interface PlayersViewProps {
  players: Player[];
  userRole: UserRole;
  onPlayerAction: (action: string, player: Player) => void;
  onTeleportToPlayer: (player: Player) => void;
  onAddPlayer?: (username: string) => void;
}

export const PlayersView: React.FC<PlayersViewProps> = ({
  players,
  userRole,
  onPlayerAction,
  onTeleportToPlayer,
  onAddPlayer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'online' | 'offline' | 'op' | 'banned'>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.username.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterTab === 'online') return p.online;
    if (filterTab === 'offline') return !p.online && !p.isBanned;
    if (filterTab === 'op') return p.isOp;
    if (filterTab === 'banned') return p.isBanned;
    return true;
  });

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    sound.playSuccess();
    if (onAddPlayer) {
      onAddPlayer(newPlayerName.trim());
    }
    setNewPlayerName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#090b0e]/90 border border-white/[0.08] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search players by username or UUID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none transition-colors"
          />
        </div>

        {/* Filter Pills & Add Player Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl">
            {(['all', 'online', 'offline', 'op', 'banned'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setFilterTab(tab);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterTab === tab
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsAddModalOpen(true);
            }}
            disabled={userRole === 'Moderator'}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-40 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Whitelist Player</span>
          </button>
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPlayers.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-2xl bg-[#090b0e]/80 border border-white/[0.08] text-slate-500 text-sm">
            No players found matching your criteria.
          </div>
        ) : (
          filteredPlayers.map((player) => (
            <div
              key={player.uuid}
              onClick={() => {
                sound.playClick();
                setSelectedPlayer(player);
              }}
              className="p-5 rounded-2xl bg-[#090b0e]/90 border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all cursor-pointer group flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative overflow-hidden"
            >
              {/* Subtle top indicator for OP or Banned */}
              {player.isBanned && (
                <div className="absolute top-0 right-0 bg-red-500/20 border-b border-l border-red-500/40 px-3 py-0.5 text-[9px] font-bold text-red-400 uppercase tracking-widest rounded-bl-lg">
                  BANNED
                </div>
              )}
              {player.isOp && !player.isBanned && (
                <div className="absolute top-0 right-0 bg-violet-500/20 border-b border-l border-violet-500/40 px-3 py-0.5 text-[9px] font-bold text-violet-400 uppercase tracking-widest rounded-bl-lg">
                  OPERATOR
                </div>
              )}

              <div>
                {/* Player Header */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative">
                    <img
                      src={`https://mc-heads.net/avatar/${player.username}/48`}
                      alt={player.username}
                      className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://mc-heads.net/avatar/MHF_Steve/48';
                      }}
                    />
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0d0f12] ${
                      player.online ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-slate-600'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm tracking-tight truncate group-hover:text-emerald-300 transition-colors">
                        {player.username}
                      </h4>
                      {player.isOp && <Shield className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Gamemode: <span className="text-slate-200 capitalize">{player.gamemode}</span>
                    </p>
                  </div>
                </div>

                {/* Health & Food Bars */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="flex items-center gap-1 text-red-400 font-semibold">
                        <Heart className="w-3.5 h-3.5 fill-current" /> Health
                      </span>
                      <span className="font-mono text-slate-300">{player.health}/20</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${(player.health / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Utensils className="w-3.5 h-3.5" /> Food
                      </span>
                      <span className="font-mono text-slate-300">{player.food}/20</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{ width: `${(player.food / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Coordinates & Playtime */}
                <div className="space-y-1.5 text-xs font-mono text-slate-400 bg-white/[0.01] p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3 text-emerald-400" /> Pos (XYZ):
                    </span>
                    <span className="text-slate-200">
                      {player.x}, {player.y}, {player.z}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3 text-violet-400" /> Playtime:
                    </span>
                    <span className="text-slate-200">{player.playTimeHours} hrs</span>
                  </div>
                </div>
              </div>

              {/* Card Footer prompt */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-emerald-400 transition-colors">
                <span>View Inventory & Actions</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Player Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#090b0e] border border-white/10 rounded-2xl p-6 backdrop-blur-2xl z-10 shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                Add Player to Server Whitelist
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlayer} className="mt-4 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Minecraft Username
                </label>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="e.g. Dream, Technoblade, Notch..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPlayerName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-40"
                >
                  Add Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Player Details & Inventory Inspector Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-md" 
            onClick={() => setSelectedPlayer(null)}
          />

          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#090b0e] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-2xl z-10 shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-4">
                <img
                  src={`https://mc-heads.net/avatar/${selectedPlayer.username}/64`}
                  alt={selectedPlayer.username}
                  className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{selectedPlayer.username}</h3>
                    {selectedPlayer.isOp && (
                      <span className="px-2 py-0.5 rounded-md bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-mono uppercase">
                        Operator
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    UUID: {selectedPlayer.uuid}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlayer(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="my-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Moderation & Player Controls</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onPlayerAction('toggle_op', selectedPlayer);
                  }}
                  disabled={userRole === 'Moderator'}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-violet-400" />
                  {selectedPlayer.isOp ? 'De-OP' : 'Make OP'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    onPlayerAction('set_survival', selectedPlayer);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Survival
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    onPlayerAction('set_creative', selectedPlayer);
                  }}
                  disabled={userRole === 'Moderator'}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Creative
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    onPlayerAction('heal', selectedPlayer);
                  }}
                  className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-red-400" />
                  Max Health & Food
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onTeleportToPlayer(selectedPlayer);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  Teleport To
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playAlert();
                    onPlayerAction('kick', selectedPlayer);
                  }}
                  className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5" />
                  Kick Player
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playAlert();
                    onPlayerAction('ban', selectedPlayer);
                  }}
                  disabled={userRole === 'Moderator'}
                  className="px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/30 border border-red-500/40 text-xs font-semibold text-red-300 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <Slash className="w-3.5 h-3.5" />
                  {selectedPlayer.isBanned ? 'Unban Player' : 'Ban Player'}
                </button>
              </div>
            </div>

            {/* In-Game Inventory Viewer */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Inventory & Equipment</h4>
                <span className="text-[11px] text-slate-400 font-mono">Real-time sync</span>
              </div>

              {/* Armor & Offhand */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">Armor:</span>
                {['helmet', 'chestplate', 'leggings', 'boots'].map((slotKey) => {
                  const item = selectedPlayer.inventory?.armor[slotKey as keyof typeof selectedPlayer.inventory.armor];
                  return (
                    <div
                      key={slotKey}
                      className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-lg relative group/slot cursor-pointer"
                      title={item ? `${item.name}\n${item.enchantments?.join(', ') || ''}` : `Empty ${slotKey}`}
                    >
                      {item ? item.icon : <span className="text-[10px] text-slate-600 uppercase">{slotKey[0]}</span>}
                      {item && (
                        <div className="hidden group-hover/slot:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 rounded-lg bg-black/95 border border-white/20 text-[10px] z-20 pointer-events-none">
                          <p className="font-bold text-emerald-400">{item.name}</p>
                          {item.enchantments?.map((ench) => (
                            <p key={ench} className="text-slate-400">§7{ench}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="h-6 w-px bg-white/10 mx-1" />

                <span className="text-xs text-slate-400 font-mono">Offhand:</span>
                <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-lg">
                  {selectedPlayer.inventory?.offhand ? selectedPlayer.inventory.offhand.icon : <span className="text-[10px] text-slate-600">OFF</span>}
                </div>
              </div>

              {/* Main Inventory 3 Rows of 9 */}
              <div>
                <span className="text-xs text-slate-400 font-mono block mb-2">Main Inventory:</span>
                <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
                  {(selectedPlayer.inventory?.main || Array(27).fill(null)).map((item, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/40 flex items-center justify-center text-base sm:text-lg relative group/slot cursor-pointer"
                      title={item ? `${item.name} x${item.count}` : 'Empty Slot'}
                    >
                      {item?.icon}
                      {item && item.count > 1 && (
                        <span className="absolute bottom-1 right-1 text-[10px] font-mono font-bold text-white bg-black/70 px-1 rounded">
                          {item.count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotbar Row of 9 */}
              <div className="pt-2 border-t border-white/5">
                <span className="text-xs text-slate-400 font-mono block mb-2">Hotbar:</span>
                <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
                  {(selectedPlayer.inventory?.hotbar || Array(9).fill(null)).map((item, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-400 flex items-center justify-center text-base sm:text-lg relative group/slot cursor-pointer"
                      title={item ? `${item.name} x${item.count}` : `Slot ${idx + 1}`}
                    >
                      {item?.icon}
                      {item && item.count > 1 && (
                        <span className="absolute bottom-1 right-1 text-[10px] font-mono font-bold text-emerald-300 bg-black/80 px-1 rounded">
                          {item.count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
