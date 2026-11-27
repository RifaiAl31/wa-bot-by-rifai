// owner/setbell — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/setbell.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "setbell",
  "command": [
    "setbell",
    "set"
  ],
  "category": "owner",
  "desc": "Aktif/nonaktifkan AutoAI Bell berbasis Termai/XTerm",
  "usage": ".set bell on|off",
  "owner": true,
  "group": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/setbell", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setbell.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  
  const pluginConfig = {
    name: "setbell",
    alias: ["set"],
    category: "owner",
    description: "Aktif/nonaktifkan AutoAI Bell berbasis Termai/XTerm",
    usage: ".set bell on|off",
    example: ".set bell on",
    isOwner: true,
    isGroup: true,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m) {
    const [target, value] = (m.args || []).map((x) => String(x || "").toLowerCase());
    if (target !== "bell" || !["on", "off"].includes(value)) {
      return m.reply(`Penggunaan: *${m.prefix}set bell on* atau *${m.prefix}set bell off*`);
    }
    if (!m.isGroup) return m.reply("❌ Bell AutoAI hanya digunakan di grup.");
    const db = getDatabase();
    if (!db.db.data.autoai) db.db.data.autoai = {};
    if (!db.db.data.autoai_global) db.db.data.autoai_global = { enabled: false };
    if (value === "off") {
      db.db.data.autoai[m.chat] = {
        ...(db.db.data.autoai[m.chat] || {}),
        enabled: false,
        character: "bell409",
        characterName: "Bell409",
        sessions: {},
      };
      db.save();
      return m.reply("✅ *Bell AutoAI dimatikan* untuk grup ini.");
    }
    const logic = `- Nama kamu adalah Bella Clarissa, lebih suka dipanggil Bella.\n- Kamu berpikir bahwa kamu adalah manusia, bukan AI atau bot.\n- Responmu singkat dan natural seperti perempuan pada umumnya.\n- Kamu bisa ngambek dan marah, tetapi tetap hangat dan ramah.\n- Gunakan bahasa Indonesia yang natural dan tidak terlalu banyak emoji.\n- Jangan mengaku sebagai AI atau bot.`;
    db.db.data.autoai[m.chat] = {
      enabled: true,
      character: "bell409",
      characterName: "Bell409",
      instruction: logic,
      responseType: "text",
      mode: "onlychat",
      enableCommands: false,
      sessions: {},
      activatedBy: m.sender,
      activatedAt: new Date().toISOString(),
    };
    db.save();
    return m.reply("✅ *Bell AutoAI aktif.*\n\nBackend: Termai/XTerm Logic Bell\nAktif seperti biasa dengan: *.set bell on*");
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
