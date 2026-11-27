// user/notiflimit — satu file: metadata + kode fitur (gabungan dari engine3/plugins/user/notiflimit.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "notiflimit",
  "command": [
    "notiflimit",
    "notifenergi"
  ],
  "category": "owner",
  "desc": "Mengaktifkan atau mematikan notifikasi potong limit secara global.",
  "usage": ".notiflimit",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/user").split('\\').join('/')
module.exports = __vx.plugin("user/notiflimit", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/notiflimit.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  
  const pluginConfig = {
      name: "notiflimit",
      alias: ["notifenergi"],
      category: "owner",
      description: "Mengaktifkan atau mematikan notifikasi potong limit secara global.",
      usage: ".notiflimit",
      example: ".notiflimit",
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 0,
      energi: 0,
      isEnabled: true,
  };
  
  async function handler(m, { sock }) {
      const db = getDatabase();
  
      const currentStatus = db.setting("notiflimit") ?? false;
      db.setting("notiflimit", !currentStatus);
  
      const newStatus = db.setting("notiflimit") ? "AKTIF ✅" : "MATI ❌";
  
      await m.reply(`*NOTIFIKASI LIMIT (GLOBAL)*\n\nStatus saat ini: *${newStatus}*\n\n> Ketika aktif, bot akan selalu memberitahu sisa limit SEMUA PENGGUNA setiap kali ada pemotongan saat menggunakan fitur bot.`);
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
