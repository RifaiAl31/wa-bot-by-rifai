// download/pixeldraindl — satu file: metadata + kode fitur (gabungan dari engine3/plugins/download/pixeldraindl.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "pixeldraindl",
  "command": [
    "pixeldraindl",
    "pddl",
    "pixeldrain",
    "pddownload"
  ],
  "category": "downloader",
  "desc": "Download file dari Pixeldrain",
  "usage": ".pixeldraindl <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/download").split('\\').join('/')
module.exports = __vx.plugin("download/pixeldraindl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/pixeldraindl.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const timeHelper = __vxNs(require("../../lib/ext/src/lib/vanxone-time.js"));
  const path = __vxDef(require("path"));
  const fs = __vxDef(require("fs"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const NEOXR_APIKEY = config.APIkey?.neoxr || '';
  
  const pluginConfig = {
    name: "pixeldraindl",
    alias: ["pddl", "pixeldrain", "pddownload"],
    category: "download",
    description: "Download file dari Pixeldrain",
    usage: ".pixeldraindl <url>",
    example: ".pixeldraindl https://pixeldrain.com/u/xxxxx",
    cooldown: 15,
    energi: 2,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const args = m.args || [];
    const url = args[0]?.trim();
  
    if (!url || !url.includes("pixeldrain.com")) {
      return m.reply(
        `📥 *ᴘɪxᴇʟᴅʀᴀɪɴ ᴅᴏᴡɴʟᴏᴀᴅ*\n\n` +
          `> Download file dari Pixeldrain\n\n` +
          `*Format:*\n` +
          `> \`${m.prefix}pixeldraindl <url>\`\n\n` +
          `*Contoh:*\n` +
          `> \`${m.prefix}pixeldraindl https://pixeldrain.com/u/xxxxx\``,
      );
    }
  
    m.react("🕕");
  
    try {
      const apiUrl = `https://api.neoxr.eu/api/pixeldrain?url=${encodeURIComponent(url)}&apikey=${NEOXR_APIKEY}`;
      const data = await f(apiUrl)
  
      if (!data?.status || !data?.data) {
        m.react("❌");
        return m.reply(
          "❌ *ɢᴀɢᴀʟ*\n\n> File tidak ditemukan atau link tidak valid",
        );
      }
  
      const file = data.data;
  
      const sizeMatch = file.size?.match(/([\d.]+)\s*(MB|GB|KB)/i);
      let sizeInMB = 0;
      if (sizeMatch) {
        const value = parseFloat(sizeMatch[1]);
        const unit = sizeMatch[2].toUpperCase();
        if (unit === "GB") sizeInMB = value * 1024;
        else if (unit === "MB") sizeInMB = value;
        else if (unit === "KB") sizeInMB = value / 1024;
      }
  
      if (sizeInMB > 0 && sizeInMB <= 100) {
  
        await sock.sendMedia(m.chat, file.url, null, m, {
          type: 'document',
          fileName: file.filename,
          mimetype: 'application/octet-stream',
          contextInfo: {
            forwardingScore: 99,
            isForwarded: true
          }
        })
      } else if (sizeInMB > 100) {
        await m.reply(
          `⚠️ *ꜰɪʟᴇ ᴛᴇʀʟᴀʟᴜ ʙᴇsᴀʀ*\n\n> File ${file.size} terlalu besar untuk dikirim\n> Gunakan link download di atas`,
        );
      }
  
      m.react("✅");
    } catch (error) {
      m.react('☢');
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
