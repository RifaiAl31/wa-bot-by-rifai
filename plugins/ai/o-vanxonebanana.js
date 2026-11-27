// ai/vanxonebanana — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/vanxonebanana.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "bananaedit",
  "command": [
    "bananaedit"
  ],
  "category": "ai",
  "desc": "Edit gambar dengan AI menggunakan prompt",
  "usage": ".bananaedit <prompt>",
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
module.exports = __vx.plugin("ai/vanxonebanana", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/vanxonebanana.js'
  const __vxExports = {};
  const { live3d } = require("../../lib/ext/src/scraper/seaart.e3.js");
  const pluginConfig = {
    name: "bananaedit",
    alias: [],
    category: "ai",
    description: "Edit gambar dengan AI menggunakan prompt",
    usage: ".bananaedit <prompt>",
    example: ".bananaedit make it anime style",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const prompt = m.args.join(" ");
    if (!prompt) {
      return m.reply(
        `🍌 *WhatsApp Bot BANANA SUPER*\n\n` +
          `> Edit gambar dengan AI\n\n` +
          `\`Contoh: ${m.prefix}bananaedit make it anime style\`\n\n` +
          `> Reply atau kirim gambar dengan caption`,
      );
    }
  
    const isImage = m.isImage || (m.quoted && m.quoted.isImage);
    if (!isImage) {
      return m.reply(
        `🍌 *ɴᴀɴᴏ ʙᴀɴᴀɴᴀ*\n\n> Reply atau kirim gambar dengan caption`,
      );
    }
  
    m.react("🕕");
  
    try {
      let mediaBuffer;
      if (m.isImage && m.download) {
        mediaBuffer = await m.download();
      } else if (m.quoted && m.quoted.isImage && m.quoted.download) {
        mediaBuffer = await m.quoted.download();
      }
  
      if (!mediaBuffer || !Buffer.isBuffer(mediaBuffer)) {
        m.react("❌");
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Gagal mengunduh gambar`);
      }
  
      const resultBuffer = await live3d(mediaBuffer, prompt).then(
        (res) => res.image,
      );
  
      m.react("✅");
  
      await sock.sendMedia(m.chat, resultBuffer, null, m, {
        type: "image",
      });
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      console.log(error);
      m.react("❌");
      m.reply(`🍀 *Waduhh, sepertinya ini ada kendala*
  Silahkan coba lagi nanti, dimohon jangan spam`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
