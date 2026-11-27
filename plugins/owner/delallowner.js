// owner/delallowner — satu file: metadata + kode fitur (gabungan dari engine8/plugins/owner/delallowner.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "delallowner",
  "command": [
    "delallowner",
    "hapusallowner",
    "delownerall",
    "clearowner",
    "resetowner"
  ],
  "category": "owner",
  "desc": "Hapus semua owner yang ditambahkan lewat .addowner",
  "usage": ".delallowner ya",
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
module.exports = __vx.plugin("owner/delallowner", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/delallowner.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e8.js");
  const { removeJadibotOwner, getJadibotOwners } = require("../../lib/ext/src/lib/vanxone-jadibot-database.e8.js");
  
  const pluginConfig = {
    name: "delallowner",
    alias: ["hapusallowner", "delownerall", "clearowner", "resetowner"],
    category: "owner",
    description: "Hapus semua owner yang ditambahkan lewat .addowner",
    usage: ".delallowner ya",
    example: ".delallowner ya",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  const digits = (v) => String(v || "").replace(/[^0-9]/g, "");
  const toJid = (v) => (digits(v) ? `${digits(v)}@s.whatsapp.net` : null);
  
  async function handler(m, { jadibotId, isJadibot }) {
    const db = getDatabase();
    if (!db) return m.reply("❌ Database belum siap, coba lagi.");
  
    const confirmed = ["ya", "yes", "confirm", "y"].includes(
      (m.args[0] || "").toLowerCase(),
    );
  
  
    // ── Tentukan daftar yang akan dihapus sesuai mode ──
    let targets = [];
    let label = "full owner";
  
    if (isJadibot && jadibotId) {
      targets = [...getJadibotOwners(jadibotId)];
      label = "owner jadibot";
    } else {
      if (!db.data.owner) db.data.owner = [];
      targets = [...db.data.owner];
    }
  
    if (targets.length === 0) {
      return m.reply(`❌ Tidak ada ${label} hasil addowner yang bisa dihapus.`);
    }
  
    const mentions = targets.map(toJid).filter(Boolean);
    const list = targets.map((n, i) => `${i + 1}. @${digits(n)}`).join("\n");
  
    if (!confirmed) {
      return m.reply(
        `⚠️ *HAPUS SEMUA ${label.toUpperCase()}*\n\n${list}\n\n` +
          `Total: *${targets.length}*\n` +
          (isJadibot
            ? ""
            : `> Owner utama dari config.js tidak ikut terhapus.\n`) +
          `\nKetik \`${m.prefix}${m.command} ya\` untuk lanjut.`,
        { mentions },
      );
    }
  
    // ── Eksekusi ──
    if (isJadibot && jadibotId) {
      targets.forEach((n) => removeJadibotOwner(jadibotId, n));
    } else {
      db.data.owner = [];
      const nameMap = db.setting("ownerNames") || {};
      targets.forEach((n) => delete nameMap[n]);
      db.setting("ownerNames", nameMap);
      db.save();
    }
  
    await m.react("✅");
    return m.reply(
      `✅ *BERHASIL*\n\nMenghapus *${targets.length}* ${label}:\n${list}`,
      { mentions },
    );
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
