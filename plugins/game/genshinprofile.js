// game/genshinprofile — satu file: metadata + kode fitur (gabungan dari engine7/plugins/game/genshinprofile.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "genshinprofile",
  "command": [
    "genshinprofile"
  ],
  "category": "game",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/genshinprofile", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/genshinprofile.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const axios = __vxDef(require("axios"));
  
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "Origin": "https://enka.network",
    "Referer": "https://enka.network/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.89 Safari/537.36",
  };
  
  const pluginConfig = {
    name: "genshinprofile",
    alias: [],
    category: "game",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  const handler = async (m, { conn, args }) => {
    if (!args[0]) {
      return m.reply('Harap masukkan UID Genshin Impact yang valid!');
    }
  
    const text = args[0];
  
    try {
      m.reply('Wait...');
      
      let res = await axios.get(`https://enka.network/api/uid/${text.trim()}`, { headers });
      const player = res.data.playerInfo;
      const screenshot = `https://mini.s-shot.ru/990x810/PNG/975/Z100/?https://enka.network/u/${res.data.uid}/`;
  
      const caption = `
  *====== \`[Genshin Profile Info]\` ======*
  - Nickname: ${player.nickname}
  - Level: ${player.level}
  - World Level: ${player.worldLevel}
  - Achievement: ${player.finishAchievementNum}
  - Card ID: ${player.nameCardId}
  - Spiral Abyss: ${player.towerFloorIndex} - ${player.towerLevelIndex}
  
  - Detail: https://enka.network/u/${res.data.uid}
  - UID: ${res.data.uid}
      `.trim();
      
      await conn.sendMessage(
        m.chat,
        { image: { url: screenshot }, caption },
        { quoted: m }
      );
    } catch (error) {
      console.error(`Error: ${error.message}`);
      m.reply(`Terjadi kesalahan: ${error.message}`);
    }
  };
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
