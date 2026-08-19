import React, { useState } from 'react';
import {
  Box,
  Globe,
  Upload,
  Download,
  Trash2,
  RotateCcw,
  Plus,
  CheckCircle2,
  FileCode,
  Archive,
  HardDrive,
  Sparkles,
  Loader2,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { ModItem, BackupItem, UserRole } from '../types';

interface ModsWorldsViewProps {
  mods: ModItem[];
  backups: BackupItem[];
  userRole: UserRole;
  onToggleMod: (id: string) => void;
  onDeleteMod: (mod: ModItem) => void;
  onUploadMod: (file: File) => void;
  onCreateBackup: () => void;
  onRestoreBackup: (backup: BackupItem) => void;
  onDeleteBackup: (backup: BackupItem) => void;
  isLoadingBackup: boolean;
}

export const ModsWorldsView: React.FC<ModsWorldsViewProps> = ({
  mods,
  backups,
  userRole,
  onToggleMod,
  onDeleteMod,
  onUploadMod,
  onCreateBackup,
  onRestoreBackup,
  onDeleteBackup,
  isLoadingBackup,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'mods' | 'worlds'>('mods');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadMod(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadMod(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subtab navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveSubTab('mods')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'mods'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>Plugins & Mods ({mods.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('worlds')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'worlds'
              ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Worlds & Backups ({backups.length})</span>
        </button>
      </div>

      {activeSubTab === 'mods' ? (
        /* MODS / PLUGINS SECTION */
        <div className="space-y-6">
          {/* Drag & Drop jar zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed p-8 text-center backdrop-blur-md transition-all ${
              isDragging
                ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Drag & drop your .jar files here</p>
                <p className="text-xs text-slate-400 mt-1">Supports Paper, Spigot, Bukkit plugins and Fabric/Forge mods</p>
              </div>
              <label className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer transition-all">
                Browse Files
                <input
                  type="file"
                  accept=".jar"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Installed plugins table / grid */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Installed JAR Packages</h4>
              <span className="text-xs text-slate-400 font-mono">
                {mods.filter((m) => m.enabled).length} Enabled / {mods.length} Total
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {mods.map((mod) => (
                <div
                  key={mod.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
                      <FileCode className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-white text-sm truncate">{mod.name}</h5>
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
                          v{mod.version}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                        {mod.filename} • {mod.sizeMB} MB • Author: {mod.author}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {/* Enable / Disable Toggle */}
                    <button
                      type="button"
                      onClick={() => onToggleMod(mod.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        mod.enabled
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                          : 'bg-white/5 border border-white/10 text-slate-500'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${mod.enabled ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                      {mod.enabled ? 'Active' : 'Disabled'}
                    </button>

                    {/* Delete Mod Button */}
                    <button
                      type="button"
                      onClick={() => onDeleteMod(mod)}
                      disabled={userRole === 'Moderator'}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all disabled:opacity-40 cursor-pointer"
                      title="Delete Plugin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* WORLDS & BACKUPS SECTION */
        <div className="space-y-6">
          {/* Active Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Dimension</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 font-mono">Loaded</span>
              </div>
              <h4 className="text-lg font-bold text-white">Overworld</h4>
              <p className="text-xs text-slate-400 font-mono mt-1">Directory: /world (850 MB)</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Dimension</span>
                <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[10px] text-red-300 font-mono">Loaded</span>
              </div>
              <h4 className="text-lg font-bold text-white">The Nether</h4>
              <p className="text-xs text-slate-400 font-mono mt-1">Directory: /world_nether (290 MB)</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">Dimension</span>
                <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-300 font-mono">Loaded</span>
              </div>
              <h4 className="text-lg font-bold text-white">The End</h4>
              <p className="text-xs text-slate-400 font-mono mt-1">Directory: /world_the_end (140 MB)</p>
            </div>
          </div>

          {/* Backup Manager Card */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md overflow-hidden">
            <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">World Snapshot & Backup Archive</h4>
                <p className="text-xs text-slate-400 mt-0.5">Automated and on-demand compressed snapshots</p>
              </div>

              <button
                type="button"
                onClick={onCreateBackup}
                disabled={isLoadingBackup}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 cursor-pointer"
              >
                {isLoadingBackup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Create New Backup</span>
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {backups.map((b) => (
                <div
                  key={b.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                      <Archive className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-white text-sm font-mono truncate">{b.name}.tar.gz</h5>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Created: {b.date} • Compressed Size: {b.sizeMB} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Download */}
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Download Archive"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>

                    {/* Restore */}
                    <button
                      type="button"
                      onClick={() => onRestoreBackup(b)}
                      disabled={userRole === 'Moderator'}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                      title="Restore World to this snapshot"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDeleteBackup(b)}
                      disabled={userRole === 'Moderator'}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all disabled:opacity-40 cursor-pointer"
                      title="Delete Backup"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
