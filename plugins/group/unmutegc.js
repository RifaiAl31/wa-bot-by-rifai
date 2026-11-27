// group/unmutegc — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/unmutegc.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "unmutegc",
  "command": [
    "unmutegc",
    "unmutegrup",
    "unmutebot",
    "unblockbot",
    "unlockbot"
  ],
  "category": "group",
  "desc": "Buka blokir command bot untuk member di grup",
  "usage": ".unmutegc",
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
module.exports = __vx.plugin("group/unmutegc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/unmutegc.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const { saluranCtx } = require("../../lib/ext/src/lib/vanxone-context.js");
  
  const pluginConfig = {
    name: "unmutegc",
    alias: ["unmutegrup", "unmutebot", "unblockbot", "unlockbot"],
    category: "group",
    description: "Buka blokir command bot untuk member di grup",
    usage: ".unmutegc",
    example: ".unmutegc",
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    isBotAdmin: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const db = getDatabase();
    const groupData = db.getGroup(m.chat) || {};
  
    if (!groupData.mutegc) {
      return m.reply(
        `🔊 *Mute GC Tidak Aktif*\n\n` +
          `> Member sudah bisa menggunakan command bot di grup ini`
      );
    }
  
    db.setGroup(m.chat, { mutegc: false });
    const ctx = saluranCtx();
    const groupName = m.groupMetadata?.subject || "grup ini";
  
    return m.reply(
      `🔊 *Mute GC Nonaktif*\n\n` +
        `> Grup: *${groupName}*\n` +
        `> Member sekarang bisa menggunakan command bot lagi\n\n` +
        `_Ketik *${m.prefix}mutegc* untuk memblokir kembali_`,
      { contextInfo: ctx }
    );
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
