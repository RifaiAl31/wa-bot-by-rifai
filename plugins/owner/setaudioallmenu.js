// owner/setaudioallmenu — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/setaudioallmenu.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "setaudioallmenu",
  "command": [
    "setaudioallmenu",
    "setaudioam",
    "audioallmenu"
  ],
  "category": "owner",
  "desc": "Mengatur gaya audio untuk All Menu",
  "usage": ".setaudioallmenu <1-4>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/setaudioallmenu", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setaudioallmenu.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  
  const pluginConfig = {
      name: "setaudioallmenu",
      alias: ["setaudioam", "audioallmenu"],
      category: "owner",
      description: "Mengatur gaya audio untuk All Menu",
      usage: ".setaudioallmenu <1-4>",
      example: ".setaudioallmenu 1",
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 0,
      energi: 0,
      isEnabled: true
  };
  
  async function handler(m, { sock }) {
      const db = getDatabase();
      const args = m.text?.trim();
  
      if (!args) {
          return m.reply(
              `⚠️ *PENGATURAN AUDIO ALL MENU*\n\n` +
              `Sistem manajemen gaya audio khusus untuk tampilan All Menu.\n\n` +
              `*PENGGUNAAN:*\n` +
              `• *${m.prefix}setaudioallmenu 1* — PTT Voice Note dengan reply pesan asli\n` +
              `• *${m.prefix}setaudioallmenu 2* — PTT Voice Note dengan reply fake polling\n` +
              `• *${m.prefix}setaudioallmenu 3* — Audio musik biasa dengan reply fake text\n` +
              `• *${m.prefix}setaudioallmenu 4* — Audio musik biasa dengan reply fake troli order\n\n` +
              `*PENJELASAN VARIAN:*\n` +
              `- *Varian 1 & 2* akan secara otomatis mengkonversi file MP3 menjadi Opus (Voice Note) murni menggunakan ffmpeg, sehingga terlihat lebih natural layaknya rekaman suara asli.\n` +
              `- *Varian 3 & 4* mengirimkan file dalam format MP3 biasa tanpa konversi, namun menggunakan *Fake Quoted* yang terlihat elegan dan keren di layar obrolan.\n\n` +
              `Saat ini All Menu menggunakan varian: *${db.setting("allmenuAudioStyle") || 1}*`
          );
      }
  
      const newStyle = parseInt(args);
      if (isNaN(newStyle) || newStyle < 1 || newStyle > 4) {
          return m.reply(`❌ *GAGAL*\n\nPilihan varian audio harus berupa angka 1 sampai 4.\nContoh: *${m.prefix}setaudioallmenu 2*`);
      }
  
      await m.react("🕕");
      db.setting("allmenuAudioStyle", newStyle);
      await m.reply(`✅ *BERHASIL*\n\nGaya audio All Menu telah sukses diubah menjadi *Varian ${newStyle}*. Silakan tes dengan mengetik *${m.prefix}allmenu*.`);
      await m.react("✅");
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
