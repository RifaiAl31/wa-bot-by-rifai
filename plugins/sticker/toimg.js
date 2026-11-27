const sharp = require('sharp')
const { getMedia } = require('../../lib/utils')
const ffm = require('../../lib/ffm')

module.exports = {
  name: 'toimg',
  command: ['toimg', 'toimage'],
  category: 'sticker',
  desc: 'Stiker jadi gambar (reply stiker). Stiker animasi jadi video/GIF',
  run: async ({ sock, msg, from, prefix, reply }) => {
    const media = await getMedia(sock, msg, ['stickerMessage'])
    if (!media) return reply(`Reply stiker dengan ${prefix}toimg`)
    try {
      const meta = await sharp(media.buffer, { animated: true }).metadata()
      if (meta.pages && meta.pages > 1) {
        const gif = await sharp(media.buffer, { animated: true }).gif().toBuffer()
        const out = await ffm.run(gif, 'mp4', (i, o) => ['-i', i, '-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', o])
        return sock.sendMessage(from, { video: out, mimetype: 'video/mp4', gifPlayback: true }, { quoted: msg })
      }
      const png = await sharp(media.buffer).png().toBuffer()
      await sock.sendMessage(from, { image: png }, { quoted: msg })
    } catch (e) {
      console.log('[TOIMG]', e.message)
      await reply(`Gagal mengubah stiker: ${ffm.explain(e)}`)
    }
  }
}
