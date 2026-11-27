// group/teswelcome — satu file: metadata + kode fitur (gabungan dari engine8/plugins/group/teswelcome.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "teswelcome",
  "command": ["teswelcome", "testwelcome", "teswc"],
  "category": "group",
  "desc": "Preview/test tampilan welcome message di grup ini",
  "usage": ".teswelcome [@user]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/teswelcome", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/teswelcome.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e8.js"));
  const { sendWelcomeMessage } = require("../../lib/ext/plugins/e8/group/welcome.js");
  
  const pluginConfig = {
    name: "teswelcome",
    alias: ["testwelcome", "teswc", "cekwelcome"],
    category: "group",
    description: "Preview/test tampilan welcome message di grup ini",
    usage: ".teswelcome [@user]",
    example: ".teswelcome @user",
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    try {
      const mentioned = m.mentionedJid?.[0] || m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const quoted    = m.quoted?.sender || m.quoted?.participant;
      const target     = mentioned || quoted || m.sender;
  
      m.react("🕕");
  
      const groupMeta = await sock.groupMetadata(m.chat);
  
      const ok = await sendWelcomeMessage(sock, m.chat, target, groupMeta, { force: true });
  
      if (ok) {
        m.react("✅");
      } else {
        m.react("☢");
        return m.reply(
          `╔═══════════════════╗\n║  ⚠️ *ᴛᴇs ɢᴀɢᴀʟ*\n╚═══════════════════╝\n\n` +
          `> Gagal mengirim tes welcome. Cek console untuk detail error.`,
        );
      }
    } catch (error) {
      console.error("TesWelcome Error:", error);
      m.react("☢");
      return m.reply(
        `╔═══════════════════╗\n║  ⚠️ *ᴇʀʀᴏʀ*\n╚═══════════════════╝\n\n` +
        `> Terjadi kesalahan saat menjalankan tes: ${error.message}`,
      );
    }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
