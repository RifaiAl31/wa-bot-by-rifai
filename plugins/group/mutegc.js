// group/mutegc — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/mutegc.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "mutegc",
  "command": [
    "mutegc",
    "mutegrup",
    "blockbot",
    "lockbot"
  ],
  "category": "group",
  "desc": "Blokir command bot untuk member, hanya admin/owner yang bisa pakai",
  "usage": ".mutegc",
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
module.exports = __vx.plugin("group/mutegc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/mutegc.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const { saluranCtx } = require("../../lib/ext/src/lib/vanxone-context.js");
  
  const pluginConfig = {
    name: "mutegc",
    alias: ["mutegrup", "mutebot", "blockbot", "lockbot"],
    category: "group",
    description: "Blokir command bot untuk member, hanya admin/owner yang bisa pakai",
    usage: ".mutegc",
    example: ".mutegc",
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
  
    if (groupData.mutegc) {
      return m.reply(
        `🔇 *Mute GC Sudah Aktif*\n\n` +
          `> Member tidak bisa menggunakan command bot di grup ini\n` +
          `> Hanya admin grup dan owner bot yang bisa akses\n\n` +
          `_Ketik *${m.prefix}unmutegc* untuk membuka_`
      );
    }
  
    db.setGroup(m.chat, { mutegc: true });
    const ctx = saluranCtx();
    const groupName = m.groupMetadata?.subject || "grup ini";
  
    return m.reply(
      `🔇 *Mute GC Aktif*\n\n` +
        `> Grup: *${groupName}*\n` +
        `> Member tidak bisa menggunakan command bot\n` +
        `> Admin grup dan owner bot tetap bisa akses\n\n` +
        `_Ketik *${m.prefix}unmutegc* untuk membuka_`,
      { contextInfo: ctx }
    );
  }
  
  function isMutegc(groupJid, db) {
    const group = db.getGroup(groupJid) || {};
    return !!group.mutegc;
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "isMutegc", { enumerable: true, get: () => isMutegc });
  return __vxExports
})
