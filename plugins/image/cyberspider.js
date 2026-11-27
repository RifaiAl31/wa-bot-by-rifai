// canvas/cyberspider — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/cyberspider.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "cyberspider",
  "command": [
    "cyberspider"
  ],
  "category": "image",
  "desc": "Bikin card cyber spider dari fotomu",
  "usage": ".cyberspider <teks> (reply/kirim foto)",
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
module.exports = __vx.plugin("canvas/cyberspider", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/cyberspider.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  const { downloadMediaMessage, getContentType } = require("../../lib/ext/src/lib/baileys.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "cyberspider",
    alias: [],
    category: "canvas",
    description: "Bikin card cyber spider dari fotomu",
    usage: ".cyberspider <teks> (reply/kirim foto)",
    example: ".cyberspider Cyber",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
  };
  
  function drawCircularText(ctx, text, centerX, centerY, radius) {
    const chars = text.split('');
    const n = chars.length;
    const arcSpan = Math.PI * 0.7;
    const angleIncrement = n > 1 ? arcSpan / (n - 1) : 0;
    const start = Math.PI / 2 + arcSpan / 2;
  
    for (let i = 0; i < n; i++) {
      const char = chars[i];
      const angle = start - i * angleIncrement;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle - Math.PI / 2);
      ctx.strokeText(char, 0, 0);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }
  
  async function handler(m, { sock }) {
    const text = m.text?.trim();
    if (!text) {
      return m.reply(`⚠️ Harap masukkan teksnya!\nContoh: \`${m.prefix}${m.command} Halo\``);
    }
  
    let media = null;
    const msgObj = m.quoted?.message ? m.quoted : m;
    const type = getContentType(msgObj.message);
  
    if (!type || type !== "imageMessage") {
      return m.reply(`⚠️ Harap kirim atau reply foto dengan perintah \`${m.prefix}${m.command} <teks>\``);
    }
    
    await m.react("🕕");
    
    try {
      media = await downloadMediaMessage(msgObj, "buffer", {});
      if (!media) throw new Error("Gagal membaca media");
  
      const bgUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771188972777.jpeg";
      const bgBuffer = await axios.get(bgUrl, { responseType: "arraybuffer" }).then(r => r.data);
  
      const bg = await loadImage(Buffer.from(bgBuffer));
      const userImg = await loadImage(media);
      const canvas = createCanvas(bg.width, bg.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  
      const circleSize = 115;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
  
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleSize, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
  
      const minSide = Math.min(userImg.width, userImg.height);
      const cropX = (userImg.width - minSide) / 2;
      const cropY = (userImg.height - minSide) / 2;
  
      ctx.drawImage(userImg, cropX, cropY, minSide, minSide, centerX - circleSize, centerY - circleSize, circleSize * 2, circleSize * 2);
      ctx.restore();
  
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleSize + 5, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#fff";
      ctx.stroke();
  
      ctx.save();
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
  
      const maxFontSize = 27.5;
      const minFontSize = 12.5;
      let fontSize = maxFontSize;
      if (text.length > 10) fontSize = Math.max(minFontSize, maxFontSize - (text.length - 10));
      ctx.font = `bold ${fontSize}px serif`;
  
      const radius = circleSize + 75;
      drawCircularText(ctx, text.toUpperCase(), centerX, centerY - 15, radius);
      ctx.restore();
  
      const buffer = await canvas.encode("png");
      await sock.sendMessage(m.chat, { image: buffer, caption: "🕷️ *Cyber Spider*" }, { quoted: m });
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
