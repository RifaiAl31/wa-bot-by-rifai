// ai-image/topanda — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai-image/topanda.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "topanda",
  "command": [
    "topanda"
  ],
  "category": "ai",
  "desc": "Fitur topanda (reply foto)",
  "usage": ".topanda (reply foto)",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai-image").split('\\').join('/')
module.exports = __vx.plugin("ai-image/topanda", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/topanda.js'
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
  
  const PROMPT = 'transform into cute panda hoodie or panda martial artist, bamboo forest background, cute and soft style, while keeping the same original face';
  
  const handler = async (m, { sock, qmsg, mime, reply, usedPrefix, command }) => {
    if (!/^image\//.test(mime || '')) return reply(`❌ Reply/kirim gambar dengan caption *${usedPrefix + command}*`);
    await sock.sendMessage(m.chat, { react: { text: '🐼', key: m.key } }).catch(() => null);
  
    try {
      const buffer = await qmsg.download().catch(() => null);
      if (!buffer) return reply('❌ Gagal mengunduh gambar!');
  
      const uguuUrl = await uploadUguu(buffer, `${command}-${Date.now()}.jpg`);
      if (!uguuUrl) return reply('❌ Gagal upload gambar ke Uguu!');
  
      const apiUrl = `https://api-faa.my.id/faa/editfoto?url=${encodeURIComponent(uguuUrl)}&prompt=${encodeURIComponent(PROMPT)}`;
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 60000 });
  
      await sock.sendMessage(m.chat, { image: Buffer.from(response.data), caption: '✅ Done' }, { quoted: m });
      await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => null);
    } catch (e) {
      console.error(`[${command.toUpperCase()} ERROR]:`, e);
      await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
      reply('❌ Gagal memproses gambar pada API Edit Foto!');
    }
  };
  
  handler.help = ['topanda (reply foto)'];
  handler.tags = ['maker', 'ai'];
  handler.command = ['topanda'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
