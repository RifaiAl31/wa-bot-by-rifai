// ai/img2video — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "img2video",
    "image2video",
    "i2v",
    "imganim"
  ],
  "category": "ai",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur img2video",
  "usage": ".img2video <prompt>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/ai/img2video", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/img2video.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const FormData = __vxDef(require("form-data"));
  const axios = __vxDef(require("axios"));
  
  let isProcessing = {};
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!/image/.test(mime)) {
      return m.reply(`⚠️ *Format Salah!* Kirim atau reply gambar dengan prompt animasi.\n\nContoh:\n*${usedPrefix + command} make the picture live and real*`);
    }
    if (!text) {
      return m.reply(`⚠️ *Prompt dibutuhkan!*\n\nContoh:\n*${usedPrefix + command} make the picture real and live*`);
    }
  
    const API_KEY = global.apikey?.vxapi;
    if (!API_KEY || API_KEY === "MASUKAN_API_KEY_KAMU_DISINI") {
      return m.reply("❌ API Key WhatsApp Bot API belum dikonfigurasi di config.js!");
    }
  
    if (isProcessing[m.sender]) {
      return m.reply('⏳ Kamu masih memiliki antrean Img2Video yang sedang diproses. Mohon tunggu!');
    }
  
    try {
      isProcessing[m.sender] = true;
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } }).catch(() => {});
      m.reply("⏳ *Sedang memproses animasi video AI...*\n_Mohon bersabar, proses render butuh waktu 1 - 2 menit._");
  
      let imageBuffer = await q.download();
      if (!imageBuffer) throw new Error("Gagal mengunduh gambar yang dikirim.");
  
      let formData = new FormData();
      formData.append('file', imageBuffer, {
        filename: `img2vid_${Date.now()}.jpg`,
        contentType: 'image/jpeg'
      });
  
      const createUrl = `${global.web}/api/ai/img2video?apikey=${API_KEY}&prompt=${encodeURIComponent(text.trim())}`;
      const response = await axios.post(createUrl, formData, {
        headers: formData.getHeaders(),
        timeout: 120000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
  
      const resData = response?.data;
      if (!resData || !resData.status) {
        throw new Error(resData?.error || resData?.message || 'Gagal memulai proses render video AI.');
      }
  
      let videoUrl = resData.result?.video_url || resData.result?.video || resData.video_url || resData.data?.video_url;
      let taskId = resData.result?.task_id || resData.data?.task_id;
  
      if (!videoUrl && taskId) {
        // Tunggu 45 detik awal render Vidu AI agar tidak spam endpoint
        await new Promise(resolve => setTimeout(resolve, 45000));
  
        const maxPoll = 12; // 12 x 10 detik = 120 detik (total tunggu 165 detik)
        for (let i = 0; i < maxPoll; i++) {
          try {
            const pollRes = await axios.post(
              `${global.web}/api/ai/img2video?apikey=${API_KEY}`,
              { task_id: taskId },
              { timeout: 30000 }
            ).catch(async () => {
              return await axios.get(
                `${global.web}/api/ai/img2video?apikey=${API_KEY}&task_id=${encodeURIComponent(taskId)}`,
                { timeout: 30000 }
              );
            });
            const pollData = pollRes?.data;
            if (pollData?.status && (pollData?.result?.video_url || pollData?.data?.video_url)) {
              videoUrl = pollData.result?.video_url || pollData.data?.video_url;
              break;
            }
            if (pollData?.status === false && pollData?.error) {
              throw new Error(pollData.error);
            }
          } catch (pe) {
            if (pe.message && !pe.message.includes('timeout') && !pe.message.includes('ECONNRESET')) {
              throw pe;
            }
          }
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      }
  
      if (!videoUrl) {
        throw new Error("Video selesai diproses atau melebihi batas waktu tunggu. Silakan coba lagi.");
      }
  
      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        mimetype: 'video/mp4',
        caption: `🎬 *IMG2VIDEO AI*\n\n📝 *Prompt:* ${text.trim()}\n✨ *Request by:* ${m.pushName || 'User'}`
      }, { quoted: m }).catch(e => m.reply("Gagal mengirim video, ini linknya: " + videoUrl));
  
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } }).catch(() => {});
    } catch (err) {
      console.error('[Img2Video Error]', err);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
      let errMsg = err.response?.data?.error || err.response?.data?.detail || err.message || 'Terjadi kesalahan pada server AI';
      m.reply(`❌ *Error:* ${errMsg}`);
    } finally {
      delete isProcessing[m.sender];
    }
  };
  
  handler.help = ['img2video <prompt>'];
  handler.tags = ['ai'];
  handler.command = /^(img2video|image2video|i2v|imganim)$/i;
  handler.limit = 5;
  handler.premium = false;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
