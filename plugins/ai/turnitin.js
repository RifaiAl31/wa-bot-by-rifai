// ai/turnitin — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": ["turnitin", "aicheck"],
  "category": "ai",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur turnitin",
  "usage": ".turnitin <teks>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/ai/turnitin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/turnitin.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  let handler = async (m, { text, usedPrefix, command, conn }) => {
    try {
      const API_KEY = global.apikey?.vxapi;
      if (!API_KEY || API_KEY === "MASUKAN_API_KEY_KAMU_DISINI") {
        return m.reply("❌ API Key WhatsApp Bot API belum dikonfigurasi di config.js!");
      }
  
      const q = m.quoted ? m.quoted : m;
      const inputText = text || q.text;
  
      if (!inputText) {
        return m.reply(`⚠️ *Teks dibutuhkan!*\n\nMasukkan atau reply teks yang ingin dicek keasliannya.\n\nContoh:\n*${usedPrefix + command} Kecerdasan buatan adalah bidang ilmu komputer yang dikhususkan untuk memecahkan masalah kognitif...*`);
      }
  
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
      const apiUrl = `${global.web}/api/ai/turnitin?apikey=${API_KEY}`;
      const response = await axios.post(apiUrl, {
        prompt: inputText
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      });
  
      const resData = response.data;
      if (!resData || !resData.status || !resData.result) {
        throw new Error(resData?.error || resData?.message || 'Gagal memproses pengecekan Turnitin');
      }
  
      const result = resData.result;
      let replyMsg = `📊 *TURNITIN AI DETECTION REPORT*\n\n`;
      replyMsg += `📝 *Total Kata:* ${result.words_count || result.total_words || '-'}\n`;
      replyMsg += `🤖 *Skor AI / Plagiasi:* *${result.ai_percentage ?? result.ai_score ?? result.score ?? 0}%*\n`;
      replyMsg += `👤 *Skor Manusia (Human):* *${result.human_percentage ?? result.human_score ?? (100 - (result.ai_percentage ?? 0))}%*\n`;
      replyMsg += `📋 *Hasil Analisis:* ${result.verdict || result.analysis || result.conclusion || 'Selesai dianalisis'}\n`;
  
      if (result.details && Array.isArray(result.details) && result.details.length > 0) {
        replyMsg += `\n🔍 *Detail Kalimat Terindikasi:*\n`;
        result.details.slice(0, 3).forEach((d, idx) => {
          replyMsg += `${idx + 1}. "${d.sentence || d.text}" (${d.probability || d.score || 0}% AI)\n`;
        });
      }
  
      await m.reply(replyMsg.trim());
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (err) {
      console.error('[Turnitin Error]', err);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply(`❌ *Error:* ${err.response?.data?.error || err.message || 'Terjadi kesalahan sistem'}`);
    }
  };
  
  handler.help = ['turnitin <teks>'];
  handler.tags = ['ai', 'tools'];
  handler.command = /^(turnitin|cekai|aicheck|aidetector)$/i;
  handler.limit = true;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
