// ai/txt2img2 — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/txt2img2.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "text2img4",
  "command": [
    "txt2img2",
    "text2img4",
    "imggen2",
    "flux"
  ],
  "category": "ai",
  "desc": "Buat gambar dari teks pakai Flux Klein 4B",
  "usage": ".txt2img2 <deskripsi gambar>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/txt2img2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/txt2img2.js'
  const __vxExports = {};
  const { Txt2Img2 } = require("../../lib/ext/src/scraper/txt2img2.js");
  
  const pluginConfig = {
    name: "text2img4",
    alias: ["t2i2", "imggen2", "flux"],
    category: "ai",
    description: "Buat gambar dari teks pakai Flux Klein 4B",
    usage: ".txt2img2 <deskripsi gambar>",
    example: ".txt2img2 Mobil Lamborghini revuelto",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 3,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const text = m.args.join(" ");
    if (!text) {
      m.react("❌");
      return m.reply(
        `🎨 *Text to Image (Flux)*\n\n` +
        `Buat gambar dari deskripsi teks pakai AI Flux Klein 4B.\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}txt2img2 <deskripsi>*\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}txt2img2 Mobil Lamborghini revuelto*\n` +
        `> *${m.prefix}txt2img2 Kucing lucu pakai topi*\n\n` +
        `_Proses generate agak lama, sekitar 30-60 detik_`
      );
    }
  
    m.react("🕕");
  
    try {
      const result = await Txt2Img2(text);
  
      if (!result.status) {
        m.react("☢");
        return m.reply(`❌ *Generate Gagal*\n\n> ${result.error}`);
      }
  
      await sock.sendMedia(m.chat, result.url, `🎨 *Flux Klein 4B*\n\n> Prompt: *${result.prompt}*`, m, {
        type: "image",
      });
  
      m.react("✅");
    } catch (e) { globalThis.__vanxoneCatch?.(e);
      console.error(e);
      m.react("☢");
      m.reply("❌ Gagal generate gambar, coba lagi nanti");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
