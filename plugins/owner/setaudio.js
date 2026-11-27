// media/setaudio — satu file: metadata + kode fitur (gabungan dari engine7/plugins/media/setaudio.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "setaudio",
  "command": [
    "setaudio"
  ],
  "category": "owner",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/media").split('\\').join('/')
module.exports = __vx.plugin("media/setaudio", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setaudio.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  
  const pluginConfig = {
    name: "setaudio",
    alias: [],
    category: "media",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, prefix, command }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    try {
      const quoted = m.quoted || m
      const mime = quoted?.mimetype || ''
  
      if (!mime.startsWith('audio/')) return m.reply(`Kirim/reply audio dulu!\nContoh: reply audio lalu ketik *${usedPrefix}${command}*`)
  
      const filePath = '../../media/tes.mp3'
      const buffer = await quoted.download()
  
      fs.writeFileSync(filePath, buffer)
      m.reply('✅ Audio menu berhasil diupdate!')
  
    } catch (e) {
      console.error(e)
      m.reply('Error: ' + e.message)
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
