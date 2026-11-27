// main/order2 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/main/order2.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "sewa2",
  "command": [
    "sewa2",
  ],
  "category": "info",
  "desc": "Daftar paket keanggotaan grup.",
  "usage": ".sewa2 <kode>",
  "owner": false,
  "group": false,
  "private": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/order2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/order2.js'
  const __vxExports = {};
  const orders = {
  'G7': { name: '7 Day Join Group', price: 'Rp. 2.000' },
  'G30': { name: '30 Day Join Group', price: 'Rp. 5.000' },
  'G365': { name: '365 Day Join Group', price: 'Rp. 80.000' }
  }
  
  let handler = async (m, { sock, text }) => {
  if (!text) {
    return m.reply(
      `🌷 *PAKET KEANGGOTAAN GRUP*\n\n` +
      `❏ G7 → 7 Day Join Group — Rp. 2.000\n` +
      `❏ G30 → 30 Day Join Group — Rp. 5.000\n` +
      `❏ G365 → 365 Day Join Group — Rp. 80.000\n\n` +
      `Cara order: .sewa2 <kode>\n` +
      `Contoh: .sewa2 G30`
    )
  }
  
  let code = text.trim().toUpperCase()
  
  if (!orders[code]) {
  return m.reply('🌷 Kode paket tidak ditemukan.\n\n❏ Ketik .sewa2 untuk melihat daftar paket.')
  }
  
  let paket = orders[code]
  
  let orderMsg = `🌷 Pesanan Baru
  
  ❏ Nama : ${m.pushName}
  ❏ Paket : ${paket.name}
  ❏ Harga : ${paket.price}
  ❏ Waktu : ${new Date().toLocaleString('id-ID')}
  
  ✨ ${global.namebot || 'WhatsApp Bot'}`
  
  await m.reply(`🌷 Pesanan Berhasil Dibuat
  
  ❏ Paket : ${paket.name}
  ❏ Harga : ${paket.price}
  
  ❏ Pesanan telah dikirim ke Owner.
  ❏ Silakan tunggu konfirmasi ya.
  
  ✨ Terima kasih telah memesan.`)
  
  let owner = (Array.isArray(global.owner)
  ? global.owner[0]
  : global.owner) || global.ownernumber
  
  owner = String(owner || '').replace(/[^0-9]/g, '')
  
  await sock.sendMessage(owner + '@s.whatsapp.net', {
  text: orderMsg
  })
  }
  const pluginConfig = {
    name: 'sewa2',
    alias: [],
    category: 'main',
    description: 'Daftar paket keanggotaan grup.',
    usage: '.sewa2 <kode>',
    example: '.sewa2 <kode>',
    isOwner: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
