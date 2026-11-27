// lib/ghostdel.js — "ghost delete" pesan orang lain di grup (dipakai plugins/owner/dmsg.js & plugins/owner/dmsg-trigger.hook.js)
// Mengikuti PERSIS urutan & nilai fromMe dari plugin dmsg bawaan WhatsApp Bot yang sudah terbukti jalan di fork baileys ini
// (lib/kernel/plugins/owner/dmsg.js lama / _backup_lama/dmsg.js.bak): placeholder groupStatusMessageV2 lalu
// protocolMessage(type 14, key.fromMe:false) yang menargetkan ID pesan korban, lalu kedua pesan bantu dihapus
// dengan fromMe:false (placeholder) / fromMe:true (hasil edit) — nilai fromMe ini TIDAK boleh ditukar.
'use strict'

const bursts = new Map() // groupJid -> [timestamp, ...]
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const idOf = (v) => (typeof v === 'string' && v ? v : (v && typeof v === 'object' && (v.key?.id || v.id)) || null)

// opsi bisa ditaruh di config.js: dmsg: { ghostDelay, ghostBurst, ghostBurstWindow }
function opts(config = {}) {
  const c = config?.dmsg ?? {}
  const num = (k, d, min = 0) => (Number.isFinite(Number(c[k])) && Number(c[k]) >= min && c[k] !== '' && c[k] != null ? Number(c[k]) : d)
  return { ghostDelay: num('ghostDelay', 100), ghostBurst: num('ghostBurst', 10), ghostBurstWindow: num('ghostBurstWindow', 10000) }
}

function recent(group, windowMs) {
  const now = Date.now()
  const list = (bursts.get(group) || []).filter((t) => now - t < windowMs)
  bursts.set(group, list)
  return list
}
const limited = (group, o) => !!o.ghostBurst && recent(group, o.ghostBurstWindow).length >= o.ghostBurst
const mark = (group, o) => bursts.set(group, [...recent(group, o.ghostBurstWindow), Date.now()])

async function ghostDelete(sock, chat, target, config) {
  const targetId = idOf(target)
  if (!sock || typeof sock.relayMessage !== 'function') throw new Error('sock.relayMessage tidak tersedia')
  if (!chat || !targetId) throw new Error('Chat atau ID pesan target tidak lengkap')
  const { ghostDelay } = opts(config)

  const placeholder = idOf(
    await sock.relayMessage(chat, { groupStatusMessageV2: { message: { extendedTextMessage: { text: '', contextInfo: { isGroupStatus: true } } } } }, {})
  )
  if (!placeholder) throw new Error('ID pesan placeholder ghost kosong')

  const edit = idOf(
    await sock.relayMessage(
      chat,
      {
        protocolMessage: {
          key: { jid: chat, fromMe: false, id: placeholder }, // fromMe:false di sini SENGAJA, sesuai plugin asli yang terbukti jalan
          type: 14,
          editedMessage: { extendedTextMessage: { text: '\0', contextInfo: { isGroupStatus: false } } }
        }
      },
      { messageId: targetId }
    )
  )

  if (ghostDelay > 0) await sleep(ghostDelay)

  await Promise.allSettled([
    sock.sendMessage(chat, { delete: { remoteJid: chat, id: placeholder, fromMe: false } }),
    sock.sendMessage(chat, { delete: { remoteJid: chat, id: edit, fromMe: true } })
  ])
  return true
}

module.exports = { ghostDelete, idOf, opts, limited, mark }
