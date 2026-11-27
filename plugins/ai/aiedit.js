// ai-image/aiedit — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai-image/aiedit.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "aiedit",
  "command": [
    "aiedit"
  ],
  "category": "ai",
  "desc": "Fitur aiedit <prompt>",
  "usage": ".aiedit <prompt>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai-image").split('\\').join('/')
module.exports = __vx.plugin("ai-image/aiedit", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/aiedit.js'
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
  
  const handler = async (m, { sock, qmsg, mime, text, reply, usedPrefix, command }) => {
    if (!/^image\//.test(mime || '')) {
      return reply(`❌ Reply ke *gambar* atau kirim gambar dengan caption *${usedPrefix + command} [prompt]*`);
    }
    if (!text) {
      return reply(`📝 Masukkan prompt setelah command.\n\nContoh:\n${usedPrefix + command} ubah jadi gaya cyberpunk dengan latar neon biru`);
    }
  
    await sock.sendMessage(m.chat, { react: { text: '🪄', key: m.key } }).catch(() => null);
  
    try {
      const buffer = await qmsg.download().catch(() => null);
      if (!buffer) return reply('❌ Gagal mengunduh gambar!');
  
      const uguuUrl = await uploadUguu(buffer, `aiedit-${Date.now()}.jpg`);
      if (!uguuUrl) return reply('❌ Gagal mengunggah gambar ke server!');
  
      const apiUrl = `https://api-faa.my.id/faa/editfoto?url=${encodeURIComponent(uguuUrl)}&prompt=${encodeURIComponent(text.trim())}`;
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 60000 });
      const resultBuffer = Buffer.from(response.data);
  
      await sock.sendMessage(m.chat, { image: resultBuffer, caption: '✨ *success*' }, { quoted: m });
      await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => null);
  
    } catch (e) {
      console.error('[AIEDIT ERROR]:', e);
      await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
      reply('❌ Error: ' + (e.message || e));
    }
  };
  
  handler.help = ['aiedit <prompt>'];
  handler.tags = ['maker', 'ai'];
  handler.command = ['aiedit'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
