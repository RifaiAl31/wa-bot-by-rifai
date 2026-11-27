// lib/livecmd.js — perintah .ytlive / .spotifylive / .ttlive (kartu Tinta yang MEMUTAR media langsung di WhatsApp)
//
// Cara kerja: bot mencari di YouTube / Spotify / TikTok, mengunduh medianya di server, memadatkannya, lalu MENANAMNYA di kartu
// -> bisa dengar lagu / nonton video langsung di chat, TANPA tunnel cloudflared / server relay / jaringan di dalam kartu.
// Kalau kartu gagal terkirim, media dikirim sebagai audio/video WhatsApp biasa (cadangan), jadi tetap bisa diputar.
//
// Pengaturan opsional di settings.js:
//   global.livecard = { maxKB: 800, maxSec: 45, audioMaxKB: 640, sendFull: true, results: 6 }
//     maxKB      = batas ukuran video pratinjau di kartu (KB)       maxSec = durasi maksimal pratinjau video (detik)
//     audioMaxKB = batas ukuran audio di kartu (KB)                 sendFull = kirim juga video/audio penuh sebagai pesan biasa
'use strict'

const lm = require('./livemedia')
const { buildCard } = require('./livecard')

const lazy = (p) => { try { return require(p) } catch { return null } }
const richui = () => lazy('./richui')
const cfg = () => Object.assign({ maxKB: 800, maxSec: 45, audioMaxKB: 640, sendFull: true, results: 6 }, global.livecard || {})
const busy = new Set()
const FULL_LIMIT = 60 * 1024 * 1024

const isUrl = (s) => /^https?:\/\//i.test(s)
const isYt = (s) => /(?:youtube\.com|youtu\.be)\//i.test(s)
const isSp = (s) => /open\.spotify\.com\/(?:intl-[a-z]+\/)?track\//i.test(s)
const isTt = (s) => /(?:tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com)/i.test(s)

// satu perintah per chat pada satu waktu
async function guard(ctx, fn) {
  if (busy.has(ctx.from)) return ctx.reply('Masih ada proses live di chat ini, tunggu sebentar ya.')
  busy.add(ctx.from)
  ctx.react && ctx.react('⏳')
  try { await fn(); ctx.react && ctx.react('✅') } catch (e) {
    console.log(`[LIVE:${ctx.command}]`, e)
    ctx.react && ctx.react('❌')
    await ctx.reply(`Gagal: ${String(e.message || e).slice(0, 500)}`).catch(() => {})
  } finally { busy.delete(ctx.from) }
}

const thumbs = (list) => Promise.all(list.map((x) => lm.imgFromUrl(x.thumb, 96, 50).catch(() => '')))

// kirim kartu; kalau gagal, balikkan false supaya pemanggil kirim media biasa
async function sendCard(ctx, html, label) {
  const r = richui()
  if (!r || !r.sendHtml) return false
  try { await r.sendHtml(ctx.sock, ctx.from, html, label); return true } catch (e) {
    console.log('[LIVE] kartu gagal terkirim:', e.message)
    const mb = (Buffer.byteLength(html) / 1048576).toFixed(1)
    await ctx.reply(`Kartu gagal terkirim (${mb} MB): ${e.message}\nMedia dikirim sebagai ${'pesan biasa'} di bawah. Kecilkan dengan global.livecard = { maxKB: 600 } di settings.js.`).catch(() => {})
    return false
  }
}

const usage = (ctx, ex) => ctx.reply(`Masukkan kata kunci atau link.\n${ex}`)

