// group/antisticker — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/antisticker.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "antisticker",
  "command": [
    "antisticker",
    "as",
    "nosticker"
  ],
  "category": "group",
  "desc": "Mengatur antisticker di grup",
  "usage": ".antisticker <on/off>",
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
module.exports = __vx.plugin("group/antisticker", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/antisticker.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const pluginConfig = {
      name: 'antisticker',
      alias: ['as', 'nosticker'],
      category: 'group',
      description: 'Mengatur antisticker di grup',
      usage: '.antisticker <on/off>',
      example: '.antisticker on',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      isBotAdmin: true,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  function gpMsg(key, replacements = {}) {
      const defaults = {
          antisticker: '⚠ *AntiSticker* — Sticker dari @%user% dihapus.',
      }
      let text = config.groupProtection?.[key] || defaults[key] || ''
      for (const [k, v] of Object.entries(replacements)) {
          text = text.replace(new RegExp(`%${k}%`, 'g'), v)
      }
      return text
  }
  
  async function checkAntisticker(m, sock, db) {
      if (!m.isGroup) return false
      if (m.isAdmin || m.isOwner || m.fromMe) return false
  
      const groupData = db.getGroup(m.chat) || {}
      if (!groupData.antisticker) return false
  
      const isSticker = m.isSticker || m.type === 'stickerMessage'
      if (!isSticker) return false
  
      try {
          await sock.sendMessage(m.chat, { delete: m.key })
      } catch {}
  
      await sock.sendMessage(m.chat, {
          text: gpMsg('antisticker', { user: m.sender.split('@')[0] }),
          mentions: [m.sender],
      })
  
      return true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const action = (m.args || [])[0]?.toLowerCase()
      const groupData = db.getGroup(m.chat) || {}
  
      if (!action) {
          const status = groupData.antisticker ? '✅ ON' : '❌ OFF'
          await m.reply(`🎭 *AntiSticker*\n\n> Status: *${status}*\n\n> \`.antisticker on/off\``)
          return
      }
  
      if (action === 'on') {
          db.setGroup(m.chat, { antisticker: true })
          m.react('✅')
          await m.reply(`✅ *AntiSticker diaktifkan*`)
          return
      }
  
      if (action === 'off') {
          db.setGroup(m.chat, { antisticker: false })
          m.react('❌')
          await m.reply(`❌ *AntiSticker dinonaktifkan*`)
          return
      }
  
      await m.reply(`❌ Gunakan \`.antisticker on\` atau \`.antisticker off\``)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "checkAntisticker", { enumerable: true, get: () => checkAntisticker });
  return __vxExports
})
