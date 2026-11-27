// main/gamenew — satu file: metadata + kode fitur (gabungan dari engine3/plugins/main/gamenew.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "gamenew",
  "command": [
    "gamenew",
    "newgame",
    "youhugame"
  ],
  "category": "info",
  "desc": "Menu game Youhu untuk WhatsApp Bot",
  "usage": ".gamenew",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/gamenew", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gamenew.js'
  const __vxExports = {};
  const pluginConfig = {
    name: 'gamenew',
    alias: ['newgame', 'youhugame'],
    category: 'main',
    description: 'Menu game Youhu untuk WhatsApp Bot',
    usage: '.gamenew',
    example: '.gamenew',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m) {
    const p = m.prefix || '.';
    return m.reply(`╭─「 🎮 GAME CENTER 」
  │
  │  01  ♟️  Chess
  │      └─ ${p}chess
  │
  │  02  🦖  Dino
  │      └─ ${p}dino
  │
  │  03  🏎️  MBIM
  │      └─ ${p}mbim
  │
  │  04  🚀  Plane
  │      └─ ${p}plane
  │
  │  05  ❌⭕  Tic Tac Toe
  │      └─ ${p}ttc
  │
  ╰─「 WhatsApp Bot GAMES 」`);
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
