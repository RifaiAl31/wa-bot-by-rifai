// rpg/craft — satu file: metadata + kode fitur (gabungan dari engine3/plugins/rpg/craft.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "craft",
  "command": [
    "buat",
    "create"
  ],
  "category": "rpg",
  "desc": "Craft item dari materials",
  "usage": ".craft <item>",
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
module.exports = __vx.plugin("rpg/craft", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/craft.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  
  const pluginConfig = {
    name: "craft",
    alias: ["buat", "create"],
    category: "rpg",
    description: "Craft item dari materials",
    usage: ".craft <item>",
    example: ".craft sword",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 0,
    isEnabled: true,
  };
  
  const RECIPES = {
    sword: {
      name: "⚔️ Iron Sword",
      materials: { iron: 5, coal: 3 },
      result: "sword",
      bonus: { attack: 10 },
    },
    armor: {
      name: "🛡️ Iron Armor",
      materials: { iron: 10, coal: 5 },
      result: "armor",
      bonus: { defense: 15 },
    },
    pickaxe: {
      name: "⛏️ Diamond Pickaxe",
      materials: { diamond: 3, iron: 2 },
      result: "pickaxe",
      bonus: { mining: 20 },
    },
    rod: {
      name: "🎣 Golden Rod",
      materials: { gold: 5, iron: 2 },
      result: "rod",
      bonus: { fishing: 20 },
    },
    potion: {
      name: "🥤 Health Potion",
      materials: { fish: 3, rabbit: 2 },
      result: "potion",
      qty: 2,
    },
  };
  
  async function handler(m, { sock }) {
    const db = getDatabase();
    const user = db.getUser(m.sender);
  
    if (!user.inventory) user.inventory = {};
    if (!user.rpg) user.rpg = {};
  
    const args = m.args || [];
    const itemKey = args[0]?.toLowerCase();
  
    if (!itemKey) {
      let txt = `Halo Petualang! Mau merakit alat apa nih? 🛠️✨\n\n`;
      txt += `*Daftar Resep Rakitan:*\n`;
  
      for (const [key, recipe] of Object.entries(RECIPES)) {
        txt += `\n*${recipe.name}*\n`;
        txt += `📦 Bahan yang dibutuhin:\n`;
        for (const [mat, qty] of Object.entries(recipe.materials)) {
          const userHas = user.inventory[mat] || 0;
          const status = userHas >= qty ? "✅" : "❌";
          txt += `• ${status} ${mat}: ${userHas}/${qty}\n`;
        }
        txt += `👉 Ketik: \`.craft ${key}\`\n`;
      }
  
      return m.reply(txt);
    }
  
    const recipe = RECIPES[itemKey];
    if (!recipe) {
      return m.reply(`Hayo, mau rakit apaan tuh? Barangnya nggak ada di daftar kak! 😂\nCek list yang bener pake \`.craft\` ya!`);
    }
  
    const missingMaterials = [];
    for (const [mat, qty] of Object.entries(recipe.materials)) {
      if ((user.inventory[mat] || 0) < qty) {
        missingMaterials.push(`• ${mat}: ${user.inventory[mat] || 0}/${qty}`);
      }
    }
    
    if (missingMaterials.length > 0) {
        return m.reply(`Eits, bahannya belum cukup buat ngerakit *${recipe.name}* nih! 😭\n\nKekurangannya:\n${missingMaterials.join("\n")}\n\nKumpulin dulu deh, baru balik ke sini! 🏃💨`);
    }
  
    await m.react("🛠️");
    await m.reply(`Tok tok tok... Krek... 🛠️🔩\nSedang serius merakit *${recipe.name}*... Bentar lagi jadi!`);
    await new Promise((r) => setTimeout(r, 2000));
  
    for (const [mat, qty] of Object.entries(recipe.materials)) {
      user.inventory[mat] -= qty;
    }
  
    const resultQty = recipe.qty || 1;
    user.inventory[recipe.result] = (user.inventory[recipe.result] || 0) + resultQty;
  
    if (recipe.bonus) {
      for (const [stat, value] of Object.entries(recipe.bonus)) {
        user.rpg[stat] = (user.rpg[stat] || 0) + value;
      }
    }
  
    await m.react("✅");
  
    let txt = `YEAYY! BARANGNYA UDAH JADI! 🎉🛠️\n\n`;
    txt += `Kamu berhasil merakit:\n`;
    txt += `📦 Item: *${recipe.name} x${resultQty}*\n`;
  
    if (recipe.bonus) {
      txt += `\n*Status Bonus Aktif:*\n`;
      for (const [stat, value] of Object.entries(recipe.bonus)) {
        txt += `📈 ${stat.toUpperCase()}: *+${value}*\n`;
      }
    }
  
    await m.reply(txt);
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
