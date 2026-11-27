// rpg/akuntt — satu file: metadata + kode fitur (gabungan dari engine7/plugins/rpg/akuntt.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "akuntiktok",
  "command": [
    "akuntiktok",
    "akuntiktokprofile",
    "akuntt"
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
module.exports = __vx.plugin("rpg/akuntt", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/akuntt.js'
  const __vxExports = {};
  const pluginConfig = {
    name: "akuntiktok",
    alias: ["akuntiktokprofile", "akuntt"],
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
  
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  let handler = async (m) => {
      let who = m.sender;
      const user = global.db.data.users[who];
  
      if (!user.tiktok || !user.tiktok.username) {
          return m.reply('❌ Anda belum memiliki akun TikTok! Gunakan perintah *.creatett <username>* untuk membuat akun.');
      }
  
      const { username, followers = 0, likes = 0, views = 0 } = user.tiktok;
  
      m.reply(`
  📱 **Profil TikTok Anda** 📱
  
  🔹 **Username**: ${username}
  ⭐ **Followers**: ${followers}
  ❤️ **Likes**: ${likes}
  👁️ **Views**: ${views}
  
  Gunakan perintah *.livett <judul>* untuk memulai siaran langsung.
      `.trim());
  };
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
