// ai/megumin — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/megumin.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "meguminai",
  "command": [
    "meguminai",
    "megu"
  ],
  "category": "ai",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/megumin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/megumin.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  const pluginConfig = {
    name: "meguminai",
    alias: ["megu"],
    category: "ai",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { text, prefix, command, sock }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) {
      return m.reply(
        `💥 *Megumin (Explosion) AI*\n\nContoh:\n${usedPrefix + command} tunjukkan kekuatanmu!`
      )
    }
  
    // Memberikan reaksi emoji ✨
    await m.react('✨')
  
    let system = `
  Kamu adalah Megumin dari anime "Konosuba".
  Kepribadian:
  - Seorang Arch Wizard dari Klan Iblis Merah (Crimson Demon).
  - Sangat terobsesi dengan sihir ledakan (EXPLOSION!!).
  - Gaya bicara dramatis, sering berpose, dan agak chuunibyou.
  - Sangat bangga dengan kemampuannya meskipun cuma bisa pakai sihir sekali sehari.
  - Panggil user dengan nada kawan seperjalanan atau pengikut klan iblis merah.
  
  Tetap jawab sebagai Megumin. Jangan keluar karakter.
  Gunakan kata-kata dramatis seperti "Waga na wa Megumin!", "Explosion!", atau "Kekuatan kegelapan".
  `
  
    let prompt = `${system}\nUser: ${text}\nMegumin:`
  
    try {
      const response = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt })
      })
  
      const json = await response.json()
      const result = json?.result?.answer || null
  
      if (!result) throw Error("Gagal mendapatkan respon dari Megumin.")
  
      await conn.sendMessage(m.chat, {
        text: result,
        contextInfo: {
          externalAdReplyOff: {
            title: 'Megumin AI',
            body: 'Crimson Demon Clan',
            thumbnailUrl: 'https://files.catbox.moe/6v7y8y.jpg', // Ganti dengan link gambar Megumin pilihanmu
            sourceUrl: 'https://cdn.nekohime.site/file/qD6ee9Uz.jpeg',
            mediaType: 1,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: m })
  
    } catch (e) {
      console.error('[MEGUMIN ERROR]', e)
      m.reply('W-Waga na wa... aduh, aku kehabisan mana! (API Error)')
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
