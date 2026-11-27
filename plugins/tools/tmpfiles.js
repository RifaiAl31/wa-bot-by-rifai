// tools/tmpfiles — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "tmpfiles"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur tmpfiles",
  "usage": ".tmpfiles (reply media)"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/tmpfiles", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/tmpfiles.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const FormData = __vxDef(require("form-data"));
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, usedPrefix, command }) => {
      let q = m.quoted ? m.quoted : m;
      let mime = (q.msg || q).mimetype || '';
  
      if (!mime) {
          return m.reply(`⚠️ *Balas atau kirim file/media* yang ingin diunggah!\n\nContoh:\n${usedPrefix + command} (sambil reply media)`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let media = await q.download();
          if (!media) throw new Error("Gagal mengunduh berkas media.");
  
          let ext = mime.split('/')[1] || 'bin';
          let filename = `upload_${Date.now()}.${ext}`;
  
          let form = new FormData();
          form.append('file', media, { filename, contentType: mime });
  
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/tmpfiles?apikey=${apiKey}`;
  
          let res = await fetch(apiUrl, {
              method: 'POST',
              body: form,
              headers: form.getHeaders()
          });
  
          let json = await res.json();
          if (!json.status) {
              throw new Error(json.error || json.message || "Gagal mengunggah file.");
          }
  
          let resData = json.result || json.data || {};
          let fileUrl = '';
          if (typeof resData === 'string') {
              fileUrl = resData;
          } else {
              fileUrl = resData.Result_url || resData.result_url || resData.url || resData.download_url || resData.Link || resData.link || resData.raw_url || resData.direct_url || (resData.files && resData.files[0]?.url) || '';
          }
  
          if (!fileUrl && typeof resData === 'object') {
              for (let k of ['url', 'link', 'download', 'Result_url', 'result_url', 'direct_link']) {
                  if (resData[k]) { fileUrl = resData[k]; break; }
              }
          }
  
          let sizeFormatted = (media.length / (1024 * 1024)).toFixed(2) + ' MB';
          if (media.length < 1024 * 1024) {
              sizeFormatted = (media.length / 1024).toFixed(2) + ' KB';
          }
  
          let caption = `📤 *UPLOAD BERHASIL (Tmpfiles.org)*\n\n`;
          caption += `🔗 *URL:* ${fileUrl || 'Lihat respon API'}\n`;
          caption += `📦 *Ukuran:* ${sizeFormatted}\n`;
          caption += `📁 *Tipe:* ${mime}\n`;
          caption += `🌐 *Server:* Tmpfiles.org\n\n`;
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          await m.reply(caption);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *Gagal Upload (Tmpfiles.org)*\nError: ${e.message}`);
      } finally {
          setTimeout(() => {
              conn.sendMessage(m.chat, { react: { text: "", key: m.key } }).catch(() => {});
          }, 3000);
      }
  };
  
  handler.help = ["tmpfiles (reply media)"];
  handler.command = ["tmpfiles"];
  handler.tags = ['tools'];
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
