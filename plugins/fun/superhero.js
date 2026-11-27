// random/superhero — satu file: metadata + kode fitur (gabungan dari engine7/plugins/random/superhero.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "superhero",
  "command": [
    "superhero",
    "hero",
    "pahlawan"
  ],
  "category": "fun",
  "desc": "Cari informasi superhero",
  "usage": ".superhero <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/random").split('\\').join('/')
module.exports = __vx.plugin("random/superhero", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/superhero.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'superhero',
      alias: ['hero', 'pahlawan'],
      category: 'random',
      description: 'Cari informasi superhero',
      usage: '.superhero <nama>',
      example: '.superhero batman',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const query = m.text?.trim()
      
      if (!query) {
          return m.reply(
              `🦸 *sᴜᴘᴇʀʜᴇʀᴏ sᴇᴀʀᴄʜ*\n\n` +
              `> Masukkan nama superhero\n\n` +
              `> Contoh: \`${m.prefix}superhero batman\``
          )
      }
      
      m.react('🦸')
      
      try {
          const apiKey = config.APIkey?.lolhuman
          
          if (!apiKey) {
              throw new Error('API Key tidak ditemukan di config')
          }
          
          const res = await axios.get(`https://api.lolhuman.xyz/api/superhero?apikey=${apiKey}&query=${encodeURIComponent(query)}`, {
              timeout: 30000
          })
          
          if (res.data?.status !== 200 || !res.data?.result) {
              throw new Error('Superhero tidak ditemukan')
          }
          
          const hero = res.data.result
          const stats = hero.powerstats || {}
          const bio = hero.biography || {}
          const appearance = hero.appearance || {}
          const work = hero.work || {}
          const connections = hero.connections || {}
          
          let txt = `🦸 *sᴜᴘᴇʀʜᴇʀᴏ ɪɴꜰᴏ*\n\n`
          txt += `╭┈┈⬡「 👤 *ɪᴅᴇɴᴛɪᴛʏ* 」\n`
          txt += `┃ ◦ ɴᴀᴍᴇ: *${hero.name || '-'}*\n`
          txt += `┃ ◦ ꜰᴜʟʟ ɴᴀᴍᴇ: *${bio['full-name'] || '-'}*\n`
          txt += `┃ ◦ ᴀʟɪɢɴᴍᴇɴᴛ: *${bio.alignment || '-'}*\n`
          txt += `┃ ◦ ᴘᴜʙʟɪsʜᴇʀ: *${bio.publisher || '-'}*\n`
          txt += `╰┈┈⬡\n\n`
          
          txt += `╭┈┈⬡「 ⚡ *ᴘᴏᴡᴇʀ sᴛᴀᴛs* 」\n`
          txt += `┃ ◦ ɪɴᴛᴇʟʟɪɢᴇɴᴄᴇ: *${stats.intelligence || '-'}*\n`
          txt += `┃ ◦ sᴛʀᴇɴɢᴛʜ: *${stats.strength || '-'}*\n`
          txt += `┃ ◦ sᴘᴇᴇᴅ: *${stats.speed || '-'}*\n`
          txt += `┃ ◦ ᴅᴜʀᴀʙɪʟɪᴛʏ: *${stats.durability || '-'}*\n`
          txt += `┃ ◦ ᴘᴏᴡᴇʀ: *${stats.power || '-'}*\n`
          txt += `┃ ◦ ᴄᴏᴍʙᴀᴛ: *${stats.combat || '-'}*\n`
          txt += `╰┈┈⬡\n\n`
          
          txt += `╭┈┈⬡「 📊 *ᴀᴘᴘᴇᴀʀᴀɴᴄᴇ* 」\n`
          txt += `┃ ◦ ɢᴇɴᴅᴇʀ: *${appearance.gender || '-'}*\n`
          txt += `┃ ◦ ʀᴀᴄᴇ: *${appearance.race || '-'}*\n`
          txt += `┃ ◦ ʜᴇɪɢʜᴛ: *${Array.isArray(appearance.height) ? appearance.height.join(' / ') : '-'}*\n`
          txt += `┃ ◦ ᴡᴇɪɢʜᴛ: *${Array.isArray(appearance.weight) ? appearance.weight.join(' / ') : '-'}*\n`
          txt += `┃ ◦ ᴇʏᴇs: *${appearance['eye-color'] || '-'}*\n`
          txt += `┃ ◦ ʜᴀɪʀ: *${appearance['hair-color'] || '-'}*\n`
          txt += `╰┈┈⬡\n\n`
          
          if (bio.aliases && bio.aliases.length > 0) {
              txt += `╭┈┈⬡「 🎭 *ᴀʟɪᴀsᴇs* 」\n`
              txt += `┃ ${bio.aliases.slice(0, 5).join(', ')}\n`
              txt += `╰┈┈⬡\n\n`
          }
          
          txt += `╭┈┈⬡「 💼 *ᴡᴏʀᴋ* 」\n`
          txt += `┃ ◦ ᴏᴄᴄᴜᴘᴀᴛɪᴏɴ: *${work.occupation || '-'}*\n`
          txt += `┃ ◦ ʙᴀsᴇ: *${work.base || '-'}*\n`
          txt += `╰┈┈⬡`
          
          const msgOptions = { caption: txt }
          
          if (hero.image?.url) {
              msgOptions.image = { url: hero.image.url }
          }
          
          await sock.sendMessage(m.chat, msgOptions, { quoted: m })
          m.react('✅')
          
      } catch (error) {
          m.react('❌')
          m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${error.message}`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
