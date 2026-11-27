// owner/dmsg — hapus pesan orang lain di grup tanpa perlu admin (ghost delete). Reply pesan target lalu kirim perintah.
// Versi baru: ID target diambil langsung dari reply, ada pembatas burst per grup, dan pesan perintah ikut dihapus.
const gd = require('../../lib/ghostdel')
const { getContextInfo } = require('../../lib/utils')

module.exports = {
  name: 'dmsg',
  command: ['dmsg', 'deletefake', 'delmsg'],
  category: 'owner',
  desc: 'Hapus pesan orang lain di grup tanpa admin (ghost delete)',
  usage: '(reply pesan target)',
  owner: true,
  group: true,
  selfReact: true,
  run: async ({ sock, msg, from, config, reply }) => {
    const ci = getContextInfo(msg)
    const targetId = ci?.stanzaId
    const cmdId = msg.key?.id
    if (!ci?.quotedMessage || !targetId) return reply('❌ Reply pesan yang ingin diproses.')
    if (!cmdId) return reply('❌ ID pesan perintah tidak ditemukan; proses DMSG dibatalkan.')
    if (targetId === cmdId) return reply('❌ Pesan target tidak boleh sama dengan pesan perintah.')

    const o = gd.opts(config)
    if (gd.limited(from, o)) return reply(`❌ Ghost delete sedang dibatasi (${o.ghostBurst}x per ${o.ghostBurstWindow / 1000} detik). Pesan target tidak dihapus.`)

    try {
      await gd.ghostDelete(sock, from, targetId, config)
      gd.mark(from, o)
    } catch (err) {
      console.log('[dmsg:target]', err)
      return reply(`❌ Gagal menghapus pesan target: ${err?.message || err}`)
    }
    // pesan perintah milik pengirim ikut dihapus (kegagalan di sini tidak dianggap error)
    try { await gd.ghostDelete(sock, from, cmdId, config) } catch (err) { console.log('[dmsg:command]', err?.message || err) }
  }
}
