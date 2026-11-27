// maker/fakenotifwa — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/fakenotifwa.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "fakenotifwa",
  "command": [
    "fakenotifwa",
    "fakenotif",
    "notifwa"
  ],
  "category": "maker",
  "desc": "Membuat gambar tampilan fake notifikasi WhatsApp iOS via AlwaysCodex API",
  "usage": ".fakenotifwa nama|pesan|jam|tanggal (atau reply gambar untuk PP)",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/fakenotifwa", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fakenotifwa.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const { withNetworkRetry, formatNetworkError } = require("../../lib/ext/src/lib/vanxone-network.js");
  const FormData = __vxDef(require("form-data"));
  
  const pluginConfig = {
    name: "fakenotifwa",
    alias: ["fakenotif", "notifwa"],
    category: "maker",
    description: "Membuat gambar tampilan fake notifikasi WhatsApp iOS via AlwaysCodex API",
    usage: ".fakenotifwa nama|pesan|jam|tanggal (atau reply gambar untuk PP)",
    example: ".fakenotifwa WhatsApp Bot 💫|Haii sayangg udah makan belumm? 🥺|6.39|Senin, 6 Maret",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  async function uploadToCatbox(buffer) {
    try {
      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('fileToUpload', buffer, { filename: 'avatar.jpg' });
  
      const res = await axios.post('https://catbox.moe/user/api.php', form, {
        headers: form.getHeaders()
      });
      return res.data;
    } catch (err) {
      console.error('[CATBOX UPLOAD ERROR]', err);
      return null;
    }
  }
  
  async function handler(m, { sock, text }) {
    if (!text) {
      return m.reply(
        `⚠️ *Format Salah*\n\n` +
        `Penggunaan:\n\`.fakenotifwa nama|pesan|jam|tanggal\`\n\n` +
        `Contoh:\n\`.fakenotifwa WhatsApp Bot 💫|Haii sayangg udah makan belumm? 🥺|6.39|Senin, 6 Maret\`\n\n` +
        `_Catatan: Kirim/reply gambar untuk mengganti foto profil._`
      );
    }
  
    const [username, chat, jamInput, tanggalInput] = text.split('|').map(v => v ? v.trim() : '');
  
    if (!username || !chat) {
      return m.reply(`⚠️ Username dan pesan minimal harus diisi!\nContoh: \`.fakenotifwa Alwayscodex|Halo dek\``);
    }
  
    await m.react('⏳');
  
    try {
      let ppurl = '';
      const q = m.quoted ? m.quoted : m;
      const isImage = q.mtype === 'imageMessage' || q.type === 'imageMessage' || (q.msg && q.msg.mtype === 'imageMessage');
  
      // 1. Ambil foto profil dari gambar yang dikirim/direply
      if (isImage && typeof q.download === 'function') {
        const imgBuffer = await q.download();
        ppurl = await uploadToCatbox(imgBuffer);
      }
  
      // 2. Fallback ke Foto Profil WhatsApp Pengirim jika tidak ada gambar
      if (!ppurl) {
        try {
          ppurl = await sock.profilePictureUrl(m.sender, 'image');
        } catch {
          ppurl = 'https://files.catbox.moe/u8o0j2.jpg'; // Avatar default
        }
      }
  
      // Default Jam dan Tanggal jika tidak diisi user
      const jam = jamInput || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '.');
      const tanggal = tanggalInput || new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
  
      // Endpoint API AlwaysCodex
      const apiUrl = `https://api.nexray.web.id/maker/fakenotifwa?username=${encodeURIComponent(username)}&chat=${encodeURIComponent(chat)}&ppurl=${encodeURIComponent(ppurl)}&tanggal=${encodeURIComponent(tanggal)}&jam=${encodeURIComponent(jam)}`;
  
      const response = await withNetworkRetry(() => axios.get(apiUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }));
  
      await sock.sendMessage(m.chat, {
        image: Buffer.from(response.data),
        caption: `✨ *Fake Notification WhatsApp Generated!*`
      }, { quoted: m });
  
      await m.react('✅');
  
    } catch (error) {
      console.error('[FAKENOTIFWA ERROR]', error);
      await m.react('❌');
      await m.reply(`❌ *Terjadi Kesalahan API:* ${error.message}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
