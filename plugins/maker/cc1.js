// colorgrade/cc1 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/colorgrade/cc1.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "cc1",
  "command": [
    "cc1",
    "moody1",
    "darkcinematic"
  ],
  "category": "maker",
  "desc": "Color Grading CC1 - Dark Cinematic Moody",
  "usage": ".cc1 (Kirim/Reply Foto)",
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
module.exports = __vx.plugin("colorgrade/cc1", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/cc1.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const sharp = __vxDef(require("sharp"));
  
  const pluginConfig = {
    name: 'cc1',
    alias: ['cc1', 'moody1', 'darkcinematic'],
    category: 'colorgrade',
    description: 'Color Grading CC1 - Dark Cinematic Moody',
    usage: '.cc1 (Kirim/Reply Foto)',
    example: '.cc1',
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
        .modulate({ brightness: 0.85, saturation: 1.15 })
        .linear(1.25, -18)
        .composite([{
          input: Buffer.from(`
            <svg width="${width}" height="${height}">
              <rect width="${width}" height="${height}" fill="#001122" opacity="0.12"/>
              <defs>
                <radialGradient id="v" cx="50%" cy="50%" r="65%">
                  <stop offset="40%" stop-color="#000000" stop-opacity="0" />
                  <stop offset="100%" stop-color="#000000" stop-opacity="0.6" />
                </radialGradient>
              </defs>
              <rect width="${width}" height="${height}" fill="url(#v)" />
            </svg>
          `),
          blend: 'over'
        }])
        .jpeg({ quality: 95 })
        .toBuffer();
  
      await sock.sendMessage(
        m.chat,
        { image: processedBuffer, caption: '✨ *Color Grade: CC1 (Dark Cinematic)*' },
        { quoted: m }
      );
  
      await m.react('✅');
  
    } catch (err) {
      console.error('[CC1 ERROR]', err);
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