// ================================================================= YOUTUBE
async function ytLive(ctx) {
  const { prefix, args } = ctx
  const c = cfg()
  let mode = 'video'
  const a = [...args]
  if (/^(audio|lagu|mp3|musik)$/i.test(a[0] || '')) { mode = 'audio'; a.shift() } else if (/^(video|vid|mp4)$/i.test(a[0] || '')) a.shift()
  const q = a.join(' ').trim()
  if (!q) return usage(ctx, `Contoh:\n${prefix}ytlive tutorial masak nasi goreng\n${prefix}ytlive audio cinta bawa duka\n${prefix}ytlive https://youtu.be/xxxx`)

  await guard(ctx, async () => {
    let list, video
    if (isUrl(q)) {
      if (!isYt(q)) throw new Error('Link harus dari YouTube.')
      video = await lm.findVideo(q)
      const rel = await lm.ytSearch(video.title, c.results).catch(() => [])
      list = [video, ...rel.filter((v) => v.id !== video.id)].slice(0, c.results)
    } else {
      list = await lm.ytSearch(q, c.results)
      video = list[0]
    }
    if (!video) throw new Error('Video tidak ditemukan.')
    const th = await thumbs(list)
    const pre = mode === 'audio' ? 'audio ' : ''
    const results = list.map((v, i) => ({ title: v.title, sub: v.channel, dur: v.duration, thumb: th[i], cmd: `${prefix}ytlive ${pre}${v.url}` }))
    const { artist, track } = lm.splitTitle(video.title, video.channel)

    if (mode === 'audio') {
      const toClip = (b) => lm.makeClip(b, 0, 0, c.audioMaxKB)
      const [got, cover, lyrics] = await Promise.all([lm.getAudio(video, toClip), lm.getCover(video.id).catch(() => ''), lm.getLyrics(video).catch(() => ({ mode: 'none', lines: [] }))])
      const clip = got.out
      const html = buildCard({
        kind: 'audio', source: 'YOUTUBE', title: lyrics.title || track || video.title, artist: lyrics.artist || artist || video.channel, cover,
        media: `data:${clip.mime};base64,${clip.data.toString('base64')}`, fullSec: lm.toSec(video.duration), clipSec: clip.sec, lyrics,
        results, curIndex: 0, nextCmd: results[1] && results[1].cmd, searchCmd: `${prefix}ytlive audio`,
        actions: [{ label: 'KIRIM AUDIO KE CHAT', cmd: `${prefix}ytmp3 ${video.url}`, id: 'dl' }]
      })
      const ok = await sendCard(ctx, html, `YT Live ${video.title}`)
      if (!ok) await ctx.sock.sendMessage(ctx.from, { audio: got.buf, mimetype: 'audio/mpeg', fileName: `${video.title.slice(0, 80)}.mp3` }, { quoted: ctx.msg })
      return
    }

    const full = await lm.ytVideoBuffer(video.url)
    const prev = await lm.videoPreview(full.buf, { maxKB: c.maxKB, maxSec: c.maxSec })
    const fullSec = lm.toSec(video.duration)
    const html = buildCard({
      kind: 'video', source: 'YOUTUBE', title: video.title, artist: video.channel, cover: '',
      media: `data:${prev.mime};base64,${prev.data.toString('base64')}`, fullSec, clipSec: prev.sec,
      lyrics: { mode: 'none', lines: [] }, hideLyrics: true, results, curIndex: 0, searchCmd: `${prefix}ytlive`,
      note: fullSec > prev.sec + 3 ? `Pratinjau ${lm.mmss(prev.sec)} dari ${lm.mmss(fullSec)}${c.sendFull ? ' • video penuh dikirim di bawah' : ''}` : '',
      actions: [{ label: 'KIRIM VIDEO KE CHAT', cmd: `${prefix}ytmp4 ${video.url}`, id: 'dl' }, { label: 'VERSI AUDIO', cmd: `${prefix}ytlive audio ${video.url}` }]
    })
    const ok = await sendCard(ctx, html, `YT Live ${video.title}`)
    if ((!ok || c.sendFull) && full.buf.length <= FULL_LIMIT) {
      await ctx.sock.sendMessage(ctx.from, { video: full.buf, mimetype: 'video/mp4', caption: `*${video.title}*\n${video.channel}${video.duration ? ' • ' + video.duration : ''}` }, { quoted: ctx.msg })
    }
  })
}

