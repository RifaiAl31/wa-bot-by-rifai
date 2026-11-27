// tools/proxy — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/proxy.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "proxy",
  "command": [
    "proxy"
  ],
  "category": "tools",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/proxy", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/proxy.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  /**
   ╔══════════════════════
        ⧉  [proxy] — [tools]
  ╚══════════════════════
  
    ✺ Type     : Plugin ESM
    ✺ Creator  : Owner Bot
    ✺ API     : https://zelapioffciall.koyeb.app
  */
  
  const pluginConfig = {
    name: "proxy",
    alias: [],
    category: "tools",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, prefix, command }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || "."; 
      try {
          await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
          
          const response = await fetch('https://zelapioffciall.koyeb.app/random/proxy');
          if (!response.ok) {
              throw new Error(`🍂 *HTTP Error!* Status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (!data.status || !data.proxy) {
              throw new Error('🍂 *Respons API tidak valid!* Format data tidak sesuai');
          }
          
          const proxy = data.proxy;
          const message = `
  ✅ *PROXY BERHASIL DITEMUKAN!*
  
  📍 *IP Address:* ${proxy.ip}
  🚪 *Port:* ${proxy.port}
  🌍 *Country:* ${proxy.country}
  🏢 *Organization:* ${proxy.org}
  ⚡ *Latency:* ${proxy.latency} ms
  🕵️ *Anonymity:* ${proxy.anonymity}
  🔗 *Full Address:* ${proxy.full}
          `.trim();
          
          await conn.reply(m.chat, message, m);
          
      } catch (error) {
          await conn.reply(m.chat, `🍂 *Gagal mengambil proxy!*\nError: ${error.message}`, m);
      } finally {
          await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
      }
  };
  
  handler.register = false; // true kan jika ada fitur register atau daftar di bot mu.
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
