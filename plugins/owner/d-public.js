// owner/public — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/public.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "public2",
  "command": [
    "public2",
    "publicmode"
  ],
  "category": "owner",
  "desc": "Mengaktifkan mode public (semua user bisa akses)",
  "usage": ".public2",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/public", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/public.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  /**
   * @file plugins/owner/public.js
   * @description Plugin untuk mengaktifkan mode public (semua bisa akses)
   */
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'public',
      alias: ['publicmode', 'open'],
      category: 'owner',
      description: 'Mengaktifkan mode public (semua user bisa akses)',
      usage: '.public',
      example: '.public',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  };
  
  /**
   * Handler untuk command public
   */
  async function handler(m, { sock }) {
      try {
          const isRealOwner = validateOwner(m);
          if (!isRealOwner) {
              return await m.reply('🚫 *ᴀᴋsᴇs ᴅɪᴛᴏʟᴀᴋ*\n\n> Hanya owner yang bisa mengubah mode bot!');
          }
          const currentMode = config.mode;
          if (currentMode === 'public') {
              return await m.reply('ℹ️ Bot sudah dalam mode *public*');
          }
          config.mode = 'public';
          const db = getDatabase();
          db.setting('botMode', 'public');
          
          const responseText = `🌐 *ᴍᴏᴅᴇ ᴘᴜʙʟɪᴄ ᴀᴋᴛɪꜰ*\n\n` +
              `> Bot sekarang merespon semua user!\n\n` +
              `_Gunakan .self untuk menutup akses_`;
          await m.reply(responseText);
          console.log(`[Mode] Changed to PUBLIC by ${m.pushName} (${m.sender})`);
      } catch (error) {
          console.error('[Public Command Error]', error);
          await m.reply(te(m.prefix, m.command, m.pushName));
      }
  }
  
  /**
   * Validasi owner dengan multiple checks
   */
  function validateOwner(m) {
      if (!m.isOwner) return false;
      if (m.fromMe) return true;
      const senderNumber = m.sender?.replace(/[^0-9]/g, '') || '';
      const ownerNumbers = config.owner?.number || [];
      
      const isInOwnerList = ownerNumbers.some(owner => {
          const cleanOwner = owner.replace(/[^0-9]/g, '');
          return senderNumber.includes(cleanOwner) || cleanOwner.includes(senderNumber);
      });
      if (!isInOwnerList) return false;
      if (!m.sender || !m.sender.includes('@')) return false;
      return true;
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
