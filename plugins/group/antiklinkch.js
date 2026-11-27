// group/antiklinkch — satu file: metadata + kode fitur (gabungan dari engine7/plugins/group/antiklinkch.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "antilinkch",
  "command": [
    "antilinkch"
  ],
  "category": "group",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/antiklinkch", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/antiklinkch.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: "antilinkch",
    alias: [],
    category: "group",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { args, isAdmin, isOwner }) {
    if (!m.isGroup) return m.reply("Fitur ini hanya bisa dipakai di grup.")
    if (!(isAdmin || isOwner)) return m.reply("Khusus admin.")
  
    global.db.data.chats = global.db.data.chats || {}
    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
  
    if (!args[0]) {
      return m.reply("Gunakan:\n.antilinkch on / off")
    }
  
    if (args[0] === "on") {
      if (global.db.data.chats[m.chat].antilinkch) {
        return m.reply("Antilink channel sudah aktif.")
      }
      global.db.data.chats[m.chat].antilinkch = true
      return m.reply("✅ Antilink channel berhasil diaktifkan.")
    }
  
    if (args[0] === "off") {
      if (!global.db.data.chats[m.chat].antilinkch) {
        return m.reply("Antilink channel sudah nonaktif.")
      }
      global.db.data.chats[m.chat].antilinkch = false
      return m.reply("❌ Antilink channel berhasil dimatikan.")
    }
  
    return m.reply("Opsi tidak valid.\nGunakan:\n.antilinkch on / off")
  }
  
  handler.before = async (m, { conn, isBotAdmin, usedPrefix, isAdmin }) => {
    if (!m.isGroup) return
    if (!isBotAdmin) return
  
    if (typeof m.text === "string") {
      const txt = m.text.toLowerCase()
      if (txt.startsWith((usedPrefix || ".") + "antilinkch")) return
    }
  
    global.db.data.chats = global.db.data.chats || {}
    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
  
    if (!global.db.data.chats[m.chat].antilinkch) return
  
    let text = m.text || ''
  
    let isChannel = /https?:\/\/(www\.)?whatsapp\.com\/channel\/[^\s]+/i.test(text)
  
    if (!isChannel) return
  
    if (isAdmin) return
  
    try {
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.sender
        }
      })
    } catch {}
  
    let who = m.mentionedJid[0] || m.quoted?.sender || m.sender
  
    return conn.sendMessage(m.chat, {
      text: `@${who.split('@')[0]} dilarang share link saluran di sini.`,
      mentions: [who]
    })
  }
  
  handler.admin = true
  handler.botAdmin = true
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
