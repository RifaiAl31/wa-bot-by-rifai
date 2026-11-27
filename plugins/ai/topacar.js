// ai-image/topacar — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai-image/topacar.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "topacar",
  "command": [
    "topacar"
  ],
  "category": "ai",
  "desc": "Fitur topacar (reply gambar)",
  "usage": ".topacar (reply gambar)",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai-image").split('\\').join('/')
module.exports = __vx.plugin("ai-image/topacar", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/topacar.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const FormData = __vxDef(require("form-data"));
  
  async function uploadUguu(buffer, filename = 'image.jpg') {
    const form = new FormData();
    form.append('files[]', buffer, { filename, contentType: 'image/jpeg' });
    const { data } = await axios.post('https://uguu.se/upload', form, { headers: { ...form.getHeaders() } });
    return data?.files?.[0]?.url || null;
  }
  
  const handler = async (m, { sock, qmsg, mime, reply, usedPrefix, command }) => {
    if (!/^image\//.test(mime || '')) {
      return reply(`❌ Reply atau kirim gambar dengan perintah *${usedPrefix + command}*`);
    }
  
    await sock.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }).catch(() => null);
  
    try {
      const buffer = await qmsg.download().catch(() => null);
      if (!buffer) return reply('❌ Gagal mengunduh gambar!');
  
      const uguuUrl = await uploadUguu(buffer, `${command}-${Date.now()}.jpg`);
      if (!uguuUrl) return reply('❌ Gagal mengunggah gambar ke Uguu!');
  
      const apiUrl = `https://api-faa.my.id/faa/topacar?url=${encodeURIComponent(uguuUrl)}`;
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 60000 });
      const resultBuffer = Buffer.from(response.data);
  
      await sock.sendMessage(m.chat, { image: resultBuffer, caption: '✅ Done' }, { quoted: m });
      await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => null);
  
    } catch (e) {
      console.error('[TOPACAR ERROR]:', e);
      await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
      reply('❌ Gagal memproses gambar!');
    }
  };
  
  handler.help = ['topacar (reply gambar)'];
  handler.tags = ['maker'];
  handler.command = ['topacar'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
