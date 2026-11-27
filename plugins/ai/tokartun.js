// ai-image/tokartun — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai-image/tokartun.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "tokartun",
  "command": [
    "tokartun"
  ],
  "category": "ai",
  "desc": "Fitur tokartun (reply gambar)",
  "usage": ".tokartun (reply gambar)",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai-image").split('\\').join('/')
module.exports = __vx.plugin("ai-image/tokartun", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tokartun.js'
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
  
  const PROMPT_KARTUN = `Transform the person in the image into a stylized cartoon version with smooth shading, expressive facial features, and vibrant colors. Maintain the original face identity, hairstyle, and expression. The final result should look like a high-quality Pixar or Disney-style cartoon portrait with clean outlines and natural lighting.`;
  
  const handler = async (m, { sock, qmsg, mime, reply, usedPrefix, command }) => {
    if (!/^image\//.test(mime || '')) {
      return reply(`❌ Reply ke *gambar* atau kirim gambar dengan caption *${usedPrefix + command}*`);
    }
  
    await sock.sendMessage(m.chat, { react: { text: '🌀', key: m.key } }).catch(() => null);
  
    try {
      const buffer = await qmsg.download().catch(() => null);
      if (!buffer) return reply('❌ Gagal mengunduh gambar!');
  
      const uguuUrl = await uploadUguu(buffer, `tokartun-${Date.now()}.jpg`);
      if (!uguuUrl) return reply('❌ Gagal mengunggah gambar ke server!');
  
      const apiUrl = `https://api-faa.my.id/faa/editfoto?url=${encodeURIComponent(uguuUrl)}&prompt=${encodeURIComponent(PROMPT_KARTUN)}`;
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 60000 });
      const resultBuffer = Buffer.from(response.data);
  
      await sock.sendMessage(m.chat, { image: resultBuffer, caption: '🌀 *success*' }, { quoted: m });
      await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => null);
  
    } catch (e) {
      console.error('[TOKARTUN ERROR]:', e);
      await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
      reply('❌ Error: ' + (e.message || e));
    }
  };
  
  handler.help = ['tokartun (reply gambar)'];
  handler.tags = ['maker', 'ai'];
  handler.command = ['tokartun'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
