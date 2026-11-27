// canvas/menumedia — satu file: metadata + kode fitur (gabungan dari engine4/plugins/canvas/menumedia.js)
const __vx = require("../../lib/adapter/e4.js")
const __meta = {
  "name": "menumedia",
  "command": [
    "menumedia",
    "mediamenu",
    "listmenumedia"
  ],
  "category": "image",
  "desc": "Menu fitur media: IQC, VOS, dan VOSV2.",
  "usage": ".menumedia",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/menumedia", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/menumedia.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getAssetBuffer } = require("../../lib/ext/src/lib/vanxone-asset-manager.e4.js");
  const { runMenuLoading } = require("../../lib/ext/src/lib/menu-loading.js");
  const configOwner = __vxDef(require("../../lib/ext/config.e4.js"));
  
  const pluginConfig = {
    name: "menumedia",
    alias: ["mediamenu", "listmenumedia"],
    category: "canvas",
    description: "Menu fitur media: IQC, VOS, dan VOSV2.",
    usage: ".menumedia",
    example: ".menumedia",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  function makeRows(prefix) {
    return [
      {
        title: "IQC",
        description: "Fake Quote iOS • .iqc WhatsApp Bot gamink",
        id: `${prefix}iqc WhatsApp Bot gamink`,
      },
      {
        title: "VOS",
        description: "Buat gambar quote dengan nama • .vos Jack,WhatsApp Bot Gamink",
        id: `${prefix}vos Jack,WhatsApp Bot Gamink`,
      },
      {
        title: "VOSV2",
        description: "Buat quote gaya Windows Media Player • .vosv2 WhatsApp Bot GAMINK",
        id: `${prefix}vosv2 WhatsApp Bot GAMINK`,
      },
    ];
  }
  
  async function sendMediaList(m, sock, prefix) {
    const rows = makeRows(prefix);
    const text =
      `╭─〔 🖼️ *WhatsApp Bot MEDIA* 〕─╮\n` +
      `│ IQC • VOS • VOSV2\n` +
      `╰────────────────╯\n\n` +
      `Pilih fitur dari tombol *LIST MENU MEDIA* di bawah.`;
  
    const buttons = [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "☰ LIST MENU MEDIA",
          sections: [{ title: "MEDIA WhatsApp Bot", rows }],
        }),
      },
    ];
  
    await sock.sendButton(m.chat, getAssetBuffer("WhatsApp Bot"), text, m, {
      buttons,
      footer: "WhatsApp Bot • Media",
    });
  }
  
  async function handler(m, { sock }) {
    await runMenuLoading(sock, m.chat, "menu media");
    const prefix = m.prefix || configOwner?.command?.prefix || ".";
    const args = (m.args || []).join(" ").trim().toLowerCase();
  
    if (args === "list" || args === "menu") {
      return sendMediaList(m, sock, prefix);
    }
  
    const text =
      `╭─〔 🖼️ *WhatsApp Bot MEDIA* 〕─╮\n` +
      `│ IQC • VOS • VOSV2\n` +
      `╰────────────────╯\n\n` +
      `Gunakan tombol *LIST MENU MEDIA* untuk melihat cara pakai dan memilih fitur.`;
  
    const buttons = [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "☰ LIST MENU MEDIA",
          sections: [{ title: "MEDIA WhatsApp Bot", rows: makeRows(prefix) }],
        }),
      },
    ];
  
    await sock.sendButton(m.chat, getAssetBuffer("WhatsApp Bot"), text, m, {
      buttons,
      footer: "WhatsApp Bot • Media",
    });
  
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
