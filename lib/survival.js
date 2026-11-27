// lib/survival.js — mode "bertahan hidup": semua fitur memakai sumber daya (energi, saldo, limit) dan tubuh user
// punya kebutuhan (lapar, haus, HP). Dipasang sebagai satu pintu di bot.js sebelum plugin.run -> berlaku ke SEMUA fitur.
//
// Pengaturan opsional di settings.js:
//   global.survival = { enabled: true, costs: { ai: { e: 2, c: 500, l: 1 } }, free: ['cmd1'] }
// Owner bisa mematikan/menyalakan lewat  .setsurvival on|off
'use strict'
const fs = require('fs')
const path = require('path')
const { getUser, save } = require('./db')

const FILE = path.join(__dirname, '..', 'database', 'survival.json')
let conf = { enabled: true }
try { conf = Object.assign(conf, JSON.parse(fs.readFileSync(FILE, 'utf8'))) } catch {}
const saveConf = () => { try { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(conf)) } catch {} }

const cfg = () => Object.assign({ costs: {}, free: [] }, global.survival || {})
const enabled = () => conf.enabled !== false && (global.survival ? global.survival.enabled !== false : true)
const setEnabled = (v) => { conf.enabled = !!v; saveConf() }

// ---- biaya per kategori: e = energi, c = koin, l = limit (e/c/l boleh 0) ----
const COST = {
  ai: { e: 3, c: 500, l: 1 }, downloader: { e: 2, c: 300, l: 1 }, maker: { e: 2, c: 300, l: 1 }, image: { e: 2, c: 300, l: 1 },
  video: { e: 2, c: 300, l: 1 }, audio: { e: 2, c: 200, l: 1 }, music: { e: 2, c: 200, l: 1 },
  sticker: { e: 1, c: 100, l: 0 }, game: { e: 2, c: 150, l: 0 }, rpg: { e: 2, c: 150, l: 0 }, search: { e: 1, c: 100, l: 0 },
  internet: { e: 1, c: 100, l: 0 }, stalker: { e: 2, c: 300, l: 1 }, fun: { e: 1, c: 50, l: 0 }, tools: { e: 1, c: 50, l: 0 },
  anime: { e: 1, c: 100, l: 0 }, dokumen: { e: 1, c: 100, l: 0 }
}
// kategori yang selalu gratis (informasi penting, administrasi, toko, pengaturan)
const FREE_CAT = new Set(['main', 'info', 'owner', 'system', 'profil', 'store', 'group', 'islam', 'islamic', 'quotes', 'channel', 'broadcast', 'misc', 'relationship', 'economy', 'primbon', 'cek'])
// perintah penyelamat: harus selalu bisa dipakai supaya user tidak terjebak (mati kelaparan tanpa bisa makan)
const ESSENTIAL = new Set(['menu', 'help', 'allmenu', 'ping', 'daftar', 'unreg', 'hidup', 'vital', 'status', 'makan', 'minum', 'tidurlelap', 'rs', 'obat', 'warung', 'tasku', 'daily', 'harian', 'saldo', 'bal', 'balance', 'limit', 'energi', 'beg', 'bansos', 'kerja', 'work', 'claimowner', 'buylimit', 'buyenergi'])

const MAX = 100
const clamp = (n, lo = 0, hi = MAX) => Math.max(lo, Math.min(hi, n))
const now = () => Date.now()

// ---- barang di warung ----
const ITEMS = {
  air:     { nama: 'Air Putih',    harga: 500,   haus: 30 },
  teh:     { nama: 'Teh Manis',    harga: 1500,  haus: 25, energi: 5 },
  kopi:    { nama: 'Kopi',         harga: 2500,  haus: 15, energi: 25 },
  roti:    { nama: 'Roti',         harga: 1500,  lapar: 20 },
  nasi:    { nama: 'Nasi Bungkus', harga: 3500,  lapar: 40, haus: -5 },
  mie:     { nama: 'Mie Instan',   harga: 3000,  lapar: 30, haus: -8 },
  ayam:    { nama: 'Ayam Geprek',  harga: 9000,  lapar: 60, haus: -10, energi: 10 },
  vitamin: { nama: 'Vitamin',      harga: 6000,  energi: 30 },
  obat:    { nama: 'Obat',         harga: 8000,  hp: 40 },
  p3k:     { nama: 'Kotak P3K',    harga: 20000, hp: 100 }
}

// ---- keadaan tubuh: dihitung malas (lazy) dari selisih waktu, tanpa timer ----
function body(u) {
  if (!u.vt) u.vt = { hp: 100, energi: 100, lapar: 100, haus: 100, t: now(), down: 0 }
  if (!u.inv) u.inv = {}
  const v = u.vt
  const mins = Math.max(0, (now() - v.t) / 60000)
  if (mins >= 0.5) {
    v.lapar = clamp(v.lapar - mins / 8)
    v.haus = clamp(v.haus - mins / 6)
    const fine = v.lapar > 20 && v.haus > 20
    if (fine) v.energi = clamp(v.energi + mins / 3)
    if (v.lapar <= 0 || v.haus <= 0) v.hp = clamp(v.hp - mins / 3)
    else if (v.lapar > 60 && v.haus > 60) v.hp = clamp(v.hp + mins / 4)
    v.t = now()
    if (v.hp <= 0 && !v.down) v.down = now() // pingsan
  }
  // pingsan otomatis pulih setelah 20 menit dengan HP 30
  if (v.down && now() - v.down > 20 * 60000) { v.down = 0; v.hp = 30; v.lapar = Math.max(v.lapar, 30); v.haus = Math.max(v.haus, 30) }
  return v
}

