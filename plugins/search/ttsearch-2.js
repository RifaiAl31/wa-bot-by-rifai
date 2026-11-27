// search/ttsearch — satu file: metadata + kode fitur (gabungan dari engine2/plugins/search/ttsearch.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "tiktoksearchvideo"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur tiktoksearchvideo (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/ttsearch", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ttsearch.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /*
  # Scrape : TikTok Search Video
  # Type : ESM Plugin
  # Url : https://www.revid.ai
  */
  
  const axios = __vxDef(require("axios"));
  
  const handler = async (m, {
      conn,
      text,
      usedPrefix,
      command
  }) => {
      if (!text) {
          return m.reply(
              `Contoh penggunaan:\n` +
              `${usedPrefix + command} cat\n\n` +
              `Contoh:\n` +
              `${usedPrefix + command} anime`
          )
      }
  
      const keywords = text.trim()
  
      const payload = {
          keywords,
          filtersFast: [
              `nbChar > 10`,
              `lang = 'en'`,
              `createTime >= 1742259708 AND createTime <= 1789563708`
          ],
          extraParams: {
              sort: ''
          }
      }
  
      try {
          await m.reply('🔎 Mencari video TikTok...')
  
          const { data } = await axios.post(
              'https://www.revid.ai/api/tiktok-search',
              payload,
              {
                  headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                  },
                  timeout: 30000
              }
          )
  
          if (!data) {
              throw new Error('Response kosong dari Revid API')
          }
  
          /*
           * Ambil hasil dari beberapa kemungkinan struktur response.
           */
          const results =
              data.results ||
              data.data ||
              data.videos ||
              data.items ||
              []
  
          if (!Array.isArray(results) || !results.length) {
              return m.reply(
                  `❌ Tidak ditemukan video untuk keyword *${keywords}*`
              )
          }
  
          let teks = `╭─〔 🔎 TIKTOK SEARCH 〕\n`
          teks += `│ Keyword: ${keywords}\n`
          teks += `│ Hasil: ${results.length}\n`
          teks += `╰───────────────\n\n`
  
          for (let i = 0; i < Math.min(results.length, 10); i++) {
              const item = results[i]
  
              const title =
                  item.title ||
                  item.description ||
                  item.desc ||
                  item.text ||
                  'Tanpa judul'
  
              const author =
                  item.author?.nickname ||
                  item.author?.uniqueId ||
                  item.author ||
                  item.username ||
                  item.user?.nickname ||
                  '-'
  
              const url =
                  item.url ||
                  item.videoUrl ||
                  item.webUrl ||
                  item.shareUrl ||
                  item.link ||
                  item.tiktokUrl ||
                  '-'
  
              teks += `*${i + 1}. ${title}*\n`
              teks += `👤 ${author}\n`
              teks += `🔗 ${url}\n\n`
          }
  
          await m.reply(teks)
  
      } catch (error) {
          console.error('[TIKTOK SEARCH]', error)
  
          let msg = error.message
  
          if (error.response) {
              msg =
                  `Revid API ${error.response.status}: ` +
                  (
                      typeof error.response.data === 'string'
                          ? error.response.data
                          : JSON.stringify(error.response.data)
                  )
          }
  
          await m.reply(
              `❌ Gagal mencari TikTok.\n\n` +
              `> ${msg}`
          )
      }
  }
  
  handler.help = ['ttsearch <keyword>']
  handler.tags = ['search']
  handler.command = /^(ttsearch|tiktoksearch|tiktoksearchvideo)$/i
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
