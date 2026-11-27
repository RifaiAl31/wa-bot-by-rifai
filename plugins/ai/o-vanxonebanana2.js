// ai/vanxonebanana2 — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/vanxonebanana2.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "bananaedit2",
  "command": [
    "bananaedit2"
  ],
  "category": "ai",
  "desc": "Buat gambar dengan AI menggunakan prompt",
  "usage": ".bananaedit2 <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/vanxonebanana2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/vanxonebanana2.js'
  const __vxExports = {};
  const { fluxImage } = require("../../lib/ext/src/scraper/seaart.e3.js");
  
  const pluginConfig = {
    name: "bananaedit2",
    alias: [],
    category: "ai",
    description: "Buat gambar dengan AI menggunakan prompt",
    usage: ".bananaedit2 <prompt>",
    example: ".bananaedit2 make it anime style",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const prompt = m.text;
    if (!prompt) {
      return m.reply(
        `🍌 *WhatsApp Bot BANANA SUPER 2*\n\n` +
          `> Buat gambar dengan AI\n\n` +
          `\`Contoh: ${m.prefix}bananaedit2 make a cat\``,
      );
    }
  
    m.react("🕕");
  
    try {
      const result = await fluxImage(prompt, "1:1");
      const imageUrl = result.url;
  
      m.react("✅");
  
      await sock.sendMedia(m.chat, imageUrl, null, m, {
        type: "image",
      });
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      console.log(error);
      m.react("❌");
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Terjadi kesalahan";
      m.reply(`🍀 *Waduhh, sepertinya ini ada kendala*
  
  ${msg}
  
  Silahkan coba lagi nanti, dimohon jangan spam`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
