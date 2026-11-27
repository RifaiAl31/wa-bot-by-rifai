// sticker/telestick — satu file: metadata + kode fitur (gabungan dari engine7/plugins/sticker/telestick.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "telestick",
  "command": [
    "telestick",
    "tgsticker",
    "telegramsticker"
  ],
  "category": "sticker",
  "desc": "Ambil sticker pack dari Telegram dan kirim sebagai sticker pack WhatsApp",
  "usage": ".telestick <url>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/telestick", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/telestick.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { BOT_DEVELOPER } = require("../../lib/ext/config.e7.js");
  const axios = __vxDef(require("axios"));
  const _sharp = __vxDef(require("sharp"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  
  const sharp = _sharp;
  
  const pluginConfig = {
    name: 'telestick',
    alias: ['tgsticker', 'telegramsticker'],
    category: 'sticker',
    description: 'Ambil sticker pack dari Telegram dan kirim sebagai sticker pack WhatsApp',
    usage: '.telestick <url>',
    example: '.telestick https://t.me/addstickers/AnimeSticker',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 30,
    energi: 3,
    isEnabled: true,
  };
  
  function getBotToken() {
    return String(config.telegram?.botToken || '').trim();
  }
  
  async function toWebp(buffer) {
    return sharp(buffer)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 80 })
      .toBuffer();
  }
  
  async function handler(m, { sock }) {
    const url = String(m.args?.[0] || '').trim();
    const match = url.match(/^https:\/\/t\.me\/addstickers\/([^/?#]+)$/i);
    if (!match) return m.reply(`📌 Contoh: ${m.prefix}telestick https://t.me/addstickers/AnimeSticker`);
    if (!m.isGroup) return m.reply('❌ Fitur ini khusus grup.');
  
    const botToken = getBotToken();
    if (!botToken) {
      return m.reply('❌ Telegram Bot Token belum diisi di config.telegram.botToken.');
    }
    if (typeof sock.sendStickerPack !== 'function') {
      return m.reply('❌ WhatsApp client WhatsApp Bot tidak mendukung pengiriman sticker pack otomatis.');
    }
  
    await m.react('⏳');
    try {
      const base = `https://api.telegram.org/bot${botToken}`;
      const { data: setRes } = await axios.get(`${base}/getStickerSet`, {
        params: { name: match[1] },
        timeout: 20000,
      });
      const stickerSet = setRes?.result;
      if (!stickerSet?.stickers?.length) throw new Error('Sticker pack Telegram tidak ditemukan.');
  
      const buffers = [];
      for (const sticker of stickerSet.stickers.slice(0, 20)) {
        try {
          const { data: fileRes } = await axios.get(`${base}/getFile`, {
            params: { file_id: sticker.file_id },
            timeout: 15000,
          });
          const filePath = fileRes?.result?.file_path;
          if (!filePath) continue;
          const { data: fileBuffer } = await axios.get(`https://api.telegram.org/file/bot${botToken}/${filePath}`, {
            responseType: 'arraybuffer',
            timeout: 30000,
          });
          buffers.push(await toWebp(Buffer.from(fileBuffer)));
        } catch {}
      }
  
      if (!buffers.length) throw new Error('Tidak ada sticker yang berhasil diunduh.');
  
      const packName = stickerSet.title || 'Telegram Sticker';
      await sock.sendStickerPack(m.chat, buffers, m, {
        name: packName,
        packname: packName,
        publisher: BOT_DEVELOPER || 'Owner Bot',
        author: BOT_DEVELOPER || 'Owner Bot',
        description: `Telegram sticker pack: ${packName}`,
        emojis: ['❤'],
      });
  
      await m.react('✅');
      await m.reply(`✅ Sticker Telegram berhasil dipindahkan.\n📦 Pack: ${packName}\n🧩 Sticker: ${buffers.length}`);
    } catch (error) {
      console.error('[TELESTICK]', error?.message || error);
      await m.react('❌');
      await m.reply(`❌ Gagal mengambil sticker Telegram: ${error?.message || 'Unknown error'}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
