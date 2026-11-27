// canvas/afinitasml2 — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/afinitasml2.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "afinitasml2",
  "command": [
    "afinitasml2"
  ],
  "category": "image",
  "desc": "Bikin card afinitas ML (versi 2) dari fotomu",
  "usage": ".afinitasml2 (reply/kirim foto)",
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
module.exports = __vx.plugin("canvas/afinitasml2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/afinitasml2.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  const { downloadMediaMessage, getContentType } = require("../../lib/ext/src/lib/baileys.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "afinitasml2",
    alias: [],
    category: "canvas",
    description: "Bikin card afinitas ML (versi 2) dari fotomu",
    usage: ".afinitasml2 (reply/kirim foto)",
    example: ".afinitasml2",
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
      return m.reply(`⚠️ Harap kirim atau reply foto dengan perintah \`${m.prefix}${m.command}\``);
    }
    
    await m.react("🕕");
    
    try {
      media = await downloadMediaMessage(msgObj, "buffer", {});
      if (!media) throw new Error("Gagal membaca media");
  
      const bgURL = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772821724016.png";
  
      const bgBuffer = await axios.get(bgURL, { responseType: "arraybuffer" }).then(r => r.data);
  
      const userImage = await loadImage(media);
      const bg = await loadImage(Buffer.from(bgBuffer));
  
      const canvas = createCanvas(bg.width, bg.height);
      const ctx = canvas.getContext("2d");
  
      const frame = { x: 450, y: 847, width: 205, height: 205 };
      const avatarSize = 300;
      const avatarX = frame.x + (frame.width - avatarSize) / 2;
      const avatarY = frame.y + (frame.height - avatarSize) / 2;
  
      const minSide = Math.min(userImage.width, userImage.height);
      const cropX = (userImage.width - minSide) / 2;
      const cropY = (userImage.height - minSide) / 2;
  
      ctx.drawImage(
        userImage,
        cropX,
        cropY,
        minSide,
        minSide,
        avatarX,
        avatarY,
        avatarSize,
        avatarSize
      );
  
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  
      const buffer = await canvas.encode("png");
      await sock.sendMessage(m.chat, { image: buffer, caption: "📱 *Afinitas ML v2*" }, { quoted: m });
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
