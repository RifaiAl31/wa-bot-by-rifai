// tools/transkrip — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/transkrip.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "transkrip",
  "command": [
    "transkrip",
    "stt",
    "speechtotext",
    "transcribe"
  ],
  "category": "tools",
  "desc": "Konversi voice note / audio ke teks (Speech-to-Text)",
  "usage": ".transkrip (reply voice note)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [
      "groq"
    ],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/transkrip", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/transkrip.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FormData = __vxDef(require("form-data"));
  const axios = __vxDef(require("axios"));
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const { exec } = require("child_process");
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'transkrip',
      alias: ['stt', 'speechtotext', 'transcribe'],
      category: 'tools',
      description: 'Konversi voice note / audio ke teks (Speech-to-Text)',
      usage: '.transkrip (reply voice note)',
      example: '.transkrip',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 2,
      isEnabled: true
  };
  function convertToWav(inputPath, outputPath) {
      return new Promise((resolve, reject) => {
          exec(
              `ffmpeg -y -i "${inputPath}" -ar 16000 -ac 1 -f wav "${outputPath}"`,
              { timeout: 30000 },
              (err) => err ? reject(err) : resolve()
          );
      });
  }
  async function transcribeWithGroq(audioBuffer, apiKey) {
      const form = new FormData();
      form.append('file', audioBuffer, { filename: 'audio.wav', contentType: 'audio/wav' });
      form.append('model', 'whisper-large-v3');
      form.append('language', 'id');
      form.append('response_format', 'json');
      const { data } = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', form, {
          headers: {
              ...form.getHeaders(),
              'Authorization': `Bearer ${apiKey}`
          },
          timeout: 60000,
          maxContentLength: Infinity
      });
      return data.text || '';
  }
  async function handler(m, { sock }) {
      const quoted = m.quoted || m;
      const isAudio = quoted.type === 'audioMessage' || /audio/.test(quoted.mimetype || '');
      if (!isAudio) {
          return m.reply(
              `🎤 *ᴛʀᴀɴsᴋʀɪᴘ*\n\n` +
              `> Reply voice note atau audio untuk mengonversi ke teks\n` +
              `> Contoh: reply VN → ketik \`${m.prefix}transkrip\``
          );
      }
      const groqKey = config.APIkey?.groq;
      if (!groqKey) {
          return m.reply(
              `❌ *ɢᴀɢᴀʟ*\n\n` +
              `> API Key Groq belum diatur\n` +
              `> Set di config.js → APIkey.groq\n` +
              `> Gratis di https://console.groq.com`
          );
      }
      m.react('🎤');
      const tmpDir = path.join(process.cwd(), 'tmp');
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      const inputFile = path.join(tmpDir, `stt_${Date.now()}.ogg`);
      const wavFile = path.join(tmpDir, `stt_${Date.now()}.wav`);
      try {
          const buffer = await quoted.download();
          if (!buffer || buffer.length < 1000) {
              m.react('❌');
              return m.reply('❌ Audio terlalu kecil atau gagal diunduh');
          }
          fs.writeFileSync(inputFile, buffer);
          await convertToWav(inputFile, wavFile);
          const wavBuffer = fs.readFileSync(wavFile);
          const text = await transcribeWithGroq(wavBuffer, groqKey);
          if (!text || text.trim() === '') {
              m.react('❌');
              return m.reply('❌ Tidak dapat mendeteksi suara. Pastikan audio jelas dan tidak terlalu pendek.');
          }
          const duration = Math.ceil(buffer.length / 4000);
          await m.reply(
              `🎤 *ᴛʀᴀɴsᴋʀɪᴘ*\n\n` +
              `╭┈┈⬡「 📝 *ʜᴀsɪʟ* 」\n` +
              `┃\n` +
              `┃ ${text}\n` +
              `┃\n` +
              `╰┈┈⬡\n\n` +
              `> 🤖 Model: Whisper Large V3\n` +
              `> 🌐 Bahasa: Indonesia\n` +
              `> 📊 Ukuran: ~${(buffer.length / 1024).toFixed(1)} KB`
          );
          m.react('✅');
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          m.react('❌');
          if (error.response?.status === 401) {
              return m.reply('❌ API Key Groq invalid. Cek config.js → APIkey.groq');
          }
          if (error.response?.status === 429) {
              return m.reply('❌ Rate limit Groq tercapai. Coba lagi nanti.');
          }
          m.reply(te(m.prefix, m.command, m.pushName));
      } finally {
          [inputFile, wavFile].forEach(f => { try { fs.unlinkSync(f); } catch {} });
      }
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
