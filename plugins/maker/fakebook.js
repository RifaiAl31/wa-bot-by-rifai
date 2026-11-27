// maker/fakebook — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/fakebook.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "fakebook",
  "command": [
    "fakebook",
    "bookquote",
    "quotebuku",
    "fakebuku"
  ],
  "category": "maker",
  "desc": "Membuat gambar quote estetis gaya halaman buku",
  "usage": ".fakebook <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/fakebook", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fakebook.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const { withNetworkRetry, formatNetworkError } = require("../../lib/ext/src/lib/vanxone-network.js");
  
  const pluginConfig = {
    name: "fakebook",
    alias: ["bookquote", "quotebuku", "fakebuku"],
    category: "maker",
    description: "Membuat gambar quote estetis gaya halaman buku",
    usage: ".fakebook <teks>",
    example: ".fakebook Mencintaimu adalah hal terindah yang pernah ada.",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text }) {
    const inputTeks = text || m.text?.split(' ').slice(1).join(' ') || '';
  
    if (!inputTeks) {
      return m.reply(
        `⚠️ *Format Salah*\n\n` +
        `Penggunaan:\n\`.fakebook <teks>\`\n\n` +
        `Contoh:\n\`.fakebook Mencintaimu adalah hal terindah yang pernah ada.\``
      );
    }
  
    await m.react('⏳');
  
    try {
      const apiUrl = `https://api.nexray.web.id/maker/fakebook?teks=${encodeURIComponent(inputTeks.trim())}`;
  
      const response = await withNetworkRetry(() => axios.get(apiUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }));
  
      await sock.sendMessage(m.chat, {
        image: Buffer.from(response.data),
        caption: `📖 *Fake Book Quote Generated!*`
      }, { quoted: m });
  
      await m.react('✅');
  
    } catch (error) {
      console.error('[FAKEBOOK ERROR]', error);
      await m.react('❌');
      await m.reply(`❌ *Gagal:* ${formatNetworkError(error, 'AlwaysCodex FakeBook')}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
