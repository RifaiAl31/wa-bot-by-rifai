// stalker/pintereststalk — satu file: metadata + kode fitur (gabungan dari engine3/plugins/stalker/pintereststalk.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "pintereststalk",
  "command": [
    "pintereststalk",
    "pinterestid",
    "stalkpinterest",
    "stalkpin"
  ],
  "category": "stalker",
  "desc": "Melihat informasi lengkap akun Pinterest berdasarkan username.",
  "usage": ".pintereststalk <username>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/stalker").split('\\').join('/')
module.exports = __vx.plugin("stalker/pintereststalk", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/pintereststalk.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "pintereststalk",
    alias: ["pinterestid", "stalkpinterest", "stalkpin"],
    category: "stalker",
    description: "Melihat informasi lengkap akun Pinterest berdasarkan username.",
    usage: ".pintereststalk <username>",
    example: ".pintereststalk dims",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const username = m.text?.trim() || m.args[0];
  
    if (!username) {
      return m.reply("❌ *Waduh, username Pinterest-nya belum dimasukkan!*\n\nKamu harus mengetikkan username Pinterest yang ingin di-stalk. \n\nContoh: `.pintereststalk dims`");
    }
  
    await m.react("🕕");
  
    try {
      const res = await axios.get(`https://api.nexray.eu.cc/stalker/pinterest?username=${encodeURIComponent(username)}`, {
        timeout: 30000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });
      
      const data = res.data;
  
      if (!data.status || !data.result) {
        await m.react("❌");
        return m.reply(`⚠️ *Pencarian Gagal!*\n\nUsername *${username}* tidak ditemukan di Pinterest. Pastikan penulisannya sudah benar ya.`);
      }
  
      const r = data.result;
      
      let caption = `📌 *PINTEREST STALK - PROFILE INFO* 📌\n\n`;
      caption += `Halo! Ini dia hasil pencarian profil untuk username *@${r.username}*:\n\n`;
      
      caption += `👤 *INFO PROFIL*\n`;
      caption += `  - Nama Lengkap: *${r.full_name || "-"}*\n`;
      caption += `  - Username: @${r.username}\n`;
      caption += `  - Bio: ${r.bio || "-"}\n`;
      caption += `  - Tipe Akun: ${r.account_type || "-"}\n`;
      caption += `  - Akun Dibuat: ${r.created_at || "-"}\n\n`;
      
      caption += `📊 *STATISTIK*\n`;
      caption += `  - Pengikut (Followers): ${r.stats?.followers || 0}\n`;
      caption += `  - Diikuti (Following): ${r.stats?.following || 0}\n`;
      caption += `  - Total Pin: ${r.stats?.pins || 0}\n`;
      caption += `  - Total Board: ${r.stats?.boards || 0}\n\n`;
      
      caption += `🔗 *LINK PROFIL*\n`;
      caption += `  - ${r.profile_url}\n\n`;
  
      caption += `Suka mengumpulkan inspirasi dari Pinterest ya? Pamerin ke temanmu yuk! 🚀`;
  
      const imageUrl = r.image?.original || r.image?.large || r.image?.medium || r.image?.small;
  
      if (imageUrl) {
        await sock.sendMessage(m.chat, {
          image: { url: imageUrl },
          caption: caption
        }, { quoted: m });
      } else {
        await m.reply(caption);
      }
  
      await m.react("✅");
  
    } catch (error) { globalThis.__vanxoneCatch?.(error);
      console.error("[Pinterest Stalk]", error.message);
      await m.react("☢");
      m.reply("😔 *Terjadi masalah di sistem kami.* \n\nSistem gagal menarik data dari server Pinterest. Silakan coba beberapa saat lagi ya.");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
