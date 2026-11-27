// rpg/sawer — satu file: metadata + kode fitur (gabungan dari engine7/plugins/rpg/sawer.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "sawer",
  "command": [
    "sawer",
    "nyawer"
  ],
  "category": "rpg",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": true,
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
module.exports = __vx.plugin("rpg/sawer", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sawer.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: "sawer",
    alias: ["nyawer"],
    category: "rpg",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { groupMetadata, command, sock, text, args, prefix }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
      //if (!Number(text)) throw 'Masukkan Angka';
      if (!args[0] || isNaN(args[0])) {
  		throw '*Example*: .sawer 1000';
  	};
  	let count = parseInt(args[0]);
      let ps = groupMetadata.participants.map(v => v.id);
      let a = ps[Math.floor(Math.random() * ps.length)]; // Memilih secara acak peserta dari array ps
      let name = await conn.getName(m.sender);
      let user = global.db.data.users[m.sender];
      let aa = global.db.data.users[a];
      
      if (user.money < count) return m.reply(`money kamu tidak cukup untuk sawer sebanyak ${count}`)
  
      let hsl = `*@${a.split`@`[0]}* Kamu mendapatkan saweran dari @${m.sender.split`@`[0]} sebesar *${count}* `;
      user.money -= count;
      aa.money += count;
  
      conn.reply(m.chat, hsl, m);
  }
  
  handler.register = true;
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
