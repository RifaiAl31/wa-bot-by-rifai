// Owner: lihat error terakhir dari fitur hasil port (plugin_baruuu). Dicatat otomatis oleh lib/vanxone.js
module.exports = {
  name: 'errfitur',
  command: ['errfitur', 'errlog'],
  category: 'owner',
  desc: 'Lihat 10 error terakhir fitur WhatsApp Bot (penyebab fitur gagal / tidak mengirim)',
  usage: '[clear]',
  owner: true,
  run: async ({ text, reply }) => {
    const list = global.vanxoneErrors || []
    if (/^clear$/i.test((text || '').trim())) { list.length = 0; return reply('Catatan error dikosongkan.') }
    if (!list.length) return reply('Belum ada error tercatat. Coba fitur yang bermasalah dulu, lalu ketik perintah ini lagi.')
    const out = list.slice(-10).reverse().map((e, i) => {
      const t = new Date(e.t).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })
      return `${i + 1}. [${t}] .${e.cmd}\n   ${e.msg}${e.at ? '\n   @ ' + e.at.slice(0, 140) : ''}`
    })
    return reply(`🔧 *Error terakhir fitur WhatsApp Bot*\n\n${out.join('\n\n')}`)
  }
}
