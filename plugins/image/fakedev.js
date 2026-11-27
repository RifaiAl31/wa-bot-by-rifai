// canvas/fakedev — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/fakedev.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "fakedev",
  "command": [
    "fakedev"
  ],
  "category": "image",
  "desc": "Bikin gambar fakedev dari fotomu",
  "usage": ".fakedev <teks> (reply/kirim foto)",
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
module.exports = __vx.plugin("canvas/fakedev", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fakedev.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  const { downloadMediaMessage, getContentType } = require("../../lib/ext/src/lib/baileys.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "fakedev",
    alias: [],
    category: "canvas",
    description: "Bikin gambar fakedev dari fotomu",
    usage: ".fakedev <teks> (reply/kirim foto)",
    example: ".fakedev developer",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
  };
  
  function drawCircularTextTop(ctx, text, centerX, centerY, radius, badgeImage) {
    const fontSize = 72;
    const strokeWidth = 3;
    const arcSpan = Math.PI * 0.7;
  
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  
    const textRadius = radius + 75;
    const chars = text.split("");
    const n = chars.length;
    const angleIncrement = n > 1 ? arcSpan / (n - 1) : 0;
    const start = Math.PI / 2 + arcSpan / 2;
  
    for (let i = 0; i < n; i++) {
      const char = chars[i];
      const angle = start - i * angleIncrement;
      const x = centerX + Math.cos(angle) * textRadius;
      const y = centerY + Math.sin(angle) * textRadius;
  
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle - Math.PI / 2);
      ctx.lineWidth = strokeWidth;
      ctx.strokeText(char, 0, 0);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  
    if (badgeImage) {
      const endAngle = start - (n - 1) * angleIncrement;
      const badgeAngle = endAngle - angleIncrement;
      const badgeSize = Math.round(fontSize * 0.9);
      const bx = centerX + Math.cos(badgeAngle) * textRadius;
      const by = centerY + Math.sin(badgeAngle) * textRadius;
      ctx.drawImage(badgeImage, bx - badgeSize / 2, by - badgeSize / 2, badgeSize, badgeSize);
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
  
      const bgUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772797781960.jpeg";
      const bgBuffer = await axios.get(bgUrl, { responseType: "arraybuffer" }).then(r => r.data);
      const badgeBuffer = await axios.get("https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772797710490.png", { responseType: "arraybuffer" }).then(r => r.data);
  
      const userImage = await loadImage(media);
      const bg = await loadImage(Buffer.from(bgBuffer));
      const badge = await loadImage(Buffer.from(badgeBuffer));
  
      const canvas = createCanvas(1080, 1080);
      const ctx = canvas.getContext("2d");
  
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 263;
  
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(userImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
      ctx.restore();
  
      drawCircularTextTop(ctx, text.toUpperCase(), centerX, centerY, radius, badge);
  
      const buffer = await canvas.encode("png");
      await sock.sendMessage(m.chat, { image: buffer, caption: "👨‍💻 *Fake Dev*" }, { quoted: m });
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
