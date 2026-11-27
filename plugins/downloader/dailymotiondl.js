// download/dailymotiondl — satu file: metadata + kode fitur (gabungan dari engine3/plugins/download/dailymotiondl.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "dailymotiondl",
  "command": [
    "dailymotiondl",
    "dailymotion",
    "dmdl"
  ],
  "category": "downloader",
  "desc": "Download video dari Dailymotion",
  "usage": ".dailymotiondl <url>",
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
    "scrapers": [
      "dailymotion"
    ],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/download").split('\\').join('/')
module.exports = __vx.plugin("download/dailymotiondl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/dailymotiondl.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { execFile } = require("child_process");
  const { promisify } = require("util");
  const fs = __vxDef(require("fs"));
  const os = __vxDef(require("os"));
  const path = __vxDef(require("path"));
  const { DailymotionDL } = require("../../lib/ext/src/scraper/dailymotion.js");
  
  const exec = promisify(execFile);
  
  const pluginConfig = {
    name: "dailymotiondl",
    alias: ["dailymotion", "dmdl"],
    category: "download",
    description: "Download video dari Dailymotion",
    usage: ".dailymotiondl <url>",
    example: ".dailymotiondl https://www.dailymotion.com/video/xxx",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 2,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const text = m.text?.trim();
    if (!text) {
      m.react("❌");
      return m.reply(
        `🎬 *Dailymotion Downloader*\n\n` +
          `Download video dari Dailymotion, otomatis dikonversi ke MP4.\n\n` +
          `*PENGGUNAAN:*\n` +
          `> *${m.prefix}dailymotiondl <link>*\n\n` +
          `*CONTOH:*\n` +
          `> *${m.prefix}dailymotiondl https://www.dailymotion.com/video/xxx*\n\n` +
          `_Proses konversi mungkin agak lama_`,
      );
    }
  
    m.react("🕕");
  
    try {
      const result = await DailymotionDL(text);
  
      if (!result.status) {
        m.react("☢");
        return m.reply(`❌ *Dailymotion Gagal*\n\n> ${result.error}`);
      }
  
      let caption =
        `🎬 *Dailymotion*\n\n` +
        `> 📌 ${result.title}\n` +
        `> ⏱️ Durasi: ${result.duration}\n` +
        `> 📺 Kualitas: ${result.quality}`;
  
      if (result.thumbnail) {
        await sock.sendMedia(m.chat, result.thumbnail, caption, m, {
          type: "image",
        });
      }
  
      if (result.video) {
        const tmpFile = path.join(os.tmpdir(), `dm_${Date.now()}.mp4`);
  
        await exec(
          "ffmpeg",
          [
            "-y",
            "-i",
            result.video,
            "-c",
            "copy",
            "-bsf:a",
            "aac_adtstoasc",
            tmpFile,
          ],
          { timeout: 120000 },
        );
  
        const buffer = fs.readFileSync(tmpFile);
        fs.unlinkSync(tmpFile);
  
        await sock.sendMessage(
          m.chat,
          {
            document: buffer,
            mimetype: "video/mp4",
            fileName:
              (result.title || "video").replace(/[<>:"/\\|?*]/g, "") + ".mp4",
            caption,
          },
          { quoted: m },
        );
      }
  
      m.react("✅");
    } catch (e) {
      console.error(e);
      m.react("☢");
      m.reply("❌ Gagal mengambil data Dailymotion, coba lagi nanti");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
