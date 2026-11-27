// rpg/ngamen — satu file: metadata + kode fitur (gabungan dari engine3/plugins/rpg/ngamen.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ngamen",
  "command": [
    "ngamen",
    "nyanyi",
    "konser"
  ],
  "category": "rpg",
  "desc": "Ngamen di jalanan untuk mencari koin",
  "usage": ".ngamen",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 120,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/rpg").split('\\').join('/')
module.exports = __vx.plugin("rpg/ngamen", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ngamen.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const { addExpWithLevelCheck } = require("../../lib/ext/src/lib/vanxone-level.js");
  
  const pluginConfig = {
    name: "ngamen",
    alias: ["nyanyi", "konser"],
    category: "rpg",
    description: "Ngamen di jalanan untuk mencari koin",
    usage: ".ngamen",
    example: ".ngamen",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 120,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const db = getDatabase();
    const user = db.getUser(m.sender);
  
    if (!user.rpg) user.rpg = {};
    
    const staminaCost = 10;
    user.rpg.stamina = user.rpg.stamina ?? 100;
  
    if (user.rpg.stamina < staminaCost) {
      return m.reply(`Suara serak, tenggorokan kering! 🥵\n\nNgamen butuh *${staminaCost} Stamina*, sisa stamina kamu *${user.rpg.stamina}*. Minum es teh dulu gih! ☕`);
    }
  
    user.rpg.stamina -= staminaCost;
  
    await m.react("🎸");
  
    const locations = [
      { name: "Perempatan Lampu Merah", min: 3000, max: 10000 },
      { name: "Warung Kopi", min: 5000, max: 15000 },
      { name: "Depan Minimarket", min: 4000, max: 12000 },
      { name: "Kafe Gaul", min: 8000, max: 25000 },
      { name: "Angkringan", min: 2000, max: 8000 }
    ];
  
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const earning = Math.floor(Math.random() * (loc.max - loc.min + 1)) + loc.min;
  
    await m.reply(`Mulai jreng-jreng gitar di *${loc.name}*... 🎶\nSemoga hari ini banyak yang ngasih receh! 💸`);
    await new Promise((resolve) => setTimeout(resolve, 3000));
  
    user.koin = (user.koin || 0) + earning;
  
    const expGain = Math.floor(earning / 20);
    await addExpWithLevelCheck(sock, m, db, user, expGain);
  
    await m.react("✅");
  
    let txt = `ALHAMDULILLAH HASIL NGAMEN! 🎸✨\n\n`;
    txt += `Lokasi: *${loc.name}*\n`;
    txt += `💵 Pendapatan: *+Rp ${earning.toLocaleString("id-ID")}*\n`;
    txt += `📈 EXP: *+${expGain}*\n`;
    txt += `⚡ Stamina: *-${staminaCost}*\n\n`;
    txt += `Lumayan buat beli nasi bungkus hari ini! 🤤`;
  
    m.reply(txt);
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
