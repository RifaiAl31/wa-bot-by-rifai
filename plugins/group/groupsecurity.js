// group/groupsecurity — satu file: metadata + kode fitur (gabungan dari engine7/plugins/group/groupsecurity.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "groupsecurity",
  "command": [
    "groupsecurity",
    "grupsecurity",
    "groupsec",
    "grupsec",
    "securitygrup"
  ],
  "category": "group",
  "desc": "Preset keamanan grup ketat untuk berbagai proteksi WhatsApp Bot",
  "usage": ".groupsecurity <on/off/status>",
  "owner": false,
  "group": true,
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
module.exports = __vx.plugin("group/groupsecurity", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/groupsecurity.js'
  const __vxExports = {};
  /*
  ╔══════════════════════════════════════════════╗
  ║       👑  WhatsApp Bot 𝑴𝑫 — GROUP SECURITY        ║
  ╚══════════════════════════════════════════════╝
  
  Fitur by: Owner Bot
  */
  
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  
  const pluginConfig = {
      name: 'groupsecurity',
      alias: ['grupsecurity', 'groupsec', 'grupsec', 'securitygrup'],
      category: 'group',
      description: 'Preset keamanan grup ketat untuk berbagai proteksi WhatsApp Bot',
      usage: '.groupsecurity <on/off/status>',
      example: '.groupsecurity on',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      isBotAdmin: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  const STRICT_SETTINGS = {
      groupSecurity: true,
      antilink: 'off',
      antilinkKick: 'on',
      antilinkKickLimit: 3,
      antiphising: 'on',
      antiphisingMode: 'remove',
      antijudol: 'on',
      antijudolMode: 'remove',
      antitoxic: true,
      antihidetag: 'on',
      antiviewonce: 'on',
      antidocument: true,
      antisticker: true,
      antimedia: true,
      antivirtex: true,
      antibot: true,
      antiswgc: 'on',
      antitagsw: 'on',
      antiflood: true
  }
  
  function onOff(value) {
      return value === true || value === 'on'
  }
  
  async function handler(m) {
      const db = getDatabase()
      const action = m.args?.[0]?.toLowerCase()
      const group = db.getGroup(m.chat) || {}
  
      if (!action || !['on', 'off', 'status'].includes(action)) {
          return m.reply(
              `🛡️ *GROUP SECURITY*\n\n` +
              `Mode: *${onOff(group.groupSecurity) ? 'STRICT ✅' : 'NORMAL ❌'}*\n\n` +
              `*Proteksi strict:*\n` +
              `> AntiLinkKick (${Number.parseInt(group.antilinkKickLimit, 10) || 3}x)\n` +
              `> AntiPhishing • AntiJudol • AntiToxic\n` +
              `> AntiHideTag • AntiViewOnce • AntiDocument • AntiSticker\n` +
              `> AntiMedia • AntiVirtex • AntiSWGC • AntiTagSW\n` +
              `> AntiFlood (${5} pesan / 5 detik)\n\n` +
              `> ${m.prefix}groupsecurity on\n` +
              `> ${m.prefix}groupsecurity off`
          )
      }
  
      if (action === 'status') {
          const checks = [
              ['AntiLinkKick', onOff(group.antilinkKick)],
              ['AntiPhishing', onOff(group.antiphising)],
              ['AntiJudol', onOff(group.antijudol)],
              ['AntiToxic', onOff(group.antitoxic)],
              ['AntiHideTag', onOff(group.antihidetag)],
              ['AntiViewOnce', onOff(group.antiviewonce)],
              ['AntiDocument', onOff(group.antidocument)],
              ['AntiSticker', onOff(group.antisticker)],
              ['AntiMedia', onOff(group.antimedia)],
              ['AntiVirtex', onOff(group.antivirtex)],
              ['AntiBot', onOff(group.antibot)],
              ['AntiSWGC', onOff(group.antiswgc)],
              ['AntiTagSW', onOff(group.antitagsw)],
              ['AntiFlood', onOff(group.antiflood)]
          ]
          return m.reply(
              `🛡️ *GROUP SECURITY STATUS*\n\n` +
              `> Mode: *${onOff(group.groupSecurity) ? 'STRICT ✅' : 'NORMAL ❌'}*\n` +
              `> AntiLinkKick limit: *${Number.parseInt(group.antilinkKickLimit, 10) || 3}x*\n\n` +
              checks.map(([name, state]) => `> ${state ? '✅' : '❌'} ${name}`).join('\n')
          )
      }
  
      if (action === 'on') {
          const currentLimit = Number.parseInt(group.antilinkKickLimit, 10)
          db.setGroup(m.chat, {
              ...STRICT_SETTINGS,
              antilinkKickLimit: Number.isInteger(currentLimit) && currentLimit >= 1 && currentLimit <= 20 ? currentLimit : 3
          })
          return m.reply(
              `🛡️ *GROUP SECURITY STRICT AKTIF*\n\n` +
              `Proteksi grup diperketat.\n` +
              `AntiLinkKick menggunakan batas *${Number.isInteger(currentLimit) && currentLimit >= 1 && currentLimit <= 20 ? currentLimit : 3}x* pelanggaran.`
          )
      }
  
      db.setGroup(m.chat, {
          groupSecurity: false,
          antilinkKick: 'off',
          antiflood: false,
          antiphising: 'off',
          antijudol: 'off',
          antitoxic: false,
          antihidetag: 'off',
          antiviewonce: 'off',
          antidocument: false,
          antisticker: false,
          antimedia: false,
          antivirtex: false,
          antibot: false,
          antiswgc: 'off',
          antitagsw: 'off'
      })
      return m.reply(`❌ *Group Security Strict dinonaktifkan*`)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
