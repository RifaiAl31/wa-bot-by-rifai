// owner/listvip — satu file: metadata + kode fitur (gabungan dari engine8/plugins/owner/listvip.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "listvip",
  "command": [
    "listvip",
    "viplist",
    "daftarvip"
  ],
  "category": "owner",
  "desc": "Lihat daftar semua VIP aktif",
  "usage": ".listvip",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/listvip", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/listvip.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e8.js");
  
  function isVipActive(user) {
    if (!user?.isVip) return false;
    if (!user.vipExpired || user.vipExpired === -1) return true;
    return Date.now() < user.vipExpired;
  }
  
  function formatExpired(ts) {
    if (!ts || ts === -1) return "♾️ Permanen";
    const sisa = ts - Date.now();
    if (sisa <= 0) return "❌ Expired";
    const d = Math.floor(sisa / (1000 * 60 * 60 * 24));
    const h = Math.floor((sisa % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const min = Math.floor((sisa % (1000 * 60 * 60)) / (1000 * 60));
    if (d > 0) return `${d}h ${h}j lagi`;
    if (h > 0) return `${h}j ${min}m lagi`;
    return `${min}m lagi`;
  }
  
  const pluginConfig = {
    name: "listvip",
    alias: ["viplist", "daftarvip"],
    category: "owner",
    description: "Lihat daftar semua VIP aktif",
    usage: ".listvip",
    example: ".listvip",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const db = getDatabase();
    const allUsers = db.getAllUsers();
  
    const vipList = Object.entries(allUsers)
      .filter(([, u]) => isVipActive(u))
      .map(([jid, u]) => ({ jid, ...u }));
  
    if (vipList.length === 0) {
      return m.reply(`💎 Belum ada user VIP aktif.`);
    }
  
    let txt = `💎 *LIST VIP AKTIF*\n`;
    txt += `╭┈┈┈┈┈┈┈┈┈┈┈\n`;
    vipList.forEach((u, i) => {
      txt += `┃ ${i + 1}. @${u.jid}\n`;
      txt += `┃    ⏳ ${formatExpired(u.vipExpired)}\n`;
    });
    txt += `╰┈┈┈┈┈┈┈┈┈┈┈\n`;
    txt += `> Total: *${vipList.length} VIP aktif*`;
  
    return m.reply(txt, {
      mentions: vipList.map(u => u.jid + "@s.whatsapp.net"),
    });
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
