// sticker/upin — satu file: metadata + kode fitur (gabungan dari engine4/plugins/sticker/upin.js)
const __vx = require("../../lib/adapter/e4.js")
const __meta = {
  "name": "upin",
  "command": [
    "upin",
    "upinboard"
  ],
  "category": "sticker",
  "desc": "Stiker Upin dengan teks hitam besar dan emoji/WEmoji",
  "usage": ".upin <teks>",
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
module.exports = __vx.plugin("sticker/upin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/upin.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const config = __vxDef(require("../../lib/ext/config.e4.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e4.js"));
  const { renderBoardText } = require("../../lib/ext/plugins/e4/sticker/board-text-renderer.js");
  
  const pluginConfig = {
    name: 'upin',
    alias: ['upinboard'],
    category: 'sticker',
    description: 'Stiker Upin dengan teks hitam besar dan emoji/WEmoji',
    usage: '.upin <teks>',
    example: '.upin HALO SEMUA! 😎🔥',
    isOwner: false, isPremium: false, isGroup: false, isPrivate: false,
    cooldown: 8, energi: 1, isEnabled: true,
  };
  
  const SOURCE = path.join(process.cwd(), 'assets', 'image', 'upin-board.png');
  // Native 1536x1536 coordinates of the actual white board area.
  const BOARD = { centerX: 965, centerY: 955, width: 820, height: 720, angle: 1.0, padX: 34, padY: 30 };
  
  const norm = (t) => String(t ?? '').replace(/\r/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
  
  async function handler(m, { sock }) {
    const text = norm(m.text);
    if (!text) return m.reply(`🪧 *UPIN BOARD*\\n\\nMasukkan kata-kata yang mau ditulis di papan.\\nEmoji/WEmoji didukung.\\n\\nContoh: ${m.prefix}upin HALO SEMUA! 😎🔥`);
    try {
      if (!fs.existsSync(SOURCE)) throw new Error('Template Upin tidak ditemukan');
      await m.react('🕕');
      const buffer = await renderBoardText({
        source: SOURCE,
        sourceWidth: 1536,
        sourceHeight: 1536,
        outSize: 512,
        board: BOARD,
        text,
        fontStart: 106,
        fontMin: 34,
        lineGap: 0.10,
      });
      await sock.sendImageAsSticker(m.chat, buffer, m, {
        packname: config.sticker.packname,
        author: config.sticker.author,
      });
      await m.react('✅');
    } catch (error) {
      console.error('UPIN BOARD ERROR:', error);
      await m.react('❌');
      await m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
