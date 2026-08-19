import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Send,
  Trash2,
  Copy,
  Download,
  Search,
  Check,
  Sparkles,
  ArrowDownCircle,
  HelpCircle
} from 'lucide-react';
import { LogEntry, UserRole } from '../types';

interface ConsoleViewProps {
  logs: LogEntry[];
  userRole: UserRole;
  onSendCommand: (command: string) => Promise<void>;
  onClearLogs: () => void;
}

export const ConsoleView: React.FC<ConsoleViewProps> = ({
  logs,
  userRole,
  onSendCommand,
  onClearLogs,
}) => {
  const [inputCommand, setInputCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim() || isSubmitting) return;

    const cmd = inputCommand.trim();
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputCommand('');
    setIsSubmitting(true);

    try {
      await onSendCommand(cmd);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputCommand(commandHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputCommand('');
      } else {
        setHistoryIndex(nextIdx);
        setInputCommand(commandHistory[nextIdx]);
      }
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedLevel !== 'ALL' && log.level !== selectedLevel) return false;
    return true;
  });

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.level}]: ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.level}]: ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minecraft-server-latest-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const quickCommands = ['tps', 'save-all', 'time set day', 'weather clear', 'whitelist on', 'help'];

  return (
    <div className="space-y-4">
      {/* Console Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search console logs..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <select
            aria-label="Filter Log Level"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-black/40 border border-white/10 text-xs font-mono text-slate-300 rounded-xl px-3 py-1.5 outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">INFO Only</option>
            <option value="WARN">WARN Only</option>
            <option value="ERROR">ERROR Only</option>
            <option value="SUCCESS">SUCCESS Only</option>
            <option value="CHAT">CHAT Only</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              autoScroll ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-white/5 border border-white/10 text-slate-400'
            }`}
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span>Auto Scroll</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLogs}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Copy all logs"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleDownloadLogs}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Download log file"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClearLogs}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-slate-300 hover:text-red-300 transition-all cursor-pointer"
            title="Clear view"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="rounded-2xl bg-black/70 border border-white/10 backdrop-blur-2xl overflow-hidden flex flex-col h-[520px] shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
        <div className="p-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] font-mono text-slate-400 ml-2">server@valkyrie-node-01:~$ rcon-session</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400/80">Active STDOUT Stream</span>
        </div>

        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar space-y-1 select-text">
          {filteredLogs.length === 0 ? (
            <div className="py-20 text-center text-slate-600">No log output available</div>
          ) : (
            filteredLogs.map((log) => {
              let levelColor = 'text-blue-400';
              if (log.level === 'WARN') levelColor = 'text-amber-400';
              if (log.level === 'ERROR') levelColor = 'text-red-400';
              if (log.level === 'SUCCESS') levelColor = 'text-emerald-400';
              if (log.level === 'CHAT') levelColor = 'text-violet-400';

              return (
                <div key={log.id} className="leading-relaxed hover:bg-white/[0.02] py-0.5 px-1 rounded flex items-start gap-2">
                  <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
                  <span className={`font-bold shrink-0 text-[11px] ${levelColor}`}>[{log.level}]</span>
                  <span className="text-slate-300 break-all">{log.message}</span>
                </div>
              );
            })
          )}
          <div ref={logsEndRef} />
        </div>

        {/* Quick Command Suggestions */}
        <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <span className="text-[10px] text-slate-500 font-mono shrink-0">Quick:</span>
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => onSendCommand(cmd)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/30 text-[11px] font-mono text-slate-300 hover:text-emerald-300 shrink-0 transition-all cursor-pointer"
            >
              /{cmd}
            </button>
          ))}
        </div>

        {/* Command Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-black/60 border-t border-white/10 flex items-center gap-3">
          <span className="text-emerald-400 font-mono font-bold text-sm pl-2">&gt;</span>
          <input
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={userRole === 'Moderator'}
            placeholder={userRole === 'Moderator' ? 'Command execution restricted for Moderator role' : 'Enter Minecraft server command (e.g. /say Hello, /tps, /gamemode)...'}
            className="flex-1 bg-transparent text-white font-mono text-xs placeholder-slate-600 outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputCommand.trim() || isSubmitting || userRole === 'Moderator'}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold font-mono flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Exec</span>
          </button>
        </form>
      </div>
    </div>
  );
};
