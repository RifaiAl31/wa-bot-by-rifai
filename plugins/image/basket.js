// canvas/basket — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/basket.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "basket",
  "command": [
    "basket"
  ],
  "category": "image",
  "desc": "Buat gambar basket dengan nama custom",
  "usage": ".basket <nama>",
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
module.exports = __vx.plugin("canvas/basket", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/basket.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "basket",
    alias: ["basket"],
    category: "canvas",
    description: "Buat gambar basket dengan nama custom",
    usage: ".basket <nama>",
    example: ".basket Fauzan",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
  };
  
  let isFontLoaded = false;
  async function loadFont() {
      if (isFontLoaded) return;
      try {
          const fontBuffer = await axios.get("https://files.catbox.moe/8wqg77.ttf", { responseType: "arraybuffer" }).then(r => r.data);
          GlobalFonts.register(Buffer.from(fontBuffer), "ArialBoldBasket");
          isFontLoaded = true;
      } catch (e) { globalThis.__vanxoneCatch?.(e);
      }
  }
  
  async function handler(m, { sock }) {
    await loadFont();
    const text = m.text?.trim();
  
    if (!text) {
      return m.reply(`⚠️ Harap masukkan teksnya!\nContoh: \`${m.prefix}${m.command} Fauzan\``);
    }
  
    if (text.length > 25) {
      return m.reply("⚠️ Nama terlalu panjang! Maksimal 25 karakter.");
    }
  
    await m.react("🕕");
  
    try {
      const backgroundUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772229249253.jpeg";
      const bgBuffer = await axios.get(backgroundUrl, { responseType: 'arraybuffer' }).then(r => r.data);
      const bg = await loadImage(Buffer.from(bgBuffer));
      
      const canvas = createCanvas(bg.width, bg.height);
      const ctx = canvas.getContext("2d");
  
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  
      const fontFace = isFontLoaded ? "ArialBoldBasket" : "sans-serif";
      ctx.font = `bold 40px "${fontFace}"`;
      ctx.fillStyle = "#1a1a1a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
  
      ctx.fillText(text, (canvas.width / 2) - 110, 545);
  
      const buffer = await canvas.encode("png");
      
      await sock.sendMessage(m.chat, {
        image: buffer,
        caption: "🏀 Gambar basket berhasil dibuat!"
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
