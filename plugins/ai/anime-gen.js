// ai/anime-gen — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/anime-gen.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "anime-gen",
  "command": [
    "anime-gen",
    "animegen",
    "aianimegen",
    "genai-anime"
  ],
  "category": "ai",
  "desc": "Generate AI anime art dari prompt",
  "usage": ".anime-gen <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/anime-gen", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/anime-gen.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'anime-gen',
      alias: ['animegen', 'aianimegen', 'genai-anime'],
      category: 'ai',
      description: 'Generate AI anime art dari prompt',
      usage: '.anime-gen <prompt>',
      example: '.anime-gen girl, vibrant color, smilling',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 30,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const prompt = m.text
      
      if (!prompt) {
          return m.reply(
              `🎨 *ᴀɴɪᴍᴇ ᴀʀᴛ ɢᴇɴᴇʀᴀᴛᴏʀ*\n\n` +
              `> Generate gambar anime AI dari prompt!\n\n` +
              `*ᴄᴀʀᴀ ᴘᴀᴋᴀɪ:*\n` +
              `> \`${m.prefix}anime-gen <deskripsi>\`\n\n` +
              `*ᴄᴏɴᴛᴏʜ:*\n` +
              `> \`${m.prefix}anime-gen girl, vibrant color, smilling, yellow pink gradient hair\`\n` +
              `> \`${m.prefix}anime-gen boy, dark aesthetic, silver hair, red eyes\`\n\n` +
              `*ᴛɪᴘs:*\n` +
              `> • Gunakan bahasa Inggris\n` +
              `> • Makin detail prompt, makin bagus hasil\n` +
              `> • Tambahkan style: vibrant, dark, pastel, etc`
          )
      }
      
      m.react('🕕')
  
      try {
          const NEOXR_APIKEY = config.APIkey?.neoxr || ''
          const apiUrl = `https://api.neoxr.eu/api/ai-anime?q=${encodeURIComponent(prompt)}&apikey=${NEOXR_APIKEY}`
          
          const data = await f(apiUrl)
          
          if (!data?.status || !data?.data?.url) {
              m.react('❌')
              return m.reply('❌ *ɢᴀɢᴀʟ*\n\n> Gagal generate gambar. Coba lagi nanti!')
          }
          
          const result = data.data  
          await sock.sendMedia(m.chat, result.url, null, m, {
              type: 'image'
          })
          m.react('✅')
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          m.react('☢')
          if (error.code === 'ECONNABORTED') {
              m.reply('⏱️ *ᴛɪᴍᴇᴏᴜᴛ*\n\n> Request terlalu lama. Coba lagi!')
          } else {
              m.reply(te(m.prefix, m.command, m.pushName))
          }
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
