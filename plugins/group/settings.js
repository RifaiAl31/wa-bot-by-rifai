// group/settings — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "settings",
    "setgc",
    "settingsgc"
  ],
  "category": "group",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur settings",
  "usage": ".settings <buka/tutup>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/group/settings", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/settings.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  let handler = async (m, { conn, args, usedPrefix, command }) => {
      let mode = (args[0] || '').toLowerCase();
      let isClose = {
          'open': 'not_announcement',
          'buka': 'not_announcement',
          'close': 'announcement',
          'tutup': 'announcement',
      }[mode];
  
      if (isClose === undefined) {
          return m.reply(
              `⚙️ *PENGATURAN GRUP*\n\n` +
              `📌 *Penggunaan:*\n` +
              `➤ ${usedPrefix + command} buka / open\n` +
              `➤ ${usedPrefix + command} tutup / close\n\n` +
              `👉 *Contoh:* ${usedPrefix + command} buka`
          );
      }
  
      try {
          await conn.groupSettingUpdate(m.chat, isClose);
          const isOpen = isClose === 'not_announcement';
          const msg = isOpen 
              ? `🔓 *GRUP DIBUKA*\n\n✅ Berhasil membuka grup. Sekarang semua anggota dapat mengirim pesan!`
              : `🔒 *GRUP DITUTUP*\n\n✅ Berhasil menutup grup. Sekarang hanya admin yang dapat mengirim pesan!`;
  
          await m.reply(msg);
      } catch (err) {
          console.error('GroupSettingUpdate Error:', err);
          m.reply(`❌ *Gagal mengubah pengaturan grup:* ${err.message || err}`);
      }
  };
  
  handler.help = ['settings <buka/tutup>', 'setgc <open/close>'];
  handler.tags = ['group'];
  handler.command = /^(settings|setgc|settingsgc|group)$/i;
  handler.group = true;
  handler.admin = true;
  handler.botAdmin = true;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
