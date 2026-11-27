// .hd .hdr .upscale .remini .unblur — satu fitur HD gambar (gabungan hd, hd2, hd3, hd4, hd5, hd8, remini, remini2).
// Mesin: lib/hdkit.js (AI online berurutan + mesin lokal sebagai cadangan). Hasil dikirim sebagai gambar DAN dokumen
// (dokumen = kualitas penuh, tidak dikompres WhatsApp).
const { getMedia } = require('../../lib/utils')
const limit = require('../../lib/limit')
const hdkit = require('../../lib/hdkit')
const { panel } = require('../../lib/uitext')

const COST = 1

module.exports = {
  name: 'hd',
  command: ['hd', 'hdr', 'upscale', 'remini', 'unblur'],
  category: 'tools',
  emoji: '✨',
  desc: 'Jernihkan & perbesar foto jadi HD (reply gambar). .hd = 2x, .hdr = 4x',
  usage: '[2|3|4] (reply / kirim gambar)',
  run: async ({ sock, msg, from, sender, isOwner, args, prefix, command, reply, react }) => {
    let media = null
    try {
      media = await getMedia(sock, msg, ['imageMessage', 'documentMessage', 'stickerMessage'])
    } catch {
      return reply('Gagal mengunduh gambar dari pesan. Coba kirim ulang.')
    }
    const mime = String((media && media.info && media.info.mimetype) || '')
    if (!media || (media.type === 'documentMessage' && !/^image\//.test(mime))) {
      return reply(
        panel('HD FOTO', [
          { head: '📖 *CARA PAKAI*', lines: [`Reply / kirim gambar dengan ${prefix}hd`, `${prefix}hd  → perbesar 2x`, `${prefix}hdr → perbesar 4x (lebih tajam & besar)`] },
          { head: '💡 *LAINNYA*', lines: [`${prefix}upscale 3 → pilih skala 2 / 3 / 4`, `${prefix}remini, ${prefix}unblur → sama dengan ${prefix}hd`] }
        ], { tip: `💡 Memakai ${COST} limit. Hasil dikirim juga sebagai dokumen supaya kualitasnya tidak turun.` })
      )
    }

    const num = parseInt(args.find((a) => /^[2-4]$/.test(a)) || '', 10)
    const scale = command === 'hdr' ? 4 : num || 2

    const lack = limit.lack(sender, COST, isOwner)
    if (lack) return reply(lack)

    await react('⏳')
    try {
      const r = await hdkit.enhanceImage(media.buffer, { scale, log: (t) => console.log(t) })
      limit.spend(sender, COST, isOwner)
      const caption =
        `✨ *HD BERHASIL*\n\n` +
        `📐 Ukuran : ${r.from.w}x${r.from.h} → ${r.to.w}x${r.to.h}\n` +
        `⚙️ Mesin  : ${r.engine === 'lokal' ? 'Lokal (penajaman)' : 'AI ' + r.engine}\n` +
        `📎 Versi kualitas penuh dikirim sebagai dokumen di bawah.`
      await sock.sendMessage(from, { image: r.buffer, caption }, { quoted: msg })
      await sock.sendMessage(from, { document: r.buffer, mimetype: r.mime, fileName: `HD_${scale}x_${Date.now()}.jpg` }, { quoted: msg })
      await react('✅')
    } catch (err) {
      console.log('[HD]', err.message)
      await react('❌')
      return reply(`❌ Gagal memproses gambar: ${String(err.message || err).slice(0, 160)}`)
    }
  }
}
