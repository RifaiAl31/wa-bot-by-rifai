// canvas/fakeml — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/fakeml.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "fakeml",
  "command": [
    "fakeml",
    "mlbbfake",
    "mlcard",
    "mlfake"
  ],
  "category": "image",
  "desc": "Membuat fake ML profile card",
  "usage": ".fakeml <nama> (reply/kirim foto)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/fakeml", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fakeml.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const { getAssetBuffer } = require("../../lib/ext/src/lib/vanxone-asset-manager.js");
  const _canvas = __vxNs(require("@napi-rs/canvas"));
  const axios = __vxDef(require("axios"));
  const path = __vxDef(require("path"));
  const fs = __vxDef(require("fs"));
  
  
  const { uploadTo0x0 } = require("../../lib/ext/src/lib/vanxone-tmpfiles.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
    name: "fakeml",
    alias: ["mlbbfake", "mlcard", "mlfake"],
    category: "canvas",
    description: "Membuat fake ML profile card",
    usage: ".fakeml <nama> (reply/kirim foto)",
    example: ".fakeml Misaki",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  let fontRegistered = false;
  async function handler(m, { sock }) {
    const name = m.text?.trim();
    if (!name) {
      return m.reply(
        `🎮 *ꜰᴀᴋᴇ ᴍʟ ᴘʀᴏꜰɪʟᴇ*\n\n` +
          `> Masukkan nama untuk profile\n\n` +
          `*ᴄᴀʀᴀ ᴘᴀᴋᴀɪ:*\n` +
          `> 1. Kirim foto + caption \`${m.prefix}fakeml <nama>\`\n` +
          `> 2. Reply foto dengan \`${m.prefix}fakeml <nama>\``,
      );
    }
    let buffer = null;
    if (
      m.quoted &&
      (m.quoted.type === "imageMessage" || m.quoted.mtype === "imageMessage")
    ) {
      try {
        buffer = await m.quoted.download();
      } catch (e) { globalThis.__vanxoneCatch?.(e);
        m.reply(te(m.prefix, m.command, m.pushName));
      }
    } else if (m.isMedia && m.type === "imageMessage") {
      try {
        buffer = await m.download();
      } catch (e) { globalThis.__vanxoneCatch?.(e);
        m.reply(te(m.prefix, m.command, m.pushName));
      }
    } else {
      try {
        let te = await sock.profilePictureUrl(m.sender, "image");
        buffer = Buffer.from(
          (await axios.get(te, { responseType: "arraybuffer" })).data,
        );
      } catch (error) { globalThis.__vanxoneCatch?.(error);
        buffer = getAssetBuffer("pp-kosong");
      }
    }
    if (!buffer) {
      return m.reply(`❌ Kirim/reply gambar untuk dijadikan avatar!`);
    }
    m.react("🕕");
    try {
      const gmbr = await uploadTo0x0(buffer, {
        filename: "image.jpg",
        contentType: "image/jpeg",
      });
      await sock.sendMedia(
        m.chat,
        `https://api.nexray.web.id/maker/fakelobyml?avatar=${encodeURIComponent(gmbr.directUrl)}&nickname=${encodeURIComponent(name)}`,
        null,
        m,
        {
          type: "image",
        },
      );
      m.react("✅");
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      m.react("❌");
      m.reply(`Coba lagi`);
    }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
