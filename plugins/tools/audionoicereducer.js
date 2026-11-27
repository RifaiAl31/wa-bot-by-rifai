// tools/audionoicereducer — satu file: metadata + kode fitur (gabungan dari engine1/plugins/tools/audionoicereducer.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "audionoicereducer",
  "command": [
    "audionoicereducer",
    "noisereducer",
    "cleanaudio",
    "anr"
  ],
  "category": "tools",
  "desc": "Kurangi noise dari audio",
  "usage": ".audionoicereducer (reply audio)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 20,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/audionoicereducer", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/audionoicereducer.js'
  const module = { exports: {} }; const exports = module.exports;
  const hsAsset = require("../../lib/ext/src/lib/assets.js")
  const axios = require('axios')
  const FormData = require('form-data')
  const config = require("../../lib/ext/config.js")
  const { downloadMediaMessage } = require("../../lib/baileys-compat.js")
  const path = require('path')
  const fs = require('fs')
  
  const NEOXR_APIKEY = config.APIkey?.neoxr || ''
  
  const pluginConfig = {
      name: 'audionoicereducer',
      alias: ['noisereducer', 'denoise', 'cleanaudio', 'anr'],
      category: 'tools',
      description: 'Kurangi noise dari audio',
      usage: '.audionoicereducer (reply audio)',
      example: '.audionoicereducer',
      cooldown: 20,
      energi: 2,
      isEnabled: true
  }
  
  let thumbTools = null
  hsAsset.tryBuffer('images/vx-tools').then(b => { if (b) thumbTools = b }).catch(() => {})
  
  function getContextInfo(title, body) {
      const saluranId = config.saluran?.id || ''
      const saluranName = config.saluran?.name || config.bot?.name || 'WhatsApp Bot'
  
      const ctx = {
          forwardingScore: 9999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: saluranId,
              newsletterName: saluranName,
              serverMessageId: 127
          }
      }
  
  
      return ctx
  }
  
  async function uploadToTmpFiles(buffer, filename) {
      const form = new FormData()
      form.append('file', buffer, { filename, contentType: 'application/octet-stream' })
      
      const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
          headers: form.getHeaders(),
          timeout: 60000
      })
      
      if (!res.data?.data?.url) throw new Error('Upload gagal')
      return res.data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/')
  }
  
  async function handler(m, { sock }) {
      let audioBuffer = null
      let filename = 'audio.mp3'
      
      if (m.quoted?.message) {
          const quotedMsg = m.quoted.message
          const audioMsg = quotedMsg.audioMessage || quotedMsg.documentMessage
          
          if (audioMsg) {
              try {
                  audioBuffer = await downloadMediaMessage(
                      { key: m.quoted.key, message: quotedMsg },
                      'buffer',
                      {}
                  )
                  filename = audioMsg.fileName || 'audio.mp3'
              } catch {}
          }
      }
      
      if (!audioBuffer && m.message) {
          const audioMsg = m.message.audioMessage || m.message.documentMessage
          if (audioMsg) {
              try {
                  audioBuffer = await m.download()
                  filename = audioMsg.fileName || 'audio.mp3'
              } catch {}
          }
      }
      
      if (!audioBuffer) {
          return m.reply(
              `🔊 *ᴀᴜᴅɪᴏ ɴᴏɪsᴇ ʀᴇᴅᴜᴄᴇʀ*\n\n` +
              `> Kurangi noise dari audio\n\n` +
              `*Cara pakai:*\n` +
              `> Reply audio dengan \`${m.prefix}audionoicereducer\`\n` +
              `> Atau kirim audio + caption command`
          )
      }
      
      m.react('🔊')
      
      try {
          await m.reply('🕕 *ᴍᴇɴɢᴜᴘʟᴏᴀᴅ...*\n\n> Mengupload audio...')
          
          const audioUrl = await uploadToTmpFiles(audioBuffer, filename)
          
          await m.reply('🔄 *ᴍᴇᴍᴘʀᴏsᴇs...*\n\n> Mengurangi noise...')
          
          const apiUrl = `https://api.neoxr.eu/api/noice-reducer?file=${encodeURIComponent(audioUrl)}&apikey=${NEOXR_APIKEY}`
          const { data } = await axios.get(apiUrl, { timeout: 120000 })
          
          if (!data?.status || !data?.data?.url) {
              m.react('❌')
              return m.reply('❌ *Gomen ne~* ✦\n\n> API tidak merespon~ 🥺')
          }
          
          await sock.sendMessage(m.chat, {
              audio: { url: data.data.url },
              mimetype: 'audio/mpeg',
              contextInfo: getContextInfo('🔊 NOISE REDUCER', 'Audio Cleaned')
          }, { quoted: m })
          
          m.react('✅')
          
      } catch (error) {
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
