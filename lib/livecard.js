// lib/livecard.js — pembangun kartu PEMUTAR rich bertema "Tinta" (hitam-putih komik + tinta donghua).
// Dipakai play2, ytlive, spotifylive, ttlive. Media (audio/video) DITANAM langsung di kartu -> jalan tanpa tunnel / server relay.
'use strict'

const fs = require('fs')
const path = require('path')
const ink = require('./inkui')
const { esc, mmss, jsonForScript } = require('./livemedia')

const CLIENT = fs.readFileSync(path.join(__dirname, 'livecard.client.js'), 'utf8')

const ICON = {
  loop: '<path d="M7 7h10v3l4-4-4-4v3H5v6h2zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2z"/>',
  back: '<path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/><path d="M9 14.5v-4l-1.3.5v-.9l1.9-.8h.4v5.2zM13.4 14.6c-.5 0-.9-.2-1.2-.5s-.4-.9-.4-1.6v-.6c0-.7.1-1.2.4-1.6.3-.3.7-.5 1.2-.5s.9.2 1.2.5.4.9.4 1.6v.6c0 .7-.1 1.2-.4 1.6s-.7.5-1.2.5zm0-.8c.3 0 .5-.1.5-.4s.1-.5.1-.9v-.8c0-.4 0-.7-.1-.9s-.2-.4-.5-.4-.5.1-.5.4-.1.5-.1.9v.8c0 .4 0 .7.1.9s.2.4.5.4z"/>',
  fwd: '<path d="M12 5V1l5 5-5 5V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z"/><path d="M9 14.5v-4l-1.3.5v-.9l1.9-.8h.4v5.2zM13.4 14.6c-.5 0-.9-.2-1.2-.5s-.4-.9-.4-1.6v-.6c0-.7.1-1.2.4-1.6.3-.3.7-.5 1.2-.5s.9.2 1.2.5.4.9.4 1.6v.6c0 .7-.1 1.2-.4 1.6s-.7.5-1.2.5zm0-.8c.3 0 .5-.1.5-.4s.1-.5.1-.9v-.8c0-.4 0-.7-.1-.9s-.2-.4-.5-.4-.5.1-.5.4-.1.5-.1.9v.8c0 .4 0 .7.1.9s.2.4.5.4z"/>',
  vol: '<path d="M3 9v6h4l5 5V4L7 9zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  pause: '<path d="M6 5h4v14H6zm8 0h4v14h-4z"/>'
}
const svg = (p, cls = '') => `<svg ${cls ? `class="${cls}" ` : ''}viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`

const SEAL = { YOUTUBE: '影', SPOTIFY: '音', TIKTOK: '舞', PLAY: '曲' }

/**
 * buildCard({
 *   kind: 'audio'|'video', source: 'YOUTUBE'|'SPOTIFY'|'TIKTOK'|'PLAY',
 *   title, artist, cover (data URI), media (data URI), mime?, fullSec, clipSec,
 *   lyrics: { mode: 'sync'|'plain'|'none', lines }, noMediaWhy?,
 *   results: [{ title, sub, dur, thumb (data URI), cmd }], curIndex, nextCmd,
 *   searchCmd: '.ytlive'  (kotak cari; kosong = sembunyikan),
 *   actions: [{ label, cmd, dark, id }], note
 * })
 */
