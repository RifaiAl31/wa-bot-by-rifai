// rpg/parkir — satu file: metadata + kode fitur (gabungan dari engine3/plugins/rpg/parkir.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "parkir",
  "command": [
    "parkir",
    "kangparkir",
    "markir"
  ],
  "category": "rpg",
  "desc": "Jadi tukang parkir minimarket, waspada satpol PP!",
  "usage": ".parkir",
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
module.exports = __vx.plugin("rpg/parkir", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/parkir.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const { addExpWithLevelCheck } = require("../../lib/ext/src/lib/vanxone-level.js");
  
  const pluginConfig = {
    name: "parkir",
    alias: ["kangparkir", "markir"],
    category: "rpg",
    description: "Jadi tukang parkir minimarket, waspada satpol PP!",
    usage: ".parkir",
    example: ".parkir",
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
    
    const staminaCost = 12;
    user.rpg.stamina = user.rpg.stamina ?? 100;
  
    if (user.rpg.stamina < staminaCost) {
      return m.reply(`Kaki pegel kebanyakan berdiri! 😫\n\nMarkir butuh *${staminaCost} Stamina*, sisa stamina kamu *${user.rpg.stamina}*. Istirahat dulu di pos! 🏚️`);
    }
  
    user.rpg.stamina -= staminaCost;
    await m.react("🅿️");
    await m.reply(`Priiiit! Terus, terus, bales kiri dikit! 🏁\nMulai narik duit parkir di minimarket... 💰`);
    await new Promise(r => setTimeout(r, 3000));
  
    const gacha = Math.random();
  
    if (gacha < 0.1) {
      const denda = Math.floor(Math.random() * 5000) + 1000;
      user.koin = Math.max(0, (user.koin || 0) - denda);
      await m.react("🚨");
      return m.reply(`WADUH ADA RAZIA SATPOL PP! 🚓💨\n\nKamu lari terbirit-birit dan duit recehanmu jatuh senilai *Rp ${denda.toLocaleString("id-ID")}*!\n⚡ Stamina: -${staminaCost}\n\nApes banget hari ini! 😭`);
    } else if (gacha > 0.9) {
      const jackpot = Math.floor(Math.random() * 50000) + 20000;
      user.koin = (user.koin || 0) + jackpot;
      const expGain = Math.floor(jackpot / 20);
      await addExpWithLevelCheck(sock, m, db, user, expGain);
      await m.react("🤑");
      return m.reply(`JACKPOT! ADA MOBIL SPORT SULTAN! 🏎️✨\n\nPas mau keluar, kaca mobil turun dan sultan ngasih pecahan 100k!\n💵 Pendapatan: *+Rp ${jackpot.toLocaleString("id-ID")}*\n📈 EXP: *+${expGain}*\n⚡ Stamina: -${staminaCost}\n\nAlhamdulillah rejeki anak soleh! 🙏`);
    }
  
    const earning = Math.floor(Math.random() * 8000) + 2000;
    user.koin = (user.koin || 0) + earning;
    const expGain = Math.floor(earning / 20);
    await addExpWithLevelCheck(sock, m, db, user, expGain);
  
    await m.react("✅");
    m.reply(`HASIL MARKIR HARI INI! 🅿️✨\n\n💵 Pendapatan: *+Rp ${earning.toLocaleString("id-ID")}*\n📈 EXP: *+${expGain}*\n⚡ Stamina: -${staminaCost}\n\nReceh demi receh lama-lama jadi bukit! 💪`);
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
