// owner/ganti-vx-mp4 — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/ganti-vx-mp4.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "ganti-vx.mp4",
  "command": [
    "ganti-vx.mp4",
    "gantivxvideo",
    "setvxvideo"
  ],
  "category": "owner",
  "desc": "Ganti video vx.mp4",
  "usage": ".ganti-vx.mp4 (reply/kirim video atau URL)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/ganti-vx-mp4", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ganti-vx-mp4.js'
  const module = { exports: {} }; const exports = module.exports;
  const hsAsset = require("../../lib/ext/src/lib/assets.js")
  const { uploadToCatbox } = require("../../lib/ext/src/lib/uploader.js")
  
  const pluginConfig = {
      name: 'ganti-vx.mp4',
      alias: ['gantivxvideo', 'setvxvideo'],
      category: 'owner',
      description: 'Ganti video vx.mp4',
      usage: '.ganti-vx.mp4 (reply/kirim video atau URL)',
      example: '.ganti-vx.mp4',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  // Aset ini sekarang berupa URL di config.assets (bukan file di folder assets/)
  const KEYS = ['video/vx']
  const LABEL = 'vx.mp4'
  
  async function handler(m, { sock }) {
      const arg = (m.args && m.args[0] ? String(m.args[0]) : '').trim()
  
      // .ganti-vx.mp4 reset → balik ke URL bawaan di config.js
      if (arg.toLowerCase() === 'reset') {
          KEYS.forEach(k => hsAsset.setUrl(k, ''))
          return m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Override URL untuk ${LABEL} dihapus, balik pakai URL di config.js`)
      }
  
      // .ganti-vx.mp4 https://... → set URL langsung
      if (/^https?:\/\//i.test(arg)) {
          KEYS.forEach(k => hsAsset.setUrl(k, arg))
          return m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> ${LABEL} sekarang pakai URL:\n> ${arg}`)
      }
  
      const isMedia = m.type === 'videoMessage' || (m.quoted && m.quoted.type === 'videoMessage')
      if (!isMedia) {
          return m.reply(
              `🎬 *ɢᴀɴᴛɪ ${LABEL.toUpperCase()}*\n\n` +
              `> Kirim/reply video, atau kirim link URL langsung\n` +
              `> Key config: ${KEYS.join(', ')}\n` +
              `> Ketik \`reset\` untuk balik ke URL di config.js`
          )
      }
  
      try {
          await m.react('🕕')
          let buffer
          if (m.quoted && m.quoted.isMedia) {
              buffer = await m.quoted.download()
          } else if (m.isMedia) {
              buffer = await m.download()
          }
  
          if (!buffer) {
              await m.react('❌')
              return m.reply(`❌ *Gomen ne~* Gagal mendownload video~ 🥺`)
          }
  
          // upload ke hosting (Catbox = permanen), lalu simpan URL-nya
          const hostedUrl = await uploadToCatbox(buffer, LABEL)
          KEYS.forEach(k => hsAsset.setUrl(k, hostedUrl))
  
          await m.react('✅')
          m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> ${LABEL} telah diganti\n> URL: ${hostedUrl}\n> Tersimpan di database/main/assetUrls.json`)
      } catch (error) {
          await m.react('❌')
          m.reply(`❌ *Gomen ne~* ✦\n\n> ${error.message}\n\n_Ai udah coba yang terbaik tapi gagal juga... coba lagi nanti ya~ 🌸_`)
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  
  return module.exports
})
