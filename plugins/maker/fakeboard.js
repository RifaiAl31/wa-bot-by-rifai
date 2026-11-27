// maker/fakeboard — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/fakeboard.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "fakeboard",
  "command": [
    "fakeboard",
    "boardquote",
    "quoteboard",
    "papanquote"
  ],
  "category": "maker",
  "desc": "Membuat gambar papan quote/kutipan dengan author custom",
  "usage": ".fakeboard <teks>|<author>",
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
module.exports = __vx.plugin("maker/fakeboard", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fakeboard.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const { withNetworkRetry, formatNetworkError } = require("../../lib/ext/src/lib/vanxone-network.js");
  
  const pluginConfig = {
    name: "fakeboard",
    alias: ["boardquote", "quoteboard", "papanquote"],
    category: "maker",
    description: "Membuat gambar papan quote/kutipan dengan author custom",
    usage: ".fakeboard <teks>|<author>",
    example: ".fakeboard Tetap semangat walau codingan error|Alwayscodex",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text }) {
    const input = text || m.text?.split(' ').slice(1).join(' ') || '';
    const [teks, author] = input.split('|').map(v => v ? v.trim() : '');
  
    if (!teks) {
      return m.reply(
        `⚠️ *Format Salah*\n\n` +
        `Penggunaan:\n\`.fakeboard <teks>|<author>\`\n\n` +
        `Contoh:\n\`.fakeboard Tetap semangat walau codingan error|Alwayscodex\``
      );
    }
  
    // Gunakan nama pengirim jika author tidak diisi
    const authorName = author || m.pushName || 'Anonymous';
  
    await m.react('⏳');
  
    try {
      const apiUrl = `https://api.nexray.web.id/maker/fakeboard?teks=${encodeURIComponent(teks)}&author=${encodeURIComponent(authorName)}`;
  
      const response = await withNetworkRetry(() => axios.get(apiUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }));
  
      await sock.sendMessage(m.chat, {
        image: Buffer.from(response.data),
        caption: `🎨 *Fake Board Quote Generated!*`
      }, { quoted: m });
  
      await m.react('✅');
  
    } catch (error) {
      console.error('[FAKEBOARD ERROR]', error);
      await m.react('❌');
      await m.reply(`❌ *Gagal:* ${formatNetworkError(error, 'AlwaysCodex FakeBoard')}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