// ================================================================= SPOTIFY
async function spotifyLive(ctx) {
  const { prefix, args } = ctx
  const c = cfg()
  const q = args.join(' ').trim()
  if (!q) return usage(ctx, `Contoh:\n${prefix}spotifylive hindia evaluasi\n${prefix}spotifylive https://open.spotify.com/track/xxxx`)

  await guard(ctx, async () => {
    let list, track
    if (isUrl(q)) {
      if (isSp(q)) {
        track = await lm.spTrackFromUrl(q)
      } else if (isYt(q)) {
        const v = await lm.findVideo(q); const s = lm.splitTitle(v.title, v.channel)
        track = { id: v.id, url: v.url, title: s.track || v.title, artist: s.artist || v.channel, duration: v.duration, thumb: v.thumb, cover: v.thumb, viaYt: true }
      } else throw new Error('Link harus berupa link track Spotify.')
      const rel = await lm.spSearch(`${track.title} ${track.artist}`, c.results).catch(() => [])
      list = [track, ...rel.filter((t) => t.id !== track.id)].slice(0, c.results)
    } else {
      list = await lm.spSearch(q, c.results)
      track = list[0]
    }
    if (!track) throw new Error('Lagu tidak ditemukan.')
    const th = await thumbs(list)
    const results = list.map((t, i) => ({ title: t.title, sub: t.artist, dur: t.duration, thumb: th[i], cmd: `${prefix}spotifylive ${t.url}` }))

    const toClip = (b) => lm.makeClip(b, 0, 0, c.audioMaxKB)
    const [got, cover, lyrics] = await Promise.all([
      lm.spAudio(track, toClip),
      lm.imgFromUrl(track.cover || track.thumb, 360, 62),
      lm.getLyrics({ title: `${track.artist} - ${track.title}`, channel: track.artist, duration: track.duration }).catch(() => ({ mode: 'none', lines: [] }))
    ])
    const clip = got.out
    const html = buildCard({
      kind: 'audio', source: 'SPOTIFY', title: track.title, artist: track.artist, cover,
      media: `data:${clip.mime};base64,${clip.data.toString('base64')}`, fullSec: Math.round((track.durMs || 0) / 1000), clipSec: clip.sec, lyrics,
      results, curIndex: 0, nextCmd: results[1] && results[1].cmd, searchCmd: `${prefix}spotifylive`,
      note: got.via === 'youtube' ? 'Audio diambil dari YouTube (sumber Spotify tidak tersedia)' : '',
      actions: [{ label: 'KIRIM AUDIO KE CHAT', cmd: `${prefix}spotifydl ${track.viaYt ? track.url : track.url}`, id: 'dl' }]
    })
    const ok = await sendCard(ctx, html, `Spotify Live ${track.title}`)
    if (!ok) await ctx.sock.sendMessage(ctx.from, { audio: got.buf, mimetype: 'audio/mpeg', fileName: `${track.title.slice(0, 60)} - ${track.artist.slice(0, 40)}.mp3` }, { quoted: ctx.msg })
  })
}

// ================================================================= TIKTOK
async function ttLive(ctx) {
  const { prefix, args } = ctx
  const c = cfg()
  const q = args.join(' ').trim()
  if (!q) return usage(ctx, `Contoh:\n${prefix}ttlive kucing lucu\n${prefix}ttlive https://vt.tiktok.com/xxxx`)

  await guard(ctx, async () => {
    let list, info
    if (isUrl(q)) {
      if (!isTt(q)) throw new Error('Link harus dari TikTok.')
      info = await lm.ttInfo(q)
      list = [info]
    } else {
      list = await lm.ttSearch(q, c.results)
      info = list[0]
    }
    if (info.images && info.images.length && !info.play) throw new Error('Ini postingan slide foto, bukan video. Pakai .ttslide.')
    const th = await thumbs(list)
    const results = list.map((v, i) => ({ title: v.title || '(tanpa judul)', sub: `@${v.author}`, dur: v.duration, thumb: th[i], cmd: `${prefix}ttlive ${v.url}` }))
    const buf = await lm.ttVideoBuffer(info)
    const prev = await lm.videoPreview(buf, { maxKB: c.maxKB, maxSec: c.maxSec })
    const html = buildCard({
      kind: 'video', source: 'TIKTOK', title: info.title || 'Video TikTok', artist: `@${info.author}`, cover: '',
      media: `data:${prev.mime};base64,${prev.data.toString('base64')}`, fullSec: info.sec || 0, clipSec: prev.sec,
      lyrics: { mode: 'none', lines: [] }, hideLyrics: true, results, curIndex: 0, searchCmd: `${prefix}ttlive`,
      note: info.sec && info.sec > prev.sec + 2 ? `Pratinjau ${lm.mmss(prev.sec)} dari ${lm.mmss(info.sec)}${c.sendFull ? ' • video penuh dikirim di bawah' : ''}` : '',
      actions: [{ label: 'KIRIM VIDEO KE CHAT', cmd: `${prefix}tiktok ${info.url}`, id: 'dl' }]
    })
    const ok = await sendCard(ctx, html, `TikTok Live ${info.title || ''}`)
    if ((!ok || c.sendFull) && buf.length <= FULL_LIMIT) {
      await ctx.sock.sendMessage(ctx.from, { video: buf, mimetype: 'video/mp4', caption: `*${(info.title || 'TikTok').slice(0, 150)}*\n@${info.author}` }, { quoted: ctx.msg })
    }
  })
}

module.exports = { ytLive, spotifyLive, ttLive }
