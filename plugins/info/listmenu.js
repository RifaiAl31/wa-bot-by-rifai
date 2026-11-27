// main/listmenu — satu file: metadata + kode fitur (gabungan dari engine4/plugins/main/listmenu.js)
const __vx = require("../../lib/adapter/e4.js")
const __meta = {
  "name": "listmenu",
  "command": [
    "listmenu",
    "menugroup",
    "groupmenu",
    "listgroup"
  ],
  "category": "info",
  "desc": "Menampilkan semua menu grup beserta fungsi setiap command",
  "usage": ".listmenu",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/listmenu", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/listmenu.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");
  const config = __vxDef(require("../../lib/ext/config.e4.js"));
  const { getPluginsByCategory } = require("../../lib/ext/src/lib/vanxone-plugins.e4.js");
  
  const pluginConfig = {
    name: "listmenu",
    alias: ["menugroup", "groupmenu", "listgroup"],
    category: "main",
    description: "Menampilkan semua menu grup beserta fungsi setiap command",
    usage: ".listmenu",
    example: ".listmenu",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  const cleanText = (value, fallback = "Fitur grup") => {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    return text || fallback;
  };
  
  const truncate = (text, max = 72) => {
    const value = cleanText(text);
    return value.length > max ? `${value.slice(0, max - 1)}…` : value;
  };
  
  async function handler(m, { sock }) {
    const prefix = m.prefix || config.command?.prefix || ".";
    const plugins = getPluginsByCategory("group")
      .filter((plugin) => plugin?.config?.isEnabled !== false)
      .map((plugin) => plugin.config)
      .sort((a, b) => {
        const aName = Array.isArray(a.name) ? a.name[0] : a.name;
        const bName = Array.isArray(b.name) ? b.name[0] : b.name;
        return String(aName).localeCompare(String(bName));
      });
  
    const seen = new Set();
    const rows = [];
  
    for (const info of plugins) {
      const names = Array.isArray(info.name) ? info.name : [info.name];
      const name = String(names[0] || "").trim().toLowerCase();
      if (!name || seen.has(name)) continue;
      seen.add(name);
  
      const description = truncate(
        info.description || info.usage || "Fitur grup"
      );
  
      rows.push({
        title: `${prefix}${name}`,
        description,
        id: `${prefix}${name}`,
      });
    }
  
    if (!rows.length) {
      return m.reply("❌ Menu grup belum tersedia.");
    }
  
    // Dibagi beberapa section agar list tetap ringan dan mudah dibaca.
    const sections = [];
    const chunkSize = 10;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      sections.push({
        title: `GROUP MENU ${Math.floor(i / chunkSize) + 1}`,
        rows: chunk,
      });
    }
  
    const body = [
      `╭─〔 👥 GROUP MENU 〕─⬣`,
      `│ Total fitur: ${rows.length}`,
      `│ Pilih command untuk melihat/menjalankannya.`,
      `╰─⬣`,
    ].join("\n");
  
    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {},
            interactiveMessage: {
              body: { text: body },
              footer: { text: `${config.bot?.name || "WhatsApp Bot"} • Group Menu` },
              contextInfo: {
                mentionedJid: [m.sender],
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                      title: "☰ LIST MENU GROUP",
                      sections,
                    }),
                  },
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      display_text: "◆ KEMBALI",
                      id: `${prefix}menu`,
                    }),
                  },
                ],
              },
            },
          },
        },
      },
      { quoted: m, userJid: sock.user.jid }
    );
  
    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
