// group/groupreact — reaksi otomatis saat member masuk / keluar grup.
// CATATAN TEKNIS: notifikasi sistem "X ditambahkan/keluar" diproses Baileys secara internal dan HANYA keluar
// lewat event 'group-participants.update' (sama seperti fitur welcome/leave bawaan di lib/groups.js) — bukan
// lewat 'messages.upsert', dan event itu tidak membawa ID pesan WA untuk direaksi langsung. Jadi di sini bot
// mengirim notifikasi singkatnya sendiri lalu me-reaksi pesan itu sendiri (bukan mereaksi notifikasi bawaan WA).
// Saklar: .joinreact on|off  /  .leavereact on|off  (default ON, disimpan di settings.json milik bot).
const fs = require('fs')
const path = require('path')
const { userOf, isBot } = require('../../lib/utils')

const SETTINGS_FILE = path.join(__dirname, '..', '..', 'settings.json')
const JOIN_EMOJI = ['👋', '🎉', '💗']
const LEAVE_EMOJI = ['😢', '👋', '🚶‍♂️']
const pick = (a) => a[Math.floor(Math.random() * a.length)]

function readSettings() {
  try { return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')) } catch { return {} }
}

async function onParticipants(sock, ev) {
  const { id, participants, action } = ev || {}
  if (!id || (action !== 'add' && action !== 'remove')) return
  const isJoin = action === 'add'
  const s = readSettings()
  if ((isJoin ? s.joinReact : s.leaveReact) === false) return

  for (const p of participants || []) {
    const jid = typeof p === 'string' ? p : p?.id || p?.jid
    if (!jid || isBot(sock, jid)) continue
    try {
      const sent = await sock.sendMessage(id, { text: `${isJoin ? '👋 Selamat datang' : '🚶 Sampai jumpa'} @${userOf(jid)}`, mentions: [jid] })
      if (sent?.key) {
        await sock.sendMessage(id, { react: { text: pick(isJoin ? JOIN_EMOJI : LEAVE_EMOJI), key: sent.key } }).catch(() => {})
      }
    } catch (err) {
      console.log('[GROUP AUTO REACT]', err?.message || err)
    }
  }
}

module.exports = {
  hook: true,
  name: 'groupreact',
  // dipanggil bot.js untuk setiap event 'group-participants.update' (lihat sock.ev.on di bot.js)
  onParticipants: async (sock, ev) => onParticipants(sock, ev)
}
