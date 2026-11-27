// ai/nova-ai — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "nova-ai",
    "novaai"
  ],
  "category": "ai",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur nova-ai",
  "usage": ".nova-ai <teks>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/ai/nova-ai", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/nova-ai.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
      if (!text) return m.reply(`⚠️ Masukkan pertanyaan/prompt!\nContoh: ${usedPrefix + command} halo`);
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      
      const response = await fetch(`${global.web}/api/ai/nova-ai?apikey=${global.apikey?.vxapi}&text=${encodeURIComponent(text)}`);
      const json = await response.json();
      
      let resultText = '';
      if (json.status && json.result) {
        resultText = typeof json.result === 'object' ? (json.result.answer || json.result.response || json.result.reply || json.result.message || json.result.text || JSON.stringify(json.result, null, 2)) : json.result;
      } else if (json.status && json.data) {
        resultText = typeof json.data === 'object' ? (json.data.answer || json.data.response || json.data.reply || json.data.message || json.data.text || JSON.stringify(json.data, null, 2)) : json.data;
      } else if (json.status && json.answer) {
        resultText = typeof json.answer === 'object' ? JSON.stringify(json.answer, null, 2) : json.answer;
      } else {
        throw new Error(json.error || json.message || "Gagal mendapatkan respons Nova AI");
      }
      
      await m.reply(String(resultText).trim());
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply("❌ Error: " + (e.message || e));
    }
  };
  
  handler.help = ["nova-ai <teks>"];
  handler.tags = ["ai"];
  handler.command = ["nova-ai", "novaai"];
  handler.limit = true;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
