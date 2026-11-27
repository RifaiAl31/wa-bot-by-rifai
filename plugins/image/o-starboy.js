// canvas/starboy — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/starboy.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "starboy",
  "command": [
    "starboy",
    "canvasstarboy",
    "efekstarboy"
  ],
  "category": "image",
  "desc": "Buat gambar efek Starboy dari foto",
  "usage": ".starboy <reply/kirim foto>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/starboy", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/starboy.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const axios = __vxDef(require("axios"));
  const { uploadImage } = require("../../lib/ext/src/lib/vanxone-uploader.js");
  
  const pluginConfig = {
    name: "starboy",
    alias: ["canvasstarboy", "efekstarboy"],
    category: "canvas",
    description: "Buat gambar efek Starboy dari foto",
    usage: ".starboy <reply/kirim foto>",
    example: ".starboy",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
  
    if (!mime.startsWith("image/")) {
      return m.reply(
        `🌟 *S T A R B O Y*\n\n> Kirim gambar dengan caption *${m.prefix + m.command}* atau balas gambar yang sudah dikirim.`,
      );
    }
  
    m.react("🕕");
  
    try {
      const media = await q.download();
      if (!media) throw new Error("Gagal mengunduh media");
  
      const imageUrl = await uploadImage(media);
      if (!imageUrl) throw new Error("Gagal mengunggah gambar");
  
      const url = `https://api.cuki.biz.id/api/canvas/starboy?apikey=${config.APIkey.cuki}&image=${encodeURIComponent(imageUrl)}`;
      
      const { data } = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000
      });
  
      const imageBuffer = Buffer.from(data, 'binary');
  
      m.react("✅");
      await sock.sendMessage(m.chat, { 
        image: imageBuffer, 
        caption: `🌟 *S T A R B O Y*` 
      }, { quoted: m });
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      console.log(error);
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
