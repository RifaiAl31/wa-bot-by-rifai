// Jawaban wizard .analisis-catatan / .catatan pengumuman (teks & foto tanpa prefix),
// dan alihkan .catatan <sub> yang bertabrakan dengan plugin image/katabgwindah.js.
'use strict'
const noteFlow = require('../../lib/noteFlow')
const catatanPlugin = require('../tools/catatan')

const SUBS = new Set(['list', 'detail', 'hapus', 'cari', 'search', 'pengumuman', 'help'])

module.exports = {
  name: 'analisis-catatan-hook',
  hook: true,
  passive: async (ctx) => {
    if (await noteFlow.passive(ctx)) return true
    const body = String(ctx.body || '').trim()
    const prefix = String(global.__prefix || ctx.prefix || '.')
    if (!prefix || !body.startsWith(prefix)) return false
    const parts = body.slice(prefix.length).trim().split(/\s+/)
    if ((parts[0] || '').toLowerCase() !== 'catatan') return false
    if (!SUBS.has((parts[1] || '').toLowerCase())) return false // .catatan biasa milik plugin lama
    noteFlow.clearSession(ctx)
    await catatanPlugin.handle(ctx)
    return true
  },
}
