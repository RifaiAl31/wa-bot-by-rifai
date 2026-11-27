// .hdvid — jernihkan video jadi HD / 2K / 4K (gabungan hdvid, hdvideo, hdv). Butuh limit 2.
// Mesin: AI online (nexray) bila bisa; hasilnya DIPERIKSA rasio gambarnya (kalau gepeng diluruskan) dan kalau online gagal
// otomatis dipakai mesin lokal ffmpeg yang menjaga rasio asli video (lib/hdkit.js).
const axios = require('axios')
const { getMedia } = require('../../lib/utils')
const { uploadBuffer } = require('../../lib/upload')
const { assertPublicUrl, fetchPublic } = require('../../lib/safeurl')
const limit = require('../../lib/limit')
const richui = require('../../lib/richui')
const { panel } = require('../../lib/uitext')
const hdkit = require('../../lib/hdkit')

const COST = 2
const RES = /^(2k|4k|1080p|720p)$/i
const MAX_SECONDS = 180

module.exports = {
  name: 'hdvideo',
  command: ['hdvid', 'hdvideo', 'enhancevid', 'vidhd', 'reminiplay', 'unblurvideo', 'vhd', 'hdv'],
  category: 'tools',
  emoji: '🎞️',
  desc: 'Jernihkan video jadi HD / 2K / 4K tanpa merusak rasio (reply video atau link)',
  usage: '[2k|4k|1080p|720p] (reply video) | <link video> [resolusi]',
  run: async ({ sock, msg, from, sender, isOwner, args, prefix, command, reply, react }) => {
    let url = ''
    let res = '1080p'
    for (const a of args) {
      if (/^https?:\/\//i.test(a)) url = a
      else if (RES.test(a)) res = a.toLowerCase()
    }

    let media = null
    try {
      media = await getMedia(sock, msg, ['videoMessage', 'documentMessage'])
      if (media && media.type === 'documentMessage' && !/^video\//.test(String((media.info && media.info.mimetype) || ''))) media = null
    } catch {
      return reply('Gagal mengunduh video dari pesan. Coba kirim ulang.')
    }

    if (!media && !url) {
      return reply(
        panel('HD VIDEO', [
          { head: '📖 *CARA PAKAI*', lines: [`Reply video dengan ${prefix}${command} [resolusi]`, `${prefix}${command} <link video> [resolusi]`] },
          { head: '🎚️ *RESOLUSI*', lines: ['1080p (bawaan), 720p, 2k, 4k', 'Video tidak dipaksa jadi lebih kecil / gepeng: rasio asli dijaga.'] },
          { head: '💡 *CONTOH*', lines: [`${prefix}${command} 4k`, `${prefix}${command} https://contoh.com/video.mp4 2k`] }
        ], { tip: `💡 Memakai ${COST} limit per video (maks ${MAX_SECONDS} detik). Proses bisa memakan beberapa menit.` })
      )
    }
    if (media && Number((media.info && media.info.seconds) || 0) > MAX_SECONDS) return reply(`Video terlalu panjang. Maksimal ${MAX_SECONDS} detik.`)

    const lack = limit.lack(sender, COST, isOwner)
    if (lack) return reply(lack)

    await react('⚙️')
    try {
      let buffer
      if (media) buffer = media.buffer
      else {
        await assertPublicUrl(url)
        buffer = (await fetchPublic(url, { maxBytes: 100 * 1024 * 1024, timeout: 120000 })).buffer
      }

      // AI online (opsional): hasilnya akan dicek & diluruskan di hdkit.enhanceVideo
      const fetchRemote = async (buf) => {
        const link = url || (await uploadBuffer(buf, `vid-${Date.now()}.mp4`))
        if (!link) throw new Error('upload video gagal')
        const api = `https://api.nexray.eu.cc/tools/v1/hdvideo?url=${encodeURIComponent(link)}&resolusi=${encodeURIComponent(res)}`
        const { data } = await axios.get(api, { timeout: 12000 })
        if (!data || !data.status || !data.result) throw new Error(String((data && (data.error || data.message)) || 'respons tidak valid').slice(0, 120))
        return (await fetchPublic(String(data.result), { maxBytes: 100 * 1024 * 1024, timeout: 120000 })).buffer
      }

      const r = await hdkit.enhanceVideo(buffer, { res, fetchRemote, log: (t) => console.log(t) })
      limit.spend(sender, COST, isOwner)
      const caption = `✨ HD VIDEO BERHASIL\nUkuran: ${r.from.w}x${r.from.h} → ${r.to.w}x${r.to.h}\nMesin: ${r.engine}`
      if (r.buffer.length > 60 * 1024 * 1024) {
        await sock.sendMessage(from, { document: r.buffer, mimetype: 'video/mp4', fileName: `HD_${Date.now()}.mp4`, caption }, { quoted: msg })
      } else {
        await sock.sendMessage(from, { video: r.buffer, mimetype: 'video/mp4', caption }, { quoted: msg })
      }
      if (richui.isRich && richui.isRich() && url) await richui.sendCopy(sock, from, [{ label: 'Link sumber', value: url }]).catch(() => {})
      await react('✅')
    } catch (err) {
      console.log('[HDVID]', err.message)
      await react('❌')
      await reply(err.message === 'nff' ? '❌ ffmpeg belum terpasang di server (sudo apt install ffmpeg).' : `❌ Gagal memproses video: ${String(err.message).slice(0, 200)}`)
    }
  }
}
