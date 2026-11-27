// lib/engine/sockfill.js — method sock.* / m.* yang dipanggil fitur hasil porting tetapi tidak ada di Baileys biasa.
// Tanpa ini fitur tersebut error "sock.xxx is not a function". Semua versi di sini memakai Baileys standar.
'use strict'

const crypto = require('crypto')
let B = {}
try { B = require('@whiskeysockets/baileys') } catch {}

const newId = () => (B.generateMessageIDV2 ? B.generateMessageIDV2() : '3EB0' + crypto.randomBytes(14).toString('hex').toUpperCase())
const q = (quoted) => (quoted ? { quoted } : undefined)
const str = (v) => (v === undefined || v === null ? '' : String(v))

// tabel teks monospasi: header[] + rows[][]
function textTable(title, header, rows) {
  const all = [header, ...rows].filter((r) => Array.isArray(r) && r.length)
  const w = []
  for (const r of all) r.forEach((c, i) => (w[i] = Math.max(w[i] || 0, [...str(c)].length)))
  const line = (r) => '| ' + r.map((c, i) => str(c).padEnd(w[i])).join(' | ') + ' |'
  const sep = '|' + w.map((n) => '-'.repeat(n + 2)).join('|') + '|'
  const body = header && header.length ? [line(header), sep, ...rows.map(line)] : rows.map(line)
  return (title ? `*${title}*\n\n` : '') + '```\n' + body.join('\n') + '\n```'
}

