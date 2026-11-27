// lib/badge.js — pengaturan Badge Realtime (stiker badge dikirim sebagai reaction ke tiap pesan masuk)
// Data: enabled, list [{ b64, isAnimated, n }], count (jumlah bawaan untuk stiker yang belum punya jumlah sendiri)
// Tidak ada batas jumlah stiker maupun jumlah kirim; tiap stiker punya jumlah sendiri (n).
'use strict'
const st = require('./jstore').open('badge', { enabled: false, list: [], count: 1, buffer: '', isAnimated: false, updatedAt: 0 })

// migrasi data lama (satu stiker di `buffer`)
if (!Array.isArray(st.data.list)) st.data.list = []
if (st.data.buffer && !st.data.list.length) st.data.list.push({ b64: st.data.buffer, isAnimated: !!st.data.isAnimated })
if (!st.data.count || st.data.count < 1) st.data.count = 1

// jumlah efektif sebuah stiker: miliknya sendiri, atau bawaan global
st.countOf = (item) => {
  const n = Math.floor(Number(item && item.n))
  return n >= 1 ? n : Math.max(1, Math.floor(Number(st.data.count)) || 1)
}
st.total = () => st.data.list.reduce((a, it) => a + st.countOf(it), 0)

// angka positif bulat tanpa batas atas (null kalau tidak valid)
st.parseN = (raw) => {
  const s = String(raw ?? '').trim()
  if (!/^\d+$/.test(s)) return null
  const n = parseInt(s, 10)
  return n >= 1 && Number.isSafeInteger(n) ? n : null
}
module.exports = st
