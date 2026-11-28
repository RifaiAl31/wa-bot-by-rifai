const { processAudio } = require('./ytmp3')

module.exports = {
  name: 'ttmp3',
  command: ['ttmp3', 'ttaudio', 'tiktokmp3', 'tiktokaudio'],
  category: 'downloader',
  desc: 'Unduh audio publik TikTok sebagai MP3',
  usage: '<link tiktok>',
  run: async ({ sock, msg, from, text, prefix, command, react, reply }) => {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    const qtext = quoted?.conversation || quoted?.extendedTextMessage?.text || ''
    const input = String(text || qtext || '').trim()
    if (!input) return reply(`Contoh penggunaan:\n${prefix}${command} https://www.tiktok.com/@user/video/...`)
    return processAudio({ sock, msg, from, input, platform: 'tiktok', react, reply })
  }
}
