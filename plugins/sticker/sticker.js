const { getMedia } = require('../../lib/utils')
const kit = require('../../lib/stickerkit')

module.exports = {
  name: 'sticker',
  command: ['s', 'sticker', 'stiker', 'sgif'],
  category: 'sticker',
  desc: 'Bikin stiker dari gambar / video / GIF / stiker (reply atau kirim dengan caption). Bisa: .s pack|author, .s crop',
  usage: '.s [crop] [pack|author]',
  run: async ({ sock, msg, from, text, config, prefix, reply, react }) => {
    const media = await getMedia(sock, msg, ['imageMessage', 'videoMessage', 'stickerMessage', 'documentMessage'])
    if (!media) return reply(`Reply gambar/video/GIF atau kirim media dengan caption *${prefix}s*\nOpsi: *${prefix}s crop* (potong persegi), *${prefix}s pack|author*`)

    const info = media.info || {}
    const mime = String(info.mimetype || '')
    if (media.type === 'documentMessage' && !/^(image|video)\//.test(mime)) return reply('Dokumen ini bukan gambar/video.')
    const kind = media.type === 'stickerMessage' ? 'webp' : (media.type === 'videoMessage' || /^video\//.test(mime) || /gif/.test(mime)) ? 'video' : 'image'
    if (kind === 'video' && Number(info.seconds || 0) > 20) return reply('Video terlalu panjang, maksimal 20 detik (yang dipakai 6 detik pertama).')

    let t = String(text || '').trim()
    const crop = /^crop\b/i.test(t)
    if (crop) t = t.replace(/^crop\b\s*/i, '')
    const [p, ...a] = t.split('|')
    const packname = (p || '').trim() || config.stickerPack
    const author = a.join('|').trim() || config.stickerAuthor

    react && react('⏳')
    try {
      const webp = await kit.make(media.buffer, kind, { packname, author, crop })
      await sock.sendMessage(from, { sticker: webp }, { quoted: msg })
      react && react('✅')
    } catch (e) {
      console.log('[STIKER]', e.message)
      react && react('❌')
      return reply(e.message === 'nff' ? 'ffmpeg belum terpasang di server (sudo apt install ffmpeg).' : `Gagal bikin stiker: ${e.message}`)
    }
  }
}
