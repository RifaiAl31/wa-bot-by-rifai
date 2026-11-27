// maker/pinkgreen — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/pinkgreen.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "pinkgreen",
  "command": [
    "pinkgreen"
  ],
  "category": "maker",
  "desc": "Efek pink-green bergaya WhatsApp Bot by WhatsApp Bot 2",
  "usage": ".pinkgreen <reply/kirim gambar>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 5,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/pinkgreen", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/pinkgreen.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs/promises"));
  const os = __vxDef(require("os"));
  const path = __vxDef(require("path"));
  const { execFile } = require("child_process");
  const { promisify } = require("util");
  
  const execFileAsync = promisify(execFile);
  
  const pluginConfig = {
    name: "pinkgreen",
    category: "maker",
    description: "Efek pink-green bergaya WhatsApp Bot by WhatsApp Bot 2",
    usage: ".pinkgreen <reply/kirim gambar>",
    example: ".pinkgreen",
    isOwner: false,
    isPremium: false,
    cooldown: 8,
    energi: 5,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const qmsg = m.quoted || m;
    const mime = String(qmsg?.mimetype || qmsg?.msg?.mimetype || m.mimetype || m.msg?.mimetype || "");
    if (!/^image\//i.test(mime)) {
      return m.reply(`Reply/kirim gambar lalu gunakan *${m.prefix}pinkgreen*`);
    }
  
    const input = await (qmsg?.download ? qmsg.download() : m.download());
    if (!input) return m.reply("❌ Gagal mengunduh gambar.");
  
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "vanxone-pinkgreen-"));
    const inputPath = path.join(tmpDir, "input.jpg");
    const outputPath = path.join(tmpDir, "output.png");
  
    try {
      await fs.writeFile(inputPath, input);
      const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";
      const filter = "format=gray,lutrgb=r='255*pow(val/255,0.6)':g='100+(5*pow(val/255,0.6))':b='180*pow(val/255,0.6)'";
      await execFileAsync(ffmpeg, ["-y", "-i", inputPath, "-vf", filter, "-frames:v", "1", outputPath], { maxBuffer: 10 * 1024 * 1024 });
      const output = await fs.readFile(outputPath);
      await sock.sendMessage(m.chat, { image: output, caption: "🌸 *PinkGreen*" }, { quoted: m });
      return m.react("✅");
    } catch (e) {
      console.error("[PINKGREEN]", e);
      await m.react("❌").catch(() => {});
      return m.reply(`❌ Gagal membuat efek pinkgreen: ${e.message}`);
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
