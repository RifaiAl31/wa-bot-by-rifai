// canvas/gura — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/gura.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "gura",
  "command": [
    "gura",
    "guracanvas"
  ],
  "category": "image",
  "desc": "Bikin efek canvas gura dari fotomu",
  "usage": ".gura (reply/kirim foto)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/gura", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gura.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FormData = __vxDef(require("form-data"));
  const fetch = __vxDef(require("node-fetch"));
  const mime = __vxDef(require("mime-types"));
  const { downloadMediaMessage, getContentType } = require("../../lib/ext/src/lib/baileys.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "gura",
    alias: ["guracanvas"],
    category: "canvas",
    description: "Bikin efek canvas gura dari fotomu",
    usage: ".gura (reply/kirim foto)",
    example: ".gura",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function uploadToCatbox(buffer, filename = "file.jpg") {
    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", buffer, {
      filename,
      contentType: mime.lookup(filename) || "image/jpeg",
    });
  
    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
      timeout: 30000,
    });
  
    if (!res.ok) throw new Error("Catbox gagal");
    const url = await res.text();
    if (!url.startsWith("http")) throw new Error("Invalid response");
    return url;
  }
  
  async function handler(m, { sock }) {
    let media = null;
  
    if (m.quoted?.message) {
      const type = getContentType(m.quoted.message);
      if (!type || type !== "imageMessage") {
        return m.reply("⚠️ Kak, tolong reply ke pesan gambar ya!");
      }
      media = await downloadMediaMessage(m.quoted, "buffer", {});
    } else if (m.message) {
      const type = getContentType(m.message);
      if (!type || type !== "imageMessage") {
        return m.reply(`🦈 *GURA CANVAS*\n\nKirim atau reply foto dengan perintah \`${m.prefix}gura\` untuk memberikan efek Gura!`);
      }
      media = await downloadMediaMessage(m, "buffer", {});
    }
  
    if (!media) return m.reply("❌ Gagal membaca media, coba lagi!");
  
    await m.react("🕕");
  
    try {
      const imgUrl = await uploadToCatbox(media);
  
      const apiUrl = `https://api.nexray.eu.cc/canvas/gura?url=${encodeURIComponent(imgUrl)}`;
      const res = await fetch(apiUrl);
      
      if (!res.ok) throw new Error("API Nexray error");
      
      const buffer = Buffer.from(await res.arrayBuffer());
  
      await sock.sendMessage(m.chat, { image: buffer, caption: "🦈 *RAWWRR! Gura is here!*" }, { quoted: m });
      await m.react("✅");
  
    } catch (err) { globalThis.__vanxoneCatch?.(err);
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
