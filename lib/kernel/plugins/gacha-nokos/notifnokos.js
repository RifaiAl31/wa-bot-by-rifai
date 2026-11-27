import axios from 'axios'
import { docStore } from '../../lib/core/system.js'
import { rankCountries, gradeOf } from '../../lib/services/nokostraffic.js'

// .notifnokos on [skor] [negara,negara]  -> bot kirim DM kalau negara naik jadi "Ramai"
// .notifnokos off | .notifnokos status
// Pemantau jalan di latar belakang tiap 5 menit selama ada yang berlangganan.

const BASE_URL = 'https://smsku.zelapi.eu.cc/api'
const WATCH_MS = 5 * 60e3       // jeda cek ZELAPI
const COOLDOWN_MS = 60 * 60e3   // negara yang sama tidak dinotif ulang ke orang yang sama sebelum ini
const DEFAULT_MIN = 70          // skor minimal ("Ramai")

const store = docStore('nokosNotif', { subs: {} })

// state dipakai bersama antar reload plugin supaya timer tidak dobel
const state = (globalThis.__nokosWatch ||= { timer: null, prev: new Map(), lastSent: new Map(), primed: false })

const wait = (ms) => new Promise(r => setTimeout(r, ms))

async function tick() {
  const subs = Object.entries(store.get().subs || {}).filter(([, v]) => v && v.on)
  if (!subs.length) { state.primed = false; return }
  const sock = global.sock
  if (!sock?.sendMessage) return

  let countries = []
  try {
    const { data } = await axios.get(`${BASE_URL}/countries`, { params: { service: 'WhatsApp' }, timeout: 10000 })
    if (data?.success && Array.isArray(data.countries)) countries = data.countries
  } catch { return }

  const ranked = rankCountries(countries)
  const now = Date.now()
  const cur = new Map(ranked.map(c => [String(c.name).toLowerCase(), c.score]))

  // siklus pertama hanya merekam kondisi awal (tanpa notif) supaya tidak spam saat bot baru nyala
  if (state.primed) {
    for (const c of ranked) {
      const key = String(c.name).toLowerCase()
      const before = state.prev.get(key) ?? 0
      for (const [jid, s] of subs) {
        const min = Number(s.min) || DEFAULT_MIN
        if (c.score < min || before >= min) continue
        if (Array.isArray(s.only) && s.only.length && !s.only.some(o => key.includes(o))) continue
        const lk = `${jid}|${key}`
        if (now - (state.lastSent.get(lk) || 0) < COOLDOWN_MS) continue
        state.lastSent.set(lk, now)
        const p = (Array.isArray(global.prefix) ? global.prefix.find(x => x) : global.prefix) || '.'
        const text =
          `🚦 *NOKOS ${String(c.name).toUpperCase()} LAGI RAMAI!*\n\n` +
          `${gradeOf(c.score)} • skor *${c.score}/100*\n` +
          `📞 Stok nomor: *${c.count ?? '?'}*\n\n` +
          `Coba gacha sekarang:\n${p}gachanokos ${c.name} 3\n\n` +
          `_Matikan notif: ${p}notifnokos off_`
        try { await sock.sendMessage(jid, { text }) } catch {}
        await wait(1500)
      }
    }
  }

  state.prev = cur
  state.primed = true
  if (state.lastSent.size > 500) {
    for (const [k, t] of state.lastSent) if (now - t > COOLDOWN_MS) state.lastSent.delete(k)
  }
}

if (state.timer) clearInterval(state.timer)
state.timer = setInterval(() => { tick().catch(() => {}) }, WATCH_MS)
state.timer.unref?.()

let handler = async (m, { args, reply, usedPrefix, prefix }) => {
  const p = usedPrefix ?? prefix ?? '.'
  const subs = (store.get().subs ||= {})
  const jid = m.sender
  const sub = String(args[0] || '').toLowerCase()

  if (sub === 'on') {
    const rest = args.slice(1)
    const num = rest.find(a => /^\d{1,3}$/.test(a))
    const min = Math.min(100, Math.max(1, Number(num) || DEFAULT_MIN))
    const only = rest.filter(a => a !== num).join(' ').split(/[,\n]/).map(x => x.trim().toLowerCase()).filter(Boolean)
    subs[jid] = { on: true, min, only, at: Date.now() }
    store.save()
    state.primed = false // rekam ulang kondisi awal, supaya notif pertama hanya untuk kenaikan baru
    return reply(
      `🔔 *Notif nokos aktif*\n\n` +
      `🎯 Skor minimal: *${min}*\n` +
      `🌍 Negara: *${only.length ? only.join(', ') : 'semua'}*\n\n` +
      `Kamu akan dapat DM kalau negara naik jadi Ramai. Cek tiap 5 menit.\n` +
      `_Matikan: ${p}notifnokos off_`
    )
  }

  if (sub === 'off') {
    if (!subs[jid]) return reply('Notif nokos kamu memang belum aktif.')
    delete subs[jid]
    store.save()
    return reply('🔕 Notif nokos dimatikan.')
  }

  if (sub === 'status') {
    const s = subs[jid]
    if (!s?.on) return reply(`🔕 Notif nokos belum aktif.\nNyalakan: ${p}notifnokos on 70`)
    return reply(`🔔 *Notif nokos aktif*\n🎯 Skor minimal: *${s.min}*\n🌍 Negara: *${s.only?.length ? s.only.join(', ') : 'semua'}*`)
  }

  return reply(
    `🔔 *NOTIF NOKOS*\n\n` +
    `Dapat DM otomatis saat negara nokos jadi Ramai.\n\n` +
    `• ${p}notifnokos on → semua negara, skor ${DEFAULT_MIN}+\n` +
    `• ${p}notifnokos on 80 → skor minimal 80\n` +
    `• ${p}notifnokos on 70 indonesia,india → negara tertentu\n` +
    `• ${p}notifnokos status\n` +
    `• ${p}notifnokos off`
  )
}

handler.command = ['notifnokos']
handler.help = ['notifnokos on|off|status']
handler.tags = ['gacha-nokos']

export default handler
