// search/stickersearch — satu file: metadata + kode fitur (gabungan dari engine2/plugins/search/stickersearch.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "sigstick",
    "stickerfind"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur stickerfind (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/stickersearch", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stickersearch.js'
  const __vxExports = {};
  /**
   * Name : Sticker Telegram Search
   * Type : ESM
   * Url : https://www.sigstick.com
   */
  const { searchPack, getPack } = require("../../lib/ext/lib/scrape/stickersearch.js");
  
  if (!global.sigstickSession) {
    global.sigstickSession = {}
  }
  
  // ============================================================
  // HANDLER SEARCH
  // ============================================================
  let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args.length) {
      return m.reply(
        `🔎 *Sticker Search*\n\nContoh:\n${usedPrefix + command} WhatsApp Bot\n${usedPrefix + command} blue archive`
      )
    }
  
    const query = args.join(' ')
  
    try {
      await m.reply(`🔎 Mencari sticker pack *${query}*...`)
      const packs = await searchPack(query)
      
      if (!packs.length) {
        return m.reply(`❌ Tidak ada sticker pack untuk *${query}*.`)
      }
  
      const results = packs.slice(0, 10)
      
      // Session per sender
      global.sigstickSession[m.sender] = results
      
      let teks = `╭─「 *SIGSTICK SEARCH* 」\n` +
                 `│ 🔎 Query: *${query}*\n` +
                 `│ 📦 Total: *${packs.length}*\n` +
                 `╰────────────────\n\n`
                 
      results.forEach((p, i) => {
        teks += `*${i + 1}. ${p.title || 'Tanpa Judul'}*\n`
        if (p.status) teks += ` Status: ${p.status}\n`
        if (p.id) teks += ` ID: ${p.id}\n`
        if (p.telegramUrl) teks += ` Telegram: ${p.telegramUrl}\n`
        teks += '\n'
      })
      
      teks += `Reply angka *1-${results.length}* untuk mengirim pack.`
      await m.reply(teks)
      
    } catch (e) {
      console.error('[SIGSTICK SEARCH]', e)
      await m.reply(`❌ Gagal mencari sticker pack.\n\n${e.message}`)
    }
  }
  
  // ============================================================
  // REPLY NUMBER
  // ============================================================
  handler.before = async function (m, { conn }) {
    if (!m.text) return
    
    // Support 1 sampai 10
    if (!/^(10|[1-9])$/.test(m.text.trim())) return
  
    const session = global.sigstickSession?.[m.sender]
    if (!session) return
  
    const number = Number(m.text.trim())
    const pack = session[number - 1]
    
    if (!pack) {
      return m.reply('❌ Nomor sticker pack tidak valid.')
    }
  
    delete global.sigstickSession[m.sender]
    await m.reply(`📦 Mengambil pack *${pack.title || 'Sticker Pack'}*...`)
  
    try {
      const result = await getPack(pack)
      let stickers = result.stickers || []
      
      if (!stickers.length) {
        return m.reply('❌ Sticker dalam pack tidak ditemukan.')
      }
  
      // WhatsApp native sticker pack.
      // Batasi jumlah agar ukuran paket tidak terlalu berat.
      const limit = stickers.slice(0, 30)
      const stickerList = limit.map(url => ({ data: { url } }))
      
      // Perbaikan: limit[0] sudah berupa string URL, jadi tidak perlu .url
      const cover = limit[0]
      
      if (!cover) {
        return m.reply('❌ Cover sticker tidak ditemukan.')
      }
  
      await conn.sendMessage(
        m.chat, 
        {
          cover: { url: cover },
          stickers: stickerList,
          name: pack.title || 'SigStick Pack',
          publisher: 'WhatsApp Bot',
          description: 'WhatsApp Bot ᴍᴅ ʙy WhatsApp Bot'
        }, 
        { quoted: m }
      )
      
    } catch (e) {
      console.error('[SIGSTICK PACK]', e)
      await m.reply(`❌ Gagal mengambil sticker pack.\n\n${e.message}`)
    }
  }
  
  
  // ============================================================
  // COMMAND
  // ============================================================
  handler.help = ['stickersearch <keyword>']
  handler.tags = ['sticker']
  handler.command = /^(stickersearch|stickerfind|sigstick)$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
