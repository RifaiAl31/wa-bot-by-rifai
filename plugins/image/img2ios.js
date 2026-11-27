// canvas/img2ios — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/img2ios.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "img2ios",
  "command": [
    "img2ios",
    "toios"
  ],
  "category": "image",
  "desc": "Bikin gambarmu menjadi gaya foto iOS",
  "usage": ".img2ios (reply/kirim foto)",
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
module.exports = __vx.plugin("canvas/img2ios", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/img2ios.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  const { downloadMediaMessage, getContentType } = require("../../lib/ext/src/lib/baileys.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "img2ios",
    alias: ["toios"],
    category: "canvas",
    description: "Bikin gambarmu menjadi gaya foto iOS",
    usage: ".img2ios (reply/kirim foto)",
    example: ".img2ios",
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
  
      const templateURL = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772230291185.jpeg";
      const templateBuffer = await axios.get(templateURL, { responseType: "arraybuffer" }).then(r => r.data);
  
      const userImg = await loadImage(media);
      const template = await loadImage(Buffer.from(templateBuffer));
  
      const canvas = createCanvas(template.width, template.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(template, 0, 0);
  
      const bubbleX = 36;
      const bubbleY = 363;
      const bubbleW = 616;
      const bubbleH = 860;
      const radius = 21;
  
      const imgRatio = userImg.width / userImg.height;
      const bubbleRatio = bubbleW / bubbleH;
      let drawW, drawH;
  
      if (imgRatio > bubbleRatio) {
        drawH = bubbleH;
        drawW = drawH * imgRatio;
      } else {
        drawW = bubbleW;
        drawH = drawW / imgRatio;
      }
  
      const offsetX = bubbleX - (drawW - bubbleW) / 2;
      const offsetY = bubbleY - (drawH - bubbleH) / 2;
  
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(bubbleX + radius, bubbleY);
      ctx.lineTo(bubbleX + bubbleW - radius, bubbleY);
      ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + radius);
      ctx.lineTo(bubbleX + bubbleW, bubbleY + bubbleH - radius);
      ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY + bubbleH, bubbleX + bubbleW - radius, bubbleY + bubbleH);
      ctx.lineTo(bubbleX + radius, bubbleY + bubbleH);
      ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleH, bubbleX, bubbleY + bubbleH - radius);
      ctx.lineTo(bubbleX, bubbleY + radius);
      ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + radius, bubbleY);
      ctx.closePath();
      ctx.clip();
  
      ctx.drawImage(userImg, offsetX, offsetY, drawW, drawH);
      ctx.restore();
  
      const buffer = await canvas.encode("png");
      await sock.sendMessage(m.chat, { image: buffer, caption: "📱 *iOS Style*" }, { quoted: m });
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
