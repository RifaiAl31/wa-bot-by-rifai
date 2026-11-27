// main/language — satu file: metadata + kode fitur (gabungan dari engine2/plugins/main/language.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "lang",
    "language"
  ],
  "category": "info",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur lang (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/language", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/language.js'
  const __vxExports = {};
  const { getChatLanguage, setChatLanguage } = require("../../lib/ext/lib/translator.js");
  
  let handler = async (m, { args, usedPrefix, command }) => {
    const current = getChatLanguage(m.chat);
    const input = String(args[0] || '').toLowerCase();
  
    // 1. Tampilkan status jika tidak ada argumen atau user mengetik status/cek/check
    if (!input || /^(status|cek|check)$/i.test(input)) {
      return m.reply(
        `🌐 *Auto Translate WhatsApp Bot*\n\n` +
        `Status / Status: *${current === 'en' ? 'English 🇬🇧' : 'Indonesia 🇮🇩'}*\n\n` +
        `Pilih bahasa / Choose language:\n` +
        `• ${usedPrefix + command} id — Indonesia 🇮🇩\n` +
        `• ${usedPrefix + command} en — English 🇬🇧\n` +
        `• ${usedPrefix + command} status — Status`
      );
    }
  
    // 2. Validasi input bahasa
    if (!['id', 'en'].includes(input)) {
      return m.reply(
        `❌ Bahasa / Language tidak tersedia.\n\n` +
        `Pilihan / Available:\n` +
        `• ${usedPrefix + command} id — Indonesia 🇮🇩\n` +
        `• ${usedPrefix + command} en — English 🇬🇧`
      );
    }
  
    // 3. Simpan pengaturan bahasa
    setChatLanguage(m.chat, input);
  
    // 4. Kirim respon sesuai bahasa yang dipilih
    if (input === 'en') {
      return m.reply(
        `🇬🇧 *Auto Translate: ON*\n\n` +
        `Bahasa diubah ke *English*.\n` +
        `Language changed to *English*.\n\n` +
        `Semua pesan plugin WhatsApp Bot akan otomatis diterjemahkan ke English.\n` +
        `All WhatsApp Bot plugin messages will be automatically translated to English.\n\n` +
        `Gunakan *${usedPrefix + command} id* untuk kembali ke Indonesia.\n` +
        `Use *${usedPrefix + command} id* to switch back to Indonesian.`,
        null,
        { __noTranslate: true }
      );
    }
  
    return m.reply(
      `🇮🇩 *Auto Translate: OFF*\n\n` +
      `Bahasa diubah ke *Indonesia*.\n` +
      `Language changed to *Indonesian*.\n\n` +
      `Pesan plugin kembali menggunakan bahasa Indonesia.\n` +
      `Plugin messages are now displayed in Indonesian.`,
      null,
      { __noTranslate: true }
    );
  };
  
  handler.help = ['lang <id|en>', 'language <id|en>'];
  handler.tags = ['main'];
  handler.command = /^(lang|language)$/i;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