function buildCard(o) {
  const kind = o.kind === 'video' ? 'video' : 'audio'
  const lyr = o.lyrics && o.lyrics.lines ? { mode: o.lyrics.mode, lines: o.lyrics.lines.slice(0, 400) } : { mode: 'none', lines: [] }
  const results = (o.results || []).slice(0, 8)
  const actions = (o.actions || []).slice(0, 3)
  const src = String(o.source || 'PLAY').toUpperCase()
  const brand = esc(global.botname || 'WhatsApp Bot')
  const dTotal = o.clipSec || o.fullSec || 0

  const data = {
    kind, lyr, full: o.fullSec || 0, clip: o.clipSec || 0, hasMedia: !!o.media, noMediaWhy: o.noMediaWhy || '',
    results: results.map((r) => ({ cmd: r.cmd })), actions: actions.map((a) => ({ cmd: a.cmd })),
    searchCmd: o.searchCmd || '', nextCmd: o.nextCmd || ''
  }

  const deck = kind === 'video'
    ? `<div class="scr"><div class="cap">${esc(src)} 動</div><video id="m" playsinline webkit-playsinline preload="auto"${o.cover ? ` poster="${o.cover}"` : ''}${o.media ? ` src="${o.media}"` : ''}></video></div>`
    : `<div class="deck"><div class="enso"></div><div class="disc"><div class="grv"></div><div class="shn"></div><div class="lab">${o.cover ? `<img src="${o.cover}" alt="">` : `<b>${SEAL[src] || '曲'}</b>`}</div><div class="hole"></div></div><div class="arm"></div></div>`

  const lyricsPanel = lyr.mode === 'none'
    ? (o.hideLyrics ? '' : `<div class="pn"><div class="ph"><b>LIRIK 詞</b><span>KOSONG</span></div><div class="empty">Lirik tidak ditemukan.<br>Nikmati musiknya saja.</div></div>`)
    : `<div class="pn"><div class="ph"><b>LIRIK 詞</b><span>${lyr.mode === 'sync' ? 'SINKRON' : 'TEKS'}</span></div><div class="lw" id="lw"><div class="lt" id="lt"></div></div></div>`

  const resultsPanel = results.length
    ? `<div class="pn" id="rs"><div class="ph"><b>HASIL ${esc(src)}</b><span>${results.length}</span></div>${results.map((r, i) =>
      `<div class="ri${i === o.curIndex ? ' cur' : ''}" data-i="${i}"><div class="rn">${i + 1}</div>${r.thumb ? `<div class="rm"><img src="${r.thumb}" alt=""></div>` : ''}<div class="rx"><b>${esc(r.title)}</b><i>${esc(r.sub || '')}</i></div>${r.dur ? `<div class="rd">${esc(r.dur)}</div>` : ''}</div>`).join('')}</div>`
    : ''

  const searchBox = o.searchCmd
    ? `<div class="sr"><input id="q" type="text" placeholder="Cari ${esc(src.toLowerCase())} lain..." autocomplete="off"><button id="go">CARI</button></div>`
    : ''

  const actionsRow = actions.length
    ? `<div class="acts" id="acts">${actions.map((a, i) => `<div class="ab${a.dark ? ' k' : ''}${a.id === 'dl' ? ' hide' : ''}" ${a.id ? `id="ab-${a.id}" ` : ''}data-a="${i}">${esc(a.label)}</div>`).join('')}</div>`
    : ''

  const html = `<style>${ink.playerCss()}</style>
<div class="wrap"><div class="sheet" id="sheet">
<div class="ht"><i class="h3"></i><i class="h2"></i><i class="h1"></i><i class="h0"></i></div>${kind === 'audio' ? '<div class="art a-bam"></div><div class="art a-spl"></div>' : ''}
<div class="in">
<div class="tb"><div class="np"><span class="eq"><i></i><i></i><i></i><i></i></span>${kind === 'video' ? 'MENONTON' : 'SEDANG DIPUTAR'}</div><div class="seal">${SEAL[src] || '曲'}</div></div>
${deck}
<div class="meta"><div class="ti">${esc(o.title || '')}</div><div class="ul"></div><div class="ar">${esc(o.artist || '')}</div></div>
<div class="bar" id="bar"><div class="trk"><div class="fil" id="fil"></div><div class="kn" id="kn"></div></div></div>
<div class="tm"><span id="cur">0:00</span><span id="dur">${mmss(dTotal)}</span></div>
<div class="ct" id="ct">
<button class="bt sm" id="lp" aria-label="Ulang">${svg(ICON.loop)}</button>
<button class="bt" id="bk" aria-label="Mundur 10 detik">${svg(ICON.back)}</button>
<div class="pp-w"><div class="tap">KETUK UNTUK MEMUTAR</div><button class="bt pp" id="pp" aria-label="Putar / jeda">${svg(ICON.play, 'i1')}${svg(ICON.pause, 'i2')}</button></div>
<button class="bt" id="fw" aria-label="Maju 10 detik">${svg(ICON.fwd)}</button>
<button class="bt sm" id="mt" aria-label="Suara">${svg(ICON.vol)}</button>
</div>
<div class="st" id="st"></div>
${o.note ? `<div class="nt">${esc(o.note)}</div>` : ''}
${actionsRow}${lyricsPanel}${resultsPanel}${searchBox}
<div class="ft"><div class="brand">${brand} × ${esc(src)}</div><div class="seal">墨</div></div>
</div>
</div></div>
${kind === 'audio' && o.media ? `<audio id="m" preload="auto" src="${o.media}"></audio>` : ''}
<script>var D=${jsonForScript(data)};\n${CLIENT}</script>`
  return html
}

module.exports = { buildCard }
