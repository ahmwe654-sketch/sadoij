import {
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
  PlayerInventory
} from '../types';

export const initialServerStatus: ServerStatus = {
  name: 'Valkyrie SMP',
  motd: '§a§lValkyrie §fNetwork §7- §bSeason 4 §6[1.20.4] §e★ Join Today ★',
  online: true,
  version: '1.20.4',
  software: 'Paper-MC (Build #342)',
  ip: 'play.valkyriemc.net',
  port: 25565,
  playersOnline: 8,
  maxPlayers: 50,
  tps: 19.98,
  cpuPercent: 28.4,
  ramUsedMB: 6840,
  ramTotalMB: 16384,
  uptimeSeconds: 1248920,
  ping: 18,
  whitelistEnabled: true,
  autoBackupEnabled: true,
};

const sampleInventory: PlayerInventory = {
  hotbar: [
    { id: '1', name: 'Netherite Sword', count: 1, icon: '⚔️', enchantments: ['Sharpness V', 'Unbreaking III', 'Mending', 'Looting III'] },
    { id: '2', name: 'Netherite Pickaxe', count: 1, icon: '⛏️', enchantments: ['Efficiency V', 'Fortune III', 'Unbreaking III'] },
    { id: '3', name: 'Netherite Axe', count: 1, icon: '🪓', enchantments: ['Efficiency V', 'Silk Touch'] },
    { id: '4', name: 'Golden Apple', count: 32, icon: '🍏' },
    { id: '5', name: 'Cooked Beef', count: 64, icon: '🥩' },
    { id: '6', name: 'Ender Pearl', count: 16, icon: '🔮' },
    { id: '7', name: 'Totem of Undying', count: 1, icon: '🗿' },
    { id: '8', name: 'Water Bucket', count: 1, icon: '🪣' },
    { id: '9', name: 'Firework Rocket', count: 64, icon: '🎆' },
  ],
  main: [
    { id: '10', name: 'Diamond Block', count: 48, icon: '💎' },
    { id: '11', name: 'Netherite Ingot', count: 6, icon: '⬛' },
    { id: '12', name: 'Shulker Box (Black)', count: 1, icon: '📦' },
    { id: '13', name: 'Elytra', count: 1, icon: '🪽', enchantments: ['Unbreaking III', 'Mending'] },
    { id: '14', name: 'Obsidian', count: 64, icon: '🪨' },
    { id: '15', name: 'Anvil', count: 1, icon: '🛠️' },
    { id: '16', name: 'Oak Log', count: 64, icon: '🪵' },
    { id: '17', name: 'Enchanted Book', count: 1, icon: '📖', enchantments: ['Protection IV'] },
    { id: '18', name: 'Cobblestone', count: 64, icon: '🧱' },
    { id: '19', name: 'Experience Bottle', count: 32, icon: '🧪' },
    { id: '20', name: 'Torch', count: 64, icon: '🕯️' },
    { id: '21', name: 'Chest', count: 16, icon: '🧰' },
    null, null, null, null, null, null, null, null, null, null, null, null, null, null, null
  ],
  armor: {
    helmet: { id: 'a1', name: 'Netherite Helmet', count: 1, icon: '🪖', enchantments: ['Protection IV', 'Respiration III', 'Aqua Affinity', 'Mending'] },
    chestplate: { id: 'a2', name: 'Netherite Chestplate', count: 1, icon: '🥋', enchantments: ['Protection IV', 'Unbreaking III', 'Mending'] },
    leggings: { id: 'a3', name: 'Netherite Leggings', count: 1, icon: '👖', enchantments: ['Protection IV', 'Swift Sneak III', 'Mending'] },
    boots: { id: 'a4', name: 'Netherite Boots', count: 1, icon: '🥾', enchantments: ['Protection IV', 'Feather Falling IV', 'Soul Speed III', 'Depth Strider III'] },
  },
  offhand: { id: 'off1', name: 'Totem of Undying', count: 1, icon: '🗿' }
};

