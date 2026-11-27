// group/fullpp — satu file: metadata + kode fitur (gabungan dari engine8/plugins/group/fullpp.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "fullpp",
  "command": [
    "fullpp",
    "setppfull",
    "ppfull"
  ],
  "category": "group",
  "desc": "Set Foto Profil Group/Bot tanpa crop (Full Size)",
  "usage": ".fullpp <reply/kirim gambar>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/fullpp", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fullpp.js'
  const __vxExports = {};
  /**
   * Group / Bot Full PP (No Crop / Full Size)
   * Adapted for ChiiMD2 / WhatsApp Bot Engine
   */
  
  const { sharp } = require("../../lib/ext/src/lib/vanxone-lazy.js");
  const { downloadContentFromMessage } = require("@whiskeysockets/baileys"); // Kita pakai core downloader
  
  const pluginConfig = {
      name: "fullpp",
      alias: ["setppfull", "ppfull"],
      category: "group",
      description: "Set Foto Profil Group/Bot tanpa crop (Full Size)",
      usage: ".fullpp <reply/kirim gambar>",
      isOwner: false,
      isGroup: false,
      isEnabled: true,
  };
  
  async function generateFullProfilePicture(buffer) {
      const img = await sharp(buffer)
          .resize(720, 720, { fit: 'inside' })
          .jpeg({ quality: 90 })
          .toBuffer();
      return img;
  }
  
  const S_WHATSAPP_NET = '@s.whatsapp.net';
  
  async function setFullProfilePicture(conn, jid, buffer) {
      const img = await generateFullProfilePicture(buffer);
  
      await conn.query({
          tag: 'iq',
          attrs: {
              target: jid,
              to: S_WHATSAPP_NET,
              type: 'set',
              xmlns: 'w:profile:picture',
          },
          content: [{
              tag: 'picture',
              attrs: { type: 'image' },
              content: img,
          }],
      });
  }
  
  async function handler(m, { sock }) {
      const conn = sock || m.conn;
  
      // Validasi Hak Akses (Biar aman)
      if (m.isGroup && !m.isAdmin && !m.isOwner) {
          return m.reply("❌ Perintah ini hanya bisa digunakan oleh *Admin Grup*.");
      }
      if (!m.isGroup && !m.isOwner) {
          return m.reply("❌ Perintah ini hanya bisa digunakan oleh *Owner Bot*.");
      }
  
      // Deteksi Gambar Fleksibel
      const q = m.quoted ? m.quoted : m;
      const mime = (q.msg || q).mimetype || q.mediaType || '';
      const isImage = /image/i.test(mime) || q.mtype === 'imageMessage' || q.type === 'imageMessage';
  
      if (!isImage) {
          return m.reply(`❌ *Format Salah!*\n\n> Balas (reply) gambar atau kirim gambar dengan caption *${m.prefix}fullpp* untuk dijadikan PP.`);
      }
  
      await m.react("⏳");
  
      try {
          let mediaBuffer;
          
          // Coba pakai fungsi download bawaan jika ada
          if (typeof q.download === 'function') {
              mediaBuffer = await q.download();
          } else {
              // Bypass fungsi error dengan core downloader low-level
              const messageContent = q.msg || q; 
              const stream = await downloadContentFromMessage(messageContent, 'image');
              
              let buffer = Buffer.from([]);
              for await (const chunk of stream) {
                  buffer = Buffer.concat([buffer, chunk]);
              }
              mediaBuffer = buffer;
          }
  
          if (!mediaBuffer) {
              throw new Error('Gagal menyedot data gambar (Buffer kosong).');
          }
  
          // Tentukan Target JID (Kalau di grup, ganti PP Grup. Kalau di private, ganti PP Bot)
          const targetJid = m.isGroup 
              ? m.chat 
              : (conn.user?.id ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : m.sender);
  
          // Eksekusi Stanza IQ untuk bypass cropping
          await setFullProfilePicture(conn, targetJid, mediaBuffer);
  
          await m.react("✅");
          return m.reply(`🎉 *Berhasil!*\n\n> Foto profil ${m.isGroup ? 'grup' : 'bot'} berhasil diperbarui menjadi *Full Size* tanpa terpotong.`);
  
      } catch (e) {
          console.error('[FullPP Error]', e);
          await m.react("❌");
          return m.reply(`⚠️ *Gagal Mengubah Foto Profil*\n\n> ${e.message || e}`);
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
