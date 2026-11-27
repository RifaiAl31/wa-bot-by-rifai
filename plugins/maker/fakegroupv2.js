// maker/fakegroupv2 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/fakegroupv2.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "fakegroupv2",
  "command": [
    "fakegroupv2"
  ],
  "category": "maker",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/fakegroupv2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fakegroupv2.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const axios = __vxDef(require("axios"));
  const FormData = __vxDef(require("form-data"));
  
  async function uguu(buffer) {
    try {
      const form = new FormData()
      form.append("files[]", buffer, "image.jpg")
  
      const { data } = await axios.post(
        "https://uguu.se/upload",
        form,
        { headers: form.getHeaders() }
      )
  
      return data?.files?.[0]?.url || null
    } catch {
      return null
    }
  }
  
  const pluginConfig = {
    name: "fakegroupv2",
    alias: [],
    category: "maker",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text, prefix, command }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''
  
    if (!text) {
      throw `Contoh:
  ${usedPrefix + command} url|name|members|desc|author|date
  Reply gambar:
  ${usedPrefix + command} name|members|desc|author|date
  
  Contoh cepat:
  ${usedPrefix}fakegroupv2 WhatsApp Bot|500|Grup ytta|WhatsApp Bot|06/03/26 15:31`
    }
  
    await m.react('🕒')
  
    try {
      let url, name, members, desc, author, date
      let args = text.split('|').map(v => v?.trim())
  
      if (args.length === 6) {
        [url, name, members, desc, author, date] = args
      } else if (args.length === 5) {
        if (!mime.startsWith('image/')) {
          throw 'Reply atau kirim gambar untuk foto grup.'
        }
        ;[name, members, desc, author, date] = args
        let media = await q.download()
        url = await uguu(media)
        if (!url) throw 'Gagal upload gambar.'
      } else {
        throw `Format salah.
  Contoh:
  ${usedPrefix}fakegroupv2 WhatsApp Bot|500|Grup ytta|WhatsApp Bot|06/03/26 15:31`
      }
  
      let api = `https://api.zenzxz.my.id/maker/fakegroupv2?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}&members=${encodeURIComponent(members)}&desc=${encodeURIComponent(desc)}&author=${encodeURIComponent(author)}&date=${encodeURIComponent(date)}`
  
      let { data } = await axios.get(api, { responseType: 'arraybuffer' })
      let buffer = Buffer.from(data)
  
      await conn.sendMessage(m.chat, {
        image: buffer
      }, { quoted: global.fstatus })
  
    } catch (e) {
      m.reply(typeof e === 'string' ? e : '❌ Gagal membuat fake group v2.')
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
