// search/spotify — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/spotify.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "spotify",
  "command": [
    "spotifysearch",
    "spsearch"
  ],
  "category": "search",
  "desc": "Mencari daftar lagu di Spotify berdasarkan judul atau artis",
  "usage": ".spotify <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/spotify", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/spotify.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const sharp = __vxDef(require("sharp"));
  
  const pluginConfig = {
    name: "spotify",
    alias: ["spotifysearch", "spsearch"],
    category: "search",
    description: "Mencari daftar lagu di Spotify berdasarkan judul atau artis",
    usage: ".spotify <query>",
    example: ".spotify neffex grateful",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text }) {
    if (!text) {
      return m.reply("❌ *Waduh, kata kuncinya mana nih?*\n\nKamu harus memasukkan judul lagu atau nama artis yang ingin dicari di Spotify. \n\nContoh penggunaan: `.spotify bruno mars`");
    }
  
    await m.react("🕕");
  
    try {
      const res = await axios.get(`https://api.nexray.eu.cc/search/spotify?q=${encodeURIComponent(text)}`);
      const data = res.data;
  
      if (!data.status || !data.result || data.result.length === 0) {
        await m.react("❌");
        return m.reply(`⚠️ *Maaf, lagu tidak ditemukan!* \n\nAku sudah mencari dengan kata kunci *${text}* tapi tidak ada hasil di Spotify. Coba gunakan judul yang lebih spesifik ya.`);
      }
  
      const results = data.result.slice(0, 5);
      const firstResult = results[0];
  
      let contentText = `✨ *HASIL PENCARIAN SPOTIFY* ✨\n\nHalo! Aku berhasil menemukan beberapa lagu berdasarkan kata kunci *${text}*. Berikut adalah daftar teratasnya:\n\n`;
  
      results.forEach((t, i) => {
        contentText += `*${i + 1}. ${t.title}*\n`;
        contentText += `   🎤 Artis: ${t.artist}\n`;
        contentText += `   ⏱️ Durasi: ${t.duration}\n`;
        contentText += `   🔗 Link: ${t.url}\n\n`;
      });
  
      contentText += `*Catatan*: Kamu bisa menyalin link lagu di atas dan menggunakan perintah \`.spdl <link>\` untuk mengunduhnya secara langsung! Atau tekan tombol di bawah ini untuk lagu pertama. 🚀`;
  
      let thumbnailBuffer = null;
      try {
        const imageResponse = await axios.get(firstResult.thumbnail, { responseType: "arraybuffer" });
        thumbnailBuffer = await sharp(imageResponse.data).resize(300, 170).jpeg().toBuffer();
      } catch (e) {
      }
  
      if (thumbnailBuffer) {
        await sock.sendButtons(m.chat, {
          location: {
            lat: 0,
            lng: 0,
            name: firstResult.title,
            address: `🎤 ${firstResult.artist} | ⏱️ ${firstResult.duration}`,
            jpegThumbnail: thumbnailBuffer,
          },
          text: contentText,
          footer: '🚀 WhatsApp Bot - Spotify Search',
          buttons: [
            { displayText: '🎵 Unduh Lagu Pertama', id: `.spdl ${firstResult.url}` },
          ],
        }, { quoted: m });
      } else {
        await m.reply(contentText);
      }
  
      await m.react("✅");
  
    } catch (err) {
      console.error("[Spotify Search]", err.message);
      await m.react("☢");
      m.reply("😔 *Aduh, sepertinya API sedang bermasalah.* \n\nTerjadi kesalahan fatal saat mencoba memproses pencarian Spotify. Silakan coba lagi nanti ya!");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
