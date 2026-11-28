const fs = require('fs')
const audioDownloader = require('../../lib/public-audio')

async function processAudio({ sock, msg, from, input, platform, react, reply }) {
  const source = audioDownloader.extractUrl(input)
  if (!source) return reply('Link tidak valid. Kirim URL YouTube atau TikTok yang lengkap.')

  let target
  try {
    target = audioDownloader.validateUrl(source)
    if (platform && target.platform !== platform) {
      return reply(`Link tidak valid. Command ini hanya menerima link ${platform === 'youtube' ? 'YouTube' : 'TikTok'}.`)
    }
  } catch (error) {
    return reply(error.message)
  }

  const platformName = target.platform === 'youtube' ? 'YouTube' : 'TikTok'
  let result
  react?.('⏳')
  try {
    await reply(`「 🎵 DOWNLOAD AUDIO 」\n\n> Sedang memproses audio...\n> Platform: ${platformName}\n> Mohon tunggu sebentar.`)
    result = await audioDownloader.downloadAudio(target.url)
    await sock.sendMessage(
      from,
      {
        audio: fs.readFileSync(result.file),
        mimetype: 'audio/mpeg',
        fileName: result.filename,
        ptt: false
      },
      { quoted: msg }
    )
    const { title, creator, duration } = result.metadata
    const durationText = duration
      ? `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`
      : 'Tidak tersedia'
    const thumbnailText = result.metadata.thumbnail
      ? `\n- Thumbnail: ${result.metadata.thumbnail.slice(0, 500)}`
      : ''
    await reply(`「 ✅ DOWNLOAD BERHASIL 」\n\n- Judul: ${title}\n- Kreator/Channel: ${creator}\n- Durasi: ${durationText}\n- Platform: ${platformName}\n- Format: MP3${thumbnailText}`)
    react?.('✅')
  } catch (error) {
    console.error('[AUDIO-DOWNLOAD]', error.message)
    react?.('❌')
    await reply(`「 ❌ DOWNLOAD GAGAL 」\n\n> ${error.message || 'Terjadi kesalahan saat memproses audio.'}`)
  } finally {
    result?.cleanup()
  }
}

module.exports = {
  name: 'ytmp3',
  command: ['ytmp3', 'yta', 'ytaudio', 'mp3'],
  category: 'downloader',
  desc: 'Unduh audio publik YouTube/TikTok sebagai MP3',
  usage: '<link youtube atau tiktok>',
  run: async ({ sock, msg, from, text, prefix, command, react, reply }) => {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    const qtext = quoted?.conversation || quoted?.extendedTextMessage?.text || ''
    const input = String(text || qtext || '').trim()
    if (command.toLowerCase() === 'mp3' && !input) {
      return require('../tools/tomp3').run({ sock, msg, from, prefix, reply })
    }
    if (!input) return reply(`Contoh penggunaan:\n${prefix}${command} https://youtube.com/watch?v=...\n${prefix}mp3 https://www.tiktok.com/@user/video/...`)
    return processAudio({
      sock, msg, from, input,
      platform: command.toLowerCase() === 'mp3' ? null : 'youtube',
      react, reply
    })
  }
}

module.exports.processAudio = processAudio
