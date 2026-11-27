// ai/text2music-get — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "text2musicget",
    "text2music-get"
  ],
  "category": "ai",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur text2musicget",
  "usage": ".text2music-get <task_id>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/ai/text2music-get", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/text2music-get.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ Masukkan task_id!\n\nContoh: *${usedPrefix + command} <task_id>*`);
    
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    m.reply('Sedang mengambil data musik... Mohon tunggu.');
    try {
      let apiKey = global.apikey?.vxapi;
      let url = `${global.web}/api/ai/text2music-get?apikey=${apiKey}`;
      
      let res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: text.trim() })
      });
      let json = await res.json();
      
      if (json.status && (json.result || json.data)) {
        let audioUrl = json.result?.audio_url || json.result?.music_url || json.result?.url || json.data?.audio_url || json.data?.url || (typeof json.result === 'string' && json.result.startsWith('http') ? json.result : null);
        if (typeof audioUrl === 'string' && audioUrl.startsWith('http')) {
          await conn.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: 'audio/mp4'
          }, { quoted: m }).catch(e => m.reply("Gagal mengirim media, ini linknya: " + audioUrl));
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } else {
          let statusText = typeof json.result === 'object' ? JSON.stringify(json.result, null, 2) : json.result;
          await m.reply(`📊 *Text2Music Status:*\n` + statusText);
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        }
      } else {
        throw new Error(json.error || json.message || 'Gagal mengambil musik');
      }
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply('❌ Error: ' + (e.message || 'Terjadi kesalahan pada server.'));
    }
  };
  
  handler.help = ['text2music-get <task_id>'];
  handler.tags = ['ai'];
  handler.command = /^text2musicget|text2music-get$/i;
  handler.limit = 1;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
