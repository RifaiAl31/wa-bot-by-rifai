// owner/sistemenergi — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/sistemenergi.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "sistemenergi",
  "command": [
    "sistemenergi",
    "sistemlimit",
    "energimode",
    "limitmode"
  ],
  "category": "owner",
  "desc": "Mengecek, menghidupkan, atau mematikan sistem energi secara global",
  "usage": ".sistemenergi [on / off]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/sistemenergi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sistemenergi.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  
  const config = {
    name: "sistemenergi",
    alias: ["sistemlimit", "energimode", "limitmode"],
    category: "owner",
    description: "Mengecek, menghidupkan, atau mematikan sistem energi secara global",
    usage: ".sistemenergi [on / off]",
    example: ".sistemenergi on",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 0,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const mode = m.args[0]?.toLowerCase();
    const db = getDatabase();
    
    const currentStatus = db.setting("energi") !== undefined ? db.setting("energi") : true;
    
    if (!mode || (mode !== "on" && mode !== "off")) {
      return m.reply(
        `🎛️ *KONTROL SISTEM ENERGI*\n\n` +
        `Fitur kendali utama untuk menghidupkan atau mematikan seluruh sistem potongan energi bot secara global.\n\n` +
        `*STATUS SAAT INI:*\n` +
        `- Mode: *${currentStatus ? "AKTIF 🔋" : "NONAKTIF (UNLIMITED) ♾️"}*\n\n` +
        `*PENGGUNAAN:*\n` +
        `- *${m.prefix}sistemenergi on* — Menghidupkan potongan energi\n` +
        `- *${m.prefix}sistemenergi off* — Mematikan potongan energi (Unlimited mode)\n\n` +
        `*CONTOH PENGGUNAAN:*\n` +
        `- *${m.prefix}sistemenergi on*`
      );
    }
  
    await m.react("🕕");
    
    const isEnabled = mode === "on";
    
    db.setting("energi", isEnabled);
    await db.save();
  
    await m.react("✅");
    return m.reply(
      `✅ *STATUS SISTEM ENERGI BERHASIL DIUBAH*\n\n` +
      `Sistem Energi kini telah berhasil di-*${isEnabled ? "HIDUPKAN" : "MATIKAN"}*.\n\n` +
      `*Status Terkini:*\n` +
      `- Mode: *${isEnabled ? "AKTIF 🔋" : "NONAKTIF (UNLIMITED) ♾️"}*\n\n` +
      `_Semua perubahan sudah tersimpan dan akan segera diterapkan pada sistem bot._`
    );
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => config });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
