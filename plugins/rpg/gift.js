// rpg/gift — satu file: metadata + kode fitur (gabungan dari engine3/plugins/rpg/gift.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "gift",
  "command": [
    "gift",
    "kasih",
    "hadiah"
  ],
  "category": "rpg",
  "desc": "Beri hadiah ke pasangan untuk meningkatkan love",
  "usage": ".gift <item> <jumlah>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/rpg").split('\\').join('/')
module.exports = __vx.plugin("rpg/gift", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gift.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
    name: "gift",
    alias: ["kasih", "hadiah"],
    category: "rpg",
    description: "Beri hadiah ke pasangan untuk meningkatkan love",
    usage: ".gift <item> <jumlah>",
    example: ".gift diamond 1",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const db = getDatabase();
    const user = db.getUser(m.sender);
  
    if (!user.rpg) user.rpg = {};
  
    if (!user.rpg.spouse) {
      return m.reply(`❌ *ʙᴇʟᴜᴍ ᴍᴇɴɪᴋᴀʜ*\n\n` + `> Kamu belum menikah!\n` + `> Nikah dulu dengan \`.marry @user\``);
    }
  
    const args = m.args || [];
    const itemKey = args[0]?.toLowerCase();
    const amount = parseInt(args[1]) || 1;
  
    if (!itemKey) {
      return m.reply(
        `🎁 *ɢɪꜰᴛ*\n\n` +
          `*📋 *ᴜsᴀɢᴇ:*
  \n` +
          `> > Pilih item untuk diberikan\n` +
          `> > \`.gift diamond 1\`\n` +
          ``,
      );
    }
  
    user.inventory = user.inventory || {};
  
    if ((user.inventory[itemKey] || 0) < amount) {
      return m.reply(`❌ *ɪᴛᴇᴍ ᴛɪᴅᴀᴋ ᴄᴜᴋᴜᴘ*\n\n` + `> Item *${itemKey}* kamu: ${user.inventory[itemKey] || 0}\n` + `> Butuh: ${amount}`);
    }
  
    const spouseJid = user.rpg.spouse;
    const partner = db.getUser(spouseJid);
  
    if (!partner) {
      return m.reply(`❌ *ᴘᴀsᴀɴɢᴀɴ ɴᴏᴛ ꜰᴏᴜɴᴅ*\n\n> Pasangan tidak ditemukan di database!`);
    }
  
    partner.inventory = partner.inventory || {};
  
    user.inventory[itemKey] -= amount;
    partner.inventory[itemKey] = (partner.inventory[itemKey] || 0) + amount;
  
    user.rpg.love = (user.rpg.love || 0) + amount * 10;
    if (partner.rpg) partner.rpg.love = (partner.rpg.love || 0) + amount * 10;
  
    db.save();
  
    let txt = `🎁 *ɢɪꜰᴛ sᴜᴋsᴇs*\n\n`;
    txt += `> 💝 Kamu memberikan ${amount}x ${itemKey}\n`;
    txt += `> 👤 Untuk: @${spouseJid.split("@")[0]}\n`;
    txt += `> 💕 Love: +${amount * 10}\n\n`;
    txt += `> _So sweet! 💖_`;
  
    await m.reply(txt, { mentions: [spouseJid] });
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
