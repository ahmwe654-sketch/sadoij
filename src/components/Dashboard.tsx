import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, 
  Users, 
  Terminal, 
  AlertCircle, 
  CheckCircle, 
  Zap 
} from 'lucide-react';

interface ServerStats {
  serverName: string;
  status: 'online' | 'offline' | 'loading';
  playerCount: number;
  maxPlayers: number;
  uptime: number;
  tps?: number;
}

interface CommandResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<ServerStats>({
    serverName: 'Loading...',
    status: 'loading',
    playerCount: 0,
    maxPlayers: 0,
    uptime: 0,
  });

  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [feedback, setFeedback] = useState<CommandResponse | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Fetch server stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        setStats({
          serverName: data.name || 'Valkyrie SMP',
          status: data.online ? 'online' : 'offline',
          playerCount: data.players || 0,
          maxPlayers: data.maxPlayers || 50,
          uptime: data.uptime || 0,
          tps: data.tps,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, status: 'offline' }));
      }
    };

    // Fetch immediately
    fetchStats();

    // Set up polling interval (e.g., every 5 seconds)
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory]);

  // Handle command execution
  const executeCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commandInput.trim()) return;

    setIsExecuting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: commandInput.trim(),
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to execute command');
      
      const data: CommandResponse = await response.json();
      
      setCommandHistory(prev => [
        ...prev,
        `> ${commandInput}`,
        `${data.message}`,
      ]);
      
      setFeedback(data);
      setCommandInput('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setCommandHistory(prev => [
        ...prev,
        `> ${commandInput}`,
        `Error: ${errorMessage}`,
      ]);
      setFeedback({
        success: false,
        message: errorMessage,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Server Dashboard</h1>
          <p className="text-slate-400">Real-time server monitoring and control</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Server Status Card */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-semibold">STATUS</h3>
              {getStatusIcon(stats.status)}
            </div>
            <p className="text-2xl font-bold capitalize">{stats.status}</p>
            <p className="text-slate-500 text-xs mt-2">Server Status</p>
          </div>

          {/* Server Name Card */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-semibold">SERVER</h3>
              <Server className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold truncate">{stats.serverName}</p>
            <p className="text-slate-500 text-xs mt-2">Server Name</p>
          </div>

          {/* Players Card */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-semibold">PLAYERS</h3>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">
              {stats.playerCount}/{stats.maxPlayers}
            </p>
            <p className="text-slate-500 text-xs mt-2">Online Players</p>
          </div>

          {/* Uptime Card */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-semibold">UPTIME</h3>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">{formatUptime(stats.uptime)}</p>
            <p className="text-slate-500 text-xs mt-2">Server Uptime</p>
          </div>
        </div>

        {/* TPS Card (if available) */}
        {stats.tps !== undefined && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
            <h3 className="text-slate-400 text-sm font-semibold mb-2">TPS (Ticks Per Second)</h3>
            <p className="text-3xl font-bold text-green-500">{stats.tps.toFixed(2)}</p>
          </div>
        )}

        {/* Console/Command Execution */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="bg-slate-900 px-6 py-4 border-b border-slate-700 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold">Console</h2>
          </div>

          {/* Terminal Output */}
          <div className="bg-black p-6 h-64 overflow-y-auto font-mono text-sm">
            {commandHistory.length === 0 ? (
              <p className="text-slate-600">Ready for commands...</p>
            ) : (
              commandHistory.map((line, idx) => (
                <div key={idx} className="text-green-400 mb-1">
                  {line}
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Feedback Message */}
          {feedback && (
            <div
              className={`px-6 py-3 border-t border-slate-700 ${
                feedback.success ? 'bg-green-900' : 'bg-red-900'
              }`}
            >
              <p
                className={`text-sm ${
                  feedback.success ? 'text-green-200' : 'text-red-200'
                }`}
              >
                {feedback.success ? '✓' : '✗'} {feedback.message}
              </p>
            </div>
          )}

          {/* Command Input Form */}
          <form
            onSubmit={executeCommand}
            className="bg-slate-900 px-6 py-4 border-t border-slate-700 flex gap-2"
          >
            <span className="text-green-400 font-mono">$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Enter command..."
              disabled={isExecuting}
              className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none font-mono text-sm"
            />
            <button
              type="submit"
              disabled={isExecuting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 rounded font-semibold text-sm transition"
            >
              {isExecuting ? 'Executing...' : 'Execute'}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-slate-500 text-xs text-center">
          <p>Last updated: {new Date().toLocaleTimeString()}</p>
          <p>Auto-refreshing every 5 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;