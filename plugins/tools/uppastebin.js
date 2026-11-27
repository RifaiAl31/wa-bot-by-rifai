// tools/uppastebin — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/uppastebin.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "up-pb",
  "command": [
    "up-pb",
    "uppastebin"
  ],
  "category": "tools",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/uppastebin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/uppastebin.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const axios = __vxDef(require("axios"));
  const PASTEBIN_API_KEY = 'PXckLHLn4g-XTbETtJ6uRH0dQh6khXRB'; // API Key Dev Pastebin
  
  const pluginConfig = {
    name: "up-pb",
    alias: ["uppastebin"],
    category: "tools",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Harap masukkan kode yang ingin diunggah ke Pastebin!');
    await conn.sendMessage(m.chat, { text: wait }, { quoted: m });
  
    try {
      const data = {
        api_dev_key: PASTEBIN_API_KEY,
        api_option: 'paste',
        api_paste_code: text,
        api_paste_private: '0', // 1 = Unlisted, 0 = Public, 2 = Private
        api_paste_name: wm,
        api_paste_expire_date: 'N',
        api_paste_format: 'javascript'
      };
  
      const res = await axios.post('https://pastebin.com/api/api_post.php', new URLSearchParams(data));
      const pasteUrl = res.data;
      const message = `${pasteUrl}\n\n`;
  
      await conn.sendMessage(m.chat, { text: message }, { quoted: m });
  
    } catch (error) {
      console.error('Error saat mengunggah ke Pastebin:', error.message);
      await conn.sendMessage(m.chat, { text: `❗ Gagal mengunggah ke Pastebin: ${error.message}` }, { quoted: m });
    }
  };
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
