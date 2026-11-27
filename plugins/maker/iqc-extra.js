// canvas/iqc — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/iqc.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "qc2",
  "command": [
    "qc2"
  ],
  "category": "maker",
  "desc": "Kartu chat iPhone (iQC)",
  "usage": ".qc2",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/iqc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/iqc.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
      name: "iqc",
      alias: ["qc2"],
      category: "canvas",
      description: "Membuat Fake Quote iOS style secara instan.",
      usage: ".iqc [text/reply]",
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 2,
      isEnabled: true,
  };
  
  async function handler(m, { sock, text }) {
      try {
          const targetText = text || (m.quoted && m.quoted.text ? m.quoted.text : "");
          
          if (!targetText) {
              let help = `💬 *FITUR FAKE QUOTE iOS*\n\n`
              help += `Fitur ini digunakan untuk membuat gambar quote elegan bergaya iOS dengan sangat cepat.\n\n`
              help += `*Cara Penggunaan:*\n`
              help += `- Ketik *${m.prefix}iqc <teks kamu>*\n`
              help += `- Atau kamu bisa membalas (reply) pesan teks orang lain dengan perintah *${m.prefix}iqc*\n\n`
              help += `_Pesan tersebut akan secara otomatis diubah menjadi quote keren!_`
              return m.reply(help)
          }
  
          await m.react('🕕');
  
          const apiUrl = `https://my.izuka-api.xyz/api/canvas/iqc?text=${encodeURIComponent(targetText)}`
          
          await sock.sendMessage(m.chat, { image: { url: apiUrl } }, { quoted: m });
          
          await m.react('✅');
  
      } catch (error) {
          console.error("[IQC Plugin Error]", error)
          await m.react('❌')
          m.reply(`Maaf, terjadi kesalahan saat mencoba membuat gambar quote. Silakan coba lagi beberapa saat.`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
