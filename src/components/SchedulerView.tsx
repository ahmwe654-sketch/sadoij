import React, { useState } from 'react';
import {
  CalendarClock,
  Radio,
  Plus,
  Trash2,
  Bell,
  Clock,
  CheckCircle2,
  Sparkles,
  Play
} from 'lucide-react';
import { RestartSchedule, BroadcastItem, UserRole } from '../types';

interface SchedulerViewProps {
  schedules: RestartSchedule[];
  broadcasts: BroadcastItem[];
  userRole: UserRole;
  onToggleSchedule: (id: string) => void;
  onDeleteSchedule: (id: string) => void;
  onAddSchedule: (schedule: Omit<RestartSchedule, 'id'>) => void;
  onToggleBroadcast: (id: string) => void;
  onDeleteBroadcast: (id: string) => void;
  onAddBroadcast: (broadcast: Omit<BroadcastItem, 'id'>) => void;
}

export const SchedulerView: React.FC<SchedulerViewProps> = ({
  schedules,
  broadcasts,
  userRole,
  onToggleSchedule,
  onDeleteSchedule,
  onAddSchedule,
  onToggleBroadcast,
  onDeleteBroadcast,
  onAddBroadcast,
}) => {
  // New Schedule form
  const [newTime, setNewTime] = useState('04:00');
  const [newMsg, setNewMsg] = useState('Daily scheduled maintenance reboot');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  // New Broadcast form
  const [newBcMsg, setNewBcMsg] = useState('');
  const [newBcInterval, setNewBcInterval] = useState(15);
  const [newBcPrefix, setNewBcPrefix] = useState('§6[ALERT]§r');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime || selectedDays.length === 0) return;
    onAddSchedule({
      time: newTime,
      days: selectedDays,
      enabled: true,
      warnings: [30, 10, 5, 1],
      customMessage: newMsg,
    });
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBcMsg.trim()) return;
    onAddBroadcast({
      message: newBcMsg.trim(),
      intervalMinutes: Number(newBcInterval),
      enabled: true,
      prefix: newBcPrefix,
    });
    setNewBcMsg('');
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: RESTART SCHEDULER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <CalendarClock className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Automated Restart Schedules</h3>
              <p className="text-xs text-slate-400">Schedule automatic server restarts with graceful player warnings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schedules List */}
          <div className="lg:col-span-2 space-y-3">
            {schedules.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-emerald-400 shrink-0">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold font-mono mt-0.5">{s.time}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{s.customMessage}</h4>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {s.days.map((d) => (
                        <span key={d} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-300">
                          {d}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">
                      Warnings: {s.warnings.join('m, ')}m prior
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => onToggleSchedule(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      s.enabled ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-white/5 border border-white/10 text-slate-500'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${s.enabled ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    {s.enabled ? 'Enabled' : 'Disabled'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteSchedule(s.id)}
                    disabled={userRole === 'Moderator'}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40 cursor-pointer"
                    title="Delete Schedule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create Schedule Form */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Add Restart Cron
            </h4>

            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Time (24h)</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">Active Days</label>
                <div className="flex flex-wrap gap-1.5">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        selectedDays.includes(day)
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/5 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Description / Reason</label>
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="e.g. Daily maintenance"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={userRole === 'Moderator'}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Schedule Restart
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* SECTION 2: AUTO-BROADCAST */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-violet-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Periodic In-Game Broadcast Messages</h3>
              <p className="text-xs text-slate-400">Deliver recurring tips, discord links, and announcements automatically</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Broadcasts List */}
          <div className="lg:col-span-2 space-y-3">
            {broadcasts.map((bc) => (
              <div
                key={bc.id}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-violet-500/20 border border-violet-500/30 text-[10px] font-mono text-violet-300">
                      Every {bc.intervalMinutes}m
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{bc.prefix}</span>
                  </div>
                  <p className="text-xs text-slate-200 font-sans leading-relaxed">{bc.message}</p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleBroadcast(bc.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      bc.enabled ? 'bg-violet-600/20 border border-violet-500/30 text-violet-300' : 'bg-white/5 border border-white/10 text-slate-500'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${bc.enabled ? 'bg-violet-400' : 'bg-slate-600'}`} />
                    {bc.enabled ? 'Active' : 'Paused'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteBroadcast(bc.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    title="Delete Broadcast"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create Broadcast Form */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-violet-400" />
              New Auto Announcement
            </h4>

            <form onSubmit={handleCreateBroadcast} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Prefix Tag</label>
                <input
                  type="text"
                  value={newBcPrefix}
                  onChange={(e) => setNewBcPrefix(e.target.value)}
                  placeholder="§6[BROADCAST]§r"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:border-violet-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Interval (Minutes)</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={newBcInterval}
                  onChange={(e) => setNewBcInterval(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:border-violet-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Broadcast Message</label>
                <textarea
                  rows={3}
                  value={newBcMsg}
                  onChange={(e) => setNewBcMsg(e.target.value)}
                  placeholder="Message to display periodically in Minecraft chat..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-violet-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!newBcMsg.trim()}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                Create Broadcast
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
