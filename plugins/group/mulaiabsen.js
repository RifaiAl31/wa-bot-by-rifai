// group/mulaiabsen — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/mulaiabsen.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "mulaiabsen",
  "command": [
    "mulaiabsen",
    "startabsen",
    "bukaabsen",
    "openabsen"
  ],
  "category": "group",
  "desc": "Mulai sesi absen di grup (admin only)",
  "usage": ".mulaiabsen [keterangan]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/mulaiabsen", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/mulaiabsen.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const pluginConfig = {
    name: "mulaiabsen",
    alias: ["startabsen", "bukaabsen", "openabsen"],
    category: "group",
    description: "Mulai sesi absen di grup (admin only)",
    usage: ".mulaiabsen [keterangan]",
    example: ".mulaiabsen Rapat Mingguan",
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true,
    isAdmin: true,
  };
  
  if (!global.absensi) global.absensi = {};
  
  async function handler(m, { sock }) {
    const chatId = m.chat;
  
    if (global.absensi[chatId]) {
      return m.reply(
        `❌ *ᴍᴀsɪʜ ᴀᴅᴀ ᴀʙsᴇɴ*\n\n` +
          `> Masih ada sesi absen di grup ini!\n\n` +
          `> Ketik *.hapusabsen* untuk menghapus\n` +
          `> atau *.cekabsen* untuk melihat daftar`,
      );
    }
  
    const keterangan = m.text?.trim() || "Absen Harian";
  
    global.absensi[chatId] = {
      keterangan: keterangan,
      createdBy: m.sender,
      createdAt: new Date().toISOString(),
      peserta: [],
    };
  
    const saluranId = config.saluran?.id || "";
    const saluranName = config.saluran?.name || config.bot?.name || "WhatsApp Bot";
  
    await m.reply(
      `📋 *ABSEN UDAH JALAN NIHH*\n\n` +
        `「 📋 *ɪɴғᴏ* 」\n` +
        `📝 ${keterangan}\n` +
        `👑 Dibuat oleh: @${m.sender.split("@")[0]}\n` +
        `👥 Peserta: 0\n\n` +
        `Untuk kamu yang mau ikutan absen, silahkan ketik *${m.prefix}absen*` +
        `Untuk admin yang mau cek absen, silahkan ketik *${m.prefix}cekabsen*` +
        `Untuk admin yang mau hapus absen, silahkan ketik *${m.prefix}hapusabsen*`,
      { mentions: [m.sender] },
    );
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
