// ai/sora2 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/sora2.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "sora2",
  "command": [
    "sora2",
    "sora"
  ],
  "category": "ai",
  "desc": "Ubah gambar menjadi video (Sora 2)",
  "usage": ".sora <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 20,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/sora2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sora2.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const pluginConfig = {
      name: 'sora2',
      alias: ['sora'],
      category: 'ai',
      description: 'Ubah gambar menjadi video (Sora 2)',
      usage: '.sora <prompt>',
      example: '.sora anime cinematic',
      cooldown: 20,
      energi: 1,
      isEnabled: true
  }
  
  let antiSpam = new Set()        
  async function handler(m, { sock }) {
      const text = m.args.join(' ')
      if (!text) {
          return m.reply(
              `🎬 *SORA 2 – Image to Video*\n\n` +
              `Contoh:\n\`${m.prefix}sora anime cinematic\``
          )
      }
  
      if (antiSpam.has(m.sender)) {
          m.react('😀')
          return m.reply(`*MASIH ADA PROSES YANG BELUM SELESAI, HARAP DI TUNGGU!*`)
      }
      m.react('⏳')
      m.reply(`⏳ *NOTE*\n\n> Ini kayaknya bakal sampai 5 menit an, jadi harap di tunggu yahh.`)
      
      antiSpam.add(m.sender)
      let result
      try {
          const { data } = await axios.get(`https://fgsi.dpdns.org/api/ai/sora2?apikey=${(global.apiKeys && global.apiKeys.fgsi) || ''}&prompt=${encodeURIComponent(text)}&ratio=landscape&enhancePrompt=true`, {
              headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
              }
          })
  
          const pollUrl = data.data.pollUrl
  
          while (true) {
              const pollRes = await axios.get(pollUrl)
              if (pollRes.data.data?.status == 'Success') {
                  result = {
                      videoUrl: pollRes.data.data.result.resultUrls[0],
                      text_enhanced: pollRes.data.data.result.prompt_optimized
                  }
                  antiSpam.delete(m.sender)
                  break
              }
              await new Promise(resolve => setTimeout(resolve, 20000))
          }
  
          await sock.sendMessage(
              m.chat,
              {
                  video: { url: result.videoUrl },
                  caption:
                      `✅ *Video berhasil dibuat!*\n\n` +
                      `📝 *Prompt:* ${text}\n` +
                      `🎬 *Model:* Sora 2 text to Video\n\n` +
                      `📝 *Prompt:* ${result.text_enhanced}`
              },
              { quoted: m }
          )
      } catch (e) {
          antiSpam.delete(m.sender)
          m.reply(`❌ Error: ${e.message}`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
