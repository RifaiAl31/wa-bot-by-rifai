// group/antidocument — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/antidocument.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "antidocument",
  "command": [
    "antidocument",
    "antidoc",
    "nodocument",
    "nodoc"
  ],
  "category": "group",
  "desc": "Mengatur antidocument di grup",
  "usage": ".antidocument <on/off>",
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
module.exports = __vx.plugin("group/antidocument", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/antidocument.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const pluginConfig = {
      name: 'antidocument',
      alias: ['antidoc', 'nodocument', 'nodoc'],
      category: 'group',
      description: 'Mengatur antidocument di grup',
      usage: '.antidocument <on/off>',
      example: '.antidocument on',
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
          antidocument: '⚠ *AntiDocument* — Dokumen dari @%user% dihapus.',
      }
      let text = config.groupProtection?.[key] || defaults[key] || ''
      for (const [k, v] of Object.entries(replacements)) {
          text = text.replace(new RegExp(`%${k}%`, 'g'), v)
      }
      return text
  }
  
  async function checkAntidocument(m, sock, db) {
      if (!m.isGroup) return false
      if (m.isAdmin || m.isOwner || m.fromMe) return false
  
      const groupData = db.getGroup(m.chat) || {}
      if (!groupData.antidocument) return false
  
      const isDocument = m.isDocument || m.type === 'documentMessage' || m.type === 'documentWithCaptionMessage'
      if (!isDocument) return false
  
      try {
          await sock.sendMessage(m.chat, { delete: m.key })
      } catch {}
  
      await sock.sendMessage(m.chat, {
          text: gpMsg('antidocument', { user: m.sender.split('@')[0] }),
          mentions: [m.sender],
      })
  
      return true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const action = (m.args || [])[0]?.toLowerCase()
      const groupData = db.getGroup(m.chat) || {}
  
      if (!action) {
          const status = groupData.antidocument ? '✅ ON' : '❌ OFF'
          await m.reply(`📄 *AntiDocument*\n\n> Status: *${status}*\n\n> \`.antidocument on/off\``)
          return
      }
  
      if (action === 'on') {
          db.setGroup(m.chat, { antidocument: true })
          m.react('✅')
          await m.reply(`✅ *AntiDocument diaktifkan*`)
          return
      }
  
      if (action === 'off') {
          db.setGroup(m.chat, { antidocument: false })
          m.react('❌')
          await m.reply(`❌ *AntiDocument dinonaktifkan*`)
          return
      }
  
      await m.reply(`❌ Gunakan \`.antidocument on\` atau \`.antidocument off\``)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "checkAntidocument", { enumerable: true, get: () => checkAntidocument });
  return __vxExports
})
