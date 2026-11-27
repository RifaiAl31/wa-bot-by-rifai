// game/tebakgame — satu file: metadata + kode fitur (gabungan dari engine1/plugins/game/tebakgame.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "tebakgame",
  "command": [
    "tgame",
    "guessgame"
  ],
  "category": "game",
  "desc": "Tebak nama game dari gambar",
  "usage": ".tebakgame",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/tebakgame", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tebakgame.js'
  const module = { exports: {} }; const exports = module.exports;
  const axios = require('axios')
  
  const {
      createSession,
      getSession,
      endSession,
      checkAnswerAdvanced,
      getHint,
      hasActiveSession,
      setSessionTimer,
      getRemainingTime,
      formatRemainingTime,
      isSurrender,
      isReplyToGame,
      getRandomReward,
      getProgressiveHint
  } = require("../../lib/ext/src/lib/gameData.js")
  
  const { getDatabase } = require("../../lib/ext/src/lib/database.js")
  const { addExpWithLevelCheck } = require("../../lib/ext/src/lib/levelHelper.js")
  const {
      getGameContextInfo,
      checkFastAnswer
  } = require("../../lib/ext/src/lib/contextHelper.js")
  
  const { fetchBuffer } = require("../../lib/ext/src/lib/functions.js")
  
  const pluginConfig = {
      name: 'tebakgame',
      alias: ['tgame', 'guessgame'],
      category: 'game',
      description: 'Tebak nama game dari gambar',
      usage: '.tebakgame',
      example: '.tebakgame',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const chatId = m.chat
  
      if (hasActiveSession(chatId)) {
          const session = getSession(chatId)
  
          if (session && session.gameType === 'tebakgame') {
              const remaining = getRemainingTime(chatId)
  
              let text = `⚠️ *Masih ada game yang belum selesai!*\n\n`
              text += `💡 Hint: *${getHint(session.question.jawaban, 3)}*\n`
              text += `⏱️ Sisa waktu: *${formatRemainingTime(remaining)}*\n\n`
              text += `_Reply gambar game untuk menjawab atau ketik "nyerah"_`
  
              return m.reply(text)
          }
      }
  
      try {
          const { data } = await axios.get('https://api.theresav.biz.id/game/tebakgame')
  
          if (!data.status || !data.result) {
              return m.reply('❌ *Ehh~* Soal game tidak tersedia~ 🥺')
          }
  
          const question = {
              img: data.result.img,
              jawaban: data.result.jawaban
          }
  
          const imageBuffer = await fetchBuffer(question.img)
  
          let caption = `🎮 *TEBAK GAME*\n\n`
          caption += `💡 Hint: *${getHint(question.jawaban, 3)}*\n`
          caption += `⏱️ Waktu: *90 detik*\n`
          caption += `🎁 Hadiah: *Limit, Koin, EXP (random)*\n\n`
          caption += `_Jawab nama game dari gambar di atas_\n`
          caption += `_Ketik "nyerah" untuk menyerah_`
  
          // NOTE: Soal berupa gambar asli — SENGAJA selalu pakai V1 (getGameContextInfo), tidak
          // boleh di-branch ke V2 (fake document trick tidak bisa menampilkan gambar soal).
          const sentMsg = await sock.sendMessage(chatId, {
              image: imageBuffer,
              caption,
              contextInfo: getGameContextInfo(
                  '🎮 TEBAK GAME',
                  'Tebak nama game dari gambar!'
              )
          }, { quoted: m })
  
          createSession(
              chatId,
              'tebakgame',
              question,
              sentMsg.key,
              90000
          )
  
          setSessionTimer(chatId, async () => {
              let timeoutText = `⏱️ *Waktu habis!*\n\n`
              timeoutText += `🎮 Jawaban: *${question.jawaban}*\n\n`
              timeoutText += `_Tidak ada yang berhasil menjawab_`
  
              await m.reply(timeoutText)
          })
  
      } catch (error) {
          console.error(error)
          m.reply('❌ *Gomen ne~* Gagal mengambil soal game~ 🥺')
      }
  }
  
  async function answerHandler(m, sock) {
      const chatId = m.chat
      const session = getSession(chatId)
  
      if (!session || session.gameType !== 'tebakgame') return false
  
      const userAnswer = (m.body || '').trim()
  
      if (!userAnswer || userAnswer.startsWith('.')) return false
  
      if (isSurrender(userAnswer)) {
          endSession(chatId)
  
          let text = `🏳️ *Yah menyerah...*\n\n`
          text += `🎮 Jawaban: *${session.question.jawaban}*\n\n`
          text += `_@${m.sender.split('@')[0]} menyerah_`
  
          await m.reply(text, {
              mentions: [m.sender]
          })
  
          return true
      }
  
      if (!isReplyToGame(m, session)) return false
  
      session.attempts++
  
      const result = checkAnswerAdvanced(
          session.question.jawaban,
          userAnswer
      )
  
      if (result.status === 'correct') {
          endSession(chatId)
  
          const db = getDatabase()
          const user = db.getUser(m.sender)
  
          const reward = getRandomReward()
  
          let totalLimit = reward.limit
          let totalBalance = reward.koin
          let totalExp = reward.exp
          let bonusText = ''
  
          const fastResult = checkFastAnswer(session)
  
          if (fastResult.isFast) {
              totalLimit += fastResult.bonus.limit
              totalBalance += fastResult.bonus.koin
              totalExp += fastResult.bonus.exp
  
              bonusText =
                  `\n\n${fastResult.praise}\n` +
                  `⚡ *BONUS KILAT:* +${fastResult.bonus.limit} Limit, +${fastResult.bonus.koin} Koin\n` +
                  `⏱️ Waktu: *${(fastResult.elapsed / 1000).toFixed(1)}s*`
          }
  
          db.updateEnergi(m.sender, totalLimit)
          db.updateKoin(m.sender, totalBalance)
  
          if (!user.rpg) user.rpg = {}
  
          await addExpWithLevelCheck(
              sock,
              m,
              db,
              user,
              totalExp
          )
  
          db.save()
  
          let text = `🎉 *BENAR! Keren banget!* \n\n`
          text += `🎮 Jawaban: *${session.question.jawaban}*\n`
          text += `👑 Pemenang: *@${m.sender.split('@')[0]}*\n`
          text += `📊 Percobaan: *${session.attempts}x*\n\n`
          text += `🎁 +${totalLimit} Limit, +${totalBalance} Koin, +${totalExp} EXP`
          text += bonusText
  
          await m.reply(text, {
              mentions: [m.sender]
          })
  
          return true
      }
  
      if (result.status === 'close') {
          const remaining = getRemainingTime(chatId)
          const percent = Math.round(result.similarity * 100)
  
          await m.react('🔥')
  
          await m.reply(
              `🔥 *Hampir benar!* Jawabanmu *${percent}%* mirip!\n` +
              `_Sisa waktu: *${formatRemainingTime(remaining)}*_`
          )
  
          return false
      }
  
      const remaining = getRemainingTime(chatId)
  
      if (remaining > 0 && session.attempts < 10) {
          await m.react('❌')
  
          const hint = getProgressiveHint(
              session.question.jawaban,
              session.attempts
          )
  
          await m.reply(
              `❌ Masih salah!\n` +
              `💡 Hint: *${hint}*\n` +
              `_Sisa waktu: *${formatRemainingTime(remaining)}*_`
          )
      }
  
      return false
  }
  
  module.exports = {
      config: pluginConfig,
      handler,
      answerHandler
  }
  return module.exports
})
