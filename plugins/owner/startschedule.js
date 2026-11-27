// owner/startschedule — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/startschedule.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "startschedule",
  "command": [
    "startschedule",
    "startscheduler",
    "schedstart",
    "resumeschedule"
  ],
  "category": "owner",
  "desc": "Memulai ulang scheduler tertentu atau semua",
  "usage": ".startschedule <nama|all>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/startschedule", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/startschedule.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { startSchedulerByName, getFullSchedulerStatus } = require("../../lib/ext/src/lib/vanxone-scheduler.js");
  const { initSholatScheduler } = require("../../lib/ext/src/lib/vanxone-sholat-scheduler.js");
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  const pluginConfig = {
      name: 'startschedule',
      alias: ['startscheduler', 'schedstart', 'resumeschedule'],
      category: 'owner',
      description: 'Memulai ulang scheduler tertentu atau semua',
      usage: '.startschedule <nama|all>',
      example: '.startschedule sholat',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  };
  
  async function handler(m, { sock, args }) {
      try {
          const target = args[0]?.toLowerCase();
          
          if (!target) {
              const helpText = `▶️ *sᴛᴀʀᴛ sᴄʜᴇᴅᴜʟᴇʀ*
  
  *Usage:*
  \`.startschedule <nama>\`
  
  *Available schedulers:*
  • \`limitreset\` - Daily Limit Reset
  • \`groupschedule\` - Group Schedule
  • \`sewa\` - Sewa Checker
  • \`messages\` - Scheduled Messages
  • \`sholat\` - Sholat Scheduler
  • \`all\` - Semua scheduler
  
  *Example:*
  \`.startschedule sholat\`
  \`.startschedule all\``;
              
              await m.reply(helpText);
              return;
          }
          
          if (target === 'sholat') {
              const db = getDatabase();
              const wasEnabled = db.setting('autoSholat');
              
              if (wasEnabled) {
                  await m.reply(`ℹ️ Sholat Scheduler sudah dalam keadaan aktif`);
                  return;
              }
              
              initSholatScheduler(sock);
              db.setting('autoSholat', true);
              
              await m.reply(`▶️ *sᴄʜᴇᴅᴜʟᴇʀ ᴅɪᴍᴜʟᴀɪ*
  
  > Scheduler: *Sholat Scheduler*
  > Status: ✅ Aktif
  
  _Notifikasi waktu sholat akan dikirim ke grup yang mengaktifkan fitur ini_`);
              return;
          }
          
          if (target === 'all') {
              initSholatScheduler(sock);
              const db = getDatabase();
              db.setting('autoSholat', true);
          }
          
          const result = startSchedulerByName(target, sock);
          
          if (result.started) {
              await m.reply(`▶️ *sᴄʜᴇᴅᴜʟᴇʀ ᴅɪᴍᴜʟᴀɪ*
  
  > Scheduler: *${result.name}*
  > Status: ✅ Aktif
  
  _Scheduler telah dimulai kembali_`);
          } else {
              await m.reply(`❌ Scheduler tidak ditemukan atau sudah aktif
  
  Gunakan \`.startschedule\` untuk melihat daftar scheduler`);
          }
      } catch (error) {
          console.error('[StartSchedule Error]', error);
          await m.reply(te(m.prefix, m.command, m.pushName));
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
