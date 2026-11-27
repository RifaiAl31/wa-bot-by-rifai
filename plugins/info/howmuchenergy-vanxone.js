// info/howmuchenergy — satu file: metadata + kode fitur (gabungan dari engine3/plugins/info/howmuchenergy.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "howmuchenergy",
  "command": [
    "howmuchenergy"
  ],
  "category": "info",
  "desc": "Mengecek penggunaan energi banyak fitur sekaligus",
  "usage": ".howmuchenergy <nama_fitur1> <nama_fitur2> ...",
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
module.exports = __vx.plugin("info/howmuchenergy", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/howmuchenergy.js'
  const __vxExports = {};
  const { getPlugin } = require("../../lib/ext/src/lib/vanxone-plugins.js");
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  
  const config = {
    name: "howmuchenergy",
    alias: ["cekenergi"],
    category: "info",
    description: "Mengecek penggunaan energi banyak fitur sekaligus",
    usage: ".howmuchenergy <nama_fitur1> <nama_fitur2> ...",
    example: ".howmuchenergy hd jpm",
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
        `🔍 *PENGECEKAN ENERGI FITUR*\n\n` +
        `Sistem untuk mengetahui berapa besar potongan energi yang dibutuhkan untuk menggunakan satu atau banyak fitur sekaligus.\n\n` +
        `*PENGGUNAAN:*\n` +
        `- *${m.prefix}howmuchenergy <nama_fitur1> <nama_fitur2> ...*\n\n` +
        `*CONTOH PENGGUNAAN:*\n` +
        `- *${m.prefix}howmuchenergy hd jpm*\n\n` +
        `*PENJELASAN:*\n` +
        `Masukkan perintah beserta satu atau banyak nama fitur yang ingin kamu cek. Pisahkan dengan spasi.`
      );
    }
  
    await m.react("🕕");
    
    const db = getDatabase();
    const overrides = db.setting("capenergi") || {};
    
    let responseText = `🔋 *DETAIL ENERGI FITUR*\n\n`;
    
    for (const cmd of m.args) {
      const targetCommand = cmd.toLowerCase();
      const plugin = getPlugin(targetCommand);
      
      if (!plugin) {
        responseText += `❌ *${targetCommand}* : Tidak ditemukan!\n\n`;
        continue;
      }
      
      const energiCost = overrides[plugin.config.name] !== undefined 
        ? overrides[plugin.config.name] 
        : (plugin.config.energi || 0);
        
      responseText += `✅ *${plugin.config.name}* : ${energiCost} Energi\n`;
    }
  
    await m.react("✅");
    return m.reply(responseText.trim());
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => config });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
