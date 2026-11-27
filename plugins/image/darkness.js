// canvas/darkness — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/darkness.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "darkness",
  "command": [
    "darkness",
    "drakness"
  ],
  "category": "image",
  "desc": "Beri efek gelap pada gambar",
  "usage": ".darkness [amount]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/darkness", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/darkness.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  const { downloadMediaMessage, getContentType } = require("../../lib/ext/src/lib/baileys.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "darkness",
    alias: ["darkness", "drakness"],
    category: "canvas",
    description: "Beri efek gelap pada gambar",
    usage: ".darkness [amount]",
    example: ".darkness 100 (sambil reply gambar)",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
  };
  
  function applyDarkness(ctx, width, height, amount) {
    const img = ctx.getImageData(0, 0, width, height);
  
    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = Math.max(0, img.data[i] - amount);
      img.data[i + 1] = Math.max(0, img.data[i + 1] - amount);
      img.data[i + 2] = Math.max(0, img.data[i + 2] - amount);
    }
  
    ctx.putImageData(img, 0, 0);
  }
  
  async function handler(m, { sock }) {
    const amountStr = m.text?.trim() || "50";
    const amount = parseInt(amountStr, 10);
  
    if (isNaN(amount) || amount < 0 || amount > 255) {
      return m.reply("⚠️ Parameter amount harus angka antara 0 - 255.");
    }
  
    const msg = m.message;
    const isQuotedImage = m.quoted && (getContentType(m.quoted.message) === "imageMessage" || m.quoted.mtype === "imageMessage");
    const isImage = getContentType(msg) === "imageMessage" || m.mtype === "imageMessage";
  
    if (!isImage && !isQuotedImage) {
      return m.reply(`⚠️ Harap kirim atau balas gambar dengan caption \`${m.prefix}${m.command} ${amount}\``);
    }
  
    await m.react("🕕");
  
    try {
      const targetMsg = isQuotedImage ? m.quoted : m;
      const mediaData = await downloadMediaMessage(
        targetMsg,
        "buffer",
        {},
        { logger: console }
      );
  
      const img = await loadImage(mediaData);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext("2d");
  
      ctx.drawImage(img, 0, 0);
      applyDarkness(ctx, canvas.width, canvas.height, amount);
  
      const buffer = await canvas.encode("png");
      
      await sock.sendMessage(m.chat, {
        image: buffer,
        caption: `🌙 Efek darkness diterapkan (amount: ${amount})`
      }, { quoted: m });
  
      await m.react("✅");
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
