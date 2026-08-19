import React, { useState } from 'react';
import {
  Code2,
  X,
  Copy,
  Check,
  Terminal,
  Radio,
  Server,
  Zap,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { sound } from '../utils/sound';

interface ApiBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiBridgeModal: React.FC<ApiBridgeModalProps> = ({ isOpen, onClose }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'node' | 'curl' | 'websocket' | 'rcon'>('node');
  const [copied, setCopied] = useState(false);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const nodeExample = `// Minecraft Java Backend Bridge (server.ts / Node.js)
import express from 'express';
import { Rcon } from 'rcon-client';

const app = express();
app.use(express.json());

// Secure RCON Credentials in environment
const RCON_HOST = process.env.MC_RCON_HOST || '127.0.0.1';
const RCON_PORT = Number(process.env.MC_RCON_PORT || 25575);
const RCON_PASSWORD = process.env.MC_RCON_PASSWORD || 'secret_rcon_pass';

// Execute server command
app.post('/api/command', async (req, res) => {
  const { command } = req.body;
  if (!command) return res.status(400).json({ error: 'Command required' });

  try {
    const rcon = await Rcon.connect({
      host: RCON_HOST,
      port: RCON_PORT,
      password: RCON_PASSWORD,
    });
    const response = await rcon.send(command);
    await rcon.end();
    return res.json({ success: true, response });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Fetch Live Status
app.get('/api/status', async (req, res) => {
  res.json({
    online: true,
    tps: 20.0,
    playersOnline: 4,
    maxPlayers: 50,
    ramUsedMB: 5420,
    ramTotalMB: 16384,
    cpuPercent: 24.5
  });
});

app.listen(3000, () => console.log('Minecraft API Bridge listening on :3000'));
`;

  const curlExample = `# Test Server Command Endpoint
curl -X POST http://localhost:3000/api/command \\
  -H "Content-Type: application/json" \\
  -d '{"command": "say Hello from Web Dashboard!"}'

# Get Server Status
curl -X GET http://localhost:3000/api/status
`;

  const wsExample = `// Live Console Logs Stream via WebSockets
import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';

const wss = new WebSocketServer({ port: 8080 });

// Stream paper.jar stdout directly to the frontend console
const mcProcess = spawn('java', ['-Xms4G', '-Xmx16G', '-jar', 'paper-1.20.4.jar', 'nogui']);

mcProcess.stdout.on('data', (data) => {
  const logLine = data.toString();
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({
        timestamp: new Date().toLocaleTimeString(),
        level: logLine.includes('WARN') ? 'WARN' : logLine.includes('ERROR') ? 'ERROR' : 'INFO',
        message: logLine.trim()
      }));
    }
  });
});
`;

  const rconExample = `# Minecraft server.properties configuration for RCON
enable-rcon=true
rcon.port=25575
rcon.password=YourSecurePassword123
broadcast-rcon-to-ops=true
`;

  const getActiveCode = () => {
    switch (activeCodeTab) {
      case 'node':
        return nodeExample;
      case 'curl':
        return curlExample;
      case 'websocket':
        return wsExample;
      case 'rcon':
        return rconExample;
    }
  };

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestPing = () => {
    sound.playClick();
    setIsTestingPing(true);
    setPingResult(null);

    setTimeout(() => {
      setIsTestingPing(false);
      setPingResult('Connected to Mock Daemon: RCON Latency 14ms • Paper 1.20.4 Protocol 765 OK');
      sound.playSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[#090b0e] border border-white/10 rounded-2xl p-6 backdrop-blur-2xl z-10 flex flex-col max-h-[90vh] shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Real Backend & RCON Integration Bridge</h3>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">API READY</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Plug this UI directly into your live Minecraft server daemon</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Alert Banner */}
        <div className="my-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs text-slate-300">
            <strong className="text-white">Zero Frontend Secrets:</strong> RCON passwords and API tokens are never exposed in browser scripts. All command calls route through secure server-side proxies (`/api/command`).
          </div>
        </div>

        {/* Code Tabs */}
        <div className="flex items-center gap-2 mb-3">
          {[
            { id: 'node', label: 'Node.js / Express' },
            { id: 'websocket', label: 'WebSocket Stream' },
            { id: 'curl', label: 'cURL Endpoints' },
            { id: 'rcon', label: 'server.properties' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveCodeTab(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeCodeTab === tab.id
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                  : 'text-slate-400 hover:text-white bg-white/5 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="ml-auto">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Snippet' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Code Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar rounded-xl bg-black/80 border border-white/10 p-4 font-mono text-xs text-emerald-300 leading-relaxed select-text">
          <pre>{getActiveCode()}</pre>
        </div>

        {/* Footer with Test Ping */}
        <div className="pt-4 mt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono">
            {pingResult ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> {pingResult}
              </span>
            ) : (
              <span>Status: Mock Data Simulator Active (Ready for live proxy)</span>
            )}
          </div>

          <button
            onClick={handleTestPing}
            disabled={isTestingPing}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isTestingPing ? 'Pinging RCON...' : 'Test Connection Latency'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
