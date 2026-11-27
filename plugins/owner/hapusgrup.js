// owner/hapusgrup — satu file: metadata + kode fitur (gabungan dari engine8/plugins/owner/hapusgrup.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "hapusgrup",
  "command": [
    "hapusgrup",
    "deletegrup",
    "delgrup"
  ],
  "category": "owner",
  "desc": "Keluar dari grup / hapus grup",
  "usage": ".hapusgrup (di dalam grup) atau .hapusgrup <jid>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/hapusgrup", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/hapusgrup.js'
  const __vxExports = {};
  const pluginConfig = {
      name: ['hapusgrup', 'deletegrup', 'delgrup'],
      alias: [],
      category: 'owner',
      description: 'Keluar dari grup / hapus grup',
      usage: '.hapusgrup (di dalam grup) atau .hapusgrup <jid>',
      example: '.hapusgrup',
      isOwner: true,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      let targetJid = null
  
      if (m.args[0]) {
          targetJid = m.args[0].replace(/[^0-9@.]/g, '')
          if (!targetJid.endsWith('@g.us')) targetJid += '@g.us'
      } else if (m.isGroup) {
          targetJid = m.chat
      }
  
      if (!targetJid || !targetJid.endsWith('@g.us')) {
          return m.reply(
              '🗑️ *ʜᴀᴘᴜs ɢʀᴜᴘ*\n\n' +
              '> `.hapusgrup` (di dalam grup) — Keluar dari grup ini\n' +
              '> `.hapusgrup <id_grup>` — Keluar dari grup tertentu\n\n' +
              '⚠️ Bot akan keluar dari grup, bukan menghapus grup secara permanen'
          )
      }
  
      try {
          const metadata = await sock.groupMetadata(targetJid).catch(() => null)
          const groupName = metadata?.subject || targetJid
  
          await sock.groupLeave(targetJid)
          await m.react('✅')
          return m.reply(
              `🗑️ *ʙᴏᴛ ᴋᴇʟᴜᴀʀ ᴅᴀʀɪ ɢʀᴜᴘ*\n\n` +
              `> Grup: ${groupName}\n` +
              `> ID: ${targetJid}`
          )
      } catch (err) {
          return m.reply(`❌ Gagal keluar dari grup: ${err.message}`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
