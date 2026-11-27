// owner/ganti-vx-v22 — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/ganti-vx-v22.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "ganti-vx-v22.jpg",
  "command": [
    "ganti-vx-v22.jpg",
    "gantivxv22",
    "setvxv22"
  ],
  "category": "owner",
  "desc": "Ganti gambar vx-v22.jpg",
  "usage": ".ganti-vx-v22.jpg (reply/kirim gambar atau URL)",
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
module.exports = __vx.plugin("owner/ganti-vx-v22", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ganti-vx-v22.js'
  const module = { exports: {} }; const exports = module.exports;
  const hsAsset = require("../../lib/ext/src/lib/assets.js")
  const { uploadToCatbox } = require("../../lib/ext/src/lib/uploader.js")
  
  const pluginConfig = {
  name: 'ganti-vx-v22.jpg',
  alias: ['gantivxv22', 'setvxv22'],
  category: 'owner',
  description: 'Ganti gambar vx-v22.jpg',
  usage: '.ganti-vx-v22.jpg (reply/kirim gambar atau URL)',
  example: '.ganti-vx-v22.jpg',
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true
  }
  
  const KEYS = ['images/vx-v22']
  const LABEL = 'vx-v22.jpg'
  
  async function handler(m, { sock }) {
  const arg = (m.args?.[0] ? String(m.args[0]) : '').trim()
  
  if (arg.toLowerCase() === 'reset') {
      KEYS.forEach(key => hsAsset.setUrl(key, ''))
      return m.reply(`✅ *BERHASIL*\n\n> Override URL ${LABEL} dihapus.\n> Gambar kembali menggunakan URL bawaan config.js.`)
  }
  
  if (/^https?:\/\//i.test(arg)) {
      KEYS.forEach(key => hsAsset.setUrl(key, arg))
      return m.reply(`✅ *BERHASIL*\n\n> ${LABEL} berhasil diganti.\n> URL: ${arg}`)
  }
  
  const quoted = m.quoted
  const isImage = m.isImage || quoted?.type === 'imageMessage'
  
  if (!isImage) {
      return m.reply(
          `🖼️ *GANTI ${LABEL.toUpperCase()}*\n\n` +
          '> Kirim/reply gambar atau masukkan URL gambar.\n' +
          '> Reset: .ganti-vx-v22.jpg reset'
      )
  }
  
  try {
      await m.react('🕕')
  
      let buffer
      if (quoted && (quoted.isMedia || quoted.type === 'imageMessage')) {
          buffer = await quoted.download()
      } else if (m.isMedia || m.isImage) {
          buffer = await m.download()
      }
  
      if (!buffer) {
          await m.react('❌')
          return m.reply('❌ Gagal mengunduh gambar.')
      }
  
      const hostedUrl = await uploadToCatbox(buffer, LABEL)
  
      if (!hostedUrl || !/^https?:\/\//i.test(hostedUrl)) {
          throw new Error('Upload Catbox tidak menghasilkan URL yang valid.')
      }
  
      KEYS.forEach(key => hsAsset.setUrl(key, hostedUrl))
  
      await m.react('✅')
      return m.reply(
          `✅ *BERHASIL*\n\n` +
          `> Gambar ${LABEL} berhasil diganti.\n` +
          `> URL: ${hostedUrl}\n` +
          '> URL override dikelola oleh sistem asset bot.'
      )
  } catch (error) {
      await m.react('❌')
      return m.reply(`❌ *ERROR*\n\n> ${error.message}`)
  }
  
  }
  
  module.exports = {
  config: pluginConfig,
  handler
  }
  return module.exports
})
