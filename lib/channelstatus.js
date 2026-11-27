// lib/channelstatus.js — Status Saluran (Channel Status) WhatsApp.
// Sistemnya mengikuti swgc (status grup): teks berwarna, gambar, video, audio (voice note).
// Pengiriman memakai API status saluran milik Baileys (sendNewsletterStatus). Kalau Baileys yang terpasang belum punya
// API itu, hasilnya DIKATAKAN apa adanya: bisa dikirim sebagai post biasa (hanya bila diminta), tidak pura-pura jadi status.
'use strict'
const { PassThrough } = require('stream')
const ch = require('./channels')

const COLORS = { biru: '#34B7F1', hijau: '#25D366', kuning: '#FFD700', jingga: '#FF8C00', merah: '#FF3B30', ungu: '#9C27B0', abu: '#9E9E9E', cyan: '#00BCD4' }
const colorNames = () => Object.keys(COLORS)
const pickColor = (name) => (name && COLORS[String(name).toLowerCase()]) || Object.values(COLORS)[Math.floor(Math.random() * Object.keys(COLORS).length)]

function capabilities(sock) {
  return {
    status: typeof sock.sendNewsletterStatus === 'function',
    canPost: typeof sock.newsletterCanPostStatus === 'function',
    list: typeof sock.getNewsletterStatuses === 'function',
    metadata: typeof sock.newsletterMetadata === 'function',
    plain: typeof sock.sendMessage === 'function'
  }
}

async function toVN(buffer) {
  const ffmpeg = require('fluent-ffmpeg')
  return new Promise((resolve, reject) => {
    const input = new PassThrough()
    const output = new PassThrough()
    const chunks = []
    input.end(buffer)
    ffmpeg(input).noVideo().audioCodec('libopus').format('ogg').on('error', reject).on('end', () => resolve(Buffer.concat(chunks))).pipe(output)
    output.on('data', (c) => chunks.push(c))
  })
}

// cek izin lebih dulu bila Baileys menyediakan; hasil null = tidak bisa dicek (coba kirim saja)
async function check(sock, jid) {
  if (typeof sock.newsletterCanPostStatus !== 'function') return null
  try { return await sock.newsletterCanPostStatus(jid) } catch (e) { return { error: e.message || String(e) } }
}

// kind: 'text' | 'image' | 'video' | 'audio'
// opts: { text, caption, buffer, color, allowPlain }
async function post(sock, jid, kind, opts = {}) {
  const cap = capabilities(sock)
  if (!cap.status) {
    if (!opts.allowPlain) {
      const e = new ch.ChannelError('Baileys yang terpasang belum punya sendNewsletterStatus, jadi status saluran belum bisa dikirim. Update paket baileys (npm i @whiskeysockets/baileys@npm:@itsliaaa/baileys@latest) lalu restart bot.\nKalau mau tetap kirim sebagai post biasa di saluran, tambahkan kata "post" di awal: .swch post <teks>')
      e.noApi = true
      throw e
    }
    const content = kind === 'text' ? { text: opts.text } : kind === 'image' ? { image: opts.buffer, caption: opts.caption || '' } : kind === 'video' ? { video: opts.buffer, caption: opts.caption || '' } : { audio: opts.buffer, mimetype: 'audio/ogg; codecs=opus', ptt: true }
    const res = await sock.sendMessage(jid, content)
    return { mode: 'post', id: res?.key?.id || null }
  }

  const perm = await check(sock, jid)
  if (perm && perm.canPost === false) {
    throw new ch.ChannelError(`Saluran ini belum punya izin Status Saluran.\nCapabilities: ${JSON.stringify(perm.capabilities || {})}\nBiasanya: bot bukan admin saluran, atau fitur belum dibuka WhatsApp untuk saluran/akun ini.`)
  }

  let payload
  if (kind === 'text') payload = { text: opts.text }
  else if (kind === 'image') payload = { image: opts.buffer, caption: opts.caption || '' }
  else if (kind === 'video') payload = { video: opts.buffer, caption: opts.caption || '' }
  else payload = { audio: opts.buffer }

  let res
  if (kind === 'text' && opts.color) {
    try { res = await sock.sendNewsletterStatus(jid, { ...payload, backgroundColor: opts.color }) }
    catch (e) {
      if (/not-authorized|forbidden|\b40[13]\b|unauthorized/i.test(String(e && e.message))) throw e
      res = await sock.sendNewsletterStatus(jid, payload) // warna tidak didukung versi ini: kirim tanpa warna
    }
  } else res = await sock.sendNewsletterStatus(jid, payload)
  return { mode: 'status', id: res?.newsletterStatusServerId || res?.serverId || res?.id || null }
}

module.exports = { COLORS, colorNames, pickColor, capabilities, toVN, check, post }
