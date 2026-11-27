// rpg/pointxp — satu file: metadata + kode fitur (gabungan dari engine7/plugins/rpg/pointxp.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "expoint",
  "command": [
    "expoint"
  ],
  "category": "rpg",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/rpg").split('\\').join('/')
module.exports = __vx.plugin("rpg/pointxp", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/pointxp.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: "expoint",
    alias: [],
    category: "rpg",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, args }) {
      const conn = sock;
    let user = global.db.data.users[m.sender];
    if (!user) throw "Data pengguna tidak ditemukan. Pastikan Anda terdaftar!";
  
    // Periksa argumen
    if (!args[0]) return m.reply("Gunakan format: `.expoint [type]|[jumlah]`\nContoh: `.expoint mana|1`");
    const [type, jumlahStr] = args[0].split('|');
    if (!type || !jumlahStr) return m.reply("Format salah. Gunakan format `.expoint [type]|[jumlah]`.");
  
    let jumlah = parseInt(jumlahStr);
    if (isNaN(jumlah) || jumlah <= 0) return m.reply("Jumlah harus berupa angka positif.");
  
    // Daftar jenis poin yang dapat dibeli
    const validTypes = ['mana', 'health', 'stamina'];
    if (!validTypes.includes(type)) return m.reply(`Tipe tidak valid. Pilih salah satu: ${validTypes.join(', ')}`);
  
    // Harga per poin (ubah sesuai kebutuhan)
    const pricePerPoint = 100; // Harga per poin
    const totalCost = jumlah * pricePerPoint;
  
    // Periksa apakah pengguna memiliki cukup uang
    if (user.money < totalCost) {
      return m.reply(`Uang kamu tidak cukup! Kamu butuh Rp ${new Intl.NumberFormat('id-ID').format(totalCost)} untuk membeli ${jumlah} ${type}.`);
    }
  
    // Proses pembelian
    user.money -= totalCost;
    user[type] = (user[type] || 0) + jumlah;
  
    // Balasan berhasil
    m.reply(`Pembelian berhasil! Kamu membeli ${jumlah} ${type} seharga Rp ${new Intl.NumberFormat('id-ID').format(totalCost)}.\nSaldo tersisa: Rp ${new Intl.NumberFormat('id-ID').format(user.money)}.`);
  };
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
