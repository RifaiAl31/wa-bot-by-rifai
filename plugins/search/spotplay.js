// search/spotplay — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/spotplay.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "spotplay",
  "command": [
    "spotplay",
    "splay"
  ],
  "category": "search",
  "desc": "Putar musik dari Spotify",
  "usage": ".spotplay <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/spotplay", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/spotplay.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "spotplay",
    alias: ["splay", "sp"],
    category: "search",
    description: "Putar musik dari Spotify",
    usage: ".spotplay <query>",
    example: ".spotplay neffex grateful",
    cooldown: 15,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const query = m.text?.trim();
    if (!query)
      return m.reply(`⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n> \`${m.prefix}spotplay <query>\``);
  
    await m.react("🕕");
  
    try {
      const searchUrl = `https://my.izuka-api.xyz/api/search/spotify-search?query=${encodeURIComponent(query)}`;
      const searchRes = await axios.get(searchUrl, { timeout: 30000 });
      const searchData = searchRes.data;
  
      if (!searchData?.status || !searchData?.result || searchData.result.length === 0) {
        await m.react("❌");
        return m.reply("❌ Lagu Spotify tidak ditemukan.");
      }
  
      const firstTrack = searchData.result[0];
      const dlUrl = `https://my.izuka-api.xyz/api/downloader/spotify?url=${encodeURIComponent(firstTrack.url)}`;
      const dlRes = await axios.get(dlUrl, { timeout: 30000 });
      const dlData = dlRes.data;
  
      if (!dlData?.status || !dlData?.result?.download_url) {
        await m.react("❌");
        return m.reply("❌ Gagal mengambil link download lagu Spotify.");
      }
  
      const result = dlData.result;
  
      await sock.sendMedia(m.chat, result.download_url, null, m, {
        type: "audio",
        mimetype: "audio/mpeg",
        ptt: false,
        fileName: `${result.artist || "Spotify"} - ${result.title || "audio"}.mp3`,
      });
  
      await m.react("✅");
    } catch (e) {
      console.error("[Spotplay Error]", e);
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
