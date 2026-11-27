// lib/inkart.js — seni tinta HITAM-PUTIH murni (tanpa abu-abu / warna pudar) untuk tema "Tinta" (komik + lukisan tinta donghua).
// Semua berupa SVG yang ditanam sebagai data URI -> tidak ada permintaan jaringan di dalam kartu WhatsApp.
'use strict'

const b64 = (svg) => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64')
// pseudo-acak deterministik (supaya gambar sama di setiap kartu)
const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const r1 = (n) => Math.round(n * 10) / 10

// filter tepi kasar ala goresan kuas basah
const ROUGH = (id = 'r', f = 0.035, s = 4) => `<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${s}" xChannelSelector="R" yChannelSelector="G"/></filter>`

// ---- halftone komik: titik hitam yang mengecil menjauhi sudut (dari kiri-atas / kanan-atas / dst)
function halftone({ w = 346, h = 120, cell = 7, from = 'tr', maxR = 3.1, reach = 0.95 } = {}) {
  const cx = from.includes('r') ? w : 0
  const cy = from.includes('b') ? h : 0
  const maxD = Math.hypot(w, h) * reach
  let dots = ''
  for (let y = cell / 2, row = 0; y < h + cell; y += cell * 0.866, row++) {
    for (let x = (row % 2 ? cell / 2 : 0); x < w + cell; x += cell) {
      const d = Math.hypot(x - cx, y - cy) / maxD
      const r = maxR * (1 - d)
      if (r > 0.45) dots += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}"/>`
    }
  }
  return b64(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><g fill="#000">${dots}</g></svg>`)
}

// ---- gunung berkabut ala shan shui / donghua: tiga lapis puncak hitam, dipisah pita kabut putih yang lebar
function mountains({ w = 346, h = 150 } = {}) {
  const rnd = rng(11)
  // punggungan: puncak meruncing mulus (kurva), lembah turun ke base
  const ridge = (base, amp, step) => {
    let d = `M-10 ${h} L-10 ${r1(base)}`
    let x = -10
    while (x < w + 10) {
      const pk = amp * (0.55 + rnd() * 0.45)
      const wd = step * (0.8 + rnd() * 0.7)
      d += ` Q${r1(x + wd * 0.35)} ${r1(base - pk * 0.15)} ${r1(x + wd * 0.5)} ${r1(base - pk)} Q${r1(x + wd * 0.7)} ${r1(base - pk * 0.2)} ${r1(x + wd)} ${r1(base)}`
      x += wd
    }
    return d + ` L${w + 10} ${h} Z`
  }
  const mist = (y, hh, seed) => {
    const rr = rng(seed)
    let d = `M-10 ${y + hh} L-10 ${y}`
    for (let x = -10; x <= w + 30; x += 46) d += ` Q${x + 23} ${r1(y - 7 - rr() * 8)} ${x + 46} ${r1(y + rr() * 4)}`
    return d + ` L${w + 40} ${y + hh} Z`
  }
  const hatch = (x0, y0, n, seed) => {
    const rr = rng(seed)
    let s = ''
    for (let i = 0; i < n; i++) {
      const x = x0 + rr() * 110, y = y0 + rr() * 22, l = 5 + rr() * 9
      s += `M${r1(x)} ${r1(y)} l${r1(l * 0.4)} ${r1(l)} `
    }
    return s
  }
  return b64(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>${ROUGH('m', 0.045, 3)}</defs>` +
    `<g filter="url(#m)">` +
    `<path d="${ridge(h * 0.52, 40, 70)}" fill="#000"/>` +
    `<path d="${mist(h * 0.56, 22, 3)}" fill="#fff"/>` +
    `<path d="${ridge(h * 0.74, 48, 84)}" fill="#000"/>` +
    `<path d="${hatch(14, h * 0.66, 12, 5)} ${hatch(200, h * 0.64, 12, 9)}" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
    `<path d="${mist(h * 0.80, 20, 8)}" fill="#fff"/>` +
    `<path d="${ridge(h * 0.93, 24, 60)}" fill="#000"/>` +
    `</g></svg>`
  )
}

// ---- bambu: batang berbuku + daun runcing
function bamboo({ w = 90, h = 220 } = {}) {
  const rnd = rng(23)
  let out = ''
  const stalk = (x, wd, top, seed) => {
    const rr = rng(seed)
    let y = h, s = ''
    while (y > top) {
      const seg = 26 + rr() * 18
      const y2 = Math.max(top, y - seg)
      s += `<rect x="${r1(x)}" y="${r1(y2)}" width="${wd}" height="${r1(y - y2 - 3)}" rx="${wd / 2.4}"/>`
      y = y2
    }
    return s
  }
  const leaf = (x, y, ang, len) => `<path transform="translate(${r1(x)} ${r1(y)}) rotate(${ang})" d="M0 0 Q${r1(len * 0.45)} ${r1(-len * 0.17)} ${r1(len)} 0 Q${r1(len * 0.45)} ${r1(len * 0.1)} 0 0Z"/>`
  out += stalk(54, 8, 18, 4) + stalk(34, 6, 56, 6) + stalk(70, 5, 90, 8)
  for (const [x, y, a, l] of [[58, 40, -28, 46], [58, 66, 18, 44], [56, 96, -40, 42], [38, 74, -150, 42], [38, 104, 160, 40], [38, 130, -160, 38], [72, 112, -20, 34], [72, 140, 24, 32], [58, 20, -62, 38]]) out += leaf(x, y, a, l)
  void rnd
  return b64(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>${ROUGH('b', 0.05, 2.6)}</defs><g fill="#000" filter="url(#b)">${out}</g></svg>`)
}

