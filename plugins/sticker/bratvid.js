// .bratvid — stiker brat ANIMASI (teks muncul kata demi kata). Dirender lokal (canvas + ffmpeg); API luar hanya cadangan.
// Gabungan: bratvid, bratgif, bratanim, bratsticker, bratvideo, bratvid2, bratvidv2, bratvid3, teksvid, teksvid2 dst.
// Opsi: [putih|hitam|hijau] [blur0-3] <teks>  (atau reply pesan)
const axios = require('axios')
const brat = require('../../lib/brat')
const kit = require('../../lib/stickerkit')
const ffm = require('../../lib/ffm')

const MAX_TEXT = 60

// mp4 -> WEBP animasi 512x512 (tanpa membuat latar putih jadi transparan) lalu dikecilkan kalau > ~900KB
async function mp4ToWebp(buf) {
  const enc = (q, fps) => ffm.run(buf, 'webp', (i, o) => ['-i', i, '-vcodec', 'libwebp', '-vf', `fps=${fps},scale=512:512:flags=lanczos`, '-loop', '0', '-preset', 'default', '-an', '-vsync', '0', '-t', '6', '-q:v', String(q), o], 120000)
  let out = await enc(55, 15)
  if (out.length > 900 * 1024) out = await enc(35, 12)
  if (out.length > 900 * 1024) out = await enc(22, 10)
  return out
}

module.exports = {
  name: 'bratvid',
  command: ['bratvid', 'bratgif', 'bratanim', 'bratsticker', 'bratvideo', 'bratvid2', 'bratvidv2', 'bratvid3', 'bratv3', 'sbratvid3', 'sbrat3', 'teksvid', 'teksvideo', 'teksvid2', 'teksv2'],
  category: 'sticker',
  emoji: '🎬',
  desc: 'Stiker animasi brat (teks muncul kata demi kata)',
  usage: '[putih|hitam|hijau] [blur0-3] <teks>',
  run: async ({ sock, msg, from, args, config, prefix, command, reply, react }) => {
    const opt = brat.parseOptions(args, msg)
    const text = opt.text
    if (!text) return reply(`Masukkan teksnya (atau reply pesan).\nContoh: ${prefix}${command} yang ini anak baik`)
    if (text.length > MAX_TEXT) return reply(`Teks terlalu panjang untuk stiker animasi. Maksimal ${MAX_TEXT} karakter.`)

    react && react('⏳')
    let webp
    try {
      if (!brat.hasFfmpeg()) throw new Error('nff')
      const res = await brat.enqueue(() => brat.renderVideo({ text, theme: opt.theme || 'white', blur: opt.blur }))
      if (res.error) throw new Error(res.error)
      webp = await mp4ToWebp(res.value)
    } catch (err) {
      console.log('[BRATVID] render lokal gagal:', err.message)
      // cadangan: API luar (hanya dipakai kalau render lokal gagal)
      try {
        const { data } = await axios.get(`https://brat.siputzx.my.id/gif?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer', timeout: 30000 })
        webp = await kit.videoToWebp(Buffer.from(data))
      } catch (e2) {
        react && react('❌')
        return reply(err.message === 'nff' ? 'ffmpeg belum terpasang di server bot. Owner perlu menginstalnya dulu.' : 'Gagal membuat stiker animasi. Coba lagi nanti.')
      }
    }
    try {
      const stamped = await kit.stamp(webp, config.stickerPack, config.stickerAuthor)
      await sock.sendMessage(from, { sticker: stamped }, { quoted: msg })
      react && react('✅')
    } catch (err) {
      console.log('[BRATVID] kirim gagal:', err)
      react && react('❌')
      await reply('Gagal mengirim stiker animasi. Coba lagi nanti.')
    }
  }
}
