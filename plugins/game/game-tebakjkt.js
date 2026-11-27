// game/game-tebakjkt — satu file: metadata + kode fitur (gabungan dari engine2/plugins/game/game-tebakjkt.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "tebakjkt",
    "whojkt"
  ],
  "category": "game",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur tebakjkt (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/game-tebakjkt", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/game-tebakjkt.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }
  
  function rewardLimit(sender) {
    let hadiah = Math.floor(Math.random() * 10) + 1
    let user = global.db.data.users[sender]
    if (user) {
      if (!user.limit) user.limit = 0
      user.limit += hadiah
    }
    return hadiah
  }
  
  function winnerText(sender, hadiah, gameName, answerExtra) {
    return `🎉 *BENAR!*\n\n🎮 Game : ${gameName}\n👤 Pemenang: @${sender.split('@')[0]}\n🎁 Reward: +${hadiah} Limit${answerExtra ? '\n' + answerExtra : ''}`
  }
  
  async function scrapeJKT() {
    try {
      const res = await axios.get('https://raw.githubusercontent.com/siputzx/tebak-jkt/main/tebak.json', { timeout: 30000 })
      const list = res.data
      const pick = list[Math.floor(Math.random() * list.length)]
      if (!pick.gambar || !pick.jawaban) throw new Error('Invalid data JKT')
      return { img: pick.gambar, answer: pick.jawaban }
    } catch (e) {
      throw new Error('Gagal mengambil data JKT!')
    }
  }
  
  let timeout = 60000
  
  let handler = async (m, { conn, command }) => {
    conn.tebakjkt = conn.tebakjkt || {}
    const chat = m.chat
    let room = conn.tebakjkt[chat]
  
    if (command === 'tebakjkt') {
      if (room && room.jawaban) return conn.reply(chat, 'Masih ada game yang belum selesai.', m)
      const data = await scrapeJKT()
  
      await conn.sendMessage(chat, {
        image: { url: data.img },
        caption: `🎀 *TEBAK MEMBER JKT48*
  
  Siapakah member pada gambar ini?
  ⏳ Timeout: ${timeout / 1000} detik
  Ketik *whojkt* untuk klu.
  Jawab langsung.`
      }, { quoted: m })
  
      conn.tebakjkt[chat] = {
        jawaban: normalize(data.answer),
        rawJawaban: data.answer,
        player: m.sender,
        isGame: true,
        timeout: setTimeout(() => {
          conn.reply(chat, `❌ Waktu habis!
  Jawaban: *${data.answer}*`)
          delete conn.tebakjkt[chat]
        }, timeout)
      }
    }
  
    if (command === 'whojkt') {
      room = conn.tebakjkt[chat]
      if (!room || !room.jawaban) return conn.reply(chat, '❌ Tidak ada game aktif.', m)
      const ans = room.rawJawaban || room.jawaban
      const hint = ans[0] + '_'.repeat(Math.max(ans.length - 2, 1)) + ans[ans.length - 1]
      return conn.reply(chat, `🧩 *KLU:* ${hint}`, m)
    }
  }
  
  handler.all = async function (m) {
    this.tebakjkt = this.tebakjkt || {}
    const room = this.tebakjkt[m.chat]
    if (!room || !room.jawaban) return
    const text = normalize(m.text)
    if (!text) return
  
    if (text === room.jawaban || text.includes(room.jawaban) || room.jawaban.includes(text)) {
      clearTimeout(room.timeout)
      let hadiah = rewardLimit(m.sender)
      this.reply(m.chat, winnerText(m.sender, hadiah, 'Tebak JKT48', `Jawaban: *${room.rawJawaban}*`), m, { mentions: [m.sender] })
      delete this.tebakjkt[m.chat]
      return true
    }
  }
  
  handler.help = ['tebakjkt']
  handler.tags = ['game']
  handler.command = /^(tebakjkt|whojkt)$/i
  handler.limit = false
  const __vxDefault = handler
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
