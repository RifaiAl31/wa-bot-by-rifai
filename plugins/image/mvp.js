// canvas/mvp — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/mvp.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "mvp",
  "command": [
    "mvp",
    "sertifikatmvp"
  ],
  "category": "image",
  "desc": "Buat sertifikat MVP",
  "usage": ".mvp <nama>",
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
module.exports = __vx.plugin("canvas/mvp", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/mvp.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "mvp",
    alias: ["sertifikatmvp", "mvp"],
    category: "canvas",
    description: "Buat sertifikat MVP",
    usage: ".mvp <nama>",
    example: ".mvp Fauzan",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const text = m.text?.trim();
  
    if (!text) {
      return m.reply(`⚠️ Harap masukkan nama!\nContoh: \`${m.prefix}${m.command} Fauzan\``);
    }
  
    if (text.length > 20) {
      return m.reply("⚠️ Nama terlalu panjang! Maksimal 20 karakter.");
    }
  
    await m.react("🕕");
  
    try {
      const backgroundUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772230577235.jpeg";
      
      const response = await axios.get(backgroundUrl, { responseType: 'arraybuffer' });
      const bg = await loadImage(Buffer.from(response.data));
  
      const canvas = createCanvas(bg.width, bg.height);
      const ctx = canvas.getContext("2d");
  
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  
      ctx.font = "bold 32px sans-serif";
      ctx.fillStyle = "#918A81";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
  
      ctx.fillText(text, 640, 530);
  
      const buffer = await canvas.encode("png");
      
      await sock.sendMessage(m.chat, {
        image: buffer,
        caption: "🎉 Ini dia sertifikat MVP kamu!"
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
