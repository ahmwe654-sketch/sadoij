export type UserRole = 'Owner' | 'Admin' | 'Moderator';

export type NavTab = 
  | 'dashboard' 
  | 'players' 
  | 'mods-worlds' 
  | 'console' 
  | 'chat' 
  | 'teleport' 
  | 'deaths' 
  | 'scheduler' 
  | 'files' 
  | 'settings';

export interface ServerStatus {
  name: string;
  motd: string;
  online: boolean;
  version: string;
  software: string;
  ip: string;
  port: number;
  playersOnline: number;
  maxPlayers: number;
  tps: number;
  cpuPercent: number;
  ramUsedMB: number;
  ramTotalMB: number;
  uptimeSeconds: number;
  ping: number;
  whitelistEnabled: boolean;
  autoBackupEnabled: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  count: number;
  icon: string;
  enchantments?: string[];
  durability?: number; // 0-100%
}

export interface PlayerInventory {
  hotbar: (InventoryItem | null)[];
  main: (InventoryItem | null)[];
  armor: {
    helmet: InventoryItem | null;
    chestplate: InventoryItem | null;
    leggings: InventoryItem | null;
    boots: InventoryItem | null;
  };
  offhand: InventoryItem | null;
}

export interface Player {
  uuid: string;
  username: string;
  online: boolean;
  isOp: boolean;
  isBanned: boolean;
  gamemode: 'survival' | 'creative' | 'spectator' | 'adventure';
  health: number; // 0 to 20
  food: number; // 0 to 20
  ping: number;
  x: number;
  y: number;
  z: number;
  dimension: 'world' | 'world_nether' | 'world_the_end';
  lastDeath: {
    x: number;
    y: number;
    z: number;
    dimension: string;
    timeAgo: string;
  };
  playTimeHours: number;
  lastSeen: string;
  inventory?: PlayerInventory;
}

export interface ModItem {
  id: string;
  name: string;
  filename: string;
  version: string;
  sizeMB: number;
  enabled: boolean;
  type: 'plugin' | 'mod';
  uploadDate: string;
  author: string;
}

export interface BackupItem {
  id: string;
  name: string;
  sizeMB: number;
  date: string;
  status: 'Healthy' | 'Archived';
  worldSizeMB: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'CHAT';
  message: string;
}

export interface ChatMessage {
  id: string;
  timestamp: string;
  sender: string;
  avatar: string;
  role: string;
  message: string;
  isSystem?: boolean;
}

export interface DeathRecord {
  id: string;
  player: string;
  event: string;
  cause: string;
  killer: string;
  world: string;
  coords: { x: number; y: number; z: number };
  timestamp: string;
  itemsLostCount: number;
}

export interface RestartSchedule {
  id: string;
  time: string; // e.g. "04:00"
  days: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  enabled: boolean;
  warnings: number[]; // e.g. [30, 10, 5, 1] (minutes)
  customMessage: string;
}

export interface BroadcastItem {
  id: string;
  message: string;
  intervalMinutes: number;
  enabled: boolean;
  prefix: string;
}

export interface ServerFileItem {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  sizeKB: number;
  lastModified: string;
  isProtected?: boolean;
  content?: string;
}

export interface ServerConfigSettings {
  serverName: string;
  motd: string;
  maxPlayers: number;
  viewDistance: number;
  simulationDistance: number;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  defaultGamemode: 'survival' | 'creative' | 'adventure' | 'spectator';
  pvp: boolean;
  commandBlocks: boolean;
  onlineMode: boolean;
  whitelist: boolean;
  allowFlight: boolean;
  spawnMonsters: boolean;
  spawnAnimals: boolean;
  allowNether: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => Promise<void> | void;
}
