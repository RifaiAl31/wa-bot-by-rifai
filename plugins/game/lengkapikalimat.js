// game/lengkapikalimat — satu file: metadata + kode fitur (gabungan dari engine7/plugins/game/lengkapikalimat.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "lengkapikalimat",
  "command": [
    "lengkapikalimat"
  ],
  "category": "game",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/lengkapikalimat", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/lengkapikalimat.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fs = __vxDef(require("fs"));
  const similarity = __vxDef(require("similarity"));
  
  let timeout = 120000
  let poin = 4999
  const threshold = 0.72
  
  const pluginConfig = {
    name: "lengkapikalimat",
    alias: [],
    category: "game",
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
  
  async function handler(m, { sock, prefix }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat : {}
  
    let id = m.chat
    if (id in conn.lengkapikalimat)
      return m.reply('Masih ada soal yang belum terjawab di chat ini!')
  
    let src = JSON.parse(fs.readFileSync('../../json/lengkapikalimat.json'))
    let json = src[Math.floor(Math.random() * src.length)]
  
    let soal = json.soal || '-'
    let jawaban = (json.jawaban || '').toLowerCase().trim()
  
    let caption = `
  *LENGKAPI KALIMAT*
  
  ${soal}
  
  ⏱️ Timeout ${(timeout / 1000)} detik
  💎 Bonus ${poin} XP
  
  Ketik *nyerah* untuk menyerah
  `.trim()
  
    let msg = await m.reply(caption)
  
    conn.lengkapikalimat[id] = [
      msg,
      { soal, jawaban },
      poin,
      setTimeout(() => {
        if (conn.lengkapikalimat[id]) {
          m.reply(`⏰ Waktu habis!\nJawaban: *${jawaban}*`)
          delete conn.lengkapikalimat[id]
        }
      }, timeout)
    ]
  }
  
  
  handler.before = async function (m, { conn }) {
    conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat : {}
  
    let id = m.chat
    if (!(id in conn.lengkapikalimat)) return
  
    let [msg, data, poin, time] = conn.lengkapikalimat[id]
    if (!m.text) return
  
    let teks = m.text.toLowerCase().replace(/\s+/g, ' ').trim()
    let jawaban = data.jawaban
  
    if (/^((me)?nyerah|surr?ender)$/i.test(teks)) {
      clearTimeout(time)
      delete conn.lengkapikalimat[id]
      m.reply(`🏳️ *Menyerah!*\nJawaban: *${jawaban}*`)
      return true
    }
  
    if (teks === jawaban) {
      clearTimeout(time)
      delete conn.lengkapikalimat[id]
      global.db.data.users[m.sender].exp += poin
      m.reply(`✅ *Benar!*\nJawaban: *${jawaban}*\n+${poin} XP`)
      return true
    }
  
    if (similarity(teks, jawaban) >= threshold) {
      m.reply('🤏 Dikit lagi!')
      return true
    }
  
    return true
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
