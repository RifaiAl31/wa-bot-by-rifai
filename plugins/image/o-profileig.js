// canvas/profileig — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/profileig.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "profileig",
  "command": [
    "profileig"
  ],
  "category": "image",
  "desc": "Membuat canvas profile instagram",
  "usage": ".profileig <pengikut>|<mengikuti>|<postingan>|<username>|<bio>|<verif(true/false)>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/profileig", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/profileig.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { uploadImage } = require("../../lib/ext/src/lib/vanxone-uploader.js");
  const { downloadMediaMessage } = require("@whiskeysockets/baileys");
  
  const pluginConfig = {
      name: "profileig",
      alias: ["profileig", "igprofile"],
      category: "canvas",
      description: "Membuat canvas profile instagram",
      usage: ".profileig <pengikut>|<mengikuti>|<postingan>|<username>|<bio>|<verif(true/false)>",
      example: ".profileig 10M|1|150|jokowi|Presiden RI|true",
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 2,
      isEnabled: true,
  };
  
  async function handler(m, { sock, text }) {
      if (!text) return m.reply(`Format salah!\n\n> Contoh: .profileig 10M|1|150|jokowi|Presiden RI|true\n> \n> _Catatan: Reply gambar untuk dijadikan foto profil._`);
      const [pengikut, mengikuti, postingan, username, bio, verif] = text.split("|").map(v => v.trim());
      if (!pengikut || !mengikuti || !postingan || !username || !bio || !verif) return m.reply(`Pastikan semua argumen diisi dengan benar, dipisah dengan tanda |.`);
      
      let imgUrl = "";
      const isImage = m.type === "imageMessage" || (m.quoted && m.quoted.type === "imageMessage");
      
      await m.react("🕕");
      try {
          if (isImage) {
              const msg = m.quoted ? m.quoted : m;
              const buffer = await downloadMediaMessage(msg, "buffer", {}, { logger: console });
              imgUrl = await uploadImage(buffer);
          } else {
              try {
                  imgUrl = await sock.profilePictureUrl(m.sender, 'image');
              } catch (e) { globalThis.__vanxoneCatch?.(e);
                  // If user doesn't have a profile picture, provide a default URL
                  imgUrl = "https://i.ibb.co/3Fh9Q6M/blank-profile-picture.png";
              }
          }
          
          const url = `https://kyzznekoo.zone.id/api/canvas/profileig?url=${encodeURIComponent(imgUrl)}&pengikut=${encodeURIComponent(pengikut)}&mengikuti=${encodeURIComponent(mengikuti)}&postingan=${encodeURIComponent(postingan)}&username=${encodeURIComponent(username)}&bio=${encodeURIComponent(bio)}&verif=${encodeURIComponent(verif)}`;
          
          const res = await axios.get(url, {
              responseType: 'arraybuffer',
              headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
                  "Content-Type": "application/json"
              }
          });
          
          await sock.sendMessage(m.chat, { image: Buffer.from(res.data), caption: "✅ Berhasil membuat profile IG" }, { quoted: m });
          await m.react("✅");
      } catch (e) { globalThis.__vanxoneCatch?.(e);
          console.error("[ProfileIG Error]", e);
          await m.react("❌");
          m.reply(te(m.prefix, m.command, m.pushName));
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
