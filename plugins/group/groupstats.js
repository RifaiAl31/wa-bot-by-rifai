// group/groupstats — satu file: metadata + kode fitur (gabungan dari engine7/plugins/group/groupstats.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "groupstats",
  "command": [
    "groupstats",
    "statsgrup",
    "statsgroup"
  ],
  "category": "group",
  "desc": "Menampilkan statistik dasar grup saat ini",
  "usage": ".groupstats",
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
module.exports = __vx.plugin("group/groupstats", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/groupstats.js'
  const __vxExports = {};
  const pluginConfig = {
    name: "groupstats",
    alias: ["statsgrup", "statsgroup"],
    category: "group",
    description: "Menampilkan statistik dasar grup saat ini",
    usage: ".groupstats",
    example: ".groupstats",
    isOwner: false, isPremium: false, isGroup: true, isPrivate: false,
    cooldown: 5, energi: 0, isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    if (!m.isGroup) return m.reply("❌ Perintah ini hanya bisa digunakan di grup.");
    const meta = await sock.groupMetadata(m.chat);
    const participants = meta.participants || [];
    const admins = participants.filter(p => p.admin === "admin" || p.admin === "superadmin");
    const owner = participants.find(p => p.admin === "superadmin");
    const members = participants.length - admins.length;
  
    return m.reply(
      `📊 *STATISTIK GRUP*\n\n` +
      `👥 Total anggota: *${participants.length}*\n` +
      `⭐ Admin: *${admins.length}*\n` +
      `👤 Member: *${members}*\n` +
      `👑 Owner grup: *${owner ? "@" + (owner.id || owner.jid).split("@")[0] : "-"}*\n` +
      `🔗 ID: \`${m.chat}\``,
      { mentions: owner ? [owner.id || owner.jid] : [] }
    );
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
