// canvas/fakeovo — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/fakeovo.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "fakeovo",
  "command": [
    "fakeovo",
    "fake-ovo"
  ],
  "category": "image",
  "desc": "Membuat canvas fake ovo",
  "usage": ".fake-ovo <nama>",
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
module.exports = __vx.plugin("canvas/fakeovo", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fakeovo.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
      name: "fakeovo",
      alias: ["fake-ovo", "fakeovo"],
      category: "canvas",
      description: "Membuat canvas fake ovo",
      usage: ".fake-ovo <nama>",
      example: ".fake-ovo Jokowi",
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 2,
      isEnabled: true,
  };
  
  async function handler(m, { sock, text }) {
      if (!text) return m.reply(`Format salah!\n\n> Contoh: .fake-ovo Budi`);
      
      await m.react("🕕");
      try {
          const url = `https://kyzznekoo.zone.id/api/canvas/fake-ovo?q=${encodeURIComponent(text)}`;
          const res = await axios.get(url, {
              responseType: 'arraybuffer',
              headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
                  "Content-Type": "application/json"
              }
          });
          await sock.sendMessage(m.chat, { image: Buffer.from(res.data), caption: "✅ Berhasil membuat fake ovo" }, { quoted: m });
          await m.react("✅");
      } catch (e) {
          console.error("[FakeOvo Error]", e);
          await m.react("❌");
          m.reply(te(m.prefix, m.command, m.pushName));
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
