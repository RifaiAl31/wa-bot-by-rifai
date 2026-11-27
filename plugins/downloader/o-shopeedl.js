// download/shopeedl — satu file: metadata + kode fitur (gabungan dari engine3/plugins/download/shopeedl.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "shopeedl",
  "command": [
    "shopeedl",
    "shopeevideo",
    "shopeevid"
  ],
  "category": "downloader",
  "desc": "Download video dari Shopee",
  "usage": ".shopeedl <url>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/download").split('\\').join('/')
module.exports = __vx.plugin("download/shopeedl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/shopeedl.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "shopeedl",
    alias: ["shopeevideo", "shopeevid"],
    category: "download",
    description: "Download video dari Shopee",
    usage: ".shopeedl <url>",
    example: ".shopeedl https://shopee.co.id/universal-link/video/...",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
  };
  
  const BASE_URL = "https://shopeenowatermark.com";
  
  async function extract(url) {
    const form = new FormData();
    form.append("url", url);
  
    const res = await fetch(`${BASE_URL}/api/extract`, {
      method: "POST",
      body: form,
    });
  
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Extraction failed");
    return data;
  }
  
  function bestStream(streams) {
    const order = ["V1080P", "V720P", "V540P", "V360P", "V1080P_H265", "V720P_H265", "V540P_H265", "V360P_H265"];
    for (const q of order) {
      const s = streams.find(s => s.quality === q);
      if (s) return s;
    }
    return streams[0];
  }
  
  async function handler(m, { sock }) {
    const url = m.args[0] || m.text?.trim();
  
    if (!url || !url.includes("shopee")) {
      return m.reply("❌ Masukkan link video Shopee yang valid.\n\nContoh: `.shopeedl https://shopee.co.id/...`");
    }
  
    await m.react("🕕");
  
    try {
      const data = await extract(url);
      if (!data || !data.streams_array || data.streams_array.length === 0) {
        await m.react("❌");
        return m.reply("⚠️ Gagal mengekstrak video. Pastikan link video Shopee sudah benar dan bersifat publik.");
      }
  
      const best = bestStream(data.streams_array);
      const videoUrl = best.stream_url;
  
      let caption = `🛍️ *SHOPEE VIDEO DOWNLOADER* 🛍️\n\n`;
      if (data.username) caption += `*Username:* ${data.username}\n`;
      caption += `*Kualitas:* ${best.quality}\n`;
      caption += `\n> Dibuat oleh bot kesayanganmu`;
  
      await sock.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption: caption
      }, { quoted: m });
  
      await m.react("✅");
  
    } catch (error) {
      console.error("[Shopee DL]", error.message);
      await m.react("☢");
      m.reply("😔 Gagal mengunduh video dari Shopee.");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
