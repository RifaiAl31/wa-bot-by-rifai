// =====================================================================
//  lib/uimode.js — pilihan TAMPILAN bot (tersimpan, bisa diganti lewat chat tanpa restart)
//
//    rich : UI kartu RICH HTML asli (richResponseMessage) — menu interaktif & semua balasan jadi kartu HTML.
//           Tampil otomatis (auto-render / auto-download, tanpa tombol "Unduh"), BUKAN gambar.
//    text : balasan teks biasa (menu & tombol memakai pengirim bawaan)
//
//  Nilai awal dari settings.js (global.uiMode, bawaan 'rich'). Setelah owner memakai `.uimode`,
//  pilihannya tersimpan di database/uimode.json dan menang atas settings.js.
// =====================================================================
'use strict'

const { createStore } = require('./store')

const store = createStore('uimode', { mode: '' })

const ALIAS = {
  text: 'text', biasa: 'text', asli: 'text', classic: 'text', lama: 'text', polos: 'text', vanxone: 'text',
  rich: 'rich', ui: 'rich', html: 'rich', baru: 'rich', kartu: 'rich', card: 'rich'
}
const normalize = (v) => ALIAS[String(v || '').trim().toLowerCase()] || ''

// urutan prioritas: pilihan lewat .uimode (database) -> settings.js -> 'rich'
const get = () => normalize(store.data.mode) || normalize(global.uiMode) || 'rich'
const isRich = () => get() === 'rich'
// Rich HTML ASLI dipakai kapan pun mode = rich. Kartu GAMBAR tidak dipakai lagi.
// (global.richNative = false di settings.js hanya untuk mematikan paksa rich HTML tanpa mengubah mode.)
const isNative = () => isRich() && global.richNative !== false

function set(v) {
  const m = normalize(v)
  if (!m) return null
  store.data.mode = m
  store.flush()
  return m
}

module.exports = { get, set, isRich, isNative, normalize }
