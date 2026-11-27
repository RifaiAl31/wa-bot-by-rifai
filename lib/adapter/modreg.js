// Registri modul fitur gabungan: tiap file plugins/**.js mendaftarkan kodenya (thunk) di sini,
// adapter memuatnya lazy saat pertama dipakai (dependensi berat tidak dimuat saat bot start).
'use strict'
const mods = new Map() // `${pack}:${rel}` -> { thunk, p }
const key = (pack, rel) => `${pack}:${rel}`

function register(pack, rel, thunk) {
  if (typeof thunk === 'function') mods.set(key(pack, rel), { thunk, p: null })
}
function get(pack, rel) {
  const e = mods.get(key(pack, rel))
  if (!e) return Promise.reject(new Error(`modul fitur "${rel}" tidak terdaftar`))
  if (!e.p) {
    e.p = Promise.resolve().then(() => e.thunk()).catch((err) => { e.p = null; throw err })
  }
  return e.p
}
// modul tanpa perintah (hanya dipakai hook): kembalikan plugin hook kosong supaya loader bot mau menerimanya
function moduleOnly(pack, rel, thunk) {
  register(pack, rel, thunk)
  return { hook: true, name: 'mod:' + rel, init() {} }
}
const _keys = () => [...mods.keys()].map((k) => { const i = k.indexOf(':'); return [k.slice(0, i), k.slice(i + 1)] })
module.exports = { register, get, moduleOnly, _keys }