// ---- enso: lingkaran kuas yang tidak tertutup, tebal-tipis
function enso({ s = 220 } = {}) {
  const c = s / 2, R = s * 0.38
  const a0 = (-60 * Math.PI) / 180, a1 = (250 * Math.PI) / 180
  const P = (r, a) => `${r1(c + r * Math.cos(a))} ${r1(c + r * Math.sin(a))}`
  const outer = `M${P(R + 7, a0)} A${R + 7} ${R + 7} 0 1 1 ${P(R + 2, a1)}`
  const inner = `M${P(R - 7, a1)} A${R - 7} ${R - 7} 0 1 0 ${P(R - 2, a0)}`
  return b64(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}"><defs>${ROUGH('e', 0.06, 6)}</defs>` +
    `<g filter="url(#e)"><path d="${outer} L${P(R - 8, a1)} ${inner.slice(inner.indexOf('A'))} Z" fill="#000"/>` +
    `<path d="M${P(R + 13, 0.35)} A${R + 13} ${R + 13} 0 0 1 ${P(R + 13, 1.25)}" stroke="#000" stroke-width="3" fill="none" stroke-linecap="round"/></g></svg>`
  )
}

// ---- goresan garis bawah judul (sapuan kuas)
function underline({ w = 300, h = 12 } = {}) {
  return b64(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="none"><defs>${ROUGH('u', 0.08, 3)}</defs><path filter="url(#u)" d="M2 ${h * 0.7} Q${w * 0.3} ${h * 0.1} ${w * 0.62} ${h * 0.55} T${w - 2} ${h * 0.4} L${w - 6} ${h * 0.9} Q${w * 0.5} ${h * 0.6} 6 ${h}Z" fill="#000"/></svg>`)
}

// ---- percikan tinta (titik-titik acak)
function splatter({ w = 140, h = 90, n = 26, seed = 5 } = {}) {
  const rr = rng(seed)
  let s = ''
  for (let i = 0; i < n; i++) s += `<circle cx="${r1(rr() * w)}" cy="${r1(rr() * h)}" r="${r1(0.8 + rr() * rr() * 5.5)}"/>`
  return b64(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><g fill="#000">${s}</g></svg>`)
}

module.exports = { halftone, mountains, bamboo, enso, underline, splatter, b64 }
