// ai-image/tosatan — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai-image/tosatan.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "tosatan",
  "command": [
    "tosatan"
  ],
  "category": "ai",
  "desc": "Fitur tosatan (reply gambar)",
  "usage": ".tosatan (reply gambar)",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai-image").split('\\').join('/')
module.exports = __vx.plugin("ai-image/tosatan", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tosatan.js'
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
  
      const apiUrl = `https://api-faa.my.id/faa/tosatan?url=${encodeURIComponent(uguuUrl)}`;
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 60000 });
      const resultBuffer = Buffer.from(response.data);
  
      await sock.sendMessage(m.chat, { image: resultBuffer, caption: '✅ Done' }, { quoted: m });
      await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => null);
  
    } catch (e) {
      console.error('[TOSATAN ERROR]:', e);
      await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
      reply('❌ Gagal memproses gambar!');
    }
  };
  
  handler.help = ['tosatan (reply gambar)'];
  handler.tags = ['maker'];
  handler.command = ['tosatan'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
