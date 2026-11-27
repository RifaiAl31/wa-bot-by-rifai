// canvas/iqc2 — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/iqc2.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "iqc2",
  "command": [
    "iqc2",
    "qc3"
  ],
  "category": "image",
  "desc": "Membuat Fake Quote iOS style dengan informasi baterai dan provider.",
  "usage": ".iqc2 [text/reply]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/iqc2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/iqc2.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
      name: "iqc2",
      alias: ["qc3"],
      category: "canvas",
      description: "Membuat Fake Quote iOS style dengan informasi baterai dan provider.",
      usage: ".iqc2 [text/reply]",
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
              return m.reply(
                  `Halo *${m.pushName}*, sepertinya kamu belum memasukkan teksnya.\n\n` +
                  `Silakan gunakan perintah dengan format:\n` +
                  `- .iqc2 <teks kamu>\n` +
                  `- Atau balas (reply) pesan orang lain dengan .iqc2`
              );
          }
  
          await m.react('🕕');
  
          const providers = ["INDOSAT", "TELKOMSEL", "XL", "TRI", "SMARTFREN", "WIFI"];
          const randomProvider = providers[Math.floor(Math.random() * providers.length)];
          
          const now = new Date();
          const jam = now.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit" }).replace('.', ':');
          
          const randomBaterai = Math.floor(Math.random() * (100 - 10 + 1)) + 10; // 10-100
  
          const apiUrl = `https://api.nexray.eu.cc/maker/v1/iqc?text=${encodeURIComponent(targetText)}&provider=${encodeURIComponent(randomProvider)}&jam=${encodeURIComponent(jam)}&baterai=${randomBaterai}`;
          
          await sock.sendMessage(m.chat, { image: { url: apiUrl } }, { quoted: m });
          
          await m.react('✅');
  
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          console.error("[IQC2 Plugin Error]", error);
          await m.react('❌');
          m.reply(`Maaf *${m.pushName}*, terjadi kesalahan saat mencoba membuat gambar quote. Silakan coba lagi beberapa saat.`);
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
