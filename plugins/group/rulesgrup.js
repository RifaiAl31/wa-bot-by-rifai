// group/rulesgrup — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/rulesgrup.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "rulesgrup",
  "command": [
    "rulesgrup",
    "grouprules",
    "aturangrup",
    "grules"
  ],
  "category": "group",
  "desc": "Menampilkan rules dan aturan grup secara lengkap",
  "usage": ".rulesgrup",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
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
module.exports = __vx.plugin("group/rulesgrup", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/rulesgrup.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const { getAssetBuffer } = require("../../lib/ext/src/lib/vanxone-asset-manager.js");
  
  const pluginConfig = {
      name: "rulesgrup",
      alias: ["grouprules", "aturangrup", "grules"],
      category: "group",
      description: "Menampilkan rules dan aturan grup secara lengkap",
      usage: ".rulesgrup",
      example: ".rulesgrup",
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true,
  }
  
  const DEFAULT_GROUP_RULES = `📜 *ATURAN GRUP*
  
  Selamat datang di grup ini! Supaya suasana tetap nyaman dan kondusif untuk semua anggota, harap patuhi aturan-aturan berikut ini ya.
  
  🔹 *ETIKA BERKOMUNIKASI*
  
  - Gunakan *bahasa yang sopan* dan saling menghargai satu sama lain. Tidak ada toleransi untuk kata-kata kasar atau ujaran kebencian.
  - Dilarang melakukan *spam* pesan berulang-ulang, termasuk spam sticker, gambar, dan voice note secara berlebihan.
  - Dilarang menyebarkan *konten SARA, pornografi, dan kekerasan* dalam bentuk apapun.
  - Jangan *menghina, membully, atau mempermalukan* anggota grup lainnya.
  
  🔹 *KONTEN DAN LINK*
  
  - Dilarang *promosi* produk, jasa, atau akun media sosial tanpa izin admin grup.
  - Dilarang *menyebarkan link* apapun tanpa persetujuan admin, termasuk link grup WhatsApp lain.
  - Dilarang menyebarkan *berita hoax* atau informasi yang belum terverifikasi kebenarannya.
  - Dilarang mengirim *dokumen atau file mencurigakan* yang berpotensi mengandung virus.
  
  🔹 *PENGGUNAAN BOT*
  
  - Gunakan command bot *secukupnya*, jangan spam command berulang-ulang.
  - *Patuhi instruksi admin* grup kapan saja. Keputusan admin adalah final.
  - Jika ada masalah, sampaikan dengan baik-baik ke admin, bukan di grup.
  
  🔹 *KONSEKUENSI*
  
  - Pelanggaran ringan mendapat *peringatan (warning)* dari admin
  - Pelanggaran berat atau berulang akan di-*kick* dari grup
  - Admin berhak mengeluarkan member kapan saja tanpa pemberitahuan
  
  _Dengan bergabung di grup ini, kamu dianggap sudah menyetujui semua aturan di atas._`
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const groupData = db.getGroup(m.chat) || {}
      const customRules = groupData.groupRules
      const rulesText = customRules || DEFAULT_GROUP_RULES
  
      const imageBuffer = getAssetBuffer("vanxone-rules")
  
      if (imageBuffer) {
          await sock.sendMessage(m.chat, {
              image: imageBuffer,
              caption: rulesText,
          }, { quoted: m })
      } else {
          await m.reply(rulesText)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "DEFAULT_GROUP_RULES", { enumerable: true, get: () => DEFAULT_GROUP_RULES });
  return __vxExports
})
