// info/whatrolethis — satu file: metadata + kode fitur (gabungan dari engine3/plugins/info/whatrolethis.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "whatrolethis",
  "command": ["whatrolethis", "whatrole"],
  "category": "info",
  "desc": "Cek persyaratan akses banyak fitur sekaligus",
  "usage": ".whatrolethis <nama_fitur1> <nama_fitur2> ...",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/info").split('\\').join('/')
module.exports = __vx.plugin("info/whatrolethis", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/whatrolethis.js'
  const __vxExports = {};
  const { getPlugin } = require("../../lib/ext/src/lib/vanxone-plugins.js");
  
  const config = {
    name: "whatrolethis",
    alias: ["whatrole", "cekrole", "cekakses"],
    category: "info",
    description: "Cek persyaratan akses banyak fitur sekaligus",
    usage: ".whatrolethis <nama_fitur1> <nama_fitur2> ...",
    example: ".whatrolethis hd jpm",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    if (m.args.length === 0) {
      return m.reply(
        `🔍 *PENGECEKAN AKSES FITUR*\n\n` +
        `Sistem untuk mengetahui detail informasi persyaratan akses sebuah fitur atau beberapa fitur sekaligus.\n\n` +
        `*PENGGUNAAN:*\n` +
        `- *${m.prefix}whatrolethis <nama_fitur1> <nama_fitur2> ...*\n\n` +
        `*CONTOH PENGGUNAAN:*\n` +
        `- *${m.prefix}whatrolethis hd jpm warn*\n\n` +
        `*PENJELASAN:*\n` +
        `Masukkan perintah beserta satu atau banyak nama fitur yang ingin kamu cek. Pisahkan dengan spasi.`
      );
    }
  
    await m.react("🕕");
    
    let responseText = `🔍 *DETAIL AKSES FITUR*\n\n`;
    
    for (const cmd of m.args) {
      const targetCommand = cmd.toLowerCase();
      const plugin = getPlugin(targetCommand);
      
      if (!plugin) {
        responseText += `❌ *${targetCommand}* : Tidak ditemukan!\n\n`;
        continue;
      }
      
      let roles = [];
      
      if (plugin.config.isOwner) roles.push("Owner Only 👑");
      if (plugin.config.isAdmin) roles.push("Admin Grup 👮");
      if (plugin.config.isBotAdmin) roles.push("Bot Admin 🤖");
      if (plugin.config.isGroup) roles.push("Grup Only 👥");
      if (plugin.config.isPrivate) roles.push("Private Chat 📱");
      if (roles.length === 0) {
        roles.push("Free / Semua Orang 🆓");
      }
      
      let listRoles = roles.map(r => `  - ${r}`).join("\n");
      responseText += `✅ *${plugin.config.name}*\n${listRoles}\n\n`;
    }
  
    await m.react("✅");
    return m.reply(responseText.trim());
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => config });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
