// sticker/brat — satu file: metadata + kode fitur (gabungan dari engine4/plugins/sticker/brat.js)
const __vx = require("../../lib/adapter/e4.js")
const __meta = {
  "name": "menusticker",
  "command": [
    "menusticker",
    "stikermenu",
    "listmenustiker",
    "liststiker"
  ],
  "category": "sticker",
  "desc": "Menu sticker WhatsApp Bot",
  "usage": ".menusticker",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/brat", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/brat.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getAssetBuffer } = require("../../lib/ext/src/lib/vanxone-asset-manager.e4.js");
  const { runMenuLoading } = require("../../lib/ext/src/lib/menu-loading.js");
  const config = __vxDef(require("../../lib/ext/config.e4.js"));
  const { prepareWAMessageMedia, generateWAMessageFromContent, jidNormalizedUser } = require("@whiskeysockets/baileys");
  const pluginConfig = {
    name: "menusticker",
    alias: ["stikermenu", "listmenustiker", "liststiker"],
    category: "sticker",
    description: "Menu sticker WhatsApp Bot",
    usage: ".menusticker",
    example: ".menusticker",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  const BRAT_VARIANTS = [
    { title: "🔥Gojo", description: "Sticker Gojo dengan teks", command: "gojo", sample: "WhatsApp Bot gamink" },
    { title: "🐙Squid", description: "Sticker papan Squid dengan teks", command: "squid", sample: "WhatsApp Bot gamink" },
    { title: "🧒Upin", description: "Sticker papan Upin dengan teks", command: "upin", sample: "WhatsApp Bot gamink" },
    { title: "🌸Vermeil", description: "Sticker Vermeil dengan teks", command: "vermeil", sample: "WhatsApp Bot gamink" },
    { title: "🌸Cewek", description: "Sticker cewek dengan teks", command: "cewek", sample: "WhatsApp Bot gamink" },
    { title: "📝Teks Brat", description: "Sticker Brat dari teks", command: "tekss", sample: "WhatsApp Bot gamink" },
    { title: "📽️Teks Video", description: "Sticker video teks animated", command: "teksvid", sample: "WhatsApp Bot gamink" },
    { title: "📽️Teks Video 2", description: "Sticker video teks versi 2", command: "teksvid2", sample: "WhatsApp Bot gamink" },
    { title: "📽️Gojo Video", description: "Sticker video Gojo", command: "gojovid", sample: "WhatsApp Bot gamink" },
    { title: "📽️Vermeil Video", description: "Sticker video Vermeil", command: "vermeilvid", sample: "WhatsApp Bot gamink" },
  ];
  
  function buildVariantRows(prefix) {
    return BRAT_VARIANTS.map((item) => {
      const sample = item.sample || "WhatsApp Bot gamink";
      const commandText = `${prefix}${item.command} ${sample}`;
      return {
        title: item.title,
        description: `${item.description} • ${commandText}`,
        id: commandText,
      };
    });
  }
  
  async function sendBratList(m, sock, prefix) {
    const caption =
      "✦ *LIST MENU STIKER WhatsApp Bot*\n\nPilih jenis stiker atau gunakan command sesuai format yang tersedia.";
    const buttons = [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "MENU STIKER",
          sections: [
            {
              title: "STIKER WhatsApp Bot",
              rows: buildVariantRows(prefix),
            },
          ],
        }),
      },
    ];
  
    await sock.sendButton(m.chat, getAssetBuffer("WhatsApp Bot"), caption, m, {
      buttons,
      footer: "WhatsApp Bot • Sticker Menu",
    });
  }
  
  async function sendBratMenu(m, sock, prefix) {
    const caption =
      "✦ *MENU STIKER WhatsApp Bot* ✦\n\nGunakan tombol *LIST MENU STIKER* untuk melihat semua fitur stiker.";
    const buttons = [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "LIST MENU STIKER",
          sections: [
            {
              title: "STIKER WhatsApp Bot",
              rows: buildVariantRows(prefix),
            },
          ],
        }),
      },
    ];
  
    await sock.sendButton(m.chat, getAssetBuffer("WhatsApp Bot"), caption, m, {
      buttons,
      footer: "WhatsApp Bot • Sticker",
    });
  }
  
  async function handler(m, { sock }) {
    await runMenuLoading(sock, m.chat, "menu stiker");
    const prefix = m.prefix || config.command?.prefix || ".";
    const args = (m.args || []).join(" ").trim().toLowerCase();
    if (args === "list" || args === "menu") {
      return sendBratList(m, sock, prefix);
    }
    await sendBratMenu(m, sock, prefix);
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