function fill(sock) {
  if (!sock || sock.__sockfill) return sock
  sock.__sockfill = true
  const send = (jid, content, quoted, opts = {}) => sock.sendMessage(jid, content, { ...(quoted ? { quoted } : {}), ...opts })

  if (!sock.delay) sock.delay = (ms) => new Promise((r) => setTimeout(r, ms))

  // sendPreview(jid, { caption, url, title, description, jpegThumbnail }, { quoted }) -> id pesan (langsung, tanpa await)
  if (!sock.sendPreview) {
    sock.sendPreview = (jid, c = {}, o = {}) => {
      const id = newId()
      const ad = { title: c.title || '', body: c.description || c.body || '', sourceUrl: c.url || '', mediaType: 1, renderLargerThumbnail: c.previewType !== 0 }
      if (Buffer.isBuffer(c.jpegThumbnail)) ad.thumbnail = c.jpegThumbnail
      else if (/^https?:/i.test(str(c.thumbnail))) ad.thumbnailUrl = c.thumbnail
      sock.sendMessage(jid, { text: c.caption || c.text || c.url || '', contextInfo: { externalAdReply: ad } }, { ...q(o.quoted), messageId: id }).catch((e) => console.log('[sendPreview]', e.message))
      return id
    }
  }

  // sendThumb(jid, teks, thumbnail(Buffer|URL), quoted, opts)
  if (!sock.sendThumb) {
    sock.sendThumb = async (jid, text, thumb, quoted, opts = {}) => {
      const ad = { title: opts.title || global.botname || 'WhatsApp Bot', body: opts.body || '', sourceUrl: opts.url || global.saluran || '', mediaType: 1, renderLargerThumbnail: !!opts.large }
      if (Buffer.isBuffer(thumb)) ad.thumbnail = thumb
      else if (/^https?:/i.test(str(thumb))) ad.thumbnailUrl = thumb
      else ad.thumbnail = await require("../thumb.js").small(300)
      return send(jid, { text: str(text), contextInfo: { externalAdReply: ad } }, quoted)
    }
  }

  // tabel: sendTable(jid, judul, header[], rows[][], quoted, { headerText, footer })
  if (!sock.sendTable) {
    sock.sendTable = (jid, title, header, rows, quoted, o = {}) => {
      const t = [o.headerText, textTable(title, header, rows || []), o.footer].filter(Boolean).join('\n\n')
      return send(jid, { text: t }, quoted)
    }
  }
  if (!sock.sendTablehsn2) sock.sendTablehsn2 = sock.sendTable
  // sendTablehsn(jid, judul, rows[][] (baris pertama = header), quoted, { header, footer })
  if (!sock.sendTablehsn) {
    sock.sendTablehsn = (jid, title, rows = [], quoted, o = {}) => {
      const t = [o.header, textTable(title, rows[0] || [], rows.slice(1)), o.footer].filter(Boolean).join('\n\n')
      return send(jid, { text: t }, quoted)
    }
  }
  // sendCodehsn(jid, kode, bahasa, quoted, { header, footer })
  if (!sock.sendCodehsn) {
    sock.sendCodehsn = (jid, code, lang = 'javascript', quoted, o = {}) => {
      const t = [o.header, '```' + str(code) + '```', o.footer].filter(Boolean).join('\n\n')
      return send(jid, { text: t }, quoted)
    }
  }

  // undangan grup pribadi (groupInviteMessage)
  if (!sock.sendGroupV4Invite) {
    sock.sendGroupV4Invite = async (groupJid, participant, inviteCode, inviteExpiration, groupName, caption, jpegThumbnail, options = {}) => {
      const msg = B.generateWAMessageFromContent(participant, {
        groupInviteMessage: { inviteCode, inviteExpiration: Number(inviteExpiration) || Math.floor(Date.now() / 1000) + 3 * 86400, groupJid, groupName, caption: caption || '', jpegThumbnail: jpegThumbnail || undefined }
      }, { userJid: sock.user?.id, ...options })
      await sock.relayMessage(participant, msg.message, { messageId: msg.key.id })
      return msg
    }
  }

  // cari ID pengguna (pn <-> lid)
  if (!sock.findUserId) {
    sock.findUserId = async (jid) => {
      const num = str(jid).split('@')[0].split(':')[0]
      try {
        const r = await sock.onWhatsApp(num)
        const hit = Array.isArray(r) && r[0]
        if (hit && hit.exists !== false) return { jid: hit.jid, phoneNumber: hit.jid, lid: hit.lid }
      } catch {}
      return { jid: num + '@s.whatsapp.net', phoneNumber: num + '@s.whatsapp.net' }
    }
  }

  // info saluran dari link -> string JSON metadata
  if (!sock.cekIDSaluran) {
    sock.cekIDSaluran = async (input) => {
      const m = str(input).match(/channel\/([A-Za-z0-9_-]+)/)
      const code = m ? m[1] : str(input).trim()
      const meta = await sock.newsletterMetadata('invite', code)
      return JSON.stringify(meta)
    }
  }

  // simulasi event anggota grup
  if (!sock.participantsUpdate) {
    sock.participantsUpdate = async (ev) => sock.ev.emit('group-participants.update', ev)
  }

  // gagal diam-diam untuk API fork yang tidak ada: kembalikan list kosong supaya fitur menjawab rapi, bukan crash
  for (const n of ['newsletterFetchAllParticipating', 'newsletterFetchAllSubscribe']) {
    if (!sock[n]) {
      sock[n] = async () => {
        if (typeof sock.newsletterSubscribed === 'function') return sock.newsletterSubscribed()
        return {}
      }
    }
  }
  if (!sock.downloadM) sock.downloadM = (m, type = 'buffer', opts = {}) => B.downloadMediaMessage(m, type, opts)
  if (!sock.sendAlbumMessage) {
    sock.sendAlbumMessage = async (jid, medias = [], opts = {}) => {
      let last
      for (const it of medias) {
        const c = it.image ? { image: it.image, caption: it.caption } : it.video ? { video: it.video, caption: it.caption } : it
        last = await send(jid, c, opts.quoted)
        await new Promise((r) => setTimeout(r, opts.delay || 500))
      }
      return last
    }
  }
  return sock
}

// m.replyImage / m.replyDocument / m.pluginMediaReply untuk objek m hasil serialize
function fillM(m, sock, from) {
  if (!m) return m
  const to = from || m.chat || m.from
  const quoted = m.fakeObj || m.msg_obj || undefined
  if (!m.replyImage) m.replyImage = (img, caption = '', o = {}) => sock.sendMessage(to, { image: Buffer.isBuffer(img) ? img : { url: img }, caption, ...o }, { quoted: m.fakeObj || undefined })
  if (!m.replyDocument) {
    m.replyDocument = (doc, fileName = 'file', mimetype = 'application/octet-stream', o = {}) =>
      sock.sendMessage(to, { document: Buffer.isBuffer(doc) ? doc : { url: doc }, fileName, mimetype, ...(o.caption ? { caption: o.caption } : {}) }, { quoted: m.fakeObj || undefined })
  }
  if (!m.pluginMediaReply) {
    m.pluginMediaReply = async (url, caption = '') => {
      const u = str(url)
      const isVid = /\.(mp4|mkv|webm|mov)(\?|$)/i.test(u)
      return sock.sendMessage(to, isVid ? { video: { url: u }, caption } : { image: { url: u }, caption }, { quoted: m.fakeObj || undefined })
    }
  }
  void quoted
  return m
}

module.exports = { fill, fillM, textTable }
