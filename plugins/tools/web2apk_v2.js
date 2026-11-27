// tools/web2apk_v2 — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "web2apk_v2",
    "web2apkv2",
    "fastapk"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur web2apk_v2",
  "usage": ".web2apk_v2 <url>|<nama app>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/web2apk_v2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/web2apk_v2.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text || !text.includes('|')) {
          return m.reply(`📱 *FAST WEB TO APK (v2)*\n\nFormat: *${usedPrefix + command} <url>|<nama app>*\nContoh:\n${usedPrefix + command} https://google.com|GoogleApp`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let [url, name] = text.split('|').map(s => s.trim());
          if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
  
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/web2apk_v2?apikey=${apiKey}`;
  
          let res = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url, name })
          });
  
          let json = await res.json();
          if (!json.status) throw new Error(json.error || "Gagal menginisiasi build APK.");
  
          let data = json.result || {};
          let caption = `📱 *BUILD APK DIMULAI (v2)*\n\n`;
          caption += `📛 *Nama App:* ${data.app_name || name}\n`;
          caption += `🆔 *Build ID:* ${data.build_id || '-'}\n`;
          caption += `🔗 *Status URL:* ${data.status_url || '-'}\n\n`;
          caption += `💡 *Cara Cek:* Gunakan perintah *${usedPrefix}apkdownload ${data.build_id}* setelah 1-2 menit.\n\n`;
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          await m.reply(caption);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *Web2APK v2 Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['web2apk_v2 <url>|<nama app>', 'fastapk <url>|<nama app>'];
  handler.tags = ['tools'];
  handler.command = /^(web2apk_v2|web2apkv2|fastapk)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
