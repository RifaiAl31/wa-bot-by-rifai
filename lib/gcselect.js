// lib/gcselect.js — pemilihan grup untuk jpm / swgc / bcgc dll.
//
// Cara pakai oleh owner:
//   .jpm Halo semua -gc 1,3,5-8      -> kirim hanya ke grup nomor 1,3,5,6,7,8
//   .jpm Halo semua -gc nama:promo   -> kirim ke grup yang namanya mengandung "promo"
//   .jpm Halo semua -gc ?            -> tampilkan daftar grup bernomor (tidak kirim apa-apa)
//   .jpm Halo semua -gc all          -> paksa ke semua grup (abaikan pilihan tersimpan)
//   .pilihgc 1,3,5-8                 -> simpan pilihan, dipakai otomatis oleh semua jpm/swgc berikutnya
//   .pilihgc reset                   -> hapus pilihan tersimpan (kembali ke semua grup)
//
// Nomor = urutan abjad nama grup (sama persis dengan yang tampil di .pilihgc).
'use strict'

const jstore = require('./jstore')
const store = () => jstore.open('gcselect', { saved: {} })

const FLAG_RE = /(?:^|\s)-gc(?:=|\s+)("[^"]*"|\S+)/i

// ambil "-gc <spec>" dari teks; kembalikan teks bersih + spec
function extract(text) {
  const raw = String(text || '')
  const mt = raw.match(FLAG_RE)
  if (!mt) return { text: raw, spec: null }
  const spec = mt[1].replace(/^"|"$/g, '').trim()
  const cleaned = (raw.slice(0, mt.index) + ' ' + raw.slice(mt.index + mt[0].length)).replace(/[ \t]+\n/g, '\n').trim()
  return { text: cleaned, spec }
}

// urutan tetap: abjad nama grup, lalu id
function sortedList(groups) {
  const arr = Array.isArray(groups) ? groups : Object.values(groups || {})
  return arr
    .filter((g) => g && g.id)
    .map((g) => ({ id: g.id, name: String(g.subject || 'Tanpa nama'), size: (g.participants && g.participants.length) || g.size || 0 }))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()) || a.id.localeCompare(b.id))
}

function parseNumbers(spec, max) {
  const out = new Set()
  for (const part of spec.split(/[,\s]+/).filter(Boolean)) {
    const r = part.match(/^(\d+)-(\d+)$/)
    if (r) {
      let a = +r[1], b = +r[2]
      if (a > b) [a, b] = [b, a]
      for (let i = a; i <= b; i++) out.add(i)
    } else if (/^\d+$/.test(part)) out.add(+part)
    else return null
  }
  const bad = [...out].filter((n) => n < 1 || n > max)
  if (bad.length) return { bad }
  return { nums: [...out].sort((a, b) => a - b) }
}

// spec -> { ids:[...] } | { all:true } | { error:'...' }
function resolve(groups, spec) {
  const list = sortedList(groups)
  const s = String(spec || '').trim()
  if (!s || /^(all|semua)$/i.test(s)) return { all: true, list }
  const nm = s.match(/^(?:nama|name|cari):(.+)$/i)
  if (nm) {
    const q = nm[1].trim().toLowerCase()
    const ids = list.filter((g) => g.name.toLowerCase().includes(q)).map((g) => g.id)
    return ids.length ? { ids, list } : { error: `Tidak ada grup yang namanya mengandung "${nm[1].trim()}".`, list }
  }
  const jids = s.split(/[,\s]+/).filter((x) => /@g\.us$/.test(x))
  if (jids.length) {
    const ids = jids.filter((j) => list.some((g) => g.id === j))
    return ids.length ? { ids, list } : { error: 'JID grup tidak ditemukan di daftar grup bot.', list }
  }
  const p = parseNumbers(s, list.length)
  if (!p) return { error: 'Format -gc salah. Contoh: -gc 1,3,5-8  atau  -gc nama:promo  atau  -gc ?', list }
  if (p.bad) return { error: `Nomor di luar daftar: ${p.bad.join(', ')} (jumlah grup: ${list.length}).`, list }
  return { ids: p.nums.map((n) => list[n - 1].id), list }
}

function formatList(list, selectedIds, limit = 120) {
  const sel = new Set(selectedIds || [])
  const rows = list.slice(0, limit).map((g, i) => `${sel.has(g.id) ? '✅' : '▫️'} ${i + 1}. ${g.name}${g.size ? ` (${g.size})` : ''}`)
  if (list.length > limit) rows.push(`…dan ${list.length - limit} grup lagi (pakai -gc nama:kata untuk mencari)`)
  return rows.join('\n')
}

const keyOf = (sender) => String(sender || 'owner').split('@')[0].split(':')[0]
const getSaved = (sender) => store().data.saved[keyOf(sender)] || null
function setSaved(sender, ids) {
  const st = store()
  if (!ids || !ids.length) delete st.data.saved[keyOf(sender)]
  else st.data.saved[keyOf(sender)] = ids
  st.save()
}

// Terapkan ke objek groups {id: meta}. Kembalikan objek baru (terfilter) atau null bila sudah dibalas error/daftar.
//   o = { sender, spec, reply(text) }
async function apply(groups, o) {
  const spec = o.spec
  if (spec && /^(\?|list|daftar)$/i.test(spec)) {
    const list = sortedList(groups)
    await o.reply(`📋 *Daftar grup (${list.length})*\n\n${formatList(list, getSaved(o.sender))}\n\nPakai: -gc 1,3,5-8  |  -gc nama:kata  |  simpan permanen: .pilihgc 1,3,5-8`)
    return null
  }
  let ids = null
  if (spec) {
    const r = resolve(groups, spec)
    if (r.error) { await o.reply(`❌ ${r.error}`); return null }
    ids = r.all ? null : r.ids
  } else {
    const saved = getSaved(o.sender)
    if (saved && saved.length) {
      const present = saved.filter((id) => (Array.isArray(groups) ? groups.some((g) => g.id === id) : groups[id]))
      if (present.length) ids = present
    }
  }
  if (!ids) return groups
  const set = new Set(ids)
  if (Array.isArray(groups)) return groups.filter((g) => set.has(g.id))
  const out = {}
  for (const id of Object.keys(groups)) if (set.has(id)) out[id] = groups[id]
  return out
}

// ---- untuk plugin gaya m (handler(m,{sock})): panggil parseM(m) di awal handler, pickM(m, groups) setelah daftar grup didapat
function parseM(m) {
  const { text, spec } = extract(m.fullArgs != null && m.fullArgs !== '' ? m.fullArgs : m.text)
  m._gcspec = spec
  if (spec !== null || FLAG_RE.test(String(m.text || ''))) {
    m.text = extract(m.text).text
    m.fullArgs = text
    if (Array.isArray(m.args)) m.args = m.text ? m.text.split(/\s+/).filter(Boolean) : []
  }
  return m
}
const pickM = (m, groups) => apply(groups, { sender: m.sender, spec: m._gcspec, reply: (t) => m.reply(t) })

// ---- untuk plugin gaya native (run({sock,msg,text,reply})): kembalikan { text, groups|null }
async function pickText(text, groups, sender, reply) {
  const { text: clean, spec } = extract(text)
  const g = await apply(groups, { sender, spec, reply })
  return { text: clean, groups: g }
}

module.exports = { extract, sortedList, resolve, formatList, getSaved, setSaved, apply, parseM, pickM, pickText }