export const initialPlayers: Player[] = [
  {
    uuid: 'c06f8906-4c3e-463c-99d7-5645367809a1',
    username: 'Steve_Crafter',
    online: true,
    isOp: true,
    isBanned: false,
    gamemode: 'survival',
    health: 20,
    food: 20,
    ping: 24,
    x: 1420,
    y: 72,
    z: -380,
    dimension: 'world',
    lastDeath: { x: 1200, y: 14, z: -450, dimension: 'world_nether', timeAgo: '2h ago' },
    playTimeHours: 248,
    lastSeen: 'Now',
    inventory: sampleInventory,
  },
  {
    uuid: '853c80ef-3c37-49fd-aa49-938b674adae6',
    username: 'Alex_Archer',
    online: true,
    isOp: false,
    isBanned: false,
    gamemode: 'survival',
    health: 16,
    food: 18,
    ping: 42,
    x: -890,
    y: 64,
    z: 1240,
    dimension: 'world',
    lastDeath: { x: -850, y: 32, z: 1200, dimension: 'world', timeAgo: '1d ago' },
    playTimeHours: 164,
    lastSeen: 'Now',
    inventory: sampleInventory,
  },
  {
    uuid: '3a216b2a-6058-450a-9d96-039c336b9550',
    username: 'ShadowNinja99',
    online: true,
    isOp: false,
    isBanned: false,
    gamemode: 'survival',
    health: 8,
    food: 12,
    ping: 58,
    x: 340,
    y: -42,
    z: 88,
    dimension: 'world',
    lastDeath: { x: 320, y: -48, z: 90, dimension: 'world', timeAgo: '15m ago' },
    playTimeHours: 92,
    lastSeen: 'Now',
    inventory: sampleInventory,
  },
  {
    uuid: '9e7b2938-e659-45ad-bc9b-1175653b6fa0',
    username: 'RedstoneWizard',
    online: true,
    isOp: true,
    isBanned: false,
    gamemode: 'creative',
    health: 20,
    food: 20,
    ping: 19,
    x: 0,
    y: 80,
    z: 0,
    dimension: 'world',
    lastDeath: { x: 0, y: 64, z: 0, dimension: 'world', timeAgo: '5d ago' },
    playTimeHours: 410,
    lastSeen: 'Now',
    inventory: sampleInventory,
  },
  {
    uuid: '1e5a8421-4f81-42cb-b1b0-2b1d3d687444',
    username: 'Frost_Knight',
    online: true,
    isOp: false,
    isBanned: false,
    gamemode: 'survival',
    health: 19,
    food: 15,
    ping: 35,
    x: 210,
    y: 110,
    z: -1450,
    dimension: 'world_nether',
    lastDeath: { x: 190, y: 70, z: -1400, dimension: 'world_nether', timeAgo: '4h ago' },
    playTimeHours: 135,
    lastSeen: 'Now',
    inventory: sampleInventory,
  },
  {
    uuid: '710b777a-4ecb-4395-9ffb-5b5cb88421ab',
    username: 'NetherHunter',
    online: true,
    isOp: false,
    isBanned: false,
    gamemode: 'survival',
    health: 14,
    food: 19,
    ping: 48,
    x: 540,
    y: 58,
    z: -320,
    dimension: 'world_nether',
    lastDeath: { x: 500, y: 40, z: -300, dimension: 'world_nether', timeAgo: '30m ago' },
    playTimeHours: 78,
    lastSeen: 'Now',
    inventory: sampleInventory,
  },
  {
    uuid: '2b4c6e8a-1a2b-4c3d-8e9f-0a1b2c3d4e5f',
    username: 'EnderQueen',
    online: true,
    isOp: false,
    isBanned: false,
    gamemode: 'survival',
    health: 20,
    food: 20,
    ping: 22,
    x: 100,
    y: 49,
    z: 0,
    dimension: 'world_the_end',
    lastDeath: { x: 100, y: 20, z: 0, dimension: 'world_the_end', timeAgo: '3d ago' },
    playTimeHours: 320,
    lastSeen: 'Now',
    inventory: sampleInventory,
  },
  {
    uuid: '5f4e3d2c-1b0a-9f8e-7d6c-5b4a3a2b1c0d',
    username: 'PixelMiner',
    online: true,
    isOp: false,
    isBanned: false,
    gamemode: 'survival',
    health: 12,
    food: 14,
    ping: 65,
    x: -450,
    y: 12,
    z: 620,
    dimension: 'world',
    lastDeath: { x: -440, y: 11, z: 610, dimension: 'world', timeAgo: '6h ago' },
    playTimeHours: 54,
    lastSeen: 'Now',
    inventory: sampleInventory,
  },
  {
    uuid: '99887766-5544-3322-1100-aabbccddeeff',
    username: 'Troll_Griefer',
    online: false,
    isOp: false,
    isBanned: true,
    gamemode: 'survival',
    health: 0,
    food: 0,
    ping: 0,
    x: 0,
    y: 0,
    z: 0,
    dimension: 'world',
    lastDeath: { x: 120, y: 64, z: 20, dimension: 'world', timeAgo: '12d ago' },
    playTimeHours: 12,
    lastSeen: '12 days ago',
    inventory: sampleInventory,
  },
  {
    uuid: '11223344-5566-7788-9900-aabbccddeeff',
    username: 'Casual_Builder',
    online: false,
    isOp: false,
    isBanned: false,
    gamemode: 'survival',
    health: 20,
    food: 19,
    ping: 0,
    x: -1200,
    y: 68,
    z: -800,
    dimension: 'world',
    lastDeath: { x: -1150, y: 60, z: -780, dimension: 'world', timeAgo: '2d ago' },
    playTimeHours: 180,
    lastSeen: '3 hours ago',
    inventory: sampleInventory,
  }
];

