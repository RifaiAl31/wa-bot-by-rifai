// canvas/tiktokchat — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/tiktokchat.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "tiktokchat",
  "command": [
    "tiktokchat",
    "tiktok-chat",
    "ttchat"
  ],
  "category": "image",
  "desc": "Membuat fake chat TikTok dari avatar kamu",
  "usage": ".tiktokchat username | pesan (reply gambar)",
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
module.exports = __vx.plugin("canvas/tiktokchat", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tiktokchat.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const FormData = __vxDef(require("form-data"));
  
  const pluginConfig = {
    name: "tiktokchat",
    alias: ["tiktok-chat", "ttchat"],
    category: "canvas",
    description: "Membuat fake chat TikTok dari avatar kamu",
    usage: ".tiktokchat username | pesan (reply gambar)",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text }) {
    const isImage = m.isImage || (m.quoted && m.quoted.type === "imageMessage");
  
    if (!isImage || !text || !text.includes("|")) {
      let help = `💬 *TIKTOK CHAT CANVAS*\n\n`
      help += `Fitur ini digunakan untuk membuat desain chat palsu bergaya TikTok yang estetis!\n\n`
      help += `*Cara Penggunaan:*\n`
      help += `- Kirim foto profil (avatar) dengan caption *${m.prefix}tiktokchat username | pesan kamu*\n`
      help += `- Atau balas (reply) foto profil dengan pesan *${m.prefix}tiktokchat username | pesan kamu*\n\n`
      help += `*Contoh:* ${m.prefix}tiktokchat WhatsApp Bot | Halo, hari ini cerah ya!`
      return m.reply(help);
    }
  
    await m.react("🕕");
  
    try {
      let [username, ...msgParts] = text.split("|");
      username = username.trim();
      const message = msgParts.join("|").trim();
  
      let buffer;
      if (m.quoted && m.quoted.isMedia) {
        buffer = await m.quoted.download();
      } else if (m.isMedia) {
        buffer = await m.download();
      }
  
      if (!buffer) {
        await m.react("❌");
        return m.reply(`Maaf, sistem gagal mengunduh gambar avatar yang kamu berikan.`);
      }
  
      const form = new FormData();
      form.append("username", username);
      form.append("text", message);
      form.append("avatar", buffer, { filename: "avatar.jpg", contentType: "image/jpeg" });
  
      const response = await axios.post("https://my.izuka-api.xyz/api/canvas/tiktok-chat", form, {
        headers: form.getHeaders(),
        responseType: "arraybuffer",
        timeout: 60000
      });
  
      await sock.sendMessage(m.chat, { image: Buffer.from(response.data) }, { quoted: m });
      await m.react("✅");
  
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      console.error("[TIKTOKCHAT Plugin Error]", error);
      await m.react("❌");
      m.reply(`Maaf, gagal membuat canvas TikTok Chat kali ini. Coba lagi beberapa saat.`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
