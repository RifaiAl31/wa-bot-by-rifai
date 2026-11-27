// user/hastag — satu file: metadata + kode fitur (gabungan dari engine7/plugins/user/hastag.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "hastag",
  "command": [
    "hastag",
    "sethastag",
    "formathastag"
  ],
  "category": "profil",
  "desc": "Menampilkan template hastag KGR dengan tombol copy otomatis",
  "usage": ".hastag",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/user").split('\\').join('/')
module.exports = __vx.plugin("user/hastag", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/hastag.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: 'hastag',
    alias: ['hastag', 'sethastag', 'formathastag'],
    category: 'user',
    description: 'Menampilkan template hastag KGR dengan tombol copy otomatis',
    usage: '.hastag',
    example: '.hastag',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
  };
  
  async function handler(m, { sock, text }) {
    // Hanya Murni Hastag (Tanpa Nama)
    const tagStyle1 = "#margakageri";
    const tagStyle2 = "#kagerifamily";
    const tagStyle3 = "#margakgr";
  
    // Merapikan teks body / caption
    const caption = `Hai *${m.pushName || 'Kak'}*! ✌️\n` +
                    `Berikut adalah variasi format hastag Kageri (KGR).\n\n` +
                    `👇 _Klik tombol di bawah untuk langsung menyalin hastag:_`;
  
    if (m.react) await m.react("⏳");
  
    try {
      // Mengirim Interactive Message dengan format proto Baileys
      await sock.relayMessage(
        m.chat,
        {
          viewOnceMessage: {
            message: {
              interactiveMessage: {
                header: {
                  title: "✨ *KAGERI HASTAG* ✨",
                  hasMediaAttachment: false
                },
                body: {
                  text: caption
                },
                footer: {
                  text: "© KGR Official Center"
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: 'cta_copy',
                      buttonParamsJson: JSON.stringify({
                        display_text: '📋 Copy #margakageri',
                        id: 'copy_tag_1',
                        copy_code: tagStyle1
                      })
                    },
                    {
                      name: 'cta_copy',
                      buttonParamsJson: JSON.stringify({
                        display_text: '📋 Copy #kagerifamily',
                        id: 'copy_tag_2',
                        copy_code: tagStyle2
                      })
                    },
                    {
                      name: 'cta_copy',
                      buttonParamsJson: JSON.stringify({
                        display_text: '📋 Copy #margakgr',
                        id: 'copy_tag_3',
                        copy_code: tagStyle3
                      })
                    }
                  ]
                }
              }
            }
          }
        },
        { quoted: m }
      );
  
      if (m.react) await m.react("✅");
  
    } catch (e) {
      console.error('[HASTAG ERROR]', e);
      if (m.react) await m.react("❌");
      return m.reply(`❌ *Gagal menampilkan tombol:* ${e.message}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
