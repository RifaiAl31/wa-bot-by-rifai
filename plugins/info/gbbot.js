// main/gbbot — satu file: metadata + kode fitur (gabungan dari engine7/plugins/main/gbbot.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "gbbot",
  "command": [
    "gbbot",
    "botgb",
    "officialgb",
    "grupbot",
    "gcbot",
    "setgbbot"
  ],
  "category": "info",
  "desc": "Menampilkan atau mengatur link grup komunitas",
  "usage": ".gbbot / .setgbbot <link grup>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/gbbot", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gbbot.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const dbFile = path.join(process.cwd(), "database", "gbbot.json");
  
  function readDb() {
    try {
      if (fs.existsSync(dbFile)) {
        return JSON.parse(fs.readFileSync(dbFile, "utf-8"));
      }
    } catch (e) {}
    return { link: "" };
  }
  
  function writeDb(data) {
    try {
      const dir = path.dirname(dbFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    } catch (e) {}
  }
  
  const pluginConfig = {
    name: "gbbot",
    alias: ["botgb", "officialgb", "grupbot", "gcbot", "setgbbot"],
    category: "main",
    description: "Menampilkan atau mengatur link grup komunitas",
    usage: ".gbbot / .setgbbot <link grup>",
    example: ".setgbbot https://chat.whatsapp.com/...",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, isOwner }) {
    const fullText = (m.text || m.body || "").trim();
    const prefix = m.prefix || ".";
  
    // Mode Pengaturan Link Khusus Owner (.setgbbot <link>)
    if (/^[\/.!#]?setgbbot/i.test(m.command || fullText)) {
      const checkOwner = m.isOwner || isOwner;
      if (!checkOwner) {
        await m.react("❌");
        return m.reply("❌ Perintah ini *khusus untuk Owner Bot*!");
      }
  
      const newLink = fullText.replace(/^[\/.!#]?setgbbot\s*/i, "").trim();
      if (!newLink || !newLink.includes("chat.whatsapp.com")) {
        return m.reply(`❌ Masukkan link grup WhatsApp yang valid!\nContoh: \`${prefix}setgbbot https://chat.whatsapp.com/...\``);
      }
  
      writeDb({ link: newLink });
      await m.react("✅");
      return m.reply(`✅ Link *gbbot* berhasil diperbarui!\n🔗 Link Baru: ${newLink}`);
    }
  
    // --- MODE TAMPILKAN UNTUK SEMUA USER (.gbbot) ---
    await m.react("🌐");
  
    try {
      const db = readDb();
      const groupLink = String(db.link || '').trim();
      const botName = global.namebot || "WhatsApp Bot";
      let caption = `╭───〔 🌐 *KOMUNITAS BOT* 〕───\n`;
      caption += `├ 🤖 *Bot:* ${botName}\n`;
      caption += `╰─────────────────────────\n\n`;
      caption += `Halo *@${m.sender.split("@")[0]}* 👋\n\n`;
      caption += groupLink
        ? `🔗 *Link grup:*\n${groupLink}`
        : `Link komunitas belum dikonfigurasi.`;
  
      await m.react("✅");
  
      return await sock.sendMessage(m.chat, {
        text: caption.trim(),
        mentions: [m.sender]
      }, { quoted: m });
  
    } catch (error) {
      console.error("[GBBot Error]:", error?.message);
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
