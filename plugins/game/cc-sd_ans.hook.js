// game/cc-sd_ans — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.module("vxnew/game/cc-sd_ans", async function () {
  const __dirname = __vdir, __filename = __vdir + "/cc-sd_ans.hook.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const threshold = 0.72
  
  let handler = m => m
  
  handler.before = async function (m) {
      let id = m.chat;
      this.game = this.game ? this.game : {};
      this['cc-sd'] = this['cc-sd'] ? this['cc-sd'] : {};
  
      if (this.game[id] === 'cc-sd' && id in this['cc-sd']) {
          if (!m.text) return !0;
  
          let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text.trim());
          if (isSurrender) {
              clearTimeout(this['cc-sd'][id][2]);
              let ans = this['cc-sd'][id][3] || this['cc-sd'][id][1]?.result?.jawaban;
              let ansDisplay = Array.isArray(ans) ? ans.join(' / ') : ans;
              delete this['cc-sd'][id];
              delete this.game[id];
              return m.reply(`🏳️ *Kamu Menyerah!*\n\nJawabannya adalah: *${ansDisplay}*`);
          }
  
          let rawAns = this['cc-sd'][id][3] || this['cc-sd'][id][1]?.result?.jawaban;
          let input = m.text.toLowerCase().trim();
          let isCorrect = false;
  
          if (Array.isArray(rawAns)) {
              isCorrect = rawAns.some(a => String(a).toLowerCase().trim() === input);
          } else {
              isCorrect = (input === String(rawAns).toLowerCase().trim());
          }
  
          if (isCorrect) {
              if (!global.db.data) global.db.data = {};
              if (!global.db.data.users) global.db.data.users = {};
              if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { exp: 0, limit: 25, coin: 0 };
              
              global.db.data.users[m.sender].exp = (global.db.data.users[m.sender].exp || 0) + 500;
              global.db.data.users[m.sender].coin = (global.db.data.users[m.sender].coin || 0) + 10;
  
              let extraDesc = this['cc-sd'][id][1]?.result?.deskripsi ? `\n\n📝 *Penjelasan:* ${this['cc-sd'][id][1].result.deskripsi}` : '';
              m.reply(`🎉 *BENAR!* 🎉\n\nKamu berhasil menjawab dan mendapatkan *+500 XP* & *+10 Koin*!${extraDesc}`);
  
              clearTimeout(this['cc-sd'][id][2]);
              delete this['cc-sd'][id];
              delete this.game[id];
          } else {
              let answerStr = Array.isArray(rawAns) ? rawAns.join(' / ') : String(rawAns);
              let answer = answerStr.toLowerCase().trim();
              let isClose = false;
              let matchCount = 0;
              for (let i = 0; i < input.length; i++) {
                  if (answer.includes(input[i])) matchCount++;
              }
              if (input.length > 2 && (matchCount / answer.length) >= threshold) {
                  isClose = true;
              }
  
              let isReply = m.quoted && m.quoted.id === this['cc-sd'][id][0]?.key?.id;
              if (isReply) {
                  if (isClose) m.reply('🔥 *Dikit lagi!*');
                  else m.reply('❌ *Salah! Coba lagi.*');
              } else if (!m.quoted && isClose) {
                  m.reply('🔥 *Dikit lagi!*');
              }
          }
      }
      return !0;
  }
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
