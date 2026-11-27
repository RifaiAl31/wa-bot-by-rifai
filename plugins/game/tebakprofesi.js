// game/tebakprofesi — satu file: metadata + kode fitur (gabungan dari engine1/plugins/game/tebakprofesi.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "tebakprofesi",
  "command": [
    "tebakprofesi",
    "tp",
    "guessjob"
  ],
  "category": "game",
  "desc": "Tebak profesi dari deskripsi yang diberikan",
  "usage": ".tebakprofesi",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/tebakprofesi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tebakprofesi.js'
  const module = { exports: {} }; const exports = module.exports;
  const {
      getRandomItem, createSession, getSession, endSession,
      checkAnswerAdvanced, getHint, hasActiveSession, setSessionTimer,
      getRemainingTime, formatRemainingTime, isSurrender, isReplyToGame,
      GAME_REWARD,
      getRandomReward,
      getProgressiveHint
  } = require("../../lib/ext/src/lib/gameData.js");
  const { getDatabase } = require("../../lib/ext/src/lib/database.js");
  const { addExpWithLevelCheck } = require("../../lib/ext/src/lib/levelHelper.js");
  const {getGameContextInfo, getWinnerContextInfo, checkFastAnswer, getGameContextInfoV2 } = require("../../lib/ext/src/lib/contextHelper.js");
  
  const pluginConfig = {
      name: 'tebakprofesi',
      alias: ['tp', 'guessjob'],
      category: 'game',
      description: 'Tebak profesi dari deskripsi yang diberikan',
      usage: '.tebakprofesi',
      example: '.tebakprofesi',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  };
  
  async function handler(m, { sock }) {
      const chatId = m.chat;
  
      if (hasActiveSession(chatId)) {
          const session = getSession(chatId);
          if (session && session.gameType === 'tebakprofesi') {
              const remaining = getRemainingTime(chatId);
              let text = `⚠️ *Eh ada game jalan nih, jawab dulu!*\n\n`;
              text += `\`\`\`${session.question.soal}\`\`\`\n\n`;
              text += `💡 Hint: *${getHint(session.question.jawaban, 2)}*\n`;
              text += `⏱️ Sisa: *${formatRemainingTime(remaining)}*\n\n`;
              text += `_Jawab langsung atau ketik "nyerah"\nSetiap salah, hint akan bertambah_`;
              await m.reply(text);
              return;
          }
      }
  
      const question = getRandomItem('tebakprofesi.json');
      if (!question) {
          await m.reply('❌ *ᴅᴀᴛᴀ ᴛɪᴅᴀᴋ ᴛᴇʀsᴇᴅɪᴀ*\n\n> Ehh~ data game-nya belum tersedia nih... coba lagi nanti ya~ 🥺');
          return;
      }
  
      let text = `👔 *ᴛᴇʙᴀᴋ ᴘʀᴏꜰᴇsɪ*\n\n`;
      text += `\`\`\`${question.soal}\`\`\`\n\n`;
      text += `💡 Hint: *${getHint(question.jawaban, 2)}*\n`;
      text += `⏱️ Waktu: *60 detik*\n`;
      text += `🎁 Hadiah: *Limit, Koin, EXP (random)*\n\n`;
      text += `_Jawab langsung atau ketik "nyerah"\nSetiap salah, hint akan bertambah_`;
  
      const db = getDatabase();
      const contextVariant = db.setting('contextVariant') || 1;
  
      let sentMsg;
      if (contextVariant === 2) {
          sentMsg = await getGameContextInfoV2(sock, chatId, text, { quoted: m });
      } else {
          sentMsg = await sock.sendMessage(chatId, { text, contextInfo: getGameContextInfo('👔 TEBAK PROFESI', 'Tebak profesi dari deskripsi!') }, { quoted: m });
      }
      createSession(chatId, 'tebakprofesi', question, sentMsg.key, 60000);
  
      setSessionTimer(chatId, async () => {
          let timeoutText = `⏱️ *Yah telat, waktu habis!*\n\nJawaban: *${question.jawaban}*\n\n_Gak ada yang bisa jawab nih~_`;
          await m.reply(timeoutText);
      });
  }
  
  async function answerHandler(m, sock) {
      const chatId = m.chat;
      const session = getSession(chatId);
      if (!session || session.gameType !== 'tebakprofesi') return false;
  
      const userAnswer = (m.body || '').trim();
      if (!userAnswer || userAnswer.startsWith('.')) return false;
  
      if (isSurrender(userAnswer)) {
          endSession(chatId);
          await m.reply(`🏳️ *ᴍᴇɴʏᴇʀᴀʜ!*\n\nJawaban: *${session.question.jawaban}*\n\n_@${m.sender.split('@')[0]} menyerah_`, { mentions: [m.sender] });
          return true;
      }
  
      if (!isReplyToGame(m, session)) return false;
  
      session.attempts++;
  
      const result = checkAnswerAdvanced(session.question.jawaban, userAnswer);
  
      if (result.status === 'correct') {
          endSession(chatId);
          const db = getDatabase();
          const user = db.getUser(m.sender);
  
          const reward = getRandomReward();
          let totalLimit = reward.limit;
          let totalBalance = reward.koin;
          let totalExp = reward.exp;
          let bonusText = '';
  
          const fastResult = checkFastAnswer(session);
          if (fastResult.isFast) {
              totalLimit += fastResult.bonus.limit;
              totalBalance += fastResult.bonus.koin;
              totalExp += fastResult.bonus.exp;
              bonusText = `\n\n${fastResult.praise}\n⚡ *BONUS KILAT:* +${fastResult.bonus.limit} Limit, +${fastResult.bonus.koin} Koin\n⏱️ Waktu: *${(fastResult.elapsed / 1000).toFixed(1)}s*`;
          }
  
          db.updateEnergi(m.sender, totalLimit);
          db.updateKoin(m.sender, totalBalance);
          if (!user.rpg) user.rpg = {};
          await addExpWithLevelCheck(sock, m, db, user, totalExp);
          db.save();
  
          let text = `💯 *TOP MARKOTOP! Lu nailed it!*\n\nJawaban: *${session.question.jawaban}*\nPemenang: *@${m.sender.split('@')[0]}*\nPercobaan: *${session.attempts}x*\n\n`;
          text += `🎁 +${totalLimit} Limit, +${totalBalance} Koin, +${totalExp} EXP`;
          text += bonusText;
  
          await m.reply(text, { mentions: [m.sender] });
          return true;
      }
  
      if (result.status === 'close') {
          const remaining = getRemainingTime(chatId);
          await m.react('🔥');
          await m.reply(`🔥 *Hampir!* Jawabanmu *${Math.round(result.similarity * 100)}%* mirip!\n_Sisa waktu: *${formatRemainingTime(remaining)}*_`);
          return false;
      }
  
      const remaining = getRemainingTime(chatId);
      if (remaining > 0 && session.attempts < 10) {
          await m.react('❌');
          const hint = getProgressiveHint(session.question.jawaban, session.attempts);
          await m.reply(`❌ *Belum bener~!* Ayo coba lagi ya, ini hint dari Ai: *${hint}*\n_Sisa waktu: *${formatRemainingTime(remaining)}*_ 🌸`);
      }
      return false;
  }
  
  module.exports = { config: pluginConfig, handler, answerHandler };
  
  return module.exports
})
