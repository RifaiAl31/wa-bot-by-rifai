// economy/xp-profile — satu file: metadata + kode fitur (gabungan dari engine2/plugins/economy/xp-profile.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "my"
  ],
  "category": "rpg",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur my (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/economy").split('\\').join('/')
module.exports = __vx.plugin("economy/xp-profile", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/xp-profile.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const PhoneNumber = __vxDef(require("awesome-phonenumber"));
  const moment = __vxDef(require("moment-timezone"));
  
  let handler = async (m, { conn }) => {
  
    let who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  
    if (!(who in global.db.data.users))
      return m.reply('WhatsApp Bot tidak menemukan user di database 🥜')
  
    let user = global.db.data.users[who]
  
    /* ================= FIX NaN ================= */
    const toNumber = (value, fallback = 0) => {
      value = Number(value)
      return Number.isFinite(value) ? value : fallback
    }
  
    if (!Number.isFinite(Number(user.limit))) user.limit = 0
    if (!Number.isFinite(Number(user.level))) user.level = 0
    if (!Number.isFinite(Number(user.exp))) user.exp = 0
  
    let name = user.registered ? user.name : await conn.getName(who)
    let number = PhoneNumber('+' + who.split('@')[0]).getNumber('international')
  
    let pp
    try {
      pp = await conn.profilePictureUrl(who, 'image')
    } catch {
      pp = 'https://i.ibb.co//profile.jpg'
    }
  
    let bio
    try {
      bio = (await conn.fetchStatus(who))?.status || 'Tidak ada bio'
    } catch {
      bio = 'Tidak ada bio'
    }
  
    let week = moment().tz('Asia/Jakarta').format('dddd')
    let date = moment().tz('Asia/Jakarta').format('DD MMMM YYYY')
    let time = moment().tz('Asia/Jakarta').format('HH:mm:ss')
  
    let role = user.role || 'Peanut Beginner'
    let level = toNumber(user.level)
    let exp = toNumber(user.exp)
    let limit = toNumber(user.limit)
  
    let registered = !!user.registered
  
    /* ================= BIRTHDAY + AGE SYNC ================= */
    let birthdayText = 'Belum di set 🥜'
    let ageText = '-'
  
    if (user.birthday) {
      const parts = user.birthday.split('-').map(Number)
  
      const d = parts[0]
      const m = parts[1]
      const y = parts[2]
  
      const months = [
        'Januari','Februari','Maret','April','Mei','Juni',
        'Juli','Agustus','September','Oktober','November','Desember'
      ]
  
      birthdayText = y
        ? `${d} ${months[m - 1]} ${y}`
        : `${d} ${months[m - 1]}`
  
      if (y) {
        let ageCalc = new Date().getFullYear() - y
  
        const now = new Date()
        const hasNotBirthday =
          now.getMonth() + 1 < m ||
          (now.getMonth() + 1 === m && now.getDate() < d)
  
        if (hasNotBirthday) ageCalc--
  
        ageText = `${ageCalc} tahun`
      }
    }
  
    let text = `
  🍿 *WhatsApp Bot Secret Profile*
  
  🎀 *Nama* : ${name}
  🎂 *Umur* : ${ageText !== '-' ? ageText : '-'}
  🎉 *Birthday* : ${birthdayText}
  💭 *Bio* : ${bio}
  
  🧸 *Tag* : @${who.split('@')[0]}
  📱 *Nomor* : ${number}
  
  ╭─⬣
  │ 🏅 Role : ${role}
  │ ⭐ Level : ${level}
  │ ✨ Exp : ${exp}
  │ 🎟️ Limit : ${limit}
  ╰────────────⬣
  
  📅 ${week}, ${date}
  ⏰ ${time}
  
  🥜 *Waku waku~*
  `.trim()
  
    let imagePayload = Buffer.isBuffer(pp)
      ? { image: pp }
      : { image: { url: pp } }
  
    await conn.sendMessage(m.chat, {
      ...imagePayload,
      caption: text,
      mentions: [who]
    }, { quoted: m })
  }
  
  handler.help = ['profile', 'profil', 'me', 'my']
  handler.tags = ['info', 'xp']
  handler.command = /^(profile|profil|me|my)$/i
  handler.limit = false
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
