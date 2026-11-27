// =====================================================================
//  play2 — pemutar musik RICH (kartu HTML) by WhatsApp Bot — tema TINTA (hitam-putih komik + tinta donghua)
//
//  .play2 <judul lagu | link youtube>
//
//  • Lagu langsung bunyi di dalam kartu (audio DITANAM di kartu, tanpa tunnel/server) + seek, ±10 detik, ulang, mute
//  • Lirik karaoke SINKRON (LRC dari lrclib.net): baris aktif menyala hitam, ketuk baris = loncat ke situ
//  • Sumber audio yang rusak (bukan audio) otomatis dilewati -> tidak ada lagi "Audio gagal: EncodingError"
//
//  Pengaturan opsional di settings.js:
//    global.play2 = { clipSec: 0, kbps: 0, maxKB: 640, fallbackAudio: false, textDelay: 1.2 }
//      clipSec = 0 -> lagu PENUH di kartu (default). maxKB = batas ukuran audio di kartu (default 640)
//      fallbackAudio = true -> kirim juga audio biasa setelah kartu
// =====================================================================
'use strict'

const lazy = (p) => { try { return require(p) } catch { return null } }
const richui = lazy('../../lib/richui')
const lm = require('../../lib/livemedia')
const { buildCard } = require('../../lib/livecard')
const { splitTitle, findVideo, getAudio, makeClip, getCover, getLyrics, toSec } = lm

const cfg = () => Object.assign({ clipSec: 0, kbps: 0, maxKB: 640, fallbackAudio: false }, global.play2 || {})

// ---------------------------------------------------------------- mode teks: sampul + lagu + lirik "live"
// Lirik dikirim sebagai satu pesan yang DI-EDIT mengikuti detik lagu (dihitung sejak audio terkirim).
// Karena di mode teks tidak ada pemutar, waktunya perkiraan: tekan play begitu audio masuk.
async function textMode({ sock, msg, from, video, track, artist, cover, audioBuf, lyrics, fullSec }) {
  const name = track || video.title
  const caption = `*${name}*\n${artist || video.channel}${video.duration ? ` • ${video.duration}` : ''}\n\nLirik: ${{ sync: 'sinkron (pesan di bawah ikut berganti)', plain: 'teks biasa', none: 'tidak ditemukan' }[lyrics.mode]}`
  if (cover) await sock.sendMessage(from, { image: Buffer.from(cover.split(',')[1], 'base64'), caption }, { quoted: msg })
  else await sock.sendMessage(from, { text: caption }, { quoted: msg })

  await sock.sendMessage(from, { audio: audioBuf, mimetype: 'audio/mpeg', ptt: false, fileName: `${name.slice(0, 80)}.mp3` }, { quoted: msg })
  const t0 = Date.now()
  const L = lyrics.lines

  if (lyrics.mode === 'plain') {
    const txt = L.map((x) => x.s).join('\n').replace(/\n{3,}/g, '\n\n').slice(0, 3500)
    return sock.sendMessage(from, { text: `*LIRIK*\n\n${txt}` })
  }
  if (lyrics.mode !== 'sync') return sock.sendMessage(from, { text: 'Lirik tidak ditemukan untuk lagu ini.' })

  const render = (i) => {
    const g = (k) => (L[k] && L[k].s) || ''
    const rows = []
    if (g(i - 1)) rows.push(`_${g(i - 1)}_`)
    rows.push(`*▶ ${g(i) || '♪'}*`)
    for (const k of [i + 1, i + 2]) if (g(k)) rows.push(g(k))
    return `*LIRIK* • ${name}\n\n${rows.join('\n')}`
  }
  const sent = await sock.sendMessage(from, { text: `*LIRIK* • ${name}\n\nTekan play pada audio di atas, lirik ikut berjalan...` })
  const delay = Number((global.play2 || {}).textDelay) || 1.2 // detik, perkiraan lama audio sampai terbuka
  let shownIdx = -1, lastEdit = 0
  await new Promise((resolve) => {
    const iv = setInterval(async () => {
      const t = (Date.now() - t0) / 1000 - delay
      if (t > (fullSec || L[L.length - 1].t + 15) + 10) { clearInterval(iv); return resolve() }
      let i = -1
      for (let k = 0; k < L.length && L[k].t <= t; k++) i = k
      if (i < 0 || i === shownIdx || Date.now() - lastEdit < 2200) return
      shownIdx = i; lastEdit = Date.now()
      try { await sock.sendMessage(from, { text: render(i), edit: sent.key }) } catch (e) { console.log('[PLAY2] edit lirik gagal:', e.message) }
    }, 400)
  })
}

