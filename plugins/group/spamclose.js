// group/spamclose — satu file: metadata + kode fitur (gabungan dari engine4/plugins/group/spamclose.js)
const __vx = require("../../lib/adapter/e4.js")
const __meta = {
  "name": "spamclose",
  "command": [
    "spamclose",
    "spam-close"
  ],
  "category": "group",
  "desc": "Otomatis menutup grup saat member mengirim 5 pesan beruntun",
  "usage": ".spamclose on/off",
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
module.exports = __vx.plugin("group/spamclose", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/spamclose.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'spamclose',
      alias: ['spam-close'],
      category: 'group',
      description: 'Otomatis menutup grup saat member mengirim 5 pesan beruntun',
      usage: '.spamclose on/off',
      example: '.spamclose on',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true,
      isAdmin: true,
      isBotAdmin: true
  };
  
  async function handler(m, { db }) {
      const mode = String(m.args?.[0] || '').toLowerCase();
      const group = db.getGroup(m.chat) || {};
  
      if (!['on', 'off'].includes(mode)) {
          const current = group.spamclose?.enabled === true;
          return m.reply(
              `╭─〔 🛡️ *SPAMCLOSE* 〕\n` +
              `│ Status : *${current ? 'ON 🟢' : 'OFF 🔴'}*\n` +
              `│ Trigger: *5 pesan beruntun*\n` +
              `│ Sticker : *ikut terdeteksi*\n` +
              `╰─╮\n` +
              `   ↳ Gunakan: *.spamclose on/off*`
          );
      }
  
      const enabled = mode === 'on';
      db.setGroup(m.chat, {
          spamclose: {
              ...(group.spamclose || {}),
              enabled,
          },
      });
  
      return m.reply(
          enabled
              ? `╭─〔 🛡️ *SPAMCLOSE AKTIF* 〕\n│ ✅ Mode: *ON*\n│ 🔢 Trigger: *5 pesan beruntun*\n│ 🧩 Sticker: *ikut dihitung*\n│ 🔒 Grup akan ditutup otomatis\n╰─╯`
              : `╭─〔 🛡️ *SPAMCLOSE NONAKTIF* 〕\n│ 🔴 Mode: *OFF*\n│ Bot tidak akan menutup grup karena spam.\n╰─╯`
      );
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
