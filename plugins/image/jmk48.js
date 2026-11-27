// canvas/jmk48 — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/jmk48.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "jmk48",
  "command": [
    "jmk48"
  ],
  "category": "image",
  "desc": "Bikin gambarmu jadi member JMK48",
  "usage": ".jmk48 (reply/kirim foto)",
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
module.exports = __vx.plugin("canvas/jmk48", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/jmk48.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  const { downloadMediaMessage, getContentType } = require("../../lib/ext/src/lib/baileys.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "jmk48",
    alias: [],
    category: "canvas",
    description: "Bikin gambarmu jadi member JMK48",
    usage: ".jmk48 (reply/kirim foto)",
    example: ".jmk48",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    let media = null;
    const msgObj = m.quoted?.message ? m.quoted : m;
    const type = getContentType(msgObj.message);
  
    if (!type || type !== "imageMessage") {
      return m.reply(`⚠️ Harap kirim atau reply foto profil dengan perintah \`${m.prefix}${m.command}\``);
    }
  
    await m.react("🕕");
    
    try {
      media = await downloadMediaMessage(msgObj, "buffer", {});
      if (!media) throw new Error("Gagal membaca media");
  
      const frameURL = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772230335511.png";
      const frameBuffer = await axios.get(frameURL, { responseType: "arraybuffer" }).then(r => r.data);
  
      const userImg = await loadImage(media);
      const frameImg = await loadImage(Buffer.from(frameBuffer));
  
      const canvas = createCanvas(frameImg.width, frameImg.height);
      const ctx = canvas.getContext("2d");
  
      const centerX = canvas.width / 2;
      const centerY = Math.round(canvas.height * 0.5);
      const radius = Math.round(canvas.width * 0.4);
  
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      // Sesuaikan posisi jika rasio foto bukan 1:1, potong ke tengah
      const minSide = Math.min(userImg.width, userImg.height);
      const cropX = (userImg.width - minSide) / 2;
      const cropY = (userImg.height - minSide) / 2;
      
      ctx.drawImage(userImg, cropX, cropY, minSide, minSide, centerX - radius, centerY - radius, radius * 2, radius * 2);
      ctx.restore();
  
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  
      const buffer = await canvas.encode("png");
      await sock.sendMessage(m.chat, { image: buffer, caption: "🎤 *JMK48 Member*" }, { quoted: m });
      await m.react("✅");
  
    } catch (err) { globalThis.__vanxoneCatch?.(err);
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