const bar = (n) => { const k = Math.round(clamp(n) / 10); return '[' + '#'.repeat(k) + '-'.repeat(10 - k) + '] ' + Math.round(clamp(n)) + '%' }

function costOf(plugin, command) {
  const c = cfg()
  const cat = String(plugin.category || '').toLowerCase()
  const name = String(command).toLowerCase()
  if (ESSENTIAL.has(name) || c.free.includes(name)) return null
  if (plugin.owner) return null
  const own = (c.costs || {})[cat] || COST[cat]
  if (!own || FREE_CAT.has(cat) && !(c.costs || {})[cat]) return null
  return own
}

// Dipanggil sebelum plugin.run. -> { block: 'pesan' } kalau ditolak, atau { refund() } kalau lolos (atau {} kalau gratis).
function charge({ sender, plugin, command, isOwner }) {
  if (!enabled() || isOwner) return {}
  const u = getUser(sender)
  const v = body(u)
  const name = String(command).toLowerCase()
  const p = global.prefix || '.'
  if (v.down && !ESSENTIAL.has(name) && !(plugin.owner)) {
    const sisa = Math.max(1, Math.ceil((20 * 60000 - (now() - v.down)) / 60000))
    save()
    return { block: `Kamu pingsan (HP habis karena kelaparan/kehausan).\nBangun sendiri sekitar ${sisa} menit lagi, atau bayar rumah sakit: ${p}rs (Rp5.000).` }
  }
  const k = costOf(plugin, command)
  if (!k) return {}
  const e = k.e || 0, c = k.c || 0, useLimit = k.l || 0
  const lacks = []
  if (v.energi < e) lacks.push(`Energi kurang (butuh ${e}, sisa ${Math.floor(v.energi)}). Istirahat ${p}tidurlelap, atau makan/minum ${p}warung.`)
  if ((u.money || 0) < c) lacks.push(`Saldo kurang (butuh ${c}, sisa ${u.money || 0}). Cari uang: ${p}kerja, ${p}daily, ${p}beg.`)
  if (useLimit && (u.limit || 0) < useLimit) lacks.push(`Limit habis (butuh ${useLimit}, sisa ${u.limit || 0}). Beli: ${p}buylimit.`)
  if (lacks.length) { save(); return { block: lacks.join('\n') } }
  v.energi -= e; u.money -= c; if (useLimit) u.limit -= useLimit
  save()
  return {
    spent: { e, c, l: useLimit },
    refund() { try { const x = getUser(sender); body(x); x.vt.energi = clamp(x.vt.energi + e); x.money += c; x.limit += useLimit; save() } catch {} }
  }
}

function status(jid) {
  const u = getUser(jid); const v = body(u); save()
  return { u, v }
}

function eat(jid, key, qty = 1) {
  const it = ITEMS[key]; const u = getUser(jid); const v = body(u)
  if ((u.inv[key] || 0) < qty) return { ok: false }
  u.inv[key] -= qty; if (u.inv[key] <= 0) delete u.inv[key]
  for (let i = 0; i < qty; i++) {
    v.lapar = clamp(v.lapar + (it.lapar || 0)); v.haus = clamp(v.haus + (it.haus || 0))
    v.energi = clamp(v.energi + (it.energi || 0)); v.hp = clamp(v.hp + (it.hp || 0))
  }
  if (v.hp > 0) v.down = 0
  save()
  return { ok: true, v }
}

function buy(jid, key, qty = 1) {
  const it = ITEMS[key]; const u = getUser(jid); body(u)
  const total = it.harga * qty
  if ((u.money || 0) < total) return { ok: false, total }
  u.money -= total; u.inv[key] = (u.inv[key] || 0) + qty
  save()
  return { ok: true, total }
}

function sleep(jid) {
  const u = getUser(jid); const v = body(u)
  const last = u.lastSleep || 0
  if (now() - last < 30 * 60000) return { ok: false, wait: Math.ceil((30 * 60000 - (now() - last)) / 60000) }
  if (v.lapar < 15 || v.haus < 15) return { ok: false, hungry: true }
  u.lastSleep = now()
  const gain = Math.min(60, 100 - v.energi)
  v.energi = clamp(v.energi + 60); v.lapar = clamp(v.lapar - 12); v.haus = clamp(v.haus - 12); v.hp = clamp(v.hp + 10)
  save()
  return { ok: true, gain, v }
}

function hospital(jid) {
  const u = getUser(jid); const v = body(u)
  if (!v.down && v.hp >= 50) return { ok: false, notNeeded: true }
  if ((u.money || 0) < 5000) return { ok: false, poor: true }
  u.money -= 5000; v.down = 0; v.hp = 60; v.lapar = Math.max(v.lapar, 40); v.haus = Math.max(v.haus, 40); v.energi = Math.max(v.energi, 30)
  save()
  return { ok: true, v }
}

function freeMeal(jid) {
  const u = getUser(jid); const v = body(u)
  if (now() - (u.freeMeal || 0) < 6 * 3600000) return { ok: false, wait: Math.ceil((6 * 3600000 - (now() - (u.freeMeal || 0))) / 60000) }
  u.freeMeal = now(); v.lapar = clamp(v.lapar + 25); v.haus = clamp(v.haus + 25); v.down = v.hp > 0 ? 0 : v.down
  save()
  return { ok: true, v }
}

module.exports = { charge, status, eat, buy, sleep, hospital, freeMeal, ITEMS, COST, bar, enabled, setEnabled, body }
