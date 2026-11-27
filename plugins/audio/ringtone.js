// music/ringtone — satu file: metadata + kode fitur (gabungan dari engine7/plugins/music/ringtone.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "ringtone",
  "command": [
    "ringtone"
  ],
  "category": "audio",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/music").split('\\').join('/')
module.exports = __vx.plugin("music/ringtone", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ringtone.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  // plugins/ringtone.js
  // Ringtone Downloader
  // API : https://anabot.my.id
  // Author : WhatsApp Bot
  
  const fetch = __vxDef(require("node-fetch"));
  
  const pluginConfig = {
    name: "ringtone",
    alias: [],
    category: "music",
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
  
  async function handler(m, { sock, text, prefix, command }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) throw `Contoh: ${usedPrefix + command} Iphone`
  
    await m.reply('✨cihuy otw cari ringtone...')
  
    try {
      let url = `https://anabot.my.id/api/download/ringtone?query=${encodeURIComponent(text)}&apikey=${(global.apiKeys && global.apiKeys.anabot) || ''}`
      let res = await fetch(url)
      let json = await res.json()
  
      if (!json.success || !json.data?.result?.length) 
        throw '❌ Ringtone tidak ditemukan.'
  
      let result = json.data.result
  
      for (let audio of result) {
        // kirim audio biasa 
        await conn.sendFile(
          m.chat,
          audio.audio,
          `${audio.title}.mpeg`,
          `🎵 *${audio.title}*`,
          m,
          false, 
          {
            mimetype: 'audio/mpeg'
          }
        )
        await new Promise(resolve => setTimeout(resolve, 1500)) // delay 1.5s biar ga spam
      }
  
    } catch (e) {
      console.error(e)
      m.reply('⚠️ Error: ' + e.message)
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
