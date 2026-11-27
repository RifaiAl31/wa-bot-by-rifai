// tools/hd3 — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "hd3",
    "remini3",
    "superhd",
    "hdv3"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur hd3",
  "usage": ".hd3 (reply gambar)"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/hd3", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/hd3.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const FormData = __vxDef(require("form-data"));
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      let q = m.quoted ? m.quoted : m;
      let mime = (q.msg || q).mimetype || '';
  
      if (!mime || !mime.startsWith('image/')) {
          return m.reply(`✨ *SUPER HD ENHANCER (v3 - Deep Vision)*\n\nBalas atau kirim gambar dengan perintah: *${usedPrefix + command}*`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          m.reply("⏳ Memproses Super HD gambar... Mohon tunggu.");
  
          let media = await q.download();
          if (!media) throw new Error("Gagal mengunduh gambar.");
  
          let scale = text && text.trim() === '4' ? '4' : '2';
  
          let form = new FormData();
          form.append('file', media, { filename: 'image.jpg', contentType: mime });
          form.append('scale', scale);
  
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/hd3?apikey=${apiKey}`;
  
          let res = await fetch(apiUrl, {
              method: 'POST',
              body: form,
              headers: form.getHeaders()
          });
  
          let json = await res.json();
          if (!json.status) throw new Error(json.error || "Gagal memproses Super HD gambar.");
  
          let upscaledUrl = json.result?.upscaled_url;
          if (!upscaledUrl) throw new Error("URL gambar Super HD tidak ditemukan.");
  
          let imgRes = await fetch(upscaledUrl);
          let imgBuffer = await imgRes.buffer();
  
          let caption = `✨ *SUPER HD ENHANCER (v3 - ${json.result?.scale_applied || '2x'})*\n\n`;
          caption += `⚙️ *Engine:* Deep Vision HD\n`;
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          await conn.sendMessage(m.chat, {
              image: imgBuffer,
              caption: caption
          }, { quoted: m });
  
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *HD3 Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['hd3 (reply gambar)', 'remini3 (reply gambar)', 'superhd (reply gambar)'];
  handler.tags = ['tools'];
  handler.command = /^(hd3|remini3|superhd|hdv3)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
