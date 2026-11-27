// download/terabox — satu file: metadata + kode fitur (gabungan dari engine3/plugins/download/terabox.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "terabox",
  "command": [
    "terabox",
    "tb",
    "tera",
    "teraboxdl",
    "tbdl"
  ],
  "category": "downloader",
  "desc": "Download video/file dari TeraBox",
  "usage": ".terabox <url>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/download").split('\\').join('/')
module.exports = __vx.plugin("download/terabox", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/terabox.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { execFile } = require("child_process");
  const { promisify } = require("util");
  const fs = __vxDef(require("fs"));
  const os = __vxDef(require("os"));
  const path = __vxDef(require("path"));
  const axios = __vxDef(require("axios"));
  const { TeraBoxDL } = require("../../lib/ext/src/scraper/terabox.js");
  
  const exec = promisify(execFile);
  
  const pluginConfig = {
    name: "terabox",
    alias: ["tb", "tera", "teraboxdl", "tbdl"],
    category: "download",
    description: "Download video/file dari TeraBox",
    usage: ".terabox <url>",
    example: ".terabox https://terabox.com/s/xxx",
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
        `📦 *TeraBox Downloader*\n\n` +
          `Download video atau file dari TeraBox.\n\n` +
          `*PENGGUNAAN:*\n` +
          `> *${m.prefix}terabox <link>*\n\n` +
          `*CONTOH:*\n` +
          `> *${m.prefix}terabox https://terabox.com/s/xxx*\n\n` +
          `_File dikirim sebagai dokumen, mungkin agak lama_`,
      );
    }
  
    m.react("🕕");
  
    try {
      const result = await TeraBoxDL(text);
  
      if (!result.status) {
        m.react("☢");
        return m.reply(`❌ *TeraBox Gagal*\n\n> ${result.error}`);
      }
  
      let caption =
        `📦 *TeraBox*\n\n` +
        `> 📌 ${result.file_name}\n` +
        `> 📏 Size: ${result.file_size}\n` +
        `> ⏱️ Durasi: ${result.duration}`;
  
      if (result.thumbnail) {
        await sock.sendMedia(m.chat, result.thumbnail, caption, m, {
          type: "image",
        });
      }
  
      if (result.stream_url && result.stream_url.endsWith(".m3u8")) {
        const tmpFile = path.join(os.tmpdir(), `tb_${Date.now()}.mp4`);
  
        await exec(
          "ffmpeg",
          [
            "-y",
            "-i",
            result.stream_url,
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
              (result.file_name || "video").replace(/[<>:"/\\|?*]/g, "") + ".mp4",
            caption,
          },
          { quoted: m },
        );
      } else if (result.download_url) {
        const res = await axios.get(result.download_url, {
          responseType: "arraybuffer",
          timeout: 120000,
          maxContentLength: 200 * 1024 * 1024,
        });
  
        const ext = result.extension || ".mp4";
        const fileName =
          (result.file_name || "file").replace(/[<>:"/\\|?*]/g, "") + ext;
  
        await sock.sendMessage(
          m.chat,
          {
            document: Buffer.from(res.data),
            mimetype: "application/zip",
            fileName,
            caption,
          },
          { quoted: m },
        );
      }
  
      m.react("✅");
    } catch (e) {
      console.error(e);
      m.react("☢");
      m.reply("❌ Gagal mengambil data TeraBox, coba lagi nanti");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
