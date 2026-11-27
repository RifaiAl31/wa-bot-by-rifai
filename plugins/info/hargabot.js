// main/hargabot — satu file: metadata + kode fitur (gabungan dari engine7/plugins/main/hargabot.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "hargabot",
  "command": [
    "hargabot",
    "sethargabot"
  ],
  "category": "info",
  "desc": "Menampilkan dan mengatur daftar harga sewa bot",
  "usage": ".hargabot / .sethargabot <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/hargabot", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/hargabot.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const dbFile = path.join(process.cwd(), "database", "hargabot.json");
  
  function readDb() {
    try {
      if (fs.existsSync(dbFile)) {
        return JSON.parse(fs.readFileSync(dbFile, "utf-8"));
      }
    } catch (e) {}
    return { text: "" };
  }
  
  function writeDb(data) {
    try {
      const dir = path.dirname(dbFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    } catch (e) {}
  }
  
  const pluginConfig = {
    name: "hargabot",
    alias: ["sethargabot"],
    category: "main",
    description: "Menampilkan dan mengatur daftar harga sewa bot",
    usage: ".hargabot / .sethargabot <teks>",
    example: ".sethargabot 1 Hari = 1k",
    isOwner: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, isOwner }) {
    const fullText = (m.text || m.body || "").trim();
    const prefix = m.prefix || ".";
  
    // Cek kalau command-nya sethargabot
    if (/^[\/.!#]?sethargabot/i.test(m.command || fullText)) {
      // Proteksi khusus Owner
      const checkOwner = m.isOwner || isOwner;
      if (!checkOwner) {
        await m.react("❌");
        return m.reply("❌ Perintah ini *khusus untuk Owner Bot*!");
      }
  
      const newText = fullText.replace(/^[\/.!#]?sethargabot\s*/i, "").trim();
      if (!newText) {
        return m.reply(`❌ Masukkan teksnya juga!\nContoh: \`${prefix}sethargabot ⭐ PRICE LIST ⭐\n1 Hari -> Rp1.000\``);
      }
  
      writeDb({ text: newText });
      await m.react("✅");
      return m.reply(`✅ Daftar harga untuk *hargabot* berhasil diubah!`);
    }
  
    // --- MEMBER BIASA & OWNER BISA AKSES DENGAN COMMAND .hargabot ---
    await m.react("⭐");
  
    try {
      const db = readDb();
      let caption = db.text;
  
      if (!caption) {
        caption = 
          `Daftar harga belum disetel oleh Owner Bot.`;
      }
  
      await m.react("✅");
      return await sock.sendMessage(m.chat, {
        text: caption.trim()
      }, { quoted: m });
  
    } catch (error) {
      console.error("[Hargabot Error]:", error?.message);
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
