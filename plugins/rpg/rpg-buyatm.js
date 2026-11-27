// rpg/rpg-buyatm — satu file: metadata + kode fitur (gabungan dari engine2/plugins/rpg/rpg-buyatm.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "buyatm"
  ],
  "category": "rpg",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur buyatm (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/rpg").split('\\').join('/')
module.exports = __vx.plugin("rpg/rpg-buyatm", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/rpg-buyatm.js'
  const __vxExports = {};
  let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender]
  
    if (user.atm) {
      return conn.reply(
        m.chat,
        '🌸 Kamu sudah memiliki ATM.',
        m
      )
    }
  
    const harga = 50000
  
    if (user.money < harga) {
      return conn.reply(
        m.chat,
        `🌸 Uang kamu kurang.\n\n💰 Harga ATM: ${harga}`,
        m
      )
    }
  
    user.money -= harga
    user.atm = true
    user.bank = 0
    user.fullatm = 1000
  
    conn.reply(
      m.chat,
      `
  🌸 *WhatsApp Bot ATM PURCHASE* ❀
  
  ╭──〔 ATM BERHASIL DIBELI 〕──╮
  │ 💳 ATM : Aktif
  │ 💰 Harga : ${harga}
  │ 🏦 Kapasitas : 1000
  ╰────────────────────╯
  `.trim(),
      m
    )
  }
  
  handler.help = ['buyatm']
  handler.tags = ['rpg']
  handler.command = /^buyatm$/i
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
