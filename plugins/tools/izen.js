// tools/izen — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/izen.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "izen",
  "command": [
    "izen",
    "skiplink"
  ],
  "category": "tools",
  "desc": "Bypass shortlink / skiplink menggunakan izen",
  "usage": ".izen link",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/izen", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/izen.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fetch = __vxDef(require("node-fetch"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "izen",
    alias: ["skiplink", "izen"],
    category: "tools",
    description: "Bypass shortlink / skiplink menggunakan izen",
    usage: ".izen link",
    example: ".izen https://sfl.gl/xxxxx",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { args, sock }) {
    if (!args[0]) {
      let txt = `🔗 *SKIPLINK BYPASS* 🔗\n\n`;
      txt += `Halo kak! Punya link yang ribet ngelewatin iklan? Sini aku bantu lewatin biar langsung ke tujuan akhir!\n\n`;
      txt += `*Cara Pakai:*\n`;
      txt += `👉 \`${m.prefix}izen <link>\`\n\n`;
      txt += `*Contoh:*\n`;
      txt += `👉 \`${m.prefix}izen https://sfl.gl/xxxxx\``;
      return m.reply(txt);
    }
  
    await m.react("⏳");
    
    try {
      const res = await fetch(`https://anabot.my.id/api/tools/izenLOL?url=${encodeURIComponent(args[0])}&apikey=${(global.apiKeys && global.apiKeys.anabot) || ''}`);
      const json = await res.json();
      
      if (!json.data?.result?.result) {
         return m.reply("❌ Waduh kak, gagal ngelewatin link-nya nih! Coba link lain ya.");
      }
      
      let txt = `✅ *BERHASIL BYPASS LINK!* ✅\n\n`;
      txt += `*Link Asli:* \n`;
      txt += `🔗 ${args[0]}\n\n`;
      txt += `*Hasil Bypass:* \n`;
      txt += `🚀 ${json.data.result.result}\n\n`;
      txt += `Semoga ngebantu ya kak! ✨`;
      
      await m.reply(txt);
      await m.react("✅");
    } catch (e) { globalThis.__vanxoneCatch?.(e);
      m.reply(`❌ Maaf kak, terjadi kesalahan sistem! 😭\nError: ${e.message}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
