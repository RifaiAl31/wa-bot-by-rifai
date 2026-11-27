// tools/web2apk_download — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "web2apk_download",
    "apkdownload",
    "getapk",
    "downloadapk"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur web2apk_download",
  "usage": ".web2apk_download <build_id>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/web2apk_download", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/web2apk_download.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`📥 *DOWNLOAD APK DARI BUILD ID*\n\nContoh:\n${usedPrefix + command} 1234567890`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let buildId = text.trim();
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/web2apk_download?apikey=${apiKey}&build_id=${encodeURIComponent(buildId)}`;
  
          let res = await fetch(apiUrl);
          let json = await res.json();
  
          if (!json.status) throw new Error(json.error || json.detail || "APK belum selesai dirakit atau Build ID tidak valid.");
  
          let data = json.result || {};
          let downloadUrl = data.download_url;
  
          let caption = `📱 *APK SIAP DIUNDUH*\n\n`;
          caption += `🆔 *Build ID:* ${data.build_id || buildId}\n`;
          caption += `📦 *Ukuran:* ${data.size_bytes ? (data.size_bytes / (1024 * 1024)).toFixed(2) + ' MB' : '-'}\n`;
          caption += `🔗 *Link Unduhan:* ${downloadUrl || '-'}\n\n`;
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          if (downloadUrl) {
              try {
                  let apkRes = await fetch(downloadUrl);
                  let apkBuffer = await apkRes.buffer();
  
                  await conn.sendMessage(m.chat, {
                      document: apkBuffer,
                      fileName: `App_${buildId}.apk`,
                      mimetype: 'application/vnd.android.package-archive',
                      caption: caption
                  }, { quoted: m });
              } catch (e) {
                  await m.reply(caption);
              }
          } else {
              await m.reply(caption);
          }
  
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *Download APK Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['web2apk_download <build_id>', 'apkdownload <build_id>'];
  handler.tags = ['tools'];
  handler.command = /^(web2apk_download|apkdownload|getapk|downloadapk)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
