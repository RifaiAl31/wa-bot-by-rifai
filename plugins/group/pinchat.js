// group/pinchat — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/pinchat.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "pinchat",
  "command": [
    "pinchat",
    "pinmsg"
  ],
  "category": "group",
  "desc": "Pin pesan penting di grup",
  "usage": ".pinchat (reply pesan)",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/pinchat", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/pinchat.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'pinchat',
      alias: ['pinmsg', 'pinpesan'],
      category: 'group',
      description: 'Pin pesan penting di grup',
      usage: '.pinchat (reply pesan)',
      example: '.pinchat',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true,
      isAdmin: true,
      isBotAdmin: true
  };
  
  async function handler(m, { sock, args }) {
      if (!m.quoted || !m.quoted.key || !m.quoted.key.id) {
          await m.reply(
              `⚠️ *ᴠᴀʟɪᴅᴀsɪ ɢᴀɢᴀʟ*\n\n` +
              `> Reply pesan yang ingin di-pin!\n\n` +
              `*Cara penggunaan:*\n` +
              `> Reply pesan → ketik \`.pinchat\`\n` +
              `> Optional: \`.pinchat 24\` (pin 24 jam)`
          );
          return;
      }
      
      let duration = 86400;
      if (args && args.length > 0 && args[0]) {
          const hours = parseInt(args[0]);
          if (!isNaN(hours) && hours >= 1 && hours <= 720) {
              duration = hours * 3600;
          }
      }
      
      try {
          const pinKey = {
              remoteJid: m.chat,
              fromMe: m.quoted.key.fromMe || false,
              id: m.quoted.key.id,
              participant: m.quoted.key.participant || m.quoted.sender
          };
          
          await sock.sendMessage(m.chat, {
              pin: pinKey,
              type: 1,
              time: duration
          });
          
          const durationText = duration >= 86400 
              ? `${Math.floor(duration / 86400)} hari` 
              : `${Math.floor(duration / 3600)} jam`;
          
          const successMsg = `✅ Success pin pesan ini`;
          await m.reply(successMsg, { mentions: [m.sender] })
          
      } catch (error) {
          await m.reply(
              `❌ *ᴇʀʀᴏʀ*\n\n` +
              `> Gagal mem-pin pesan.\n` +
              `> _${error.message}_`
          );
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
