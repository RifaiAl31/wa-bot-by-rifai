// user/bataldaftar — satu file: metadata + kode fitur (gabungan dari engine3/plugins/user/bataldaftar.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "bataldaftar",
  "command": [
    "bataldaftar",
    "cancelreg",
    "canceldaftar",
    "regcancel"
  ],
  "category": "profil",
  "desc": "Batalkan sesi pendaftaran yang sedang aktif",
  "usage": ".bataldaftar",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/user").split('\\').join('/')
module.exports = __vx.plugin("user/bataldaftar", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/bataldaftar.js'
  const __vxExports = {};
  const { clearRegistrationSession } = require("../../lib/ext/plugins/e3/user/daftar.js");
  
  const pluginConfig = {
    name: "bataldaftar",
    alias: ["cancelreg", "canceldaftar", "regcancel"],
    category: "user",
    description: "Batalkan sesi pendaftaran yang sedang aktif",
    usage: ".bataldaftar",
    example: ".bataldaftar",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
    skipRegistration: true,
  };
  
  async function handler(m) {
    const canceled = clearRegistrationSession(m.sender);
  
    if (!canceled) {
      return m.reply(`❌ Kamu tidak punya sesi pendaftaran aktif.`);
    }
  
    return m.reply(
      `✅ Sesi pendaftaran berhasil dibatalkan.\n\n` +
        `> Mulai lagi dengan: \`${m.prefix}daftar\``,
    );
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
