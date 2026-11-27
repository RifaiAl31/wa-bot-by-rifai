// relationship/xp-birthday — satu file: metadata + kode fitur (gabungan dari engine2/plugins/relationship/xp-birthday.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "bday"
  ],
  "category": "fun",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur bday (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/relationship").split('\\').join('/')
module.exports = __vx.plugin("relationship/xp-birthday", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/xp-birthday.js'
  const __vxExports = {};
  let handler = async (m) => {
    const db = global.db?.data?.users
    if (!db) return m.reply('❌ DB tidak ditemukan')
  
    const target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
    const user = db[target]
  
    if (!user?.birthday) {
      return m.reply(
        target === m.sender
          ? '❌ Kamu belum set birthday'
          : '❌ User belum set birthday'
      )
    }
  
    const parts = user.birthday.split('-').map(Number)
  
    const d = parts[0]
    const mo = parts[1]
    const y = parts[2]
  
    const months = [
      'Januari','Februari','Maret','April','Mei','Juni',
      'Juli','Agustus','September','Oktober','November','Desember'
    ]
  
    const now = new Date()
    const year = now.getFullYear()
  
    let next = new Date(year, mo - 1, d)
    if (next < now) next = new Date(year + 1, mo - 1, d)
  
    const diff = Math.ceil((next - now) / 86400000)
  
    const isToday =
      now.getDate() === d &&
      now.getMonth() === mo - 1
  
    // UMUR REAL
    let ageText = '-'
    if (y) {
      let age = now.getFullYear() - y
      const hasNotBirthday =
        now.getMonth() + 1 < mo ||
        (now.getMonth() + 1 === mo && now.getDate() < d)
  
      if (hasNotBirthday) age--
      ageText = `${age} tahun`
    }
  
    let birthText = y
      ? `${d} ${months[mo - 1]} ${y}`
      : `${d} ${months[mo - 1]}`
  
    let text = `🎂 *BIRTHDAY INFO*\n\n`
    text += `👤 @${target.split('@')[0]}\n`
    text += `📅 ${birthText}\n`
    text += `🎂 Umur : ${ageText}\n`
  
    text += isToday
      ? `🎉 HARI INI ULTAH!\n`
      : `⏳ ${diff} hari lagi\n`
  
    if (isToday) text += `\n🎊 HAPPY BIRTHDAY 🎊`
  
    m.reply(text, { mentions: [target] })
  }
  
  handler.help = ['birthday']
  handler.tags = ['info', 'xp']
  handler.command = /^birthday|bday|ultah$/i
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