// ---------------------------------------------------------------- perintah
module.exports = {
  name: 'play2',
  command: ['play2'],
  category: 'downloader',
  desc: 'Pemutar musik rich: lagu langsung nyala di kartu + lirik sinkron',
  usage: '<judul lagu | link youtube>',
  run: async ({ sock, msg, from, args, prefix, react, reply }) => {
    const query = args.join(' ').trim()
    if (!query) return reply(`Masukkan judul lagu.\nContoh: ${prefix}play2 cinta bawa duka`)
    const c = cfg()
    react && react('⏳')
    try {
      const video = await findVideo(query)
      const { artist, track } = splitTitle(video.title, video.channel)
      const fullSec = toSec(video.duration)
      const richOk = !!(richui && richui.sendHtml)
      const toClip = (b) => makeClip(b, Number(c.clipSec) > 0 ? Math.max(20, Number(c.clipSec)) : 0, Number(c.kbps) > 0 ? Math.max(12, Number(c.kbps)) : 0, Number(c.maxKB) > 0 ? Number(c.maxKB) : 640)
      const [got, cover, lyrics] = await Promise.all([
        getAudio(video, richOk ? toClip : null),
        getCover(video.id).catch(() => ''),
        getLyrics(video).catch(() => ({ mode: 'none', lines: [] }))
      ])
      const audioBuf = got.buf
      let shown = false
      if (richOk) {
        const clip = got.out
        const title = lyrics.title || track || video.title
        const html = buildCard({
          kind: 'audio', source: 'PLAY', title, artist: lyrics.artist || artist || video.channel, cover,
          media: clip ? `data:${clip.mime};base64,${clip.data.toString('base64')}` : '',
          fullSec, clipSec: clip ? clip.sec : 0, lyrics,
          note: clip && fullSec && clip.sec < fullSec - 3 ? `Cuplikan ${lm.mmss(clip.sec)} dari ${lm.mmss(fullSec)}` : '',
          searchCmd: `${prefix}play2`,
          actions: [{ label: 'KIRIM AUDIO KE CHAT', cmd: `${prefix}ytmp3 ${video.url}`, id: 'dl' }]
        })
        try {
          await richui.sendHtml(sock, from, html, `Play ${track || video.title}`)
          shown = true
        } catch (e) {
          console.log('[PLAY2] kartu gagal terkirim:', e)
          const mb = (Buffer.byteLength(html) / 1048576).toFixed(1)
          await reply(`Kartu gagal terkirim (ukuran kartu ${mb} MB): ${e.message}\nKalau karena terlalu besar, atur global.play2 = { kbps: 64 } (atau 32) di settings.js.`).catch(() => {})
        }
        if (shown && c.fallbackAudio === true) {
          await sock.sendMessage(from, { audio: audioBuf, mimetype: 'audio/mpeg', fileName: `${(track || video.title).slice(0, 80)}.mp3` }, { quoted: msg })
        }
      }
      if (!shown) await textMode({ sock, msg, from, video, track, artist, cover, audioBuf, lyrics, fullSec })
      react && react('✅')
    } catch (err) {
      console.log('[PLAY2]', err)
      react && react('❌')
      reply(`Gagal memutar lagu: ${err.message || err}`)
    }
  }
}
