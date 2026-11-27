// .rvo — buka media sekali-lihat (foto / video / suara). Balas pesan sekali-lihat lalu ketik .rvo
const vo = require('../../lib/viewonce')

module.exports = {
  name: 'rvo',
  command: ['rvo', 'readviewonce', 'openvo', 'viewonce', 'bukavo', 'liatvo'],
  category: 'tools',
  desc: 'Buka foto/video/suara sekali-lihat (balas pesannya)',
  usage: '(balas pesan sekali-lihat)',
  run: async ({ sock, msg, from, prefix, command, react, reply }) => {
    const ctx = msg.message?.extendedTextMessage?.contextInfo || Object.values(msg.message || {}).map((v) => v?.contextInfo).find(Boolean)
    if (!ctx?.quotedMessage) return reply(`Balas pesan *sekali-lihat* (foto/video/suara) dengan ${prefix}${command}`)
    react?.('⏳')
    const r = await vo.find(msg)
    if (!r) {
      react?.('❌')
      return reply('Media sekali-lihat itu tidak bisa dibuka. Bot hanya bisa membuka media yang masuk saat bot sudah online (pesan lama/sebelum bot masuk tidak tersimpan).')
    }
    const quoted = { quoted: msg }
    const cap = r.caption || ''
    try {
      if (r.kind === 'imageMessage') await sock.sendMessage(from, { image: r.buf, caption: cap }, quoted)
      else if (r.kind === 'videoMessage') await sock.sendMessage(from, { video: r.buf, caption: cap, mimetype: r.mime || 'video/mp4' }, quoted)
      else await sock.sendMessage(from, { audio: r.buf, mimetype: r.mime || 'audio/ogg; codecs=opus', ptt: r.ptt }, quoted)
      react?.('✅')
    } catch (err) {
      react?.('❌')
      reply(`Gagal mengirim media: ${err.message}`)
    }
  }
}
