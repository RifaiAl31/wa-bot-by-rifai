// tools/ssweb-3hasil — satu file: metadata + kode fitur (gabungan dari engine1/plugins/tools/ssweb-3hasil.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "ssweb-3hasil",
  "command": [
    "ssweb-3hasil",
    "ssweb3",
    "ss3",
    "screenshot3",
    "screenshotweb3"
  ],
  "category": "tools",
  "desc": "Screenshot website dalam 3 versi (desktop, mobile, tablet)",
  "usage": ".ssweb-3hasil <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/ssweb-3hasil", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ssweb-3hasil.js'
  const module = { exports: {} }; const exports = module.exports;
  const axios = require('axios')
  const crypto = require('crypto')
  const { generateWAMessage, generateWAMessageFromContent, jidNormalizedUser } = require("../../lib/baileys-compat.js")
  const config = require("../../lib/ext/config.js")
  
  const pluginConfig = {
      name: 'ssweb-3hasil',
      alias: ['ssweb3', 'ss3', 'screenshot3', 'screenshotweb3'],
      category: 'tools',
      description: 'Screenshot website dalam 3 versi (desktop, mobile, tablet)',
      usage: '.ssweb-3hasil <url>',
      example: '.ssweb-3hasil https://google.com',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 15,
      energi: 2,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const url = m.text?.trim()
      
      if (!url) {
          return m.reply(
              `📸 *sᴄʀᴇᴇɴsʜᴏᴛ ᴡᴇʙ 3 ᴠᴇʀsɪ*\n\n` +
              `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
              `┃ \`${m.prefix}ssweb-3hasil <url>\`\n` +
              `╰┈┈⬡\n\n` +
              `> Contoh:\n` +
              `\`${m.prefix}ssweb-3hasil https://google.com\``
          )
      }
      
      let targetUrl = url
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
          targetUrl = 'https://' + url
      }
      
      m.react('📸')
      
      try {
          const apiUrl = `https://api-faa.my.id/faa/ssweb-3hasil?url=${encodeURIComponent(targetUrl)}`
          const { data } = await axios.get(apiUrl, { timeout: 60000 })
          
          if (!data?.status || !data?.results) {
              throw new Error('Gagal mengambil screenshot')
          }
          
          const results = data.results
          
          const mediaPromises = Object.entries(results).map(async ([device, imgUrl]) => {
              if (!imgUrl) return null
              
              try {
                  const imgRes = await axios.get(imgUrl, { 
                      responseType: 'arraybuffer',
                      timeout: 30000 
                  })
                  
                  const deviceEmoji = {
                      'desktop': '🖥️',
                      'mobile': '📱',
                      'tablet': '📲'
                  }[device] || '📷'
                  
                  return {
                      image: Buffer.from(imgRes.data),
                      caption: `${deviceEmoji} *${device.toUpperCase()}*\n\n` +
                          `╭┈┈⬡「 📋 *ɪɴꜰᴏ* 」\n` +
                          `┃ 🔗 URL: \`${targetUrl}\`\n` +
                          `┃ 📱 Device: *${device}*\n` +
                          `╰┈┈⬡`
                  }
              } catch (e) {
                  console.log(`[SSWeb3] Failed to download ${device}:`, e.message)
                  return null
              }
          })
          
          const mediaList = (await Promise.all(mediaPromises)).filter(m => m !== null)
          
          if (mediaList.length === 0) {
              throw new Error('Gagal mengunduh screenshot')
          }
          
          m.react('📤')
          
          try {
              const opener = generateWAMessageFromContent(
                  m.chat,
                  {
                      messageContextInfo: { messageSecret: crypto.randomBytes(32) },
                      albumMessage: {
                          expectedImageCount: mediaList.length,
                          expectedVideoCount: 0
                      }
                  },
                  {
                      userJid: jidNormalizedUser(sock.user.id),
                      quoted: m,
                      upload: sock.waUploadToServer
                  }
              )
              
              await sock.relayMessage(opener.key.remoteJid, opener.message, {
                  messageId: opener.key.id
              })
              
              const generatedMessages = await Promise.all(mediaList.map(async (content) => {
                  const msg = await generateWAMessage(opener.key.remoteJid, content, {
                      upload: sock.waUploadToServer
                  })
                  
                  msg.message.messageContextInfo = {
                      messageSecret: crypto.randomBytes(32),
                      messageAssociation: {
                          associationType: 1,
                          parentMessageKey: opener.key
                      }
                  }
                  
                  return msg
              }))
              
              for (const msg of generatedMessages) {
                  await sock.relayMessage(msg.key.remoteJid, msg.message, {
                      messageId: msg.key.id
                  })
              }
              
              m.react('✅')
              
          } catch (albumErr) {
              console.log('[SSWeb3] Album failed, sending individually:', albumErr.message)
              
              const saluranId = config.saluran?.id || ''
              const saluranName = config.saluran?.name || config.bot?.name || 'WhatsApp Bot'
              
              for (const content of mediaList) {
                  await sock.sendMessage(m.chat, {
                      image: content.image,
                      caption: content.caption,
                      contextInfo: {
                          forwardingScore: 9999,
                          isForwarded: true,
                          forwardedNewsletterMessageInfo: {
                              newsletterJid: saluranId,
                              newsletterName: saluranName,
                              serverMessageId: 127
                          }
                      }
                  }, { quoted: m })
              }
              
              m.react('✅')
          }
          
      } catch (error) {
          console.error('[SSWeb3] Error:', error.message)
          m.react('❌')
          m.reply(`❌ *Gomen ne~* ✦\n\n> ${error.message}\n\n_Ai udah coba yang terbaik tapi gagal juga... coba lagi nanti ya~ 🌸_`)
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  
  return module.exports
})
