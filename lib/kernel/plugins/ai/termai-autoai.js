// Auto AI: bot membalas obrolan biasa (tanpa command) memakai AI Termai (logic-bell)
//   .autoai on | off            → hidup/matikan di chat ini (grup: admin/owner)
//   .autoai on-all | off-all    → owner: semua chat
//   .autoai on-group | off-group | on-private | off-private → owner: default grup / chat pribadi
//   .resetaichat                → hapus riwayat ingatan AI milik kamu
// Pemicu: chat pribadi = semua pesan | grup = pesan diawali nama bot, mention bot, atau reply jawaban AI.
// Opsional di config.js: global.autoai = { name, aliases: [], persona, voice }

import axios from 'axios'
import { cfg, tJson, tImage, bard, imageEdit, minimizeImage } from '../../lib/services/termai.js'
import { pickImage, reactTo } from '../../lib/core/file.js'
import { liveDoc } from '../../lib/db/database.js'
import PERSONA from '../../lib/services/autoai-persona.js'

const { data: db, save } = liveDoc('autoai', { chats: {}, def: { group: false, private: false } })
const answerIds = new Set()
const lastUse = new Map()
const busy = new Set()
const COOLDOWN = 2500

const opt = () => global.autoai || {}
const botName = () => String(opt().name || global.namebot || 'Bot').trim()
const ownerName = () => String(global.ownername || 'Owner')
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const num = j => String(j || '').split('@')[0].split(':')[0]

const rememberAnswer = (id) => {
  if (!id) return
  answerIds.add(id)
  while (answerIds.size > 500) answerIds.delete(answerIds.values().next().value)
}

const isOn = (m) => {
  const v = db.chats?.[m.chat]
  if (typeof v === 'boolean') return v
  return !!db.def?.[m.isGroup ? 'group' : 'private']
}

const triggerNames = () => {
  const full = botName().toLowerCase()
  const first = full.split(/\s+/)[0]
  return [...new Set([full, first, ...(opt().aliases || []).map(a => String(a).toLowerCase())].filter(a => a.length >= 3))]
}

const isBotMentioned = (sock, m) => {
  const me = [sock.user?.id, sock.user?.lid].filter(Boolean).map(num)
  return (m.mentionedJid || []).some(j => me.includes(num(j)))
}

const buildCommands = (hasImage) => {
  const name = botName()
  const cmds = [
    { description: 'Jika perlu direspon dengan suara', output: { cmd: 'voice', msg: `Pesan di sini. Gunakan gaya bicara ${name} yang menarik dan realistis, lengkap dengan tanda baca yang tepat agar terdengar hidup saat diucapkan.` } },
    { description: 'Jika pesan adalah permintaan untuk membuatkan gambar', output: { cmd: 'txt2img', msg: 'isi pesan singkat yang menyertai gambar', cfg: { prompt: 'isi teks prompt yang menggambarkan gambar yang diinginkan. Tulis dalam bahasa Inggris.' } } },
    { description: 'Jika berisi pesan yang membutuhkan jawaban dari internet atau search engine', output: { cmd: 'bard', cfg: { query: 'isi pertanyaan yg dimaksud dalam pesan' } } }
  ]
  if (hasImage) cmds.push({ description: 'Jika pesan adalah permintaan melakukan pengeditan atau perubahan pada gambar', output: { cmd: 'img2img', msg: 'isi pesan singkat yang menyertai gambar', cfg: { prompt: 'isi teks prompt yang menjelaskan perubahan yang diinginkan pada gambar. Tulis dalam bahasa Inggris' } } })
  return cmds
}

// ───────── command: .autoai / .resetaichat ─────────
async function command(m, { sock, text, prefix, command: cmd, reply, isOwner, isAdmin }) {
  const p = prefix || '.'
  if (/^(resetaichat|clearsesichat)$/i.test(cmd)) {
    try {
      const r = await tJson('/api/chat/logic-bell/reset', { params: { id: num(m.sender) } })
      let msg = r?.msg || r?.message || '✅ Riwayat ingatan AI kamu berhasil dibersihkan!'
      if (/not found/i.test(msg)) msg = 'ℹ️ Riwayat ingatan AI kamu belum ada atau sudah bersih.'
      return reply(msg)
    } catch (e) {
      return reply('ℹ️ Riwayat ingatan AI kamu belum ada atau sudah bersih.')
    }
  }

  const sub = String(text || '').trim().toLowerCase()
  const state = isOn(m) ? 'AKTIF ✅' : 'MATI ❌'
  const help = `*🤖 AUTO AI*\nStatus chat ini: *${state}*\n\n• *${p}autoai on* / *off* — chat ini${m.isGroup ? ' (admin grup)' : ''}\n• *${p}autoai on-all* / *off-all* — semua chat (owner)\n• *${p}autoai on-group* / *off-group* — default grup (owner)\n• *${p}autoai on-private* / *off-private* — default chat pribadi (owner)\n• *${p}resetaichat* — hapus riwayat ingatan AI kamu\n\n_Di chat pribadi bot membalas semua pesan. Di grup, panggil nama bot (${botName()}), mention bot, atau reply jawaban AI._`
  if (!sub) return reply(help)

  const m2 = sub.match(/^(on|off)(?:-(all|group|private))?$/)
  if (!m2) return reply(help)
  const value = m2[1] === 'on'
  const scope = m2[2]

  if (scope) {
    if (!isOwner) return reply(global.mess?.owner || 'Khusus owner.')
    if (scope === 'all') { db.def.group = value; db.def.private = value; db.chats = {} }
    else db.def[scope] = value
    save()
    return reply(`✅ Auto AI ${value ? 'diaktifkan' : 'dimatikan'} untuk *${scope === 'all' ? 'semua chat' : scope === 'group' ? 'semua grup' : 'semua chat pribadi'}*.`)
  }
  if (m.isGroup && !isAdmin && !isOwner) return reply(global.mess?.admin || 'Khusus admin grup.')
  db.chats[m.chat] = value
  save()
  return reply(`✅ Auto AI ${value ? 'diaktifkan' : 'dimatikan'} di chat ini.${value ? (m.isGroup ? `\nPanggil dengan menyebut "${botName()}" di awal pesan, atau mention bot.` : '\nSilakan ngobrol langsung.') : ''}`)
}