export const initialMods: ModItem[] = [
  { id: '1', name: 'EssentialsX', filename: 'EssentialsX-2.20.1.jar', version: '2.20.1', sizeMB: 4.8, enabled: true, type: 'plugin', uploadDate: '2026-08-10', author: 'EssentialsX Team' },
  { id: '2', name: 'CoreProtect', filename: 'CoreProtect-22.2.jar', version: '22.2', sizeMB: 3.2, enabled: true, type: 'plugin', uploadDate: '2026-08-12', author: 'Intelli' },
  { id: '3', name: 'WorldEdit', filename: 'worldedit-bukkit-7.2.15.jar', version: '7.2.15', sizeMB: 5.6, enabled: true, type: 'plugin', uploadDate: '2026-08-01', author: 'EngineHub' },
  { id: '4', name: 'Vault', filename: 'Vault-1.7.3.jar', version: '1.7.3', sizeMB: 0.4, enabled: true, type: 'plugin', uploadDate: '2026-07-28', author: 'Sleakes' },
  { id: '5', name: 'LuckPerms', filename: 'LuckPerms-Bukkit-5.4.102.jar', version: '5.4.102', sizeMB: 7.1, enabled: true, type: 'plugin', uploadDate: '2026-08-05', author: 'Luck' },
  { id: '6', name: 'Dynmap', filename: 'Dynmap-3.7-beta-1.jar', version: '3.7-beta', sizeMB: 18.4, enabled: true, type: 'plugin', uploadDate: '2026-08-15', author: 'mikeprimm' },
  { id: '7', name: 'Chunky', filename: 'Chunky-1.4.10.jar', version: '1.4.10', sizeMB: 1.2, enabled: false, type: 'plugin', uploadDate: '2026-07-15', author: 'pop4959' },
  { id: '8', name: 'VoiceChat', filename: 'simple-voice-chat-paper-1.20.4-2.4.31.jar', version: '2.4.31', sizeMB: 8.9, enabled: true, type: 'plugin', uploadDate: '2026-08-18', author: 'henkelmax' }
];

export const initialBackups: BackupItem[] = [
  { id: 'b1', name: 'AutoBackup_Daily_2026-08-19_0400', sizeMB: 1420, date: '2026-08-19 04:00', status: 'Healthy', worldSizeMB: 1280 },
  { id: 'b2', name: 'AutoBackup_Daily_2026-08-18_0400', sizeMB: 1390, date: '2026-08-18 04:00', status: 'Healthy', worldSizeMB: 1250 },
  { id: 'b3', name: 'Pre_Plugin_Update_CoreProtect', sizeMB: 1380, date: '2026-08-17 19:30', status: 'Archived', worldSizeMB: 1240 },
  { id: 'b4', name: 'Season4_World_Launch_Clean', sizeMB: 650, date: '2026-08-01 00:00', status: 'Archived', worldSizeMB: 620 }
];

