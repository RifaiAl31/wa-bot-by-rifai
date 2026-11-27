// tools/nulis — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/nulis.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "nulis",
  "command": [
    "tulis",
    "write"
  ],
  "category": "tools",
  "desc": "Generate tulisan tangan di kertas",
  "usage": ".nulis <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": [
      "vanxone-font",
      "vanxone-kertas"
    ]
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/nulis", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/nulis.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const _canvas = __vxNs(require("@napi-rs/canvas"));
  const path = __vxDef(require("path"));
  const fs = __vxDef(require("fs"));
  const timeHelper = __vxNs(require("../../lib/ext/src/lib/vanxone-time.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { saluranCtx } = require("../../lib/ext/src/lib/vanxone-context.js");
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { getAssetBuffer } = require("../../lib/ext/src/lib/vanxone-asset-manager.js");
  const pluginConfig = {
    name: "nulis",
    alias: ["tulis", "write"],
    category: "tools",
    description: "Generate tulisan tangan di kertas",
    usage: ".nulis <teks>",
    example: ".nulis Aku cinta kamu selamanya",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  const fontUrl = getAssetBuffer("vanxone-font");
  let _fontRegistered = false;
  function wrapText(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }
  async function handler(m, { sock }) {
    const text = m.args?.join(" ");
    if (!text) {
      return m.reply(
        `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
          `> \`${m.prefix}nulis <teks>\`\n\n` +
          `> Contoh:\n` +
          `> \`${m.prefix}nulis Aku cinta kamu selamanya\``,
      );
    }
    if (text.length > 500) {
      return m.reply(`❌ *ᴛᴇᴋs ᴛᴇʀʟᴀʟᴜ ᴘᴀɴᴊᴀɴɢ*\n\n> Maksimal 500 karakter`);
    }
    const inputUrl = getAssetBuffer("vanxone-kertas");
    if (!inputUrl) {
      return m.reply(
        `❌ *ᴛᴇᴍᴘʟᴀᴛᴇ ᴛɪᴅᴀᴋ ᴀᴅᴀ*\n\n> File template kertas tidak ditemukan di config.assets`,
      );
    }
    await m.react("🕕");
    await m.reply(`🕕 *ᴍᴇᴍᴘʀᴏsᴇs...*\n\n> Membuat tulisan tangan...`);
    try {
      const { createCanvas, loadImage, GlobalFonts } = _canvas;
      if (!_fontRegistered) {
        try {
          const fontBuf = getAssetBuffer("vanxone-font");
          if (fontBuf) {
            GlobalFonts.register(fontBuf, "Zahraaa");
          }
        } catch (err) { globalThis.__vanxoneCatch?.(err);
          console.error("Gagal load font:", err);
        }
        _fontRegistered = true;
      }
      const bgBuf = getAssetBuffer("vanxone-kertas");
      const bgImage = await loadImage(bgBuf);
      const canvas = createCanvas(bgImage.width, bgImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bgImage, 0, 0);
      const tgl = timeHelper.formatDate("DD/MM/YYYY");
      const hari = timeHelper.formatFull("dddd");
      ctx.font = "20px Zahraaa, Arial";
      ctx.fillStyle = "#1a1a2e";
      ctx.fillText(hari, 806, 78);
      ctx.font = "18px Zahraaa, Arial";
      ctx.fillText(tgl, 806, 102);
      ctx.font = "20px Zahraaa, Arial";
      const maxWidth = 600;
      const lineHeight = 28;
      const startX = 344;
      const startY = 142;
      const lines = wrapText(ctx, text, maxWidth);
      lines.forEach((line, i) => {
        ctx.fillText(line, startX, startY + i * lineHeight);
      });
      const buffer = canvas.toBuffer("image/jpeg");
      await m.react("✅");
      await sock.sendMedia(
        m.chat,
        buffer,
        `✅ *ʟᴜʟɪsᴀɴ ᴛᴀɴɢᴀɴ*\n\n> Hatihati ketahuan! 📖`,
        m,
        { type: "image", contextInfo: saluranCtx() },
      );
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
