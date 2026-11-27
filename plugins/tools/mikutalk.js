// tools/mikutalk — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/mikutalk.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "mikutalk",
  "command": [
    "mikutalk"
  ],
  "category": "tools",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/mikutalk", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/mikutalk.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  const pluginConfig = {
    name: "mikutalk",
    alias: [],
    category: "tools",
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
  
  async function handler(m, { sock, text, command }) {
      const conn = sock;
    let apikey = 'planaai'
    if (!text) throw `Kirim teks yang mau diucapkan Miku!\n\nContoh: .${command} Haloo WhatsApp Bot`
    
    await m.react('🎶')
    
    try {
      let res = await fetch(`https://www.sankavolereii.my.id/anime/ttsmiku?apikey=${apikey}&text=${encodeURIComponent(text)}`)
      if (!res.ok) throw await res.text()
  
      let buffer = await res.buffer()
      await conn.sendFile(m.chat, buffer, 'miku.mp3', `🎶 Miku sudah ngomong: ${text}`, m)
      await m.react('✅')
  
    } catch (e) {
      console.error(e)
      await m.reply('❌ Gagal mengambil audio dari API.')
      await m.react('❌')
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
