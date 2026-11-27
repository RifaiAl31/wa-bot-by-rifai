// group/setwelcome — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/setwelcome.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "setwelcome",
  "command": [
    "customwelcome"
  ],
  "category": "group",
  "desc": "Set custom welcome message",
  "usage": ".setwelcome <pesan>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/setwelcome", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setwelcome.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
    name: "setwelcome",
    alias: ["customwelcome"],
    category: "group",
    description: "Set custom welcome message",
    usage: ".setwelcome <pesan>",
    example: ".setwelcome Halo {user}, selamat datang di {group}!",
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const db = getDatabase();
    const text = m.fullArgs?.trim() || m.args.join(" ");
  
    if (!text) {
      return m.reply(
        `📝 *sᴇᴛ ᴡᴇʟᴄᴏᴍᴇ*\n\n` +
          `╭┈┈⬡「 📋 *ᴘʟᴀᴄᴇʜᴏʟᴅᴇʀ* 」\n` +
          `┃ ◦ \`{user}\` - Nama member\n` +
          `┃ ◦ \`{number}\` - Nomor member\n` +
          `┃ ◦ \`{group}\` - Nama grup\n` +
          `┃ ◦ \`{desc}\` - Deskripsi grup\n` +
          `┃ ◦ \`{count}\` - Jumlah member\n` +
          `┃ ◦ \`{owner}\` - Nama owner grup\n` +
          `┃ ◦ \`{date}\` - Tanggal (DD/MM/YYYY)\n` +
          `┃ ◦ \`{time}\` - Waktu (HH:mm WIB)\n` +
          `┃ ◦ \`{day}\` - Hari (Senin, Selasa, dll)\n` +
          `┃ ◦ \`{bot}\` - Nama bot\n` +
          `┃ ◦ \`{prefix}\` - Prefix bot\n` +
          `╰┈┈⬡\n\n` +
          `\`Contoh:\`\n` +
          `\`${m.prefix}setwelcome Halo {user}! 👋\`\n` +
          `\`Selamat datang di {group} pada {day}, {date}\``,
      );
    }
  
    db.setGroup(m.chat, { welcomeMsg: text, welcome: true });
    db.save();
  
    m.react("✅");
  
    await m.reply(
      `✅ Welcome berhasil di set menjadi *${text}*\nMau reset? ketik ${m.prefix}resetwelcome`,
    );
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
