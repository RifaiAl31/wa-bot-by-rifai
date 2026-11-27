// stalker/daftartt — satu file: metadata + kode fitur (gabungan dari engine7/plugins/stalker/daftartt.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "daftartiktok",
  "command": [
    "daftartiktok",
    "daftartt",
    "regtt"
  ],
  "category": "stalker",
  "desc": "Mendaftarkan username TikTok ke database user",
  "usage": ".daftartt <username>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/stalker").split('\\').join('/')
module.exports = __vx.plugin("stalker/daftartt", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/daftartt.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'daftartiktok',
      alias: ['daftartt', 'regtt'],
      category: 'stalker',
      description: 'Mendaftarkan username TikTok ke database user',
      usage: '.daftartt <username>',
      example: '.daftartt faizprst7',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { args, usedPrefix, sock }) {
      let user = global.db.data.users[m.sender]
      if (!user) return m.reply('❌ Data user tidak ditemukan!')
  
      // ===== INIT DATA =====
      if (!user.tiktok) {
          user.tiktok = {
              username: null,
              registered: false
          }
      }
  
      let username = args[0]
  
      if (!username) {
          return m.reply(`❌ Masukkan username TikTok!\n\nContoh:\n${usedPrefix}daftartt faizprst7`)
      }
  
      // bersihin @ kalau ada
      username = username.replace('@', '').trim()
  
      // validasi sederhana
      if (username.length < 2) {
          return m.reply('❌ Username tidak valid!')
      }
  
      // simpan
      user.tiktok.username = username
      user.tiktok.registered = true
  
      m.reply(`
  ✅ *BERHASIL DAFTAR TIKTOK*
  
  👤 Username: @${username}
  
  Sekarang kamu bisa cek akun dengan:
  ${usedPrefix}cekakuntt
  `)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
