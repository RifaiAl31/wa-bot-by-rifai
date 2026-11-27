// game/game-tebakwarna — satu file: metadata + kode fitur (gabungan dari engine2/plugins/game/game-tebakwarna.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "whowarna"
  ],
  "category": "game",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur whowarna (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/game-tebakwarna", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/game-tebakwarna.js'
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
  
  async function scrapeWarna() {
    try {
      const res = await axios.get('https://raw.githubusercontent.com/siputzx/databasee/main/games/butawarna.json', { timeout: 30000 })
      const list = res.data.filter(v => v.correct && v.image && v.image.startsWith('http'))
      if (!list.length) throw new Error('Database warna tidak valid')
      const pick = list[Math.floor(Math.random() * list.length)]
      return { img: pick.image, answer: String(pick.correct) }
    } catch (e) {
      throw new Error('Gagal mengambil data warna!')
    }
  }
  
  let timeout = 60000
  
  let handler = async (m, { conn, command }) => {
    conn.tebakwarna = conn.tebakwarna || {}
    const chat = m.chat
    let room = conn.tebakwarna[chat]
  
    if (command === 'tebakwarna') {
      if (room && room.jawaban) return m.reply('❌ Masih ada soal yang belum terjawab!', m)
      let data
      try { data = await scrapeWarna() } catch (e) { return m.reply('❌ Gagal mengambil data warna!', m) }
      await conn.sendFile(chat, data.img, 'warna.jpg', `🎨 *TES BUTA WARNA (Ishihara)*
  
  Kamu melihat angka berapa pada gambar ini?
  ⏳ Timeout: *${timeout / 1000} detik*
  Jawab langsung.`, m)
  
      conn.tebakwarna[chat] = {
        jawaban: normalize(data.answer),
        rawJawaban: data.answer,
        player: m.sender,
        isGame: true,
        timeout: setTimeout(() => {
          conn.reply(chat, `❌ Waktu habis!
  Jawaban: *${data.answer}*`)
          delete conn.tebakwarna[chat]
        }, timeout)
      }
    }
  
    if (command === 'whowarna') {
      room = conn.tebakwarna[chat]
      if (!room || !room.jawaban) return m.reply('❌ Tidak ada game aktif.', m)
      let ans = room.rawJawaban || room.jawaban
      let hint = ans[0] + '_'.repeat(Math.max(ans.length - 2, 1)) + ans[ans.length - 1]
      return m.reply(`🧩 *KLU:* ${hint}`, m)
    }
  }
  
  handler.all = async function (m) {
    this.tebakwarna = this.tebakwarna || {}
    const room = this.tebakwarna[m.chat]
    if (!room || !room.jawaban) return
    let text = normalize(m.text)
    if (!text) return
  
    if (text === room.jawaban) {
      clearTimeout(room.timeout)
      let hadiah = rewardLimit(m.sender)
      this.reply(m.chat, winnerText(m.sender, hadiah, 'Tebak Warna', `Jawaban: *${room.rawJawaban}*`), m, { mentions: [m.sender] })
      delete this.tebakwarna[m.chat]
      return true
    }
  }
  
  handler.help = ['tebakwarna']
  handler.tags = ['game']
  handler.command = /^(tebakwarna|whowarna)$/i
  handler.limit = false
  const __vxDefault = handler
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
