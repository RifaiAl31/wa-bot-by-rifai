// group/notifmakan — satu file: metadata + kode fitur (gabungan dari engine7/plugins/group/notifmakan.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "notifmakan",
  "command": [
    "notifmakan",
    "jadwalmakan",
    "makanreminder"
  ],
  "category": "group",
  "desc": "Atur pengingat waktu makan otomatis",
  "usage": ".notifmakan on <jam1,jam2,...> [menu] / off / edit <jam1,jam2,...> [menu]",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/notifmakan", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/notifmakan.js'
  const __vxExports = {};
  const { setNotifMakan, toggleNotif, getNotif, deleteNotif, parseJadwal } = require("../../lib/ext/src/lib/vanxone-notif-scheduler.js");
  
  const pluginConfig = {
      name: 'notifmakan',
      alias: ['jadwalmakan', 'makanreminder'],
      category: 'group',
      description: 'Atur pengingat waktu makan otomatis',
      usage: '.notifmakan on <jam1,jam2,...> [menu] / off / edit <jam1,jam2,...> [menu]',
      example: '.notifmakan on 07.00,12.00,19.00 Nasi Padang',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  function handler(m) {
      const args = m.args || []
      const sub = args[0]?.toLowerCase()
      const chatJid = m.chat
      const sender = m.sender
  
      const existing = getNotif('makan', sender, chatJid)
  
      if (!sub || !['on', 'off', 'edit'].includes(sub)) {
          const status = existing
              ? (existing.enabled ? '✅ Aktif' : '❌ Nonaktif')
              : '⚪ Belum diatur'
  
          let info = `🍽️ *PENGINGAT MAKAN*\n\n`
          info += `📌 *Status:* ${status}\n`
  
          if (existing) {
              info += `⏰ *Jadwal:* ${existing.jadwal.map(j => `*${j}* WIB`).join(', ')}\n`
              if (existing.menu) info += `🍴 *Menu:* _${existing.menu}_\n`
          }
  
          info += `\n*📋 Cara Pakai:*\n`
          info += `> \`${m.prefix}notifmakan on 07.00,12.00,19.00\`\n`
          info += `> \`${m.prefix}notifmakan on 07.00,12.00 Nasi Goreng\`\n`
          info += `> \`${m.prefix}notifmakan edit 08.00,13.00\`\n`
          info += `> \`${m.prefix}notifmakan off\`\n`
          info += `\n> 💡 _Jam bisa pakai titik atau titik dua (07.00 / 07:00)_\n`
          info += `> 💡 _Bisa multiple jam, pisahkan pakai koma_`
  
          return m.reply(info)
      }
  
      if (sub === 'off') {
          if (!existing) {
              return m.reply(`❌ *Belum ada pengingat makan* yang aktif di chat ini`)
          }
          toggleNotif('makan', sender, chatJid, false)
          return m.reply(`✅ *Pengingat makan dinonaktifkan* 🔕\n\n> Ketik \`${m.prefix}notifmakan on\` untuk mengaktifkan kembali`)
      }
  
      if (sub === 'on') {
          if (existing?.enabled && args.length === 1) {
              return m.reply(`⚠️ *Pengingat makan sudah aktif!*\n\n⏰ Jadwal: ${existing.jadwal.map(j => `*${j}*`).join(', ')} WIB\n\n> Gunakan \`${m.prefix}notifmakan edit\` untuk mengubah jadwal`)
          }
  
          if (existing && args.length === 1) {
              toggleNotif('makan', sender, chatJid, true)
              return m.reply(`✅ *Pengingat makan diaktifkan kembali!* 🔔\n\n⏰ Jadwal: ${existing.jadwal.map(j => `*${j}*`).join(', ')} WIB`)
          }
  
          const timeInput = args[1]
          if (!timeInput) {
              return m.reply(`❌ *Masukkan jadwal makan!*\n\n> Contoh: \`${m.prefix}notifmakan on 07.00,12.00,19.00\``)
          }
  
          const jadwal = parseJadwal(timeInput)
          if (jadwal.length === 0) {
              return m.reply(`❌ *Format jam salah!*\n\n> Gunakan format *HH.MM* atau *HH:MM*\n> Contoh: \`07.00,12.30,19.00\``)
          }
  
          const menu = args.slice(2).join(' ').trim()
          setNotifMakan(sender, chatJid, jadwal, menu)
  
          let reply = `✅ *Pengingat makan aktif!* 🔔\n\n`
          reply += `⏰ *Jadwal:*\n`
          for (const j of jadwal) {
              const label = getMealLabel(j)
              reply += `> 🕐 *${j}* WIB _(${label})_\n`
          }
          if (menu) reply += `\n🍴 *Menu:* _${menu}_`
          reply += `\n\n> 💡 _Notifikasi akan dikirim ke chat ini setiap hari_`
  
          return m.reply(reply)
      }
  
      if (sub === 'edit') {
          if (!existing) {
              return m.reply(`❌ *Belum ada pengingat makan!*\n\n> Aktifkan dulu: \`${m.prefix}notifmakan on 07.00,12.00,19.00\``)
          }
  
          const timeInput = args[1]
          if (!timeInput) {
              return m.reply(`❌ *Masukkan jadwal baru!*\n\n> Contoh: \`${m.prefix}notifmakan edit 08.00,13.00,20.00\``)
          }
  
          const jadwal = parseJadwal(timeInput)
          if (jadwal.length === 0) {
              return m.reply(`❌ *Format jam salah!*\n\n> Gunakan format *HH.MM* atau *HH:MM*\n> Contoh: \`08.00,13.00,20.00\``)
          }
  
          const menu = args.slice(2).join(' ').trim() || existing.menu || ''
          setNotifMakan(sender, chatJid, jadwal, menu)
  
          let reply = `✅ *Jadwal makan diperbarui!* ✏️\n\n`
          reply += `⏰ *Jadwal baru:*\n`
          for (const j of jadwal) {
              const label = getMealLabel(j)
              reply += `> 🕐 *${j}* WIB _(${label})_\n`
          }
          if (menu) reply += `\n🍴 *Menu:* _${menu}_`
  
          return m.reply(reply)
      }
  }
  
  function getMealLabel(jam) {
      const hour = parseInt(jam.split(':')[0], 10)
      if (hour >= 4 && hour < 10) return 'pagi'
      if (hour >= 10 && hour < 15) return 'siang'
      if (hour >= 15 && hour < 18) return 'sore'
      return 'malam'
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
