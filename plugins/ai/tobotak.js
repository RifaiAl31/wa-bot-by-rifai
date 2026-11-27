// ai-image/tobotak — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai-image/tobotak.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "tobotak",
  "command": [
    "tobotak"
  ],
  "category": "ai",
  "desc": "Fitur tobotak (reply gambar)",
  "usage": ".tobotak (reply gambar)",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai-image").split('\\').join('/')
module.exports = __vx.plugin("ai-image/tobotak", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tobotak.js'
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
  
  const PROMPT_BOTAK = "Transform the person in the image to appear completely bald, keeping their facial structure, expression, and skin tone natural and unchanged. The bald effect should look realistic with proper lighting and shading on the scalp. Do not modify the face — only remove all visible hair.";
  
  const handler = async (m, { sock, qmsg, mime, reply, usedPrefix, command }) => {
    if (!/^image\//.test(mime || '')) {
      return reply(`❌ Reply atau kirim gambar dengan perintah *${usedPrefix + command}*`);
    }
  
    await sock.sendMessage(m.chat, { react: { text: '🪮', key: m.key } }).catch(() => null);
  
    try {
      const buffer = await qmsg.download().catch(() => null);
      if (!buffer) return reply('❌ Gagal mengunduh gambar!');
  
      const uguuUrl = await uploadUguu(buffer, `${command}-${Date.now()}.jpg`);
      if (!uguuUrl) return reply('❌ Gagal mengunggah gambar ke server Uguu!');
  
      const apiUrl = `https://api-faa.my.id/faa/editfoto?url=${encodeURIComponent(uguuUrl)}&prompt=${encodeURIComponent(PROMPT_BOTAK)}`;
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 60000 });
      const resultBuffer = Buffer.from(response.data);
  
      await sock.sendMessage(m.chat, { image: resultBuffer, caption: '🧑‍🦲 *success*' }, { quoted: m });
      await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => null);
  
    } catch (e) {
      console.error('[TOBOTAK ERROR]:', e);
      await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
      reply('❌ Error: ' + (e.message || e));
    }
  };
  
  handler.help = ['tobotak (reply gambar)'];
  handler.tags = ['maker', 'ai'];
  handler.command = ['tobotak'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
