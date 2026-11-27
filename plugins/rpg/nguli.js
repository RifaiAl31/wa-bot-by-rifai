// economy/nguli — satu file: metadata + kode fitur (gabungan dari engine7/plugins/economy/nguli.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "vanxone-nguli",
  "command": [
    "vanxone-nguli"
  ],
  "category": "rpg",
  "desc": "Klaim upah nguli +10 limit dari WhatsApp Bot",
  "usage": ".nguli",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/economy").split('\\').join('/')
module.exports = __vx.plugin("economy/nguli", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/nguli.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-bridge.js");
  
  const pluginConfig = {
    name: "vanxone-nguli",
    alias: ["nguli"],
    category: "economy",
    description: "Klaim upah nguli +10 limit dari WhatsApp Bot",
    usage: ".nguli",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m) {
    const db = getDatabase();
    const user = db.getUser(m.sender) || db.setUser(m.sender, {});
    const now = Date.now();
    const last = Number(user.riooLastNguli || 0);
    const cooldown = 30 * 60 * 1000;
    if (now - last < cooldown) {
      const remain = Math.ceil((cooldown - (now - last)) / 60000);
      return m.reply(`⛏️ Kamu sudah mengambil upah nguli. Coba lagi sekitar ${remain} menit lagi.`);
    }
    user.limit = Number(user.limit || 0) + 10;
    user.riooLastNguli = now;
    return m.reply("⛏️ *Upah nguli diterima!*\n\n+10 limit");
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
