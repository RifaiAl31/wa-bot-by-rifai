// owner/stopschedule — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/stopschedule.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "stopschedule",
  "command": [
    "stopschedule",
    "stopscheduler",
    "schedstop",
    "pauseschedule"
  ],
  "category": "owner",
  "desc": "Menghentikan scheduler tertentu atau semua",
  "usage": ".stopschedule <nama|all>",
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
module.exports = __vx.plugin("owner/stopschedule", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stopschedule.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { stopSchedulerByName, getFullSchedulerStatus } = require("../../lib/ext/src/lib/vanxone-scheduler.js");
  const { stopSholatScheduler } = require("../../lib/ext/src/lib/vanxone-sholat-scheduler.js");
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  const pluginConfig = {
      name: 'stopschedule',
      alias: ['stopscheduler', 'schedstop', 'pauseschedule'],
      category: 'owner',
      description: 'Menghentikan scheduler tertentu atau semua',
      usage: '.stopschedule <nama|all>',
      example: '.stopschedule sholat',
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
              const helpText = `🛑 *sᴛᴏᴘ sᴄʜᴇᴅᴜʟᴇʀ*
  
  *Usage:*
  \`.stopschedule <nama>\`
  
  *Available schedulers:*
  • \`limitreset\` - Daily Limit Reset
  • \`groupschedule\` - Group Schedule
  • \`sewa\` - Sewa Checker
  • \`messages\` - Scheduled Messages
  • \`sholat\` - Sholat Scheduler
  • \`all\` - Semua scheduler
  
  *Example:*
  \`.stopschedule sholat\`
  \`.stopschedule all\``;
              
              await m.reply(helpText);
              return;
          }
          
          if (target === 'sholat') {
              const db = getDatabase();
              const wasEnabled = db.setting('autoSholat');
              
              if (!wasEnabled) {
                  await m.reply(`ℹ️ Sholat Scheduler sudah dalam keadaan nonaktif`);
                  return;
              }
              
              stopSholatScheduler();
              db.setting('autoSholat', false);
              
              await m.reply(`🛑 *sᴄʜᴇᴅᴜʟᴇʀ ᴅɪʜᴇɴᴛɪᴋᴀɴ*
  
  > Scheduler: *Sholat Scheduler*
  > Status: ❌ Dihentikan
  
  _Gunakan \`.startschedule sholat\` untuk mengaktifkan kembali_`);
              return;
          }
          
          if (target === 'all') {
              stopSholatScheduler();
              const db = getDatabase();
              db.setting('autoSholat', false);
          }
          
          const result = stopSchedulerByName(target);
          
          if (result.stopped) {
              await m.reply(`🛑 *sᴄʜᴇᴅᴜʟᴇʀ ᴅɪʜᴇɴᴛɪᴋᴀɴ*
  
  > Scheduler: *${result.name}*
  > Status: ❌ Dihentikan
  
  _Gunakan \`.startschedule ${target}\` untuk mengaktifkan kembali_`);
          } else {
              await m.reply(`❌ Scheduler tidak ditemukan atau sudah nonaktif
  
  Gunakan \`.stopschedule\` untuk melihat daftar scheduler`);
          }
      } catch (error) {
          console.error('[StopSchedule Error]', error);
          await m.reply(te(m.prefix, m.command, m.pushName));
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
