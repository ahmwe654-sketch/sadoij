import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Trash2,
  Filter,
  Sparkles,
  Shield,
  User,
  Radio
} from 'lucide-react';
import { ChatMessage, UserRole } from '../types';

interface ChatViewProps {
  chatMessages: ChatMessage[];
  userRole: UserRole;
  onSendChatMessage: (msg: string, senderName: string) => void;
  onClearChat: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  chatMessages,
  userRole,
  onSendChatMessage,
  onClearChat,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [senderIdentity, setSenderIdentity] = useState<'CONSOLE' | 'ADMIN'>('CONSOLE');
  const [filterUser, setFilterUser] = useState<string>('ALL');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onSendChatMessage(inputMessage.trim(), senderIdentity === 'CONSOLE' ? 'CONSOLE' : `Admin_${userRole}`);
    setInputMessage('');
  };

  const filteredMessages = chatMessages.filter((m) => {
    if (filterUser !== 'ALL' && m.sender !== filterUser) return false;
    return true;
  });

  // Extract unique senders for filter
  const uniqueSenders = Array.from(new Set(chatMessages.map((m) => m.sender)));

  return (
    <div className="space-y-4">
      {/* Header toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-tight">Live In-Game Chat Feed</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">({chatMessages.length} messages)</span>
        </div>

        <div className="flex items-center gap-3">
          <select
            aria-label="Filter Chat by Player"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="bg-black/40 border border-white/10 text-xs font-mono text-slate-300 rounded-xl px-3 py-1.5 outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Players</option>
            {uniqueSenders.map((sender) => (
              <option key={sender} value={sender}>{sender}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={onClearChat}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 text-slate-400 hover:text-red-300 transition-all cursor-pointer"
            title="Clear Chat View"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="rounded-2xl bg-black/60 border border-white/10 backdrop-blur-2xl overflow-hidden flex flex-col h-[520px] shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="py-24 text-center text-slate-600 text-sm font-mono">
              No chat messages recorded yet.
            </div>
          ) : (
            filteredMessages.map((msg) => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 font-mono flex items-center justify-between">
                    <span>{msg.message}</span>
                    <span className="text-[10px] text-slate-600">{msg.timestamp}</span>
                  </div>
                );
              }

              let roleBadgeBg = 'bg-slate-800 text-slate-300 border-slate-700';
              if (msg.role === 'Owner') roleBadgeBg = 'bg-red-500/20 text-red-300 border-red-500/30';
              if (msg.role === 'Admin') roleBadgeBg = 'bg-violet-500/20 text-violet-300 border-violet-500/30';
              if (msg.role === 'VIP') roleBadgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

              return (
                <div key={msg.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
                  <img
                    src={msg.avatar}
                    alt={msg.sender}
                    className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 shrink-0 mt-0.5"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://mc-heads.net/avatar/MHF_Steve/48';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-white tracking-tight">{msg.sender}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${roleBadgeBg}`}>
                        {msg.role}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{msg.message}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* In-Game Chat Sender Form */}
        <form onSubmit={handleSubmit} className="p-3.5 bg-black/80 border-t border-white/10 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Send as:</span>
            <select
              aria-label="Chat Sender Identity"
              value={senderIdentity}
              onChange={(e) => setSenderIdentity(e.target.value as 'CONSOLE' | 'ADMIN')}
              className="bg-transparent text-xs font-bold text-emerald-400 outline-none cursor-pointer"
            >
              <option value="CONSOLE" className="bg-[#0d0f12] text-emerald-400">[CONSOLE]</option>
              <option value="ADMIN" className="bg-[#0d0f12] text-violet-400">[ADMIN]</option>
            </select>
          </div>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type message to broadcast into the Minecraft world..."
            className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Chat</span>
          </button>
        </form>
      </div>
    </div>
  );
};
