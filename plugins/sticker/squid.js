// sticker/squid — satu file: metadata + kode fitur (gabungan dari engine4/plugins/sticker/squid.js)
const __vx = require("../../lib/adapter/e4.js")
const __meta = {
  "name": "squid",
  "command": [
    "squid",
    "squidboard",
    "squidward"
  ],
  "category": "sticker",
  "desc": "Stiker Squid 3D dengan teks hitam besar dan emoji/WEmoji",
  "usage": ".squid <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/squid", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/squid.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const config = __vxDef(require("../../lib/ext/config.e4.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e4.js"));
  const { renderBoardText } = require("../../lib/ext/plugins/e4/sticker/board-text-renderer.js");
  
  const pluginConfig = {
    name: 'squid',
    alias: ['squidboard', 'squidward'],
    category: 'sticker',
    description: 'Stiker Squid 3D dengan teks hitam besar dan emoji/WEmoji',
    usage: '.squid <teks>',
    example: '.squid JANGAN LUPA SENYUM! 😎🔥',
    isOwner: false, isPremium: false, isGroup: false, isPrivate: false,
    cooldown: 8, energi: 1, isEnabled: true,
  };
  
  const SOURCE = path.join(process.cwd(), 'assets', 'image', 'squid-board-3d.png');
  const BOARD = { centerX: 717, centerY: 315, width: 842, height: 414, angle: 5.4, padX: 32, padY: 22 };
  
  const norm = (t) => String(t ?? '').replace(/\r/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
  
  async function handler(m, { sock }) {
    const text = norm(m.text);
    if (!text) return m.reply(`🪧 *SQUID 3D BOARD*\\n\\nMasukkan kata-kata yang mau ditulis di papan.\\nEmoji/WEmoji didukung.\\n\\nContoh: ${m.prefix}squid TURUNKAN HARGA PANEL! 😎🔥`);
    try {
      if (!fs.existsSync(SOURCE)) throw new Error('Template Squid 3D tidak ditemukan');
      await m.react('🕕');
      const buffer = await renderBoardText({
        source: SOURCE,
        sourceWidth: 1254,
        sourceHeight: 1254,
        outSize: 512,
        board: BOARD,
        text,
        fontStart: 128,
        fontMin: 42,
        lineGap: 0.10,
      });
      await sock.sendImageAsSticker(m.chat, buffer, m, {
        packname: config.sticker.packname,
        author: config.sticker.author,
      });
      await m.react('✅');
    } catch (error) {
      console.error('SQUID BOARD ERROR:', error);
      await m.react('❌');
      await m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