export const initialLogs: LogEntry[] = [
  { id: 'l1', timestamp: '14:20:01', level: 'INFO', message: 'Starting minecraft server version 1.20.4 (Paper-MC)' },
  { id: 'l2', timestamp: '14:20:03', level: 'INFO', message: 'Loading properties & generating keypair' },
  { id: 'l3', timestamp: '14:20:05', level: 'INFO', message: 'Loaded 8 plugins (EssentialsX, CoreProtect, WorldEdit, LuckPerms, Dynmap, VoiceChat...)' },
  { id: 'l4', timestamp: '14:20:08', level: 'SUCCESS', message: 'Done (7.421s)! For help, type "help"' },
  { id: 'l5', timestamp: '14:20:15', level: 'INFO', message: 'UUID of player Steve_Crafter is c06f8906-4c3e-463c-99d7-5645367809a1' },
  { id: 'l6', timestamp: '14:20:16', level: 'INFO', message: 'Steve_Crafter joined the game (1420, 72, -380)' },
  { id: 'l7', timestamp: '14:22:30', level: 'CHAT', message: '<Steve_Crafter> Welcome everyone to Season 4!' },
  { id: 'l8', timestamp: '14:24:12', level: 'INFO', message: 'Alex_Archer logged in with entity id 429 at (-890, 64, 1240)' },
  { id: 'l9', timestamp: '14:26:00', level: 'WARN', message: 'Can\'t keep up! Is the server overloaded? Running 2150ms or 43 ticks behind' },
  { id: 'l10', timestamp: '14:28:44', level: 'INFO', message: 'Auto-saving world chunks to disk...' },
  { id: 'l11', timestamp: '14:28:46', level: 'SUCCESS', message: 'World "world", "world_nether", "world_the_end" saved successfully' },
  { id: 'l12', timestamp: '14:31:02', level: 'CHAT', message: '<ShadowNinja99> Anyone got spare iron ingots near spawn?' },
  { id: 'l13', timestamp: '14:33:18', level: 'INFO', message: 'ShadowNinja99 was slain by Zombie' }
];

export const initialChat: ChatMessage[] = [
  { id: 'c1', timestamp: '14:22:30', sender: 'Steve_Crafter', avatar: 'https://mc-heads.net/avatar/Steve_Crafter/48', role: 'Owner', message: 'Welcome everyone to Season 4! Let\'s build something legendary.' },
  { id: 'c2', timestamp: '14:24:45', sender: 'Alex_Archer', avatar: 'https://mc-heads.net/avatar/Alex_Archer/48', role: 'Member', message: 'Setting up the main community wheat farm at coords 120, 64, -200.' },
  { id: 'c3', timestamp: '14:27:10', sender: 'RedstoneWizard', avatar: 'https://mc-heads.net/avatar/RedstoneWizard/48', role: 'Admin', message: 'Please keep redstone clocks equipped with on/off levers to preserve server TPS.' },
  { id: 'c4', timestamp: '14:31:02', sender: 'ShadowNinja99', avatar: 'https://mc-heads.net/avatar/ShadowNinja99/48', role: 'Member', message: 'Anyone got spare iron ingots near spawn?' },
  { id: 'c5', timestamp: '14:31:40', sender: 'Frost_Knight', avatar: 'https://mc-heads.net/avatar/Frost_Knight/48', role: 'VIP', message: 'Check the community starter chest at /warp spawn!' },
  { id: 'c6', timestamp: '14:33:18', sender: 'SYSTEM', avatar: 'https://mc-heads.net/avatar/MHF_Chest/48', role: 'System', message: '☠ ShadowNinja99 was slain by Zombie in world (-320, -48, 90)', isSystem: true }
];

