// lib/menuflow.js — alur menu: animasi loading (edit pesan) -> menu asli -> audio.
// Semua diatur dari settings.js: menuLoading, menuWithAudio, menuAudio, menuAudioPtt, menuCommands, menuFlowMainOnly.
'use strict'
const fs = require('fs')
const path = require('path')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const ROOT = path.join(__dirname, '..')

function isMenuCommand(command) {
  const list = Array.isArray(global.menuCommands) && global.menuCommands.length
    ? global.menuCommands
    : ['menu', 'help', 'allmenu']
  return list.map((c) => String(c).toLowerCase()).includes(String(command || '').toLowerCase())
}

// Animasi: "Loading ." -> "Loading .." -> "Loading ..." -> "Loading Complete ✓" (jeda 0,5 detik, pakai edit pesan)
async function loadingAnimation(sock, from, msg) {
  const delay = Number(global.menuLoadingDelay) > 0 ? Number(global.menuLoadingDelay) : 500
  const frames = ['Loading ..', 'Loading ...', 'Loading Complete ✓']
  let sent
  try {
    sent = await sock.sendMessage(from, { text: 'Loading .' }, { quoted: msg })
  } catch (err) {
    console.log('[MENU] gagal kirim loading:', err.message)
    return
  }
  const key = sent && sent.key
  if (!key) return
  for (const text of frames) {
    await sleep(delay)
    try {
      await sock.sendMessage(from, { text, edit: key })
    } catch (err) {
      console.log('[MENU] gagal edit loading:', err.message)
      return
    }
  }
}

// Sumber audio: path lokal (relatif ke folder bot) atau URL. Kalau file lokal tidak ada, pakai global.music (URL) sebagai cadangan.
function resolveAudio() {
  const candidates = [global.menuAudio, global.music].filter((x) => typeof x === 'string' && x.trim())
  for (const c of candidates) {
    const src = c.trim()
    if (/^https?:\/\//i.test(src)) return { url: src }
    const p = path.isAbsolute(src) ? src : path.join(ROOT, src)
    if (fs.existsSync(p)) return { url: p, local: p }
  }
  return null
}

async function sendMenuAudio(sock, from, msg) {
  const src = resolveAudio()
  if (!src) {
    console.log('[MENU] audio dilewati: global.menuAudio / global.music kosong atau file tidak ditemukan')
    return
  }
  const content = {
    audio: src.local ? fs.readFileSync(src.local) : { url: src.url },
    mimetype: 'audio/mpeg',
    ptt: global.menuAudioPtt === true
  }
  try {
    await sock.sendMessage(from, content, { quoted: msg })
  } catch (err) {
    console.log('[MENU] gagal kirim audio:', err.message)
  }
}

// Dipanggil dari bot.js: run = () => plugin.run(ctx)
async function wrap(ctx, command, run) {
  const { sock, from, msg } = ctx
  const hasArgs = !!String(ctx.text || '').trim()
  const applicable = isMenuCommand(command) && !(global.menuFlowMainOnly !== false && hasArgs)
  if (!applicable) return run()

  if (global.menuLoading !== false) await loadingAnimation(sock, from, msg)
  const result = await run()
  if (global.menuWithAudio === true) await sendMenuAudio(sock, from, msg)
  return result
}

module.exports = { wrap, isMenuCommand, loadingAnimation, sendMenuAudio, resolveAudio }