// ───────── pasif: balas chat biasa ─────────
async function auto(m, ctx) {
  const { sock } = ctx
  if (m.fromMe || m.chat === 'status@broadcast' || m.isNewsletter || !isOn(m)) return false

  let body = String(ctx.body || m.body || m.text || '').trim()
  if (!body) return false

  const mentioned = isBotMentioned(sock, m)
  const named = triggerNames().some(n => new RegExp(`^${esc(n)}(?![\\p{L}\\p{N}])`, 'iu').test(body))
  const replyToAi = !!(m.quoted?.fromMe && answerIds.has(m.quoted.id))
  if (m.isGroup && !(named || mentioned || replyToAi)) return false
  if (mentioned) body = body.replace(/@⁨?[^\s@⁩]*⁩?|@\d{5,}/g, botName()).trim()

  const who = num(m.sender)
  const now = Date.now()
  if (busy.has(who) || now - (lastUse.get(who) || 0) < COOLDOWN) return false
  lastUse.set(who, now); busy.add(who)

  const chat = m.chat
  const send = async (content) => {
    const sent = await sock.sendMessage(chat, content, { quoted: m })
    rememberAnswer(sent?.key?.id)
    return sent
  }

  try {
    await sock.sendPresenceUpdate?.('composing', chat).catch(() => null)

    // gambar yang dikirim / di-reply (bukan gambar buatan bot sendiri)
    let image = null
    const pi = pickImage(m)
    if (pi && !(pi.node === m.quoted && m.quoted?.fromMe)) {
      try { image = await minimizeImage(await pi.download()) } catch (e) { console.error('[AUTOAI] gambar', e?.message) }
    }

    const o = opt()
    const r = await tJson('/api/chat/logic-bell', {
      data: {
        text: body,
        id: who,
        fullainame: botName(),
        nickainame: botName().split(/\s+/)[0],
        senderName: m.pushName,
        ownerName: ownerName(),
        date: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        role: ctx.isOwner ? `pemilikmu, ${ownerName()}` : undefined,
        msgtype: m.mtype,
        custom_profile: o.persona || PERSONA,
        image: image || false,
        commands: buildCommands(!!image)
      }
    })

    const d = r?.data || {}
    const cmd = String(d.cmd || '').toLowerCase()
    const msg = typeof d.msg === 'string' ? d.msg.trim() : ''
    if (!r?.data && !msg) throw new Error(r?.msg || 'AI tidak memberi jawaban.')

    if (cmd === 'voice' && msg) {
      await sock.sendPresenceUpdate?.('recording', chat).catch(() => null)
      const { url, key } = cfg()
      const res = await axios.get(`${url}/api/text2speech/elevenlabs`, { params: { key, text: msg, voice: o.voice || 'cute voice', speed: 0.9 }, responseType: 'arraybuffer', timeout: 120_000 })
      const buf = Buffer.from(res.data)
      if (/json|text/.test(String(res.headers['content-type'] || ''))) throw new Error('Gagal membuat suara.')
      await send({ audio: buf, mimetype: 'audio/mpeg', ptt: true })
    } else if (cmd === 'txt2img' && d.cfg?.prompt) {
      await sock.sendPresenceUpdate?.('composing', chat).catch(() => null)
      const img = await tImage('/api/text2img/dalle3', { params: { prompt: d.cfg.prompt } })
      await send({ image: img, ...(msg ? { caption: msg } : {}) })
    } else if (cmd === 'img2img' && d.cfg?.prompt && image) {
      const img = await imageEdit(image, d.cfg.prompt)
      await send({ image: img, ...(msg ? { caption: msg } : {}) })
    } else if (cmd === 'bard' && d.cfg?.query) {
      if (msg) await send({ text: msg })
      const ans = String(await bard(d.cfg.query) || '').trim()
      if (ans) await send({ text: ans })
    } else if (msg) {
      await send({ text: msg })
    } else {
      return false
    }
    return true
  } catch (e) {
    console.error('[AUTOAI]', e)
    await send({ text: `❌ ${e?.message || e}` }).catch(() => null)
    return true
  } finally {
    busy.delete(who)
  }
}

let handler = async (m, ctx) => ctx.command ? command(m, ctx) : auto(m, ctx)

handler.command = ['autoai', 'aichat', 'resetaichat', 'clearsesichat']
handler.help = ['autoai on/off', 'resetaichat']
handler.tags = ['ai']
handler.customPrefix = /^[\s\S]+$/

export default handler
