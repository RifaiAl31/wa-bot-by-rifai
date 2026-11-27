// group/antimedia — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/antimedia.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "antimedia",
  "command": [
    "antimedia",
    "am",
    "nomedia"
  ],
  "category": "group",
  "desc": "Mengatur antimedia di grup (blokir gambar/video/audio/dokumen)",
  "usage": ".antimedia <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/antimedia", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/antimedia.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const pluginConfig = {
    name: "antimedia",
    alias: ["am", "nomedia"],
    category: "group",
    description: "Mengatur antimedia di grup (blokir gambar/video/audio/dokumen)",
    usage: ".antimedia <on/off>",
    example: ".antimedia on",
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    isBotAdmin: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  function gpMsg(key, replacements = {}) {
    const defaults = {
      antimedia: "⚠ *AntiMedia* — Media dari @%user% dihapus.",
    };
    let text = config.groupProtection?.[key] || defaults[key] || "";
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replace(new RegExp(`%${k}%`, "g"), v);
    }
    return text;
  }
  
  async function checkAntimedia(m, sock, db) {
    if (!m.isGroup) return false;
    if (m.isAdmin || m.isOwner || m.fromMe) return false;
  
    const groupData = db.getGroup(m.chat) || {};
    if (!groupData.antimedia) return false;
  
    const isMedia =
      m.isImage || m.isVideo || m.isGif || m.isAudio || m.isDocument;
    if (!isMedia) return false;
  
    try {
      await sock.sendMessage(m.chat, { delete: m.key });
    } catch {}
  
    await sock.sendMessage(m.chat, {
      text: gpMsg("antimedia", { user: m.sender.split("@")[0] }),
      mentions: [m.sender],
    });
  
    return true;
  }
  
  async function handler(m, { sock }) {
    const db = getDatabase();
    const action = (m.args || [])[0]?.toLowerCase();
    const groupData = db.getGroup(m.chat) || {};
  
    if (!action) {
      const status = groupData.antimedia ? "✅ ON" : "❌ OFF";
      await m.reply(
        `🖼️ *AntiMedia*\n\n> Status: *${status}*\n\n> \`.antimedia on/off\``,
      );
      return;
    }
  
    if (action === "on") {
      db.setGroup(m.chat, { antimedia: true });
      m.react("✅");
      await m.reply(`✅ *AntiMedia diaktifkan*`);
      return;
    }
  
    if (action === "off") {
      db.setGroup(m.chat, { antimedia: false });
      m.react("❌");
      await m.reply(`❌ *AntiMedia dinonaktifkan*`);
      return;
    }
  
    await m.reply(`❌ Gunakan \`.antimedia on\` atau \`.antimedia off\``);
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "checkAntimedia", { enumerable: true, get: () => checkAntimedia });
  return __vxExports
})
