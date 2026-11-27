// download/douyindl — satu file: metadata + kode fitur (gabungan dari engine3/plugins/download/douyindl.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "douyindl",
  "command": [
    "dydl"
  ],
  "category": "downloader",
  "desc": "Download video/audio dari Douyin (TikTok China)",
  "usage": ".douyindl <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/download").split('\\').join('/')
module.exports = __vx.plugin("download/douyindl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/douyindl.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "douyindl",
    alias: ["douyin", "dydl"],
    category: "download",
    description: "Download video/audio dari Douyin (TikTok China)",
    usage: ".douyindl <url>",
    example: ".douyindl https://v.douyin.com/xxx",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  async function douyinFetch(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await axios.get(`https://api.azbry.com/api/downloader/douyin?url=${encodeURIComponent(url)}`, { timeout: 30000 });
        if (res.data?.status && res.data?.result) {
          return res.data;
        }
      } catch (e) {
        if (i === retries - 1) throw e;
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    throw new Error("Gagal mengambil data dari server");
  }
  
  async function handler(m, { sock }) {
    const text = m.text?.trim();
    if (!text) {
      m.react("❌");
      return m.reply(
        `🎵 *Douyin Downloader*\n\n` +
          `Download video atau audio dari Douyin (TikTok China).\n\n` +
          `*PENGGUNAAN:*\n` +
          `> *${m.prefix}douyindl <link>*\n\n` +
          `*CONTOH:*\n` +
          `> *${m.prefix}douyindl https://v.douyin.com/xxx*`,
      );
    }
  
    m.react("🕕");
  
    try {
      const data = await douyinFetch(text);
      const result = data.result;
  
      let caption = `🎵 *${result.platform || "Douyin"}*\n\n${result.title || ""}`;
  
      if (result.video) {
        await sock.sendMedia(m.chat, result.video, caption, m, {
          type: "video",
        });
      }
  
      if (result.audio) {
        await sock.sendMedia(m.chat, result.audio, null, m, {
          type: "audio",
        });
      }
  
      m.react("✅");
    } catch (e) {
      console.error(e);
      m.react("☢");
      m.reply("❌ Gagal mengambil data Douyin, coba lagi nanti");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
