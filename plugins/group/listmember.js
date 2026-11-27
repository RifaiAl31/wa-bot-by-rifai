// group/listmember — satu file: metadata + kode fitur (gabungan dari engine7/plugins/group/listmember.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "listmember",
  "command": [
    "listmember",
    "memberlist",
    "daftarmember",
    "listanggota"
  ],
  "category": "group",
  "desc": "Menampilkan daftar anggota grup",
  "usage": ".listmember",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/listmember", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/listmember.js'
  const __vxExports = {};
  const pluginConfig = {
    name: "listmember",
    alias: ["memberlist", "daftarmember", "listanggota"],
    category: "group",
    description: "Menampilkan daftar anggota grup",
    usage: ".listmember",
    example: ".listmember",
    isOwner: false, isPremium: false, isGroup: true, isPrivate: false,
    cooldown: 5, energi: 0, isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    if (!m.isGroup) return m.reply("❌ Perintah ini hanya bisa digunakan di grup.");
    const meta = await sock.groupMetadata(m.chat);
    const participants = meta.participants || [];
    if (!participants.length) return m.reply("❌ Data anggota grup tidak tersedia.");
  
    const lines = participants.map((p, i) => {
      const jid = p.id || p.jid || "";
      const role = p.admin === "superadmin" ? "👑 Owner" : p.admin === "admin" ? "⭐ Admin" : "👤 Member";
      return `${i + 1}. ${role} @${jid.split("@")[0]}`;
    });
    const mentions = participants.map(p => p.id || p.jid).filter(Boolean);
    return m.reply(`👥 *DAFTAR MEMBER*\n\nGrup: *${meta.subject || "-"}*\nTotal: *${participants.length}*\n\n${lines.join("\n")}`, { mentions });
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
