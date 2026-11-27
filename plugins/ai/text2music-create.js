// ai/text2music-create — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "text2musiccreate",
    "text2music-create"
  ],
  "category": "ai",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur text2musiccreate",
  "usage": ".text2music-create <prompt>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/ai/text2music-create", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/text2music-create.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ Masukkan prompt musik!\n\nContoh: *${usedPrefix + command} cinematic piano music*`);
    
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    m.reply('Sedang memproses pembuatan musik... Mohon tunggu.');
    try {
      let apiKey = global.apikey?.vxapi;
      let url = `${global.web}/api/ai/text2music-create?apikey=${apiKey}`;
      
      let res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text || '', duration: 30 })
      });
      let json = await res.json();
      
      if (json.status && (json.result || json.data)) {
        let taskId = json.result?.task_id || json.data?.task_id || json.result || json.data;
        await m.reply(`✅ *Text2Music Task Created!*\n🆔 *Task ID:* ${taskId}\n\n_Gunakan ${usedPrefix}text2music-get ${taskId} untuk mengambil audio._`);
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
      } else {
        throw new Error(json.error || json.message || 'Gagal memproses pembuatan musik');
      }
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply('❌ Error: ' + (e.message || 'Terjadi kesalahan pada server.'));
    }
  };
  
  handler.help = ['text2music-create <prompt>'];
  handler.tags = ['ai'];
  handler.command = /^text2musiccreate|text2music-create$/i;
  handler.limit = 1;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
