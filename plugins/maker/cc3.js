// colorgrade/cc3 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/colorgrade/cc3.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "cc3",
  "command": [
    "cc3",
    "neoncity"
  ],
  "category": "maker",
  "desc": "Color Grading CC3 - Cyberpunk Neon Blue Pink",
  "usage": ".cc3 (Kirim/Reply Foto)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/colorgrade").split('\\').join('/')
module.exports = __vx.plugin("colorgrade/cc3", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/cc3.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const sharp = __vxDef(require("sharp"));
  
  const pluginConfig = {
    name: 'cc3',
    alias: ['cc3', 'cyberpunk', 'neoncity'],
    category: 'colorgrade',
    description: 'Color Grading CC3 - Cyberpunk Neon Blue Pink',
    usage: '.cc3 (Kirim/Reply Foto)',
    example: '.cc3',
    isEnabled: true,
  };
  
  function getMediaMessageAndMime(m) {
    const target = m.isQuoted ? m.quoted : m;
    const msg = target?.message || target;
  
    const viewOnceMsg = msg?.viewOnceMessage?.message || msg?.viewOnceMessageV2?.message || msg?.viewOnceMessageV2Extension?.message;
    const actualMsg = viewOnceMsg || msg;
  
    const imageMsg = actualMsg?.imageMessage;
    const docMsg = actualMsg?.documentMessage || actualMsg?.documentWithCaptionMessage?.message?.documentMessage;
  
    let mimeType = imageMsg?.mimetype || docMsg?.mimetype || target?.mimetype;
  
    return {
      isImage: Boolean(mimeType && mimeType.startsWith('image/')),
      targetToDownload: target
    };
  }
  
  async function handler(m, { sock, prefix, command }) {
    const { isImage, targetToDownload } = getMediaMessageAndMime(m);
  
    if (!((m.isMedia || m.hasQuotedMedia) && isImage)) {
      return await sock.sendMessage(
        m.chat,
        { text: `⚠️ *Format Salah!*\n\n> Balas/Kirim foto dengan ketik *${prefix || '.'}${command}*` },
        { quoted: m }
      );
    }
  
    try {
      await m.react('🎨');
  
      const inputBuffer = await targetToDownload.download();
      if (!inputBuffer) throw new Error('Gagal mengunduh foto.');
  
      const metadata = await sharp(inputBuffer).metadata();
      const width = metadata.width || 800;
      const height = metadata.height || 1200;
  
      const processedBuffer = await sharp(inputBuffer)
        .modulate({ brightness: 0.9, saturation: 1.5 })
        .linear(1.2, -10)
        .composite([{
          input: Buffer.from(`
            <svg width="${width}" height="${height}">
              <rect width="${width}" height="${height}" fill="#6600ff" opacity="0.15"/>
            </svg>
          `),
          blend: 'screen'
        }])
        .jpeg({ quality: 95 })
        .toBuffer();
  
      await sock.sendMessage(
        m.chat,
        { image: processedBuffer, caption: '✨ *Color Grade: CC3 (Cyberpunk Neon)*' },
        { quoted: m }
      );
  
      await m.react('✅');
  
    } catch (err) {
      console.error('[CC3 ERROR]', err);
      await m.react('❌');
      await sock.sendMessage(
        m.chat,
        { text: `❌ *Gagal memproses gambar:* ${err.message}` },
        { quoted: m }
      );
    }
  }
  
  const __vxDefault = { config: pluginConfig, handler };
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
