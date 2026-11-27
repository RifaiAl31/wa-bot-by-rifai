// tools/spamapibottele — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "spamapibottele",
    "spamtele",
    "telebotspam"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur spamapibottele",
  "usage": ".spamapibottele <token>|<chat_id>|<text>|<limit>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/spamapibottele", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/spamapibottele.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text || !text.includes('|')) {
          return m.reply(`🤖 *SPAM TELEGRAM BOT API*\n\nFormat: *${usedPrefix + command} <token>|<chat_id>|<pesan>|<limit>*\nContoh:\n${usedPrefix + command} 12345:ABCDEF|123456789|Halo selamat pagi|5`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let [token, chat_id, messageText, limit] = text.split('|').map(s => s.trim());
          let count = parseInt(limit || '5');
          if (isNaN(count) || count < 1) count = 5;
  
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/spamapibottele?apikey=${apiKey}&token=${encodeURIComponent(token)}&chat_id=${encodeURIComponent(chat_id)}&text=${encodeURIComponent(messageText)}&limit=${count}`;
  
          let res = await fetch(apiUrl);
          let json = await res.json();
  
          if (!json.status) throw new Error(json.error || json.message || "Gagal mengirim pesan Telegram.");
  
          let caption = `🤖 *TELEGRAM BOT SPAM BERHASIL*\n\n`;
          caption += `🎯 *Target Chat ID:* ${chat_id}\n`;
          caption += `📊 *Jumlah:* ${count} Pesan\n\n`;
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          await m.reply(caption);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *Spam Telegram Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['spamapibottele <token>|<chat_id>|<text>|<limit>'];
  handler.tags = ['tools'];
  handler.command = /^(spamapibottele|spamtele|telebotspam)$/i;
  handler.owner = true;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
