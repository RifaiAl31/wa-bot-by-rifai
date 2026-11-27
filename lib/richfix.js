// =====================================================================
//  lib/richfix.js — pesan RICH (kartu HTML / AI rich) langsung TAMPIL tanpa tombol "Unduh"
//
//  Penyebab "harus pencet unduh": WhatsApp menahan pesan richResponseMessage yang baru diterima sampai
//  penerima menekan Unduh. Library rich asli (AIRich, lib/ext/lib/wraper-send/rich-send.js) mengakali ini
//  dengan "bypassDownload": setelah pesan terkirim, pesan yang SAMA langsung di-EDIT sendiri
//  (protocolMessage type 14 di dalam botForwardedMessage) sehingga klien menganggapnya sudah terunduh.
//
//  Modul ini memasang langkah itu SATU KALI di sock.relayMessage, jadi berlaku untuk SEMUA pengirim rich:
//  kartu UI (lib/richui.js), game HTML (plugins/game/*), fitur engine (AIRich / MessageBuilder, dll).
//
//  Matikan (tidak disarankan): global.richAutoRender = false
// =====================================================================
'use strict'

const crypto = require('crypto')

let baileys = null
try { baileys = require('@whiskeysockets/baileys') } catch {}

// ID pesan gaya WhatsApp (3EB0....). Cadangan kalau Baileys versi lama tidak punya generateMessageIDV2.
function newId(sock) {
  try {
    if (baileys && typeof baileys.generateMessageIDV2 === 'function') return baileys.generateMessageIDV2(sock?.user?.id)
    if (baileys && typeof baileys.generateMessageID === 'function') return baileys.generateMessageID()
  } catch {}
  return '3EB0' + crypto.randomBytes(14).toString('hex').toUpperCase()
}

// JSON dengan karakter non-ASCII di-escape (\uXXXX): aman dibaca parser klien WhatsApp
const stringifyEscaped = (obj) => JSON.stringify(obj).replace(/[\u007f-￿]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))

// metadata verifikasi seperti pada pesan rich asli (isi acak: hanya penanda bentuk, tidak divalidasi server)
function verificationMetadata() {
  const blob = (tag, size) => Buffer.concat([Buffer.from(tag), crypto.randomBytes(Math.max(0, size - tag.length))]).toString('base64')
  return {
    proofs: [{
      version: 1,
      useCase: 1,
      signature: blob('WhatsApp Bot.RichSignature', 64),
      certificateChain: [blob('WhatsApp Bot.RichCertificate', 684), blob('WhatsApp Bot.RichCertificate', 892)]
    }]
  }
}

// pesan rich yang membawa data respons? -> kembalikan richResponseMessage-nya
function richOf(message) {
  const r = message && message.botForwardedMessage && message.botForwardedMessage.message && message.botForwardedMessage.message.richResponseMessage
  if (!r || !r.unifiedResponse) return null
  const d = r.unifiedResponse.data
  return d && d.length ? r : null
}

// pesan edit (protocolMessage type 14 di dalam botForwardedMessage)? -> id pesan yang diedit
function editTargetOf(message) {
  const p = message && message.botForwardedMessage && message.botForwardedMessage.message && message.botForwardedMessage.message.protocolMessage
  return p && p.key ? p.key.id : null
}

function buildEdit(jid, id, message) {
  return {
    botForwardedMessage: {
      message: {
        protocolMessage: { key: { remoteJid: jid, fromMe: true, id }, type: 14, editedMessage: message }
      }
    }
  }
}

const enabled = () => global.richAutoRender !== false

function install(sock) {
  if (!sock || sock.__richfix || typeof sock.relayMessage !== 'function') return sock
  sock.__richfix = true
  const orig = sock.relayMessage.bind(sock)
  const pending = new Map() // id pesan rich -> timer edit otomatis

  sock.relayMessage = async function relayMessage(jid, message, opts = {}) {
    // pengirim yang sudah mengedit sendiri (AIRich / MessageBuilder): batalkan edit otomatis agar tidak dobel
    const target = editTargetOf(message)
    if (target && pending.has(target)) {
      clearTimeout(pending.get(target))
      pending.delete(target)
    }

    const res = await orig(jid, message, opts)

    try {
      if (enabled() && !opts.__noBypass && richOf(message)) {
        const id = (opts && opts.messageId) || (typeof res === 'string' ? res : null)
        if (id && !pending.has(id)) {
          // tunggu sebentar: kalau pengirim mengedit sendiri, edit otomatis dibatalkan di atas
          const t = setTimeout(() => {
            pending.delete(id)
            orig(jid, buildEdit(jid, id, message), { messageId: newId(sock), __noBypass: true }).catch((err) => console.log('[RICHFIX] edit bypass gagal:', err.message))
          }, 250)
          if (t.unref) t.unref()
          pending.set(id, t)
          if (pending.size > 200) pending.delete(pending.keys().next().value)
        }
      }
    } catch (err) {
      console.log('[RICHFIX]', err.message)
    }
    return res
  }
  return sock
}

module.exports = { install, newId, stringifyEscaped, verificationMetadata, buildEdit, richOf }
