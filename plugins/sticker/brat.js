// .brat — stiker teks gaya brat (gambar diam). Dirender LOKAL (canvas), tanpa API pihak ketiga, jadi tidak ikut mati kalau API luar down.
// Gabungan: brat, bratblack, bratgreen, brat2, bratimg, brattext.  Opsi: [putih|hitam|hijau] [blur0-3] <teks>  (atau reply pesan)
const brat = require('../../lib/brat')
const kit = require('../../lib/stickerkit')

const BY_COMMAND = { bratblack: 'black', bratgreen: 'green', brat2: 'green' }
const MAX_TEXT = 200

module.exports = {
  name: 'brat',
  command: ['brat', 'bratblack', 'bratgreen', 'brat2', 'bratimg', 'brattext'],
  category: 'sticker',
  emoji: '🟩',
  desc: 'Stiker teks gaya brat. Tema: putih (bawaan) / hitam / hijau, blur 0-3',
  usage: '[putih|hitam|hijau] [blur0-3] <teks>',
  run: async ({ sock, msg, from, args, command, config, prefix, reply, react }) => {
    const opt = brat.parseOptions(args, msg)
    const text = opt.text
    if (!text) return reply(`Masukkan teksnya (atau reply pesan).\nContoh:\n${prefix}brat halo semua\n${prefix}brat hijau blur1 yang ini anak baik`)
    if (text.length > MAX_TEXT) return reply(`Teks terlalu panjang! Maksimal ${MAX_TEXT} karakter.`)
    const theme = opt.theme || BY_COMMAND[command] || 'white'

    react && react('⏳')
    const res = await brat.enqueue(() => brat.renderImage({ text, theme, blur: opt.blur }))
    if (res.error) {
      react && react('❌')
      return reply(res.error)
    }
    try {
      const webp = await kit.make(res.value, 'image', { packname: config.stickerPack, author: config.stickerAuthor })
      await sock.sendMessage(from, { sticker: webp }, { quoted: msg })
      react && react('✅')
    } catch (err) {
      console.log('[BRAT] gagal:', err)
      react && react('❌')
      await reply('Gagal membuat stiker brat. Coba lagi nanti.')
    }
  }
}
