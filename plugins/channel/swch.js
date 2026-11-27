// .swch — Status Saluran (Channel Status). Sistem sama seperti .swgc (status grup), tujuannya saluran.
//   .swch teks                      -> status teks (warna acak)
//   .swch teks | biru               -> status teks warna biru
//   reply/kirim gambar/video + .swch caption
//   reply audio + .swch             -> voice note
//   .swch <link saluran> teks       -> ke saluran lain (default: saluran dari .setch)
//   .swch cek                       -> cek kemampuan bot & izin saluran
const ch = require('../../lib/channels')
const cs = require('../../lib/channelstatus')
const { getMedia, getQuotedText } = require('../../lib/utils')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'swch',
  command: ['swch', 'statusch', 'statussaluran', 'upswch', 'postch', 'updatech'],
  category: 'channel',
  emoji: '📣',
  desc: 'Status saluran (teks berwarna, gambar, video, audio) seperti swgc tapi untuk saluran',
  usage: '[link saluran] <teks> [| warna] | kirim/reply media | cek',
  owner: true,
  run: async ({ sock, msg, body, prefix, reply }) => {
    let raw = String(body || '').replace(/^\S+\s*/, '')
    try {
      const word = raw.trim().split(/\s+/)[0]?.toLowerCase()
      const cap = cs.capabilities(sock)

      if (word === 'cek' || word === 'check') {
        const cur = ch.getCurrent()
        let izin = 'tidak dicek (bot belum punya newsletterCanPostStatus)'
        if (cur && cap.canPost) {
          const p = await cs.check(sock, cur.id)
          izin = p?.error ? `gagal cek: ${p.error}` : p?.canPost ? 'boleh' : 'tidak boleh'
        }
        return reply(panel('CEK STATUS SALURAN', [
          { head: '📡 *KEMAMPUAN BOT*', lines: [`Kirim status saluran : ${cap.status ? 'ada' : 'TIDAK ADA'}`, `Cek izin status : ${cap.canPost ? 'ada' : 'tidak ada'}`, `Daftar status : ${cap.list ? 'ada' : 'tidak ada'}`] },
          { head: '📌 *SALURAN TUJUAN*', lines: cur ? [`Nama : ${cur.name}`, `Peran bot : ${cur.role ? cur.role.toLowerCase() : 'tidak diketahui'}`, `Izin status : ${izin}`] : [`Belum diatur. Pakai ${prefix}setch <link saluran>`] }
        ], { tip: cap.status ? '💡 Siap memposting status saluran.' : '💡 Update paket baileys supaya status saluran bisa dikirim.' }))
      }

      // mode post biasa (opsional, bila baileys belum punya API status)
      let allowPlain = false
      if (word === 'post') { allowPlain = true; raw = raw.replace(/^\S+\s*/, '') }

      const t = await ch.pickTarget(sock, raw)
      let media = null
      try { media = await getMedia(sock, msg, ['imageMessage', 'videoMessage', 'audioMessage']) }
      catch (err) { console.log('[CH] swch unduh media:', err.message); return reply('Gagal mengunduh media. Coba kirim ulang gambar/videonya.') }

      // pecah "teks | warna"
      const parts = t.rest.split('|').map((v) => v.trim()).filter(Boolean)
      let text = ''
      let colorName = ''
      for (const p of parts) {
        if (!colorName && cs.COLORS[p.toLowerCase()] && text) colorName = p.toLowerCase()
        else text = text ? `${text} | ${p}` : p
      }

      let kind
      const opts = { allowPlain }
      if (media) {
        if (media.type === 'imageMessage') { kind = 'image'; opts.buffer = media.buffer; opts.caption = text }
        else if (media.type === 'videoMessage') { kind = 'video'; opts.buffer = media.buffer; opts.caption = text }
        else { kind = 'audio'; opts.buffer = await cs.toVN(media.buffer) }
      } else {
        text = text || getQuotedText(msg) || ''
        if (!text) {
          return reply(panel('STATUS SALURAN', [
            { head: '📖 *CARA PAKAI*', lines: [`${prefix}swch <teks> → status teks`, `${prefix}swch <teks> | biru → pilih warna`, `Kirim/reply gambar atau video + ${prefix}swch <caption>`, `Reply audio + ${prefix}swch → voice note`, `${prefix}swch <link saluran> <teks> → saluran lain`, `${prefix}swch cek → cek kemampuan & izin`] },
            { head: '🎨 *WARNA*', lines: [cs.colorNames().join(', ')], plain: true }
          ], { tip: ch.getCurrent() ? `💡 Tujuan saat ini: ${ch.getCurrent().name}` : `💡 Atur tujuan dulu: ${prefix}setch <link saluran>` }))
        }
        if (text.length > 2000) return reply('Teks terlalu panjang (maks 2000 karakter).')
        kind = 'text'; opts.text = text; opts.color = cs.pickColor(colorName)
      }

      ch.assertCanPost(t)
      const r = await cs.post(sock, t.id, kind, opts)
      const label = { text: 'teks', image: 'gambar', video: 'video', audio: 'audio' }[kind]
      if (r.mode === 'status') return reply(`✅ Status saluran (${label}) terkirim ke *${t.name}*.${r.id ? `\nID status: ${r.id}` : ''}\nTampil 24 jam.`)
      return reply(`✅ Terkirim sebagai *post biasa* (${label}) di saluran *${t.name}*.\nCatatan: ini bukan Status Saluran karena baileys di bot belum punya fitur statusnya.`)
    } catch (err) {
      console.log('[CH] swch:', err.message)
      await reply(`❌ ${ch.explain(err)}`)
    }
  }
}
