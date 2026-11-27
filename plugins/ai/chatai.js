// ai/chatai — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "chatai",
    "ai2"
  ],
  "category": "ai",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur chatai",
  "usage": ".chatai <teks/gambar>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/ai/chatai", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/chatai.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const FormData = __vxDef(require("form-data"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
      const q = m.quoted ? m.quoted : m;
      const mime = (q.msg || q).mimetype || '';
      const isImage = /image/.test(mime);
  
      if (!text && !isImage) {
        return m.reply(`⚠️ Masukkan pertanyaan atau kirim/reply gambar dengan caption!\n\nContoh:\n${usedPrefix + command} siapa presiden pertama indonesia?\n(Reply Gambar) ${usedPrefix + command} jelaskan gambar ini`);
      }
  
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
      if (isImage) {
        const imgBuffer = await q.download();
        const form = new FormData();
        form.append('file', imgBuffer, {
          filename: 'image.jpg',
          contentType: 'image/jpeg'
        });
        form.append('prompt', text || 'Jelaskan gambar ini secara mendalam');
        form.append('model', 'gpt-4o');
  
        const response = await axios.post(`${global.web}/api/ai/chatvision?apikey=${global.apikey?.vxapi}`, form, {
          headers: form.getHeaders(),
          timeout: 60000
        });
  
        const data = response.data;
        if (!data.status) throw new Error(data.error || data.message || "Gagal menganalisis gambar");
        
        let answer = data.result?.answer || data.result?.response || data.result?.text || data.result || data.answer || data.data;
        if (typeof answer === 'object') answer = JSON.stringify(answer, null, 2);
        
        await m.reply(String(answer).trim());
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
      } else {
        const apiUrl = `${global.web}/api/ai/chatai?apikey=${global.apikey?.vxapi}&prompt=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 60000 });
        const data = response.data;
        
        if (!data.status) throw new Error(data.error || data.message || "Gagal mendapatkan respon AI");
        
        let answer = data.result?.answer || data.result?.response || data.result?.text || data.result || data.answer || data.data;
        if (typeof answer === 'object') answer = JSON.stringify(answer, null, 2);
        
        await m.reply(String(answer).trim());
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
      }
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply(`❌ Error: ${e.response?.data?.error || e.message || "Terjadi kesalahan internal"}`);
    }
  };
  
  handler.help = ["chatai <teks/gambar>"];
  handler.tags = ["ai"];
  handler.command = ["chatai", "ai2", "simi2"];
  handler.limit = true;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
