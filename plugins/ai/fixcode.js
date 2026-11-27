// ai/fixcode — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "fixcode",
    "perbaikikode"
  ],
  "category": "ai",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur fixcode",
  "usage": ".fixcode <kode>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/ai/fixcode", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/fixcode.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
      const q = m.quoted ? m.quoted : m;
      const codeText = text || q.text;
      if (!codeText) return m.reply(`⚠️ Masukkan atau reply kode yang ingin diperbaiki!\nContoh: ${usedPrefix + command} const a = 1; a = 2;`);
      
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      
      const response = await fetch(`${global.web}/api/ai/fixcode?apikey=${global.apikey?.vxapi}&code=${encodeURIComponent(codeText)}&model=gpt-4o`);
      const json = await response.json();
      
      let resultText = '';
      if (json.status && json.result) {
        resultText = typeof json.result === 'object' ? (json.result.code || json.result.fixed || json.result.response || json.result.result || json.result.message || JSON.stringify(json.result, null, 2)) : json.result;
      } else if (json.status && json.data) {
        resultText = typeof json.data === 'object' ? (json.data.code || json.data.fixed || json.data.response || json.data.result || json.data.message || JSON.stringify(json.data, null, 2)) : json.data;
      } else {
        throw new Error(json.error || json.message || "Gagal memperbaiki kode");
      }
      
      await m.reply(String(resultText).trim());
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply("❌ Error: " + (e.message || e));
    }
  };
  
  handler.help = ["fixcode <kode>"];
  handler.tags = ["ai", "tools"];
  handler.command = ["fixcode", "perbaikikode"];
  handler.limit = true;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
