// .pilihgc — pilih grup tujuan untuk semua jpm / swgc / bcgc (disimpan permanen sampai di-reset)
const gcsel = require('../../lib/gcselect')

module.exports = {
  name: 'pilihgc',
  command: ['pilihgc', 'targetgc', 'setgctarget', 'listgcnomor'],
  category: 'owner',
  emoji: '🎯',
  desc: 'Pilih grup tujuan jpm/swgc/bcgc (owner)',
  usage: '[nomor | nama:kata | all | reset]',
  owner: true,
  run: async ({ sock, sender, text, prefix, command, reply }) => {
    const { fetchGroupsSafe } = require('../../lib/ext/src/lib/jpmHelper.js')
    const groups = await fetchGroupsSafe(sock)
    const list = gcsel.sortedList(groups)
    if (!list.length) return reply('Bot belum bergabung ke grup mana pun.')
    const arg = String(text || '').trim()
    const saved = gcsel.getSaved(sender)

    if (/^(reset|hapus|clear|all|semua)$/i.test(arg)) {
      gcsel.setSaved(sender, null)
      return reply('✅ Pilihan dihapus. jpm/swgc/bcgc kembali ke SEMUA grup.')
    }
    if (!arg || /^(\?|list|daftar)$/i.test(arg)) {
      return reply(
        `🎯 *Target grup* — ${saved && saved.length ? `${saved.length} grup dipilih` : 'semua grup'}\n\n${gcsel.formatList(list, saved)}\n\n` +
        `Atur: ${prefix}${command} 1,3,5-8\n${prefix}${command} nama:promo\nHapus: ${prefix}${command} reset\n\n_Sekali pakai: tambahkan -gc 1,3 di akhir perintah jpm/swgc._`
      )
    }
    const r = gcsel.resolve(groups, arg)
    if (r.error) return reply(`❌ ${r.error}`)
    if (r.all) { gcsel.setSaved(sender, null); return reply('✅ Target: semua grup.') }
    gcsel.setSaved(sender, r.ids)
    const names = r.ids.map((id) => list.find((g) => g.id === id)?.name).filter(Boolean)
    return reply(`✅ Target disimpan: ${r.ids.length} grup\n\n${names.slice(0, 30).map((n, i) => `${i + 1}. ${n}`).join('\n')}${names.length > 30 ? `\n…dan ${names.length - 30} lainnya` : ''}\n\nSemua jpm/swgc/bcgc sekarang hanya ke grup ini. Hapus: ${prefix}${command} reset`)
  }
}
