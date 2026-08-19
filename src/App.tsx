import React, { useState, useEffect } from 'react';
import {
  NavTab,
  UserRole,
  ServerStatus,
  Player,
  ModItem,
  BackupItem,
  LogEntry,
  ChatMessage,
  DeathRecord,
  RestartSchedule,
  BroadcastItem,
  ServerFileItem,
  ServerConfigSettings,
  ToastMessage,
  ModalState
} from './types';

import {
  initialServerStatus,
  initialPlayers,
  initialMods,
  initialBackups,
  initialLogs,
  initialChat,
  initialDeaths,
  initialSchedules,
  initialBroadcasts,
  initialFiles,
  initialConfigSettings,
  sendCommandAPI
} from './data/mockData';

import { sound } from './utils/sound';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { PlayersView } from './components/PlayersView';
import { ModsWorldsView } from './components/ModsWorldsView';
import { ConsoleView } from './components/ConsoleView';
import { ChatView } from './components/ChatView';
import { TeleportView } from './components/TeleportView';
import { DeathHistoryView } from './components/DeathHistoryView';
import { SchedulerView } from './components/SchedulerView';
import { FileManagerView } from './components/FileManagerView';
import { SettingsView } from './components/SettingsView';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/ToastContainer';
import { ApiBridgeModal } from './components/ApiBridgeModal';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('Owner');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isApiBridgeOpen, setIsApiBridgeOpen] = useState(false);

  // Core Data States
  const [serverStatus, setServerStatus] = useState<ServerStatus>(initialServerStatus);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [mods, setMods] = useState<ModItem[]>(initialMods);
  const [backups, setBackups] = useState<BackupItem[]>(initialBackups);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChat);
  const [deaths, setDeaths] = useState<DeathRecord[]>(initialDeaths);
  const [schedules, setSchedules] = useState<RestartSchedule[]>(initialSchedules);
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>(initialBroadcasts);
  const [files, setFiles] = useState<ServerFileItem[]>(initialFiles);
  const [settings, setSettings] = useState<ServerConfigSettings>(initialConfigSettings);

  // Notification Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [allRecentNotifications, setAllRecentNotifications] = useState<ToastMessage[]>([
    { id: '1', type: 'success', title: 'Server Online', message: 'Paper-MC daemon running on port 25565' },
    { id: '2', type: 'info', title: 'Auto-Backup Healthy', message: 'Daily snapshot completed at 04:00 AM' }
  ]);

  // Modals & Action loading
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isIpCopied, setIsIpCopied] = useState(false);

  // Toggle Audio Mute
  const handleToggleAudio = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    sound.enabled = !nextState;
    if (!nextState) {
      sound.playClick();
    }
  };

  // Helper to add toast with sound FX
  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    if (type === 'success') sound.playSuccess();
    else if (type === 'error' || type === 'warning') sound.playAlert();
    else sound.playClick();

    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
    setAllRecentNotifications((prev) => [newToast, ...prev.slice(0, 15)]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Periodic simulated live ticks
  useEffect(() => {
    const interval = setInterval(() => {
      if (!serverStatus.online) return;

      setServerStatus((prev) => {
        const cpuJitter = +(prev.cpuPercent + (Math.random() * 4 - 2)).toFixed(1);
        const ramJitter = Math.min(
          prev.ramTotalMB,
          Math.max(4000, Math.round(prev.ramUsedMB + (Math.random() * 80 - 40)))
        );
        const tpsJitter = +(19.95 + Math.random() * 0.05).toFixed(2);

        return {
          ...prev,
          cpuPercent: Math.max(12, Math.min(85, cpuJitter)),
          ramUsedMB: ramJitter,
          tps: Math.min(20.0, tpsJitter),
          uptimeSeconds: prev.uptimeSeconds + 3,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [serverStatus.online]);

  // Copy IP handler
  const handleCopyIp = () => {
    navigator.clipboard.writeText(`${serverStatus.ip}:${serverStatus.port}`);
    setIsIpCopied(true);
    addToast('info', 'IP Copied to Clipboard', `${serverStatus.ip}:${serverStatus.port}`);
    setTimeout(() => setIsIpCopied(false), 2500);
  };

  // Server Action Handlers
  const handleStartServer = async () => {
    setIsLoadingAction(true);
    addToast('info', 'Booting Server', 'Allocating memory & starting Paper daemon...');
    
    setTimeout(() => {
      setServerStatus((prev) => ({ ...prev, online: true, playersOnline: 4 }));
      setIsLoadingAction(false);
      addToast('success', 'Server Started', 'Minecraft Java Server is now accepting player connections.');
      setLogs((prev) => [
        ...prev,
        { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Paper server initialized in 3.8s' }
      ]);
    }, 1500);
  };

  const handleStopServer = () => {
    setModalState({
      isOpen: true,
      title: 'Stop Minecraft Server?',
      description: 'All active players will be disconnected and world chunks will be saved to disk. Are you sure you want to stop the server?',
      confirmText: 'Stop Server Now',
      isDanger: true,
      onConfirm: async () => {
        setIsLoadingAction(true);
        setModalState((prev) => ({ ...prev, isOpen: false }));
        addToast('warning', 'Stopping Server', 'Saving chunks and disconnecting players...');

        setTimeout(() => {
          setServerStatus((prev) => ({ ...prev, online: false, playersOnline: 0 }));
          setIsLoadingAction(false);
          addToast('error', 'Server Offline', 'Minecraft server process has stopped.');
          setLogs((prev) => [
            ...prev,
            { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), level: 'WARN', message: 'Server stopped gracefully by administrator' }
          ]);
        }, 1200);
      },
    });
  };

  const handleRestartServer = () => {
    setModalState({
      isOpen: true,
      title: 'Restart Server Process?',
      description: 'This will initiate a graceful restart. Active players will experience a brief 10-second reconnection window.',
      confirmText: 'Restart Process',
      isDanger: true,
      onConfirm: async () => {
        setIsLoadingAction(true);
        setModalState((prev) => ({ ...prev, isOpen: false }));
        addToast('info', 'Restarting Process', 'Flushing cache and rebooting server...');

        setTimeout(() => {
          setIsLoadingAction(false);
          addToast('success', 'Restart Complete', 'Server restarted successfully and TPS is optimal.');
          setLogs((prev) => [
            ...prev,
            { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Server restart sequence completed cleanly' }
          ]);
        }, 1800);
      },
    });
  };

  const handleSaveWorld = () => {
    addToast('info', 'Saving World Chunks', 'Flushing all dirty chunk blocks to disk...');
    setTimeout(() => {
      addToast('success', 'World Saved', 'Dimensions "world", "world_nether", "world_the_end" written safely.');
      setLogs((prev) => [
        ...prev,
        { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Forced world save: all 3 dimensions flushed to disk.' }
      ]);
    }, 600);
  };

  const handleClearLag = () => {
    const removedCount = Math.floor(Math.random() * 80 + 35);
    addToast('success', 'Entities Cleared', `Successfully purged ${removedCount} dropped item entities.`);
    setLogs((prev) => [
      ...prev,
      { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: `[ClearLag] Removed ${removedCount} item entities from memory.` }
    ]);
  };

  const handleToggleWhitelist = () => {
    const newState = !serverStatus.whitelistEnabled;
    setServerStatus((prev) => ({ ...prev, whitelistEnabled: newState }));
    addToast('info', 'Whitelist Updated', `Server whitelist is now ${newState ? 'Enabled' : 'Disabled'}.`);
  };

  const handleQuickBroadcast = (msg: string) => {
    const formatted = `[ANNOUNCEMENT] ${msg}`;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        sender: 'CONSOLE',
        avatar: 'https://mc-heads.net/avatar/MHF_Chest/48',
        role: 'System',
        message: formatted,
        isSystem: true
      }
    ]);
    addToast('success', 'Broadcast Sent', `"${msg}" sent to in-game chat.`);
  };

  // Add / Whitelist Player
  const handleAddPlayer = (username: string) => {
    const newP: Player = {
      uuid: Math.random().toString(36).substring(2, 12),
      username,
      ping: 24,
      online: false,
      isOp: false,
      isBanned: false,
      playTimeHours: 0,
      health: 20,
      food: 20,
      gamemode: 'survival',
      x: 0,
      y: 64,
      z: 0,
      dimension: 'world',
      lastDeath: {
        x: 0,
        y: 64,
        z: 0,
        dimension: 'world',
        timeAgo: 'Never'
      },
      lastSeen: 'Registered',
      inventory: {
        armor: { helmet: null, chestplate: null, leggings: null, boots: null },
        offhand: null,
        hotbar: [],
        main: []
      }
    };
    setPlayers((prev) => [newP, ...prev]);
    addToast('success', 'Player Whitelisted', `Added ${username} to server player database.`);
  };

  // Player Actions
  const handlePlayerAction = (action: string, player: Player) => {
    if (action === 'kick') {
      setModalState({
        isOpen: true,
        title: `Kick ${player.username}?`,
        description: `Are you sure you want to disconnect ${player.username} from the server?`,
        confirmText: 'Kick Player',
        isDanger: true,
        onConfirm: () => {
          setPlayers((prev) =>
            prev.map((p) => (p.uuid === player.uuid ? { ...p, online: false, lastSeen: 'Just now' } : p))
          );
          setServerStatus((prev) => ({ ...prev, playersOnline: Math.max(0, prev.playersOnline - 1) }));
          setModalState((prev) => ({ ...prev, isOpen: false }));
          addToast('warning', 'Player Disconnected', `${player.username} was kicked from the server.`);
        },
      });
    } else if (action === 'ban') {
      const isCurrentlyBanned = player.isBanned;
      setModalState({
        isOpen: true,
        title: isCurrentlyBanned ? `Unban ${player.username}?` : `Ban ${player.username}?`,
        description: isCurrentlyBanned
          ? `Allow ${player.username} to rejoin the server?`
          : `Prevent ${player.username} from joining the server permanently?`,
        confirmText: isCurrentlyBanned ? 'Unban Player' : 'Ban Player',
        isDanger: !isCurrentlyBanned,
        onConfirm: () => {
          setPlayers((prev) =>
            prev.map((p) =>
              p.uuid === player.uuid
                ? { ...p, isBanned: !isCurrentlyBanned, online: false, lastSeen: 'Banned' }
                : p
            )
          );
          if (!isCurrentlyBanned && player.online) {
            setServerStatus((prev) => ({ ...prev, playersOnline: Math.max(0, prev.playersOnline - 1) }));
          }
          setModalState((prev) => ({ ...prev, isOpen: false }));
          addToast(
            isCurrentlyBanned ? 'success' : 'error',
            isCurrentlyBanned ? 'Player Unbanned' : 'Player Banned',
            `${player.username} ban status updated.`
          );
        },
      });
    } else if (action === 'toggle_op') {
      setPlayers((prev) =>
        prev.map((p) => (p.uuid === player.uuid ? { ...p, isOp: !p.isOp } : p))
      );
      addToast('info', 'Operator Status Changed', `${player.username} is ${!player.isOp ? 'now an OP' : 'no longer an OP'}.`);
    } else if (action === 'set_survival') {
      setPlayers((prev) =>
        prev.map((p) => (p.uuid === player.uuid ? { ...p, gamemode: 'survival' } : p))
      );
      addToast('success', 'Gamemode Changed', `Set ${player.username} to Survival Mode.`);
    } else if (action === 'set_creative') {
      setPlayers((prev) =>
        prev.map((p) => (p.uuid === player.uuid ? { ...p, gamemode: 'creative' } : p))
      );
      addToast('success', 'Gamemode Changed', `Set ${player.username} to Creative Mode.`);
    } else if (action === 'heal') {
      setPlayers((prev) =>
        prev.map((p) => (p.uuid === player.uuid ? { ...p, health: 20, food: 20 } : p))
      );
      addToast('success', 'Player Restored', `Restored ${player.username} to 20/20 Health and Food.`);
    }
  };

  const handleTeleportToPlayer = (player: Player) => {
    addToast('info', 'Teleporting Admin', `Transported your camera to ${player.username} at (${player.x}, ${player.y}, ${player.z}).`);
  };

  // Console Execution
  const handleSendCommand = async (command: string) => {
    sound.playTerminal();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [
      ...prev,
      { id: Math.random().toString(), timestamp, level: 'INFO', message: `> ${command}` }
    ]);

    const res = await sendCommandAPI(command);
    setLogs((prev) => [
      ...prev,
      { id: Math.random().toString(), timestamp, level: 'SUCCESS', message: res.response }
    ]);
  };

  // Chat Sender
  const handleSendChatMessage = (msg: string, senderName: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        timestamp,
        sender: senderName,
        avatar: senderName === 'CONSOLE' ? 'https://mc-heads.net/avatar/MHF_Chest/48' : 'https://mc-heads.net/avatar/Steve_Crafter/48',
        role: userRole,
        message: msg,
      }
    ]);
    addToast('success', 'Message Broadcasted', `Sent into in-game world chat as ${senderName}`);
  };

  // Teleport Handlers
  const handleExecuteTeleport = async (source: string, target: string, isCoords: boolean) => {
    setIsLoadingAction(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoadingAction(false);

    if (isCoords) {
      addToast('success', 'Teleport Successful', `Teleported ${source} to coordinates (${target}).`);
    } else {
      addToast('success', 'Teleport Successful', `Teleported ${source} directly to ${target}.`);
    }
  };

  // Mods & Backup Handlers
  const handleToggleMod = (id: string) => {
    setMods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
    const target = mods.find((m) => m.id === id);
    addToast('info', 'Plugin Status Updated', `${target?.name} is now ${!target?.enabled ? 'enabled' : 'disabled'}.`);
  };

  const handleDeleteMod = (mod: ModItem) => {
    setModalState({
      isOpen: true,
      title: `Delete ${mod.name}?`,
      description: `This will remove ${mod.filename} (${mod.sizeMB} MB) from the /plugins directory.`,
      confirmText: 'Delete Plugin File',
      isDanger: true,
      onConfirm: () => {
        setMods((prev) => prev.filter((m) => m.id !== mod.id));
        setModalState((prev) => ({ ...prev, isOpen: false }));
        addToast('error', 'Plugin Removed', `${mod.name} has been deleted.`);
      },
    });
  };

  const handleUploadMod = (file: File) => {
    const newMod: ModItem = {
      id: Math.random().toString(),
      name: file.name.replace('.jar', ''),
      filename: file.name,
      version: '1.0.0',
      sizeMB: +(file.size / (1024 * 1024)).toFixed(1),
      enabled: true,
      type: 'plugin',
      uploadDate: new Date().toISOString().split('T')[0],
      author: 'Uploaded File'
    };
    setMods((prev) => [newMod, ...prev]);
    addToast('success', 'Plugin Uploaded', `Successfully installed ${file.name} to /plugins`);
  };

  const handleCreateBackup = async () => {
    setIsLoadingAction(true);
    addToast('info', 'Creating Snapshot', 'Compressing world dimensions and playerdata...');
    
    setTimeout(() => {
      const dateStr = new Date().toISOString().replace('T', '_').substring(0, 16);
      const newB: BackupItem = {
        id: Math.random().toString(),
        name: `Manual_Snapshot_${dateStr}`,
        sizeMB: 1410,
        date: new Date().toLocaleString(),
        status: 'Healthy',
        worldSizeMB: 1280
      };
      setBackups((prev) => [newB, ...prev]);
      setIsLoadingAction(false);
      addToast('success', 'Backup Complete', 'Compressed world snapshot created safely.');
    }, 1500);
  };

  const handleRestoreBackup = (b: BackupItem) => {
    setModalState({
      isOpen: true,
      title: `Restore from ${b.name}?`,
      description: `WARNING: This will replace the active /world filesystem with the snapshot from ${b.date}. Current unsaved world state will be overwritten!`,
      confirmText: 'Restore Snapshot',
      isDanger: true,
      onConfirm: async () => {
        setIsLoadingAction(true);
        setModalState((prev) => ({ ...prev, isOpen: false }));
        addToast('warning', 'Restoring World', 'Extracting snapshot archive to /world...');

        setTimeout(() => {
          setIsLoadingAction(false);
          addToast('success', 'World Restored', `Active world restored to state from ${b.date}.`);
        }, 1600);
      },
    });
  };

  const handleDeleteBackup = (b: BackupItem) => {
    setModalState({
      isOpen: true,
      title: `Delete Backup Archive?`,
      description: `Are you sure you want to permanently delete ${b.name}.tar.gz (${b.sizeMB} MB)?`,
      confirmText: 'Delete Archive',
      isDanger: true,
      onConfirm: () => {
        setBackups((prev) => prev.filter((item) => item.id !== b.id));
        setModalState((prev) => ({ ...prev, isOpen: false }));
        addToast('error', 'Backup Deleted', 'Snapshot removed from disk storage.');
      },
    });
  };

  // Schedule & Broadcast Handlers
  const handleToggleSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    addToast('info', 'Schedule Removed', 'Restart cron rule deleted.');
  };

  const handleAddSchedule = (s: Omit<RestartSchedule, 'id'>) => {
    const newSchedule: RestartSchedule = { ...s, id: Math.random().toString() };
    setSchedules((prev) => [...prev, newSchedule]);
    addToast('success', 'Schedule Configured', `Server will automatically reboot at ${s.time}.`);
  };

  const handleToggleBroadcast = (id: string) => {
    setBroadcasts((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  };

  const handleDeleteBroadcast = (id: string) => {
    setBroadcasts((prev) => prev.filter((b) => b.id !== id));
    addToast('info', 'Broadcast Removed', 'Auto-message rule deleted.');
  };

  const handleAddBroadcast = (b: Omit<BroadcastItem, 'id'>) => {
    const newBc: BroadcastItem = { ...b, id: Math.random().toString() };
    setBroadcasts((prev) => [...prev, newBc]);
    addToast('success', 'Broadcast Created', `Message will display every ${b.intervalMinutes} minutes.`);
  };

  // Files & Settings Handlers
  const handleSaveFile = (file: ServerFileItem, content: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, content, lastModified: 'Just now' } : f))
    );
    addToast('success', 'File Saved', `Successfully updated ${file.name}`);
  };

  const handleDeleteFile = (file: ServerFileItem) => {
    setModalState({
      isOpen: true,
      title: `Delete ${file.name}?`,
      description: file.isProtected
        ? `CAUTION: ${file.name} is a critical server configuration file. Deleting it may cause server boot failures.`
        : `Are you sure you want to permanently delete this item?`,
      confirmText: 'Delete File',
      isDanger: true,
      onConfirm: () => {
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
        setModalState((prev) => ({ ...prev, isOpen: false }));
        addToast('error', 'File Removed', `${file.name} deleted from server.`);
      },
    });
  };

  const handleSaveSettings = async (newSettings: ServerConfigSettings) => {
    setIsLoadingAction(true);
    await new Promise((r) => setTimeout(r, 600));
    setSettings(newSettings);
    setServerStatus((prev) => ({
      ...prev,
      name: newSettings.serverName,
      motd: newSettings.motd,
      maxPlayers: newSettings.maxPlayers,
      whitelistEnabled: newSettings.whitelist,
    }));
    setIsLoadingAction(false);
    addToast('success', 'Settings Synchronized', 'Updated server.properties and reloaded runtime variables.');
  };

  return (
    <div className="flex h-screen w-full bg-[#050608] text-slate-200 font-sans overflow-hidden relative selection:bg-emerald-500 selection:text-black">
      {/* 1. Cinematic Welcome Splash Screen */}
      {showWelcome && (
        <WelcomeScreen
          serverName={serverStatus.name}
          isOnline={serverStatus.online}
          onFinish={() => setShowWelcome(false)}
        />
      )}

      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-violet-600/[0.05] rounded-full blur-[170px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        userRole={userRole}
        onRoleChange={setUserRole}
        isOnline={serverStatus.online}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        onOpenApiBridge={() => setIsApiBridgeOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Bar */}
        <TopBar
          serverStatus={serverStatus}
          userRole={userRole}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          recentNotifications={allRecentNotifications}
          onClearNotifications={() => setAllRecentNotifications([])}
          onCopyIp={handleCopyIp}
          isCopied={isIpCopied}
          onOpenApiBridge={() => setIsApiBridgeOpen(true)}
          isAudioMuted={isAudioMuted}
          onToggleAudio={handleToggleAudio}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto pb-16">
            {currentTab === 'dashboard' && (
              <DashboardView
                serverStatus={serverStatus}
                userRole={userRole}
                onStartServer={handleStartServer}
                onStopServer={handleStopServer}
                onRestartServer={handleRestartServer}
                onSaveWorld={handleSaveWorld}
                onClearLag={handleClearLag}
                onToggleWhitelist={handleToggleWhitelist}
                onQuickBroadcast={handleQuickBroadcast}
                isLoadingAction={isLoadingAction}
                onNavigateTab={(tab) => setCurrentTab(tab as NavTab)}
              />
            )}

            {currentTab === 'players' && (
              <PlayersView
                players={players}
                userRole={userRole}
                onPlayerAction={handlePlayerAction}
                onTeleportToPlayer={handleTeleportToPlayer}
                onAddPlayer={handleAddPlayer}
              />
            )}

            {currentTab === 'mods-worlds' && (
              <ModsWorldsView
                mods={mods}
                backups={backups}
                userRole={userRole}
                onToggleMod={handleToggleMod}
                onDeleteMod={handleDeleteMod}
                onUploadMod={handleUploadMod}
                onCreateBackup={handleCreateBackup}
                onRestoreBackup={handleRestoreBackup}
                onDeleteBackup={handleDeleteBackup}
                isLoadingBackup={isLoadingAction}
              />
            )}

            {currentTab === 'console' && (
              <ConsoleView
                logs={logs}
                userRole={userRole}
                onSendCommand={handleSendCommand}
                onClearLogs={() => setLogs([])}
              />
            )}

            {currentTab === 'chat' && (
              <ChatView
                chatMessages={chatMessages}
                userRole={userRole}
                onSendChatMessage={handleSendChatMessage}
                onClearChat={() => setChatMessages([])}
              />
            )}

            {currentTab === 'teleport' && (
              <TeleportView
                players={players}
                userRole={userRole}
                onExecuteTeleport={handleExecuteTeleport}
                isLoading={isLoadingAction}
              />
            )}

            {currentTab === 'deaths' && (
              <DeathHistoryView
                deaths={deaths}
                userRole={userRole}
              />
            )}

            {currentTab === 'scheduler' && (
              <SchedulerView
                schedules={schedules}
                broadcasts={broadcasts}
                userRole={userRole}
                onToggleSchedule={handleToggleSchedule}
                onDeleteSchedule={handleDeleteSchedule}
                onAddSchedule={handleAddSchedule}
                onToggleBroadcast={handleToggleBroadcast}
                onDeleteBroadcast={handleDeleteBroadcast}
                onAddBroadcast={handleAddBroadcast}
              />
            )}

            {currentTab === 'files' && (
              <FileManagerView
                files={files}
                userRole={userRole}
                onSaveFile={handleSaveFile}
                onDeleteFile={handleDeleteFile}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                settings={settings}
                userRole={userRole}
                onSaveSettings={handleSaveSettings}
                isLoading={isLoadingAction}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Confirmation Modal */}
      <ConfirmModal
        modalState={modalState}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        isLoading={isLoadingAction}
      />

      {/* Real Backend & RCON Integration Guide Modal */}
      <ApiBridgeModal
        isOpen={isApiBridgeOpen}
        onClose={() => setIsApiBridgeOpen(false)}
      />

      {/* Global Toast Notification System */}
      <ToastContainer
        toasts={toasts}
        onDismiss={removeToast}
      />
    </div>
  );
}
