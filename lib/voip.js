// lib/voip.js — mesin panggilan suara (VoipClient) untuk .playcall. Opsional: dipakai kalau paket Baileys yang terpasang
// menyediakannya (mis. fork @itsliaaa/baileys). Kalau tidak ada, .playcall otomatis memutar lagu sebagai audio biasa.
'use strict'

const CANDIDATES = ['@itsliaaa/baileys', 'baileys-caller', 'baileys', '@whiskeysockets/baileys']

function findClass() {
  for (const name of CANDIDATES) {
    try {
      const mod = require(name)
      const C = mod.VoipClient || (mod.default && mod.default.VoipClient)
      if (typeof C === 'function') return { C, name }
    } catch {}
  }
  return null
}

async function init(sock) {
  if (global.voipSock === sock) return !!global.voipClient
  const hit = findClass()
  if (!hit) {
    global.voipClient = null
    return false
  }
  try {
    try { await global.voipClient?.disconnect?.() } catch {}
    const c = new hit.C()
    if (typeof c.connectWithSocket !== 'function') throw new Error('VoipClient tanpa connectWithSocket')
    await c.connectWithSocket(sock)
    global.voipClient = c
    global.voipSock = sock
    console.log(`[VOIP] mesin panggilan aktif (${hit.name})`)
    return true
  } catch (err) {
    global.voipClient = null
    console.log('[VOIP] gagal mengaktifkan mesin panggilan:', err.message)
    return false
  }
}

module.exports = { init, findClass }
