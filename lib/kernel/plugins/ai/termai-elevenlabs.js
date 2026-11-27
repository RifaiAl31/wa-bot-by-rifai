// Text-to-Speech ElevenLabs via Termai
// .elevenlabs <teks>
// .elevenlabs voice=bella speed=1.2 pitch=0 format=mp3 <teks>
// reply teks + .elevenlabs [opsi]
import { elevenlabs } from '../../lib/services/termai.js'
import { reactTo } from '../../lib/core/file.js'

const MAX_CHARS = 1000
const FORMATS = ['mp3', 'wav', 'ogg']
const DEF = { voice: 'bella', speed: 1.0, pitch: 0, format: 'mp3' }

// ambil opsi key=value di awal teks, sisanya jadi teks yang dibacakan
function parse(input) {
  const opt = { ...DEF }
  const words = String(input || '').trim().split(/\s+/)
  let i = 0
  for (; i < words.length; i++) {
    const mm = words[i].match(/^(voice|speed|pitch|format|ptt)=(.+)$/i)
    if (!mm) break
    const k = mm[1].toLowerCase(), v = mm[2]
    if (k === 'voice') opt.voice = v.toLowerCase()
    else if (k === 'speed') opt.speed = Number(v)
    else if (k === 'pitch') opt.pitch = Number(v)
    else if (k === 'format') opt.format = v.toLowerCase()
    else if (k === 'ptt') opt.ptt = /^(1|true|on|ya)$/i.test(v)
  }
  return { opt, text: words.slice(i).join(' ').trim() }
}

let handler = async (m, { sock, text, prefix, command, reply }) => {
  const p = prefix || '.'
  const { opt, text: own } = parse(text)
  const q = (own || m.quoted?.text || m.quoted?.caption || '').trim()

  if (!q) {
    return reply(
`Tulis teks yang mau dijadikan suara.

*Contoh:*
${p}${command} Halo! Selamat datang di Termai API.
${p}${command} voice=bella speed=1.2 Halo semuanya

*Opsi (opsional):*
• voice=<nama>  (default: ${DEF.voice})
• speed=0.5–2   (default: ${DEF.speed})
• pitch=-12–12  (default: ${DEF.pitch})
• format=${FORMATS.join('/')}  (default: ${DEF.format})
• ptt=1  (kirim sebagai voice note)

Bisa juga reply teks lalu ketik ${p}${command}`)
  }

  if (q.length > MAX_CHARS) return reply(`Teks terlalu panjang (${q.length}). Maksimal ${MAX_CHARS} karakter.`)
  if (!Number.isFinite(opt.speed) || opt.speed < 0.5 || opt.speed > 2) return reply('speed harus angka antara 0.5 dan 2.')
  if (!Number.isFinite(opt.pitch) || opt.pitch < -12 || opt.pitch > 12) return reply('pitch harus angka antara -12 dan 12.')
  if (!FORMATS.includes(opt.format)) return reply(`format harus salah satu dari: ${FORMATS.join(', ')}.`)

  try {
    await reactTo(sock, m, '⏳')
    const { buffer, mime } = await elevenlabs(q, opt)
    await sock.sendMessage(m.chat, {
      audio: buffer,
      mimetype: opt.ptt ? 'audio/ogg; codecs=opus' : mime,
      ptt: !!opt.ptt
    }, { quoted: m })
    await reactTo(sock, m, '✅')
  } catch (e) {
    console.error('[TERMAI-ELEVENLABS]', e)
    await reactTo(sock, m, '❌')
    return reply(`❌ Gagal: ${e?.message || e}`)
  }
}

handler.command = ['elevenlabs', 'eleven', 'ttsel']
handler.help = ['elevenlabs <teks>', 'elevenlabs voice=bella speed=1.2 <teks>']
handler.tags = ['ai']
handler.limit = true

export default handler
