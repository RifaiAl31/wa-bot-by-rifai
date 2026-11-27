// main/menuhtml — satu file: metadata + kode fitur (gabungan dari engine4/plugins/main/menuhtml.js)
const __vx = require("../../lib/adapter/e4.js")
const __meta = {
  "name": "menuhtml",
  "command": [
    "menuhtml",
    "htmlmenu",
    "menugamehtml"
  ],
  "category": "info",
  "desc": "Menu tombol untuk menjalankan semua game HTML WhatsApp Bot",
  "usage": ".menuhtml",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/menuhtml", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/menuhtml.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getAssetBuffer } = require("../../lib/ext/src/lib/vanxone-asset-manager.e4.js");
  const { runMenuLoading } = require("../../lib/ext/src/lib/menu-loading.js");
  const config = __vxDef(require("../../lib/ext/config.e4.js"));
  const pluginConfig = {
    name: "menuhtml",
    alias: ["htmlmenu", "menugamehtml"],
    category: "main",
    description: "Menu tombol untuk menjalankan semua game HTML WhatsApp Bot",
    usage: ".menuhtml",
    example: ".menuhtml",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  const HTML_GAMES = [
    { title: "Flappy Bird", description: "Game terbang melewati pipa", command: "flappy" },
    { title: "Catur", description: "Permainan catur interaktif", command: "catur" },
    { title: "XOZO", description: "Tic Tac Toe melawan robot", command: "xozo" },
    { title: "Dino Run", description: "Endless runner versi Dino Run", command: "dinorun" },
    { title: "PINZO", description: "Piano dengan 7 tuts", command: "pinzo" },
    { title: "KJZO", description: "Chase Runner", command: "kjzo" },
    { title: "PIXZO", description: "Pixel Maze", command: "pixzo" },
    { title: "ZONIC", description: "Speed Adventure endless runner", command: "zonic" },
    { title: "ZONIC V2", description: "Sonic Speed Adventure dengan laser dan boss", command: "zonicv2" },
  ];
  
  async function handler(m, { sock }) {
    const prefix = m.prefix || config.command?.prefix || ".";
    await runMenuLoading(sock, m.chat, "menu game HTML");
  
    const rows = HTML_GAMES.map((game) => ({
      title: game.title,
      description: `${game.description} • ${prefix}${game.command}`,
      id: `${prefix}${game.command}`,
    }));
  
    const buttons = [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "PILIH GAME HTML",
          sections: [{ title: "GAME WhatsApp Bot", rows }],
        }),
      },
    ];
  
    const caption = [
      "▪ MENU GAME HTML WhatsApp Bot",
      "",
      "Pilih tombol untuk menjalankan game yang diinginkan.",
      "Semua pilihan menggunakan command resmi bot.",
    ].join("\n");
  
    return sock.sendButton(m.chat, getAssetBuffer("WhatsApp Bot"), caption, m, {
      buttons,
      footer: `${config.bot?.name || "WhatsApp Bot"} | Menu HTML`,
    });
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
