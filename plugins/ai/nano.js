// ai-image/nano — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai-image/nano.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "nano",
  "command": [
    "nano",
    "nanobanana"
  ],
  "category": "ai",
  "desc": "Fitur nano <prompt>",
  "usage": ".nano <prompt>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai-image").split('\\').join('/')
module.exports = __vx.plugin("ai-image/nano", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/nano.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FormData = __vxDef(require("form-data"));
  const axios = __vxDef(require("axios"));
  
  async function uploadToUguu(buffer) {
    const form = new FormData();
    form.append('files[]', buffer, {
      filename: `upload_${Date.now()}.jpg`,
      contentType: 'image/jpeg'
    });
  
    const { data } = await axios.post('https://uguu.se/upload', form, {
      headers: { ...form.getHeaders() }
    });
  
    if (!data?.files?.[0]?.url) throw new Error('Gagal mengunggah gambar ke Uguu.');
    return data.files[0].url;
  }
  
  const handler = async (m, { sock, qmsg, mime, text, usedPrefix, command, reply }) => {
    const isImage = /image\/(png|jpe?g|webp)/.test(mime || '');
  
    if (!isImage) {
      return reply(`*Format Salah!*\n\nReply/kirim gambar lalu ketik:\n*Contoh:* ${usedPrefix + command} Ubah jadi tersenyum`);
    }
  
    if (!text) {
      return reply(`*Teks Prompt Kosong!*\n\n*Contoh:* ${usedPrefix + command} Ubah jadi tersenyum`);
    }
  
    await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
  
    try {
      const media = await qmsg.download().catch(() => null);
      if (!media) throw new Error('Gagal mengunduh gambar.');
  
      const urlGambar = await uploadToUguu(media);
  
      // Ambil langsung binary buffer dari endpoint FAA Nano Banana
      const apiUrl = `https://api-faa.my.id/faa/nano-banana?url=${encodeURIComponent(urlGambar)}&prompt=${encodeURIComponent(text.trim())}`;
      const res = await axios.get(apiUrl, {
        responseType: 'arraybuffer',
        timeout: 60000
      });
  
      const resultBuffer = Buffer.from(res.data);
  
      await sock.sendMessage(
        m.chat,
        {
          image: resultBuffer,
          caption: `✨ *Prompt:* ${text.trim()}`,
          contextInfo: {
            isForwarded: true,
            forwardingScore: 9999,
            forwardedNewsletterMessageInfo: {
              newsletterName: global.namech || "WhatsApp Bot Channel",
              newsletterJid: global.idch || ""
            }
          }
        },
        { quoted: m }
      );
  
      await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => null);
  
    } catch (e) {
      console.error('[NANOBANANA ERROR]:', e);
      await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
      reply(`❌ Gagal mengedit gambar: ${e.response?.data?.message || e.message || e}`);
    }
  };
  
  handler.help = ['nano <prompt>', 'nanobanana <prompt>'];
  handler.tags = ['ai', 'maker'];
  handler.command = ['nano', 'nanobanana'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
