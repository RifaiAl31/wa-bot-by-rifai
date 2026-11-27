// ai/roboguru — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/roboguru.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "roboguru",
  "command": [
    "roboguru"
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
module.exports = __vx.plugin("ai/roboguru", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/roboguru.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  const pluginConfig = {
    name: "roboguru",
    alias: [],
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
  
  async function handler(m, { sock, text, prefix, command }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) {
      return m.reply(`Example: ${usedPrefix + command} 1+1`)
    }
  
    await conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key }
    })
  
    try {
      let url = API('lol', '/api/roboguru', {
        query: text,
        grade: 'sma',
        subject: 'sejarah'
      })
  
      let res = await fetch(url)
      let json = await res.json()
  
      if (json.status !== 200 || !json.result?.length) {
        return m.reply('Tidak ditemukan jawaban untuk pertanyaan itu')
      }
  
      let q = json.result[0].question
      let a = json.result[0].answer
  
      let msg = `📘 *RoboGuru*\n\n*Pertanyaan:*\n${q}\n\n*Jawaban:*\n${a}`
  
      m.reply(msg)
  
    } catch (e) {
      m.reply('Terjadi kesalahan saat mengambil data dari Lolhuman')
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
