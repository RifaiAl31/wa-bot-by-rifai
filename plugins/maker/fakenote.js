// maker/fakenote — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/fakenote.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "fakenote",
  "command": [
    "fakenote"
  ],
  "category": "maker",
  "desc": "Generate gambar Note speech bubble meme",
  "usage": ".fakenote name|pesan|avatar_url",
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
module.exports = __vx.plugin("maker/fakenote", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fakenote.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fetch = __vxDef(require("node-fetch"));
  const { withNetworkRetry, formatNetworkError } = require("../../lib/ext/src/lib/vanxone-network.js");
  
  const pluginConfig = {
    name: "fakenote",
    alias: [],
    category: "maker",
    description: "Generate gambar Note speech bubble meme",
    usage: ".fakenote name|pesan|avatar_url",
    example: ".fakenote @kyynhz|jadilah manusia berkualitas, tidak menindas untuk menjadi teratas",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text }) {
    if (!text) {
      return m.reply(
        `⚠️ *Format Salah*\n\n` +
        `Penggunaan:\n\`.fakenote name|pesan|avatar_url\`\n\n` +
        `Contoh:\n\`.fakenote @kyynhz|jadilah manusia berkualitas, tidak menindas untuk menjadi teratas\``
      );
    }
  
    // Parse parameter: name | message | avatar
    let [inputName, inputMessage, inputAvatar] = text.split('|').map(v => v ? v.trim() : '');
  
    // Jika user hanya memasukkan pesan tanpa "|", nama otomatis dari pushName
    if (!inputMessage && inputName) {
      inputMessage = inputName;
      inputName = m.pushName ? `@${m.pushName.replace(/\s+/g, '').toLowerCase()}` : '@user';
    }
  
    if (!inputMessage) {
      return m.reply(`⚠️ Masukkan pesan yang ingin ditampilkan pada note!`);
    }
  
    await m.react('⏳');
  
    try {
      let avatarUrl = inputAvatar || '';
  
      // Jika avatar tidak diisi via URL, coba ambil PP pengirim dari WhatsApp
      if (!avatarUrl) {
        try {
          avatarUrl = await sock.profilePictureUrl(m.sender, 'image');
        } catch {
          avatarUrl = 'https://telegra.ph/file/24167123924712411.jpg'; // Fallback default avatar
        }
      }
  
      const apiUrl = `https://api.nexray.web.id/maker/fakenote?name=${encodeURIComponent(inputName)}&message=${encodeURIComponent(inputMessage)}&avatar=${encodeURIComponent(avatarUrl)}`;
  
      const response = await withNetworkRetry(() => fetch(apiUrl, { timeout: 30000 }));
      const contentType = response.headers.get('content-type') || '';
  
      // Jika API mengembalikan gambar langsung (Buffer)
      if (contentType.includes('image')) {
        const imageBuffer = await response.buffer();
        await sock.sendMessage(m.chat, {
          image: imageBuffer,
          caption: `✨ *Fake Note Generated!*`
        }, { quoted: m });
        await m.react('✅');
        return;
      }
  
      // Jika API mengembalikan JSON
      const resJson = await response.json();
      if ((resJson.status || resJson.success) && resJson.result) {
        const imageUrl = typeof resJson.result === 'string' ? resJson.result : resJson.result.url;
        await sock.sendMessage(m.chat, {
          image: { url: imageUrl },
          caption: `✨ *Fake Note Generated!*`
        }, { quoted: m });
        await m.react('✅');
      } else {
        await m.react('❌');
        m.reply(`❌ *Gagal generate:* ${resJson.message || 'Terjadi kesalahan pada server API.'}`);
      }
  
    } catch (err) {
      console.error('[FAKENOTE ERROR]', err);
      await m.react('❌');
      await m.reply(`❌ *Gagal:* ${formatNetworkError(err, 'AlwaysCodex Fake Note')}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
