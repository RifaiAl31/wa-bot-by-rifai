// sticker/stickerly — satu file: metadata + kode fitur (gabungan dari engine2/plugins/sticker/stickerly.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "stly"
  ],
  "category": "sticker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur stly (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/stickerly", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stickerly.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  const baseURL = 'https://api.sticker.ly/v4'
  if (!global.stickerlySession) global.stickerlySession = {}
  
  let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args.length) {
      return m.reply(
        `Contoh:\n` +
        `${usedPrefix + command} blue archive`
      )
    }
  
    const query = args.join(' ')
    try {
      const { data } = await axios.post(
        `${baseURL}/stickerPack/smartSearch`,
        {
          keyword: query,
          enabledKeywordSearch: true,
          filter: {
            extendSearchResult: false,
            sortBy: 'RECOMMENDED',
            languages: ['ALL'],
            minStickerCount: 5,
            searchBy: 'ALL',
            stickerType: 'ALL',
          },
        },
        {
          headers: {
            'user-agent': 'androidapp.stickerly/3.17.0',
            'content-type': 'application/json',
          },
        }
      )
  
      const packs = data?.result?.stickerPacks || []
      if (!packs.length) return m.reply('Tidak ada pack ditemukan.')
  
      global.stickerlySession[m.sender] = packs.slice(0, 10)
  
      let teks = `*StickerLy Search: ${query}*\n\n`
      packs.slice(0, 10).forEach((p, i) => {
        teks += `${i + 1}. ${p.name}\n`
        teks += `Stiker: ${p.resourceFiles.length}\n\n`
      })
      teks += `Ketik angka 1-10 untuk pilih`
  
      m.reply(teks)
  
    } catch (e) {
      console.log(e)
      m.reply('Gagal mencari pack.')
    }
  }
  
  handler.before = async function (m, { conn }) {
    if (!/^(10|[1-9])$/.test(m.text)) return
  
    const session = global.stickerlySession?.[m.sender]
    if (!session) return
  
    const pack = session[Number(m.text) - 1]
    if (!pack) return m.reply('Nomor tidak valid.')
  
    delete global.stickerlySession[m.sender]
  
    m.reply(`Mengirim *${pack.name}*...`)
  
    try {
      let match = pack.shareUrl.match(/\/s\/([^\/\?#]+)/)
      if (!match) return m.reply('URL error.')
  
      let { data } = await axios.get(
        `${baseURL}/stickerPack/${match[1]}?needRelation=true`,
        {
          headers: {
            'user-agent': 'androidapp.stickerly/3.17.0',
            'content-type': 'application/json',
          },
        }
      )
  
      let stickers = data.result.stickers || []
      let prefix = data.result.resourceUrlPrefix
  
      if (!stickers.length) return m.reply('Kosong.')
  
      let limit = stickers.slice(0, 30)
  
      let stickerList = limit.map(s => ({
        data: { url: prefix + s.fileName }
      }))
  
      await conn.sendMessage(m.chat, {
        cover: { url: prefix + limit[0].fileName },
        stickers: stickerList,
        name: pack.name,
        publisher: 'WhatsApp Bot',
        description: 'WhatsApp Bot ᴍᴅ ʙy WhatsApp Bot'
      }, { quoted: m })
  
    } catch (e) {
      console.log(e)
      m.reply('Gagal ambil.')
    }
  }
  
  handler.help = ['stickerly']
  handler.tags = ['sticker']
  handler.command = /^(stly|stickerly)$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
