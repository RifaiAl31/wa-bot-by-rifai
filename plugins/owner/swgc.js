// .swgc — Status Grup (border hijau) dengan PILIH GRUP. Gabungan swgc / swgcv2 / swgcall / swgcv2all / swgcv3all.
//
// Cara pakai (owner):
//   .swgc Teks | merah | 2            -> tampil daftar grup bernomor, lalu balas:  .swgc --pilih 1,3,5-8   (atau: all / batal)
//   .swgc Teks -gc 1,3,5-8            -> langsung posting ke grup nomor 1,3,5-8
//   .swgc Teks -gc nama:promo         -> langsung ke semua grup yang namanya mengandung "promo"
//   .swgc ... -gc ?                   -> hanya menampilkan daftar grup
//   .pilihgc 1,3,5-8                  -> simpan pilihan; .swgc berikutnya langsung memakainya
//   .swgcall / .swgcv2all / .swgcv3all-> semua grup (kecuali ada -gc)
// Kirim/reply gambar, video, audio, stiker juga bisa (caption = teks).
const gs = require('../../lib/groupstatus')
const gcsel = require('../../lib/gcselect')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const PENDING_TTL = 10 * 60 * 1000
const pending = new Map() // sender -> { prep, ts }

const ALL_CMDS = new Set(['swgcall', 'swgcbc', 'groupstoryall', 'upswgcall', 'swgcv2all', 'statusgrupv2all', 'swgcv3all', 'statusgrupv3all'])

async function fetchGroups(sock) {
  const { fetchGroupsSafe } = require('../../lib/ext/src/lib/jpmHelper.js')
  return fetchGroupsSafe(sock)
}

async function broadcast(sock, reply, react, prep, groups) {
  const list = Object.values(groups)
  if (!list.length) return reply('Bot belum bergabung ke grup mana pun.')
  await react('⏳')
  await reply(`📣 Memulai status grup ke ${list.length} grup (±${Math.max(1, Math.ceil((list.length * 3) / 60))} menit)…`)
  let ok = 0
  const fail = []
  for (const g of list) {
    try {
      for (const p of prep.payloads) {
        await gs.postStatus(sock, g.id, p.content, prep.style)
        if (prep.payloads.length > 1) await sleep(1500)
      }
      ok++
    } catch (err) {
      fail.push(`${String(g.subject || g.id).slice(0, 30)} (${String(err.message).slice(0, 40)})`)
    }
    await sleep(2500 + Math.floor(Math.random() * 1000))
  }
  await reply(`✅ Selesai\nBerhasil: ${ok} grup\nGagal: ${fail.length} grup${fail.length ? `\n\n${fail.slice(0, 10).map((f) => `• ${f}`).join('\n')}${fail.length > 10 ? `\n…dan ${fail.length - 10} lainnya` : ''}` : ''}`)
}

module.exports = {
  name: 'swgc',
  command: ['swgc', 'statusgrup', 'swgroup', 'groupstory', 'toswgc', 'swgcv2', 'statusgrupv2', ...ALL_CMDS],
  category: 'owner',
  emoji: '📣',
  desc: 'Posting Status Grup ke grup PILIHAN (owner)',
  usage: '<teks> | [warna] | [font] [-gc 1,3,5-8] — atau kirim/reply media',
  owner: true,
  run: async ({ sock, msg, from, sender, text, prefix, command, reply, react }) => {
    if (!gs.supported()) return reply('Versi Baileys di bot ini belum mendukung Status Grup. Update baileys lalu restart bot.')
    const cmd = String(command || '').toLowerCase()
    const key = String(sender || from)

    // ---- lanjutan: .swgc --pilih 1,3  /  all  /  batal
    const cont = String(text || '').trim().match(/^(?:--pilih|pilih|--batal|batal)\b\s*(.*)$/i)
    if (cont) {
      const p = pending.get(key)
      if (/^(--)?batal/i.test(text.trim())) {
        pending.delete(key)
        return reply('Dibatalkan.')
      }
      if (!p || Date.now() - p.ts > PENDING_TTL) {
        pending.delete(key)
        return reply(`Tidak ada status yang menunggu (kedaluwarsa 10 menit). Kirim ulang ${prefix}${cmd} <teks/media> dulu.`)
      }
      const groups = await fetchGroups(sock)
      const sel = await gcsel.apply(groups, { sender, spec: cont[1].trim() || '?', reply })
      if (!sel) return
      pending.delete(key)
      return broadcast(sock, reply, react, p.prep, sel)
    }

    // ---- siapkan konten
    const { text: clean, spec } = gcsel.extract(text)
    const prep = await gs.prepare(sock, msg, clean, async (t) => reply(t))
    if (prep.error) return reply(`❌ ${prep.error}`)
    if (prep.help) {
      return reply(
        `*Status Grup*\n\nKirim/reply media atau tulis teks.\nContoh: ${prefix}${cmd} Info penting | merah | 2\n\n` +
        `Pilih grup:\n• tanpa opsi → muncul daftar, lalu balas ${prefix}${cmd} --pilih 1,3,5-8\n• ${prefix}${cmd} teks -gc 1,3,5-8\n• ${prefix}${cmd} teks -gc nama:promo\n• simpan permanen: ${prefix}pilihgc 1,3,5-8`
      )
    }

    const groups = await fetchGroups(sock)
    if (!Object.keys(groups).length) return reply('Bot belum bergabung ke grup mana pun.')

    // perintah "…all" = semua grup, kecuali ada -gc
    if (ALL_CMDS.has(cmd) && !spec) return broadcast(sock, reply, react, prep, groups)

    const saved = gcsel.getSaved(sender)
    if (spec || (saved && saved.length)) {
      const sel = await gcsel.apply(groups, { sender, spec, reply })
      if (!sel) return
      return broadcast(sock, reply, react, prep, sel)
    }

    // belum ada pilihan → tampilkan daftar & tunggu
    pending.set(key, { prep, ts: Date.now() })
    const list = gcsel.sortedList(groups)
    await reply(
      `📋 *Pilih grup tujuan (${list.length})*\n\n${gcsel.formatList(list, [])}\n\n` +
      `Balas dengan:\n• ${prefix}${cmd} --pilih 1,3,5-8\n• ${prefix}${cmd} --pilih nama:promo\n• ${prefix}${cmd} --pilih all\n• ${prefix}${cmd} batal\n\n_Berlaku 10 menit._`
    )
  }
}
