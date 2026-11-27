// game/tebakgambar — satu file: metadata + kode fitur (gabungan dari engine1/plugins/game/tebakgambar.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "tebakgambar",
  "command": [
    "guessimage"
  ],
  "category": "game",
  "desc": "Tebak kata dari gambar",
  "usage": ".tebakgambar",
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
module.exports = __vx.plugin("game/tebakgambar", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tebakgambar.js'
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
  const { fetchBuffer } = require("../../lib/ext/src/lib/functions.js");
  
  const pluginConfig = {
      name: 'tebakgambar',
      alias: ['guessimage'],
      category: 'game',
      description: 'Tebak kata dari gambar',
      usage: '.tebakgambar',
      example: '.tebakgambar',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  };
  
  async function handler(m, { sock }) {
      const chatId = m.chat;
      
      if (hasActiveSession(chatId)) {
          const session = getSession(chatId);
          if (session && session.gameType === 'tebakgambar') {
              const remaining = getRemainingTime(chatId);
              let text = `⚠️ *Eh ada game jalan nih, jawab dulu!*\n\n`;
              text += `💡 Hint: *${getHint(session.question.jawaban, 3)}*\n`;
              text += `⏱️ Sisa: *${formatRemainingTime(remaining)}*\n\n`;
              text += `_Reply pesan gambar untuk menjawab atau ketik "nyerah"_`;
              await m.reply(text);
              return;
          }
      }
      
      const question = getRandomItem('tebakgambar.json');
      if (!question) {
          await m.reply('❌ *Ehh~* Data game tidak tersedia~ 🥺');
          return;
      }
      
      try {
          const imageBuffer = await fetchBuffer(question.img);
          
          let caption = `🖼️ *TEBAK GAMBAR*\n\n`;
          caption += `💡 Hint: *${getHint(question.jawaban, 3)}*\n`;
          caption += `⏱️ Waktu: *90 detik*\n`;
          caption += `🎁 Hadiah: *Limit, Koin, EXP (random)*\n\n`;
          caption += `_Jawab langsung atau ketik "nyerah"\nSetiap salah, hint akan bertambah_`;
          
          // NOTE: Soal berupa gambar asli — SENGAJA selalu pakai V1 (getGameContextInfo), tidak
          // boleh di-branch ke V2 (fake document trick tidak bisa menampilkan gambar soal).
          const sentMsg = await sock.sendMessage(chatId, {
              image: imageBuffer,
              caption: caption,
              contextInfo: getGameContextInfo('🖼️ TEBAK GAMBAR', 'Tebak dari gambar!')
          }, { quoted: m });
          
          createSession(chatId, 'tebakgambar', question, sentMsg.key, 90000);
          
          setSessionTimer(chatId, async () => {
              let timeoutText = `⏱️ *Yah telat, waktu habis!*\n\n`;
              timeoutText += `Jawaban: *${question.jawaban}*\n\n`;
              timeoutText += `_Gak ada yang bisa jawab nih~_`;
              await m.reply(timeoutText);
          });
      } catch (error) {
          await m.reply('❌ *Gomen ne~* Gagal mengambil gambar. Coba lagi~ 🥺');
      }
  }
  
  async function answerHandler(m, sock) {
      const chatId = m.chat;
      const session = getSession(chatId);
      
      if (!session || session.gameType !== 'tebakgambar') return false;
      
      const userAnswer = (m.body || '').trim();
      if (!userAnswer || userAnswer.startsWith('.')) return false;
      
      if (isSurrender(userAnswer)) {
          endSession(chatId);
          let text = `🏳️ *Yahhh nyerah deh...*\n\n`;
          text += `Jawaban: *${session.question.jawaban}*\n\n`;
          text += `_@${m.sender.split('@')[0]} menyerah_`;
          await m.reply(text, { mentions: [m.sender] });
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
          
          let text = `✨ *KEREN ABIS! Lu emang pinter!*\n\n`;
          text += `Jawaban: *${session.question.jawaban}*\n`;
          text += `Pemenang: *@${m.sender.split('@')[0]}*\n`;
          text += `Percobaan: *${session.attempts}x*\n\n`;
          text += `🎁 +${totalLimit} Limit, +${totalBalance} Koin, +${totalExp} EXP`;
          text += bonusText;
          
          await m.reply(text, { mentions: [m.sender] });
          return true;
      }
      
      if (result.status === 'close') {
          const remaining = getRemainingTime(chatId);
          const percent = Math.round(result.similarity * 100);
          await m.react('🔥');
          await m.reply(`🔥 *Hampir!* Jawabanmu *${percent}%* mirip!\n_Sisa waktu: *${formatRemainingTime(remaining)}*_`);
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
  
  module.exports = {
      config: pluginConfig,
      handler,
      answerHandler
  };
  return module.exports
})
