// tools/alkiosku — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "alkiosku",
    "kioskudigital"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur alkiosku",
  "usage": ".alkiosku <email>|<pass>|<amount>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/alkiosku", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/alkiosku.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text || !text.includes('|')) {
          return m.reply(`🏪 *ALKIOSKU AUTOMATION*\n\nFormat: *${usedPrefix + command} <email>|<password>|<amount>*\nContoh:\n${usedPrefix + command} akun@mail.com|Pass123!|10`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let [email, password, amount] = text.split('|').map(s => s.trim());
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/alkiosku?apikey=${apiKey}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&amount=${encodeURIComponent(amount || '1')}`;
  
          let res = await fetch(apiUrl);
          let json = await res.json();
  
          if (!json.status) throw new Error(json.error || json.message || "Gagal memproses request Alkiosku.");
  
          let caption = `🏪 *ALKIOSKU BERHASIL*\n\n`;
          caption += "\`\`\`" + JSON.stringify(json.result || json.data || json, null, 2, null, 2) + "\`\`\`\n\n";
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          await m.reply(caption);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *Alkiosku Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['alkiosku <email>|<pass>|<amount>'];
  handler.tags = ['tools'];
  handler.command = /^(alkiosku|kioskudigital)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
