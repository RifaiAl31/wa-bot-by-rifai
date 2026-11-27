// search/playsoundcloud — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/playsoundcloud.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "playsoundcloud",
  "command": [
    "playsoundcloud",
    "playsc"
  ],
  "category": "search",
  "desc": "Cari dan download lagu dari SoundCloud",
  "usage": ".playsc judul",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/playsoundcloud", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/playsoundcloud.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { scSearch } = require("../../lib/ext/plugins/e3/search/soundcloud.js");
  const scdl = __vxDef(require("../../lib/ext/src/scraper/soundclouddl.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "playsoundcloud",
    alias: ["playsc"],
    category: "search",
    description: "Cari dan download lagu dari SoundCloud",
    usage: ".playsc judul",
    example: ".playsc Only We Know",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 2,
    isEnabled: true,
  };
  
  async function handler(m, { args, sock }) {
    if (!args[0]) {
      let txt = `🎶 *PLAY SOUNDCLOUD* 🎶\n\n`;
      txt += `Halo kak! Pengen dengerin lagu dari SoundCloud? Aku bisa cariin sekalian downloadin format MP3-nya buat kamu!\n\n`;
      txt += `*Cara Pakai:*\n`;
      txt += `👉 \`${m.prefix}playsc <judul lagu>\`\n\n`;
      txt += `*Contoh:*\n`;
      txt += `\`${m.prefix}playsc Only We Know\``;
      return m.reply(txt);
    }
  
    await m.react("🕕");
  
    try {
      const searchResults = await scSearch(args.join(" "));
      if (!searchResults.length) {
        return m.reply(`❌ Yah kak, lagunya nggak ketemu! Coba cari dengan judul lain ya. 😭`);
      }
  
      const track = searchResults[0];
      const downloadInfo = await scdl(track.url);
      let contentTxt = `🎵 *Judul :* ${downloadInfo.title}\n`;
      contentTxt += `👤 *Uploader :* ${downloadInfo.uploader}\n`;
      contentTxt += `⏱️ *Durasi :* ${downloadInfo.duration}\n`;
      contentTxt += `👁️ *Views :* ${downloadInfo.views}\n`;
      contentTxt += `❤️ *Likes :* ${downloadInfo.likes}\n`;
      contentTxt += `📦 *Ukuran :* ${downloadInfo.size}`;
  
      let txt = `🎉 *BERHASIL DOWNLOAD LAGU!* 🎉\n\n`;
      txt += contentTxt.trim().split("\n").map(line => `${line}`).join("\n");
      txt += `\n\n`;
      txt += `_Audio MP3 sedang dikirim, ditunggu ya kak!_ 🎶`;
  
      await sock.sendMedia(m.chat, downloadInfo.thumbnail || track.artwork, txt.trim(), m, { type: "image" });
      await sock.sendMedia(m.chat, downloadInfo.download_url, downloadInfo.title, m, { type: "audio" });
  
      await m.react("✅");
    } catch (e) {
      m.reply(`❌ Gagal mendownload lagu kak! 😭\nError: ${e.message}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
