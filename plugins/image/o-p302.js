// canvas/p302 — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/p302.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "p302",
  "command": [
    "p302"
  ],
  "category": "image",
  "desc": "Buat logo 3D metal (p302)",
  "usage": ".p302 <teks>",
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
module.exports = __vx.plugin("canvas/p302", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/p302.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas } = require("@napi-rs/canvas");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "p302",
    alias: ["p302"],
    category: "canvas",
    description: "Buat logo 3D metal (p302)",
    usage: ".p302 <teks>",
    example: ".p302 Fauzan",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    let text = m.text?.trim();
  
    if (!text) {
      return m.reply(`⚠️ Harap masukkan teksnya!\nContoh: \`${m.prefix}${m.command} Fauzan\``);
    }
  
    await m.react("🕕");
  
    try {
      text = text.toUpperCase();
  
      const width = 1200;
      const height = 600;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
  
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, "#0b1220");
      bgGradient.addColorStop(0.5, "#000000");
      bgGradient.addColorStop(1, "#111827");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
  
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
  
      let fontSize = 320;
      const maxWidth = width * 0.95;
  
      ctx.font = `bold ${fontSize}px sans-serif`;
      let textWidth = ctx.measureText(text).width;
  
      if (textWidth > maxWidth) {
        fontSize = Math.floor(fontSize * (maxWidth / textWidth));
      }
  
      ctx.font = `bold ${fontSize}px sans-serif`;
  
      const x = width / 2;
      const y = height / 2;
  
      ctx.shadowColor = "rgba(0,0,0,0.9)";
      ctx.shadowBlur = 60;
      ctx.shadowOffsetY = 30;
      ctx.fillStyle = "#000000";
      ctx.fillText(text, x, y + 25);
  
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
  
      const metal = ctx.createLinearGradient(0, y - fontSize, 0, y + fontSize);
      metal.addColorStop(0, "#ffffff");
      metal.addColorStop(0.2, "#e5e7eb");
      metal.addColorStop(0.5, "#9ca3af");
      metal.addColorStop(0.8, "#e5e7eb");
      metal.addColorStop(1, "#ffffff");
  
      ctx.fillStyle = metal;
      ctx.fillText(text, x, y);
  
      ctx.lineWidth = fontSize * 0.05;
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.strokeText(text, x, y);
  
      const buffer = await canvas.encode("png");
      
      await sock.sendMessage(m.chat, {
        image: buffer,
        caption: "✨ Logo p302 berhasil dibuat!"
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
