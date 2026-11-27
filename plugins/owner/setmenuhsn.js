// owner/setmenuhsn — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/setmenuhsn.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "setmenuhsn",
  "command": [
    "setmenuhsn",
    "menuhsnstyle",
    "menuhsnvariant"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan menuhsn",
  "usage": ".setmenuhsn <v1-v5>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/setmenuhsn", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setmenuhsn.js'
  const module = { exports: {} }; const exports = module.exports;
  const config = require("../../lib/ext/config.js")
  const { getDatabase } = require("../../lib/ext/src/lib/database.js")
  const { generateWAMessageFromContent, proto } = require("../../lib/baileys-compat.js")
  
  const pluginConfig = {
      name: 'setmenuhsn',
      alias: ['menuhsnstyle', 'menuhsnvariant'],
      category: 'owner',
      description: 'Mengatur variant tampilan menuhsn',
      usage: '.setmenuhsn <v1-v5>',
      example: '.setmenuhsn v2',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  const VARIANTS = {
      v1: { id: 1, name: 'Standard',    desc: 'Mirip menu V2 — text + contextInfo + verified quoted' },
      v2: { id: 2, name: 'Default',     desc: 'Tampilan menuhsn saat ini — box kategori + list command' },
      v3: { id: 3, name: 'Button',      desc: 'Mirip menu V5 — interactive single_select + quick_reply' },
      v4: { id: 4, name: 'Minimalist',  desc: 'Mirip menu V8 — box ASCII + ftroli quoted' },
      v5: { id: 5, name: 'Interactive', desc: 'Mirip menu V15 — nativeFlow + single_select kategori' },
  }
  
  async function handler(m, { sock, db }) {
      const args = m.args || []
      const variant = args[0]?.toLowerCase()
  
      if (variant) {
          const selected = VARIANTS[variant]
          if (!selected) {
              return m.reply(`❌ Variant tidak valid!\n\n> Gunakan: \`v1\` s/d \`v5\``)
          }
  
          db.setting('menuhsnVariant', selected.id)
          await db.save()
  
          return m.reply(
              `✅ *Menucat variant diubah ke V${selected.id}*\n\n` +
              `> 🎨 *${selected.name}*\n` +
              `> _${selected.desc}_`
          )
      }
  
      // Tampilkan daftar variant
      const current = db.setting('menuhsnVariant') || 2
  
      const rows = Object.entries(VARIANTS).map(([key, val]) => ({
          title: `${key.toUpperCase()}${val.id === current ? ' ✓' : ''} — ${val.name}`,
          description: val.desc,
          id: `${m.prefix}setmenuhsn ${key}`
      }))
  
      const bodyText =
          `🎨 *sᴇᴛ ᴍᴇɴᴜᴄᴀᴛ ᴠᴀʀɪᴀɴᴛ*\n\n` +
          `> Variant aktif: *V${current}*\n` +
          `> _${VARIANTS[`v${current}`]?.name || 'Unknown'}_\n\n` +
          `> Pilih variant dari daftar di bawah`
  
      try {
          const msg = generateWAMessageFromContent(m.chat, {
              viewOnceMessage: {
                  message: {
                      messageContextInfo: {
                          deviceListMetadata: {},
                          deviceListMetadataVersion: 2
                      },
                      interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                          body: proto.Message.InteractiveMessage.Body.fromObject({
                              text: bodyText
                          }),
                          footer: proto.Message.InteractiveMessage.Footer.fromObject({
                              text: config.bot?.name || 'WhatsApp Bot-Bot'
                          }),
                          header: proto.Message.InteractiveMessage.Header.fromObject({
                              title: '🎨 Menucat Variant',
                              subtitle: `${Object.keys(VARIANTS).length} variant tersedia`,
                              hasMediaAttachment: false
                          }),
                          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                              buttons: [{
                                  name: 'single_select',
                                  buttonParamsJson: JSON.stringify({
                                      title: '🎨 ᴘɪʟɪʜ ᴠᴀʀɪᴀɴᴛ',
                                      sections: [{
                                          title: 'ᴅᴀꜰᴛᴀʀ ᴠᴀʀɪᴀɴᴛ ᴍᴇɴᴜᴄᴀᴛ',
                                          rows
                                      }]
                                  })
                              }]
                          }),
                          contextInfo: {
                              mentionedJid: [m.sender],
                              forwardingScore: 9999,
                              isForwarded: true,
                              forwardedNewsletterMessageInfo: {
                                  newsletterJid: config.saluran?.id || '',
                                  newsletterName: config.saluran?.name || config.bot?.name || 'WhatsApp Bot-Bot',
                                  serverMessageId: 127
                              }
                          }
                      })
                  }
              }
          }, { userJid: m.sender, quoted: m })
  
          await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
      } catch {
          let txt = `🎨 *sᴇᴛ ᴍᴇɴᴜᴄᴀᴛ ᴠᴀʀɪᴀɴᴛ*\n\n`
          txt += `> Variant saat ini: *V${current}*\n\n`
          for (const [key, val] of Object.entries(VARIANTS)) {
              const mark = val.id === current ? ' ✓' : ''
              txt += `> *${key.toUpperCase()}*${mark} — _${val.desc}_\n`
          }
          txt += `\n_Gunakan: \`${m.prefix}setmenuhsn v1\` dst._`
          await m.reply(txt)
      }
  }
  
  module.exports = { config: pluginConfig, handler }
  return module.exports
})