export const initialDeaths: DeathRecord[] = [
  { id: 'd1', player: 'ShadowNinja99', event: 'Player killed by Mob', cause: 'Slain by Zombie', killer: 'Zombie (Level 3)', world: 'Overworld', coords: { x: 320, y: -48, z: 90 }, timestamp: '15m ago', itemsLostCount: 14 },
  { id: 'd2', player: 'NetherHunter', event: 'Environment Hazard', cause: 'Tried to swim in lava', killer: 'Lava', world: 'Nether', coords: { x: 500, y: 40, z: -300 }, timestamp: '30m ago', itemsLostCount: 28 },
  { id: 'd3', player: 'Steve_Crafter', event: 'Player killed by Mob', cause: 'Blown up by Creeper', killer: 'Creeper', world: 'Nether', coords: { x: 1200, y: 14, z: -450 }, timestamp: '2h ago', itemsLostCount: 4 },
  { id: 'd4', player: 'Frost_Knight', event: 'Environment Hazard', cause: 'Fell from a high place', killer: 'Fall Damage', world: 'Nether', coords: { x: 190, y: 70, z: -1400 }, timestamp: '4h ago', itemsLostCount: 0 },
  { id: 'd5', player: 'Alex_Archer', event: 'Player killed by Mob', cause: 'Shot by Skeleton', killer: 'Skeleton', world: 'Overworld', coords: { x: -850, y: 32, z: 1200 }, timestamp: '1d ago', itemsLostCount: 19 },
  { id: 'd6', player: 'EnderQueen', event: 'Environment Hazard', cause: 'Fell into the Void', killer: 'The Void', world: 'The End', coords: { x: 100, y: -64, z: 0 }, timestamp: '3d ago', itemsLostCount: 36 }
];

