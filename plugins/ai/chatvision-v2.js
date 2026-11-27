// ai/chatvision-v2 — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "chatvision-v2",
    "chatvisionv2",
    "visionv2"
  ],
  "category": "ai",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur chatvision-v2",
  "usage": ".chatvision-v2 <prompt> (reply image)"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/ai/chatvision-v2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/chatvision-v2.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const FormData = __vxDef(require("form-data"));
  const axios = __vxDef(require("axios"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
      const q = m.quoted ? m.quoted : m;
      const mime = q?.msg?.mimetype || q?.mimetype || "";
  
      if (!/image/.test(mime)) {
        return m.reply(`⚠️ Reply gambar dengan caption ${usedPrefix + command} <prompt>\nContoh: ${usedPrefix + command} jelaskan gambar ini`);
      }
      
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
      const media = await q.download();
      const formData = new FormData();
      formData.append("file", media, { filename: "image.jpg", contentType: "image/jpeg" });
      formData.append("prompt", text || "Jelaskan gambar ini secara rinci");
  
      const response = await axios.post(`${global.web}/api/ai/chatvision-v2?apikey=${global.apikey?.vxapi}`, formData, {
        headers: formData.getHeaders(),
        timeout: 60000
      });
      
      const json = response.data;
      let resultText = '';
      if (json.status && json.result) {
        resultText = typeof json.result === 'object' ? (json.result.answer || json.result.response || json.result.reply || json.result.message || JSON.stringify(json.result, null, 2)) : json.result;
      } else if (json.status && json.data) {
        resultText = typeof json.data === 'object' ? (json.data.answer || json.data.response || json.data.reply || json.data.message || JSON.stringify(json.data, null, 2)) : json.data;
      } else if (json.status && json.answer) {
        resultText = typeof json.answer === 'object' ? JSON.stringify(json.answer, null, 2) : json.answer;
      } else {
        throw new Error(json.error || json.detail || json.message || "Gagal menganalisis gambar");
      }
  
      await m.reply(String(resultText).trim());
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply("❌ Error: " + (e.response?.data?.error || e.message || "Terjadi kesalahan internal"));
    }
  };
  
  handler.help = ["chatvision-v2 <prompt> (reply image)"];
  handler.tags = ["ai"];
  handler.command = ["chatvision-v2", "chatvisionv2", "visionv2"];
  handler.limit = true;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
