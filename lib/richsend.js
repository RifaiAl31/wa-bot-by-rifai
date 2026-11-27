// =====================================================================
//  lib/richsend.js — satu-satunya jalur kirim pesan RICH HTML (kartu UI, menu rich, game HTML, play2 rich).
//
//  Memakai MessageBuilder (lib/MessageBuilder.js, class AIRich). AIRich.send() mengirim pesan, lalu langsung
//  meng-EDIT pesan yang sama (bypassDownload) supaya WhatsApp menampilkan kartu seketika, tanpa tombol "Unduh".
//  Kalau MessageBuilder gagal dimuat (mis. Baileys belum terpasang), dipakai jalur mentah lib/richfix.js sebagai cadangan.
// =====================================================================
'use strict'

let mod = null
// MessageBuilder.js = CommonJS -> dimuat dengan require (import() tidak selalu mengenali named export-nya)
function load() {
  if (!mod) {
    mod = Promise.resolve().then(() => {
      const m = require('./MessageBuilder.js')
      const AIRich = m.AIRich || (m.default && m.default.AIRich)
      if (!AIRich) throw new Error('AIRich tidak ditemukan di MessageBuilder.js')
      return { AIRich }
    })
    mod.catch(() => { mod = null })
  }
  return mod
}

// Kirim HTML sebagai pesan rich yang langsung tampil.
// opts: { label, botJid, quoted, bypassDownload }
async function sendHtmlAIRich(sock, jid, html, opts = {}) {
  const { AIRich } = await load()
  const label = String(opts.label || '').slice(0, 120)
  const rich = new AIRich(sock, { dynamic: true, unsupportedTypeAlert: false })
  rich.setContextInfo({
    forwardingScore: 1,
    isForwarded: true,
    forwardedAiBotMessageInfo: { botJid: opts.botJid || global.uiBotJid || '867051314767696@bot' },
    forwardOrigin: 4
  })
  rich._nodes.push({
    id: null,
    section: AIRich.newLayout('Single', { __typename: 'GenAIaeacdsnwHtmlPrimitive', payload: html, trusted_sources: [] }),
    submessage: label ? { messageType: 2, messageText: label } : null
  })
  const sendOpts = { bypassDownload: opts.bypassDownload !== false, forwarded: true }
  if (opts.quoted) sendOpts.quoted = opts.quoted
  const sent = await rich.send(jid, sendOpts)
  return { key: sent.key, message: sent.message || {} }
}

// ---- Format kartu bawaan (dipakai semua rich): richResponseMessage di dalam botForwardedMessage,
// dengan capabilityMetadata. Format ini yang langsung tampil di WhatsApp tanpa tombol Unduh.
const CAPS = [34, 58, 29, 1, 67, 60, 55, 8]
const hex = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('')
const respId = () => `${hex(8)}-${hex(4)}-4${hex(3)}-a${hex(3)}-${hex(12)}`

function buildPayload(html, label, botJid, quoted) {
  const q = quoted && quoted.key && quoted.message ? { stanzaId: quoted.key.id, participant: quoted.key.participant || quoted.sender, remoteJid: quoted.chat || quoted.key.remoteJid, quotedMessage: quoted.message } : {}
  return {
    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2, botMetadata: { capabilityMetadata: { capabilities: CAPS } } },
    botForwardedMessage: { message: { richResponseMessage: {
      messageType: 1,
      submessages: [{ messageType: 2, messageText: label }],
      unifiedResponse: { data: Buffer.from(JSON.stringify({
        response_id: respId(),
        sections: [{ view_model: { primitive: { __typename: 'GenAIaeacdsnwHtmlPrimitive', payload: html, trusted_sources: [] }, __typename: 'GenAISingleLayoutViewModel' } }]
      })).toString('base64') },
      contextInfo: { forwardingScore: 1, isForwarded: true, forwardedAiBotMessageInfo: { botJid }, forwardOrigin: 4, ...q }
    } } }
  }
}

async function sendHtml(sock, jid, html, opts = {}) {
  const label = String(opts.label || '').slice(0, 120)
  const botJid = opts.botJid || global.uiBotJid || '867051314767696@bot'
  try {
    const id = require('./richfix').newId(sock)
    await sock.relayMessage(jid, buildPayload(html, label, botJid, opts.quoted), { messageId: id })
    return { key: { remoteJid: jid, fromMe: true, id }, message: {} }
  } catch (err) {
    console.log('[RICHSEND] format kartu gagal, pakai cadangan:', err.message)
    return sendHtmlAIRich(sock, jid, html, opts)
  }
}

module.exports = { sendHtml, sendHtmlAIRich, buildPayload, load }

