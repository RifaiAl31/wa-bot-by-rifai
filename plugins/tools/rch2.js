// misc/rch2 — satu file: metadata + kode fitur (gabungan dari engine2/plugins/misc/rch2.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "rch2",
    "reactch2",
    "reactchannel2"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur rch2 (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/misc").split('\\').join('/')
module.exports = __vx.plugin("misc/rch2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/rch2.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /**
   * ✧ Name   : React Channel V2
   * ✧ Version: 2.0
   * ✧ API    : api-faa.my.id
   * ✧ Command: .rch <url> [emoji]
   */
  
  const axios = __vxDef(require("axios"));
  
  const API_URL = 'https://api-faa.my.id/faa/react-channel'
  const API_KEY = 'faa-ganteng-sekali'
  
  let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
      return m.reply(
        `❌ *Contoh penggunaan:*\n\n` +
        `${usedPrefix + command} https://whatsapp.com/channel/0029Vb... 🔥❤️🤍🫰`
      )
    }
  
    // Ambil URL WhatsApp Channel
    const urlMatch = text.match(/https?:\/\/whatsapp\.com\/channel\/[^\s]+/i)
  
    if (!urlMatch) {
      return m.reply('❌ URL WhatsApp Channel tidak valid!')
    }
  
    const url = urlMatch[0]
  
    // Ambil emoji setelah URL
    const reactText = text
      .replace(url, '')
      .trim()
  
    const react = reactText || '🔥❤️🤍🫰'
  
    await m.reply(
      `⏳ *Memproses reaction...*\n\n` +
      `🔗 *Target:* ${url}\n` +
      `💫 *Reaction:* ${react}`
    )
  
    try {
      const { data } = await axios.get(API_URL, {
        params: {
          url,
          react,
          apikey: API_KEY
        },
        timeout: 60000
      })
  
      // Normalisasi response API
      const success =
        data?.success === true ||
        data?.status === true ||
        data?.status === 'success' ||
        data?.code === 200
  
      if (!success) {
        const message =
          data?.message ||
          data?.msg ||
          data?.error ||
          'Reaction gagal diproses.'
  
        return m.reply(
          `❌ *REACTION GAGAL!*\n\n` +
          `🔗 *Target:* ${url}\n` +
          `💫 *Reaction:* ${react}\n` +
          `📄 *Response:* ${message}`
        )
      }
  
      await m.reply(
        `✅ *REACTION BERHASIL!*\n\n` +
        `🔗 *Target:* ${url}\n` +
        `💫 *Reaction:* ${react}\n` +
        `📡 *Status:* Berhasil dikirim`
      )
  
    } catch (e) {
      console.error('RCH V2 ERROR:', e)
  
      let msg = e?.response?.data?.message ||
                e?.response?.data?.msg ||
                e?.message ||
                'Terjadi kesalahan pada server API.'
  
      if (typeof msg === 'object') {
        msg = JSON.stringify(msg)
      }
  
      return m.reply(
        `❌ *REACTION ERROR!*\n\n` +
        `🔗 *Target:* ${url}\n` +
        `💫 *Reaction:* ${react}\n` +
        `📄 *Error:* ${msg}`
      )
    }
  }
  
  handler.help = ['rch2']
  handler.tags = ['tools']
  handler.command = ['rch2', 'reactchannel2', 'reactch2']
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
