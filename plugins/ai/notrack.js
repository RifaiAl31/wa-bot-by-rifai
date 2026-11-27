// ai/notrack — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "notrack"
  ],
  "category": "ai",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur notrack",
  "usage": ".notrack <teks>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/ai/notrack", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/notrack.js"
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
  
      if (!text) {
        return m.reply(`⚠️ *Teks dibutuhkan!*\n\nContoh:\n*${usedPrefix + command} Halo, ceritakan tentang planet Mars.*`);
      }
  
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
      const apiUrl = `${global.web}/api/ai/notrack?apikey=${API_KEY}`;
      const response = await axios.post(apiUrl, {
        prompt: text,
        sessionId: m.sender.split('@')[0],
        chatId: m.chat.split('@')[0]
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      });
  
      const resData = response.data;
      if (!resData || !resData.status) {
        throw new Error(resData?.error || resData?.message || 'Gagal memproses AI');
      }
  
      let resultText = resData.data?.response || resData.data?.reply || resData.data?.message || resData.data?.answer || resData.data?.text || resData.data || resData.result;
      if (typeof resultText === 'object') resultText = JSON.stringify(resultText, null, 2);
  
      await m.reply(String(resultText).trim());
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (err) {
      console.error('[NoTrack Error]', err);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply(`❌ *Error:* ${err.response?.data?.error || err.message || 'Terjadi kesalahan sistem'}`);
    }
  };
  
  handler.help = ["notrack <teks>"];
  handler.tags = ["ai"];
  handler.command = ["notrack"];
  handler.limit = true;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