export const initialSchedules: RestartSchedule[] = [
  { id: 's1', time: '04:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], enabled: true, warnings: [30, 10, 5, 1], customMessage: 'Scheduled daily server restart & garbage collection' },
  { id: 's2', time: '16:00', days: ['Sat', 'Sun'], enabled: true, warnings: [15, 5, 1], customMessage: 'Weekend peak maintenance reboot' }
];

export const initialBroadcasts: BroadcastItem[] = [
  { id: 'bc1', message: 'Join our official Discord community: discord.gg/valkyriemc for events & rewards!', intervalMinutes: 15, enabled: true, prefix: '§6[ANNOUNCEMENT]§r' },
  { id: 'bc2', message: 'Remember to claim your land with a Golden Shovel to protect your builds from griefing.', intervalMinutes: 20, enabled: true, prefix: '§b[TIP]§r' },
  { id: 'bc3', message: 'Vote daily on PMC & NameMC for free crate keys! Type /vote in game.', intervalMinutes: 30, enabled: false, prefix: '§a[VOTE]§r' }
];

export const initialFiles: ServerFileItem[] = [
  { id: 'f1', name: 'server.properties', path: '/server.properties', isDirectory: false, sizeKB: 4.2, lastModified: '2026-08-19 12:00', isProtected: true, content: `# Minecraft server properties\nserver-port=25565\nmotd=§a§lValkyrie §fNetwork §7- §bSeason 4\nmax-players=50\ndifficulty=hard\npvp=true\nonline-mode=true\nenable-command-block=true\nview-distance=10\nsimulation-distance=8\nallow-flight=false\nspawn-monsters=true\nspawn-animals=true` },
  { id: 'f2', name: 'bukkit.yml', path: '/bukkit.yml', isDirectory: false, sizeKB: 3.1, lastModified: '2026-08-18 10:00', isProtected: true, content: `settings:\n  allow-end: true\n  warn-on-overload: true\n  query-plugins: true\nspawn-limits:\n  monsters: 70\n  animals: 10\n  water-animals: 5\n  ambient: 15` },
  { id: 'f3', name: 'spigot.yml', path: '/spigot.yml', isDirectory: false, sizeKB: 5.8, lastModified: '2026-08-18 10:00', isProtected: true, content: `config-version: 12\nsettings:\n  save-user-cache-on-stop-only: false\n  bungeecord: false\nworld-settings:\n  default:\n    entity-tracking-range:\n      players: 48\n      animals: 48\n      monsters: 48` },
  { id: 'f4', name: 'paper-global.yml', path: '/paper-global.yml', isDirectory: false, sizeKB: 8.4, lastModified: '2026-08-19 04:00', isProtected: true, content: `_version: 28\nchunk-loading:\n  min-load-radius: 2\n  max-concurrent-loads: 500\ncollisions:\n  enable-player-collisions: true` },
  { id: 'f5', name: 'plugins', path: '/plugins', isDirectory: true, sizeKB: 48500, lastModified: '2026-08-19 14:00' },
  { id: 'f6', name: 'world', path: '/world', isDirectory: true, sizeKB: 850000, lastModified: '2026-08-19 14:35', isProtected: true },
  { id: 'f7', name: 'world_nether', path: '/world_nether', isDirectory: true, sizeKB: 290000, lastModified: '2026-08-19 14:35' },
  { id: 'f8', name: 'world_the_end', path: '/world_the_end', isDirectory: true, sizeKB: 140000, lastModified: '2026-08-19 14:35' },
  { id: 'f9', name: 'ops.json', path: '/ops.json', isDirectory: false, sizeKB: 1.2, lastModified: '2026-08-15 16:20', isProtected: true, content: `[\n  {\n    "uuid": "c06f8906-4c3e-463c-99d7-5645367809a1",\n    "name": "Steve_Crafter",\n    "level": 4,\n    "bypassesPlayerLimit": true\n  },\n  {\n    "uuid": "9e7b2938-e659-45ad-bc9b-1175653b6fa0",\n    "name": "RedstoneWizard",\n    "level": 4,\n    "bypassesPlayerLimit": true\n  }\n]` },
  { id: 'f10', name: 'whitelist.json', path: '/whitelist.json', isDirectory: false, sizeKB: 2.5, lastModified: '2026-08-19 11:15', isProtected: true, content: `[\n  {\n    "uuid": "c06f8906-4c3e-463c-99d7-5645367809a1",\n    "name": "Steve_Crafter"\n  },\n  {\n    "uuid": "853c80ef-3c37-49fd-aa49-938b674adae6",\n    "name": "Alex_Archer"\n  }\n]` },
  { id: 'f11', name: 'banned-players.json', path: '/banned-players.json', isDirectory: false, sizeKB: 0.8, lastModified: '2026-08-07 18:00', isProtected: true, content: `[\n  {\n    "uuid": "99887766-5544-3322-1100-aabbccddeeff",\n    "name": "Troll_Griefer",\n    "created": "2026-08-07",\n    "source": "Console",\n    "expires": "forever",\n    "reason": "Severe Griefing at spawn and fly hacking"\n  }\n]` }
];

export const initialConfigSettings: ServerConfigSettings = {
  serverName: 'Valkyrie SMP - Season 4',
  motd: '§a§lValkyrie §fNetwork §7- §bSeason 4 §6[1.20.4] §e★ Join Today ★',
  maxPlayers: 50,
  viewDistance: 10,
  simulationDistance: 8,
  difficulty: 'hard',
  defaultGamemode: 'survival',
  pvp: true,
  commandBlocks: true,
  onlineMode: true,
  whitelist: true,
  allowFlight: false,
  spawnMonsters: true,
  spawnAnimals: true,
  allowNether: true,
};

// =========================================================================
// BACKEND INTEGRATION LAYER
// Replace these simulated handlers with real fetch requests to your Minecraft API:
// GET  /api/server
// POST /api/server/start, stop, restart
// POST /api/command
// POST /api/teleport
// POST /api/player/action
// etc.
// =========================================================================

export async function sendCommandAPI(command: string): Promise<{ success: boolean; response: string }> {
  // Real backend integration:
  // const res = await fetch('/api/command', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ command })
  // });
  // return await res.json();
  
  await new Promise(resolve => setTimeout(resolve, 350));
  const cmd = command.trim().toLowerCase();
  
  if (cmd.startsWith('help')) {
    return { success: true, response: 'Available commands: gamemode, tp, kick, ban, unban, op, deop, stop, save-all, whitelist, time, weather, say, tps' };
  } else if (cmd.startsWith('tps')) {
    return { success: true, response: 'TPS from last 1m, 5m, 15m: 20.00, 19.98, 19.95' };
  } else if (cmd.startsWith('save-all')) {
    return { success: true, response: 'Saved the world (all 3 dimensions written to disk)' };
  } else if (cmd.startsWith('say ')) {
    return { success: true, response: `[Server] ${command.substring(4)}` };
  } else if (cmd.startsWith('time set ')) {
    return { success: true, response: `Set the time to ${cmd.replace('time set ', '')}` };
  } else if (cmd.startsWith('weather ')) {
    return { success: true, response: `Set the weather to ${cmd.replace('weather ', '')}` };
  } else {
    return { success: true, response: `Executed server command: "${command}"` };
  }
}
