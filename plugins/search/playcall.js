// search/playcall — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/playcall.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "playcall",
  "command": [
    "playcall",
    "call"
  ],
  "category": "search",
  "desc": "Putar musik dari YouTube lewat telpon",
  "usage": ".playcall <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/playcall", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/playcall.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const crypto = __vxDef(require("crypto"));
  const { createRequire } = require("module");
  
  
  
  const pluginConfig = {
    name: "playcall",
    alias: ["telepon", "call"],
    category: "search",
    description: "Putar musik dari YouTube lewat telpon (tanpa mesin telpon: diputar sebagai audio)",
    usage: ".playcall <query>",
    example: ".playcall komang",
    cooldown: 15,
    energi: 2,
    isEnabled: true,
  };
  
  // cari video: yt-search kalau terpasang, kalau tidak pencari bawaan bot
  async function searchVideo(query) {
    try {
      const yts = require("yt-search");
      const r = await yts(query);
      if (r.videos && r.videos[0]) return r.videos[0];
    } catch {}
    const ytLite = require("../../lib/youtube.js");
    const [it] = await ytLite.search(query, 1);
    if (!it) return null;
    return { title: it.title, url: it.url, author: { name: it.channel }, timestamp: it.duration };
  }
  
  // ambil MP3 (Buffer): API azbry dulu, lalu jalur downloader bot (scriptmind, ytultra, cobalt, dst.)
  async function getAudioBuffer(video, m, sock) {
    try {
      const res = await axios.get(`https://api.azbry.com/api/download/ytmp3?url=${encodeURIComponent(video.url)}`, { timeout: 45000 });
      const link = res.data?.result?.download;
      if (res.data?.status && link) {
        const a = await axios.get(link, { responseType: "arraybuffer", timeout: 90000 });
        const buf = Buffer.from(a.data);
        if (buf.length > 20000) return buf;
      }
    } catch (e) {
      console.log("[PlayCall] API azbry gagal:", e.message);
    }
    return null;
  }
  
  async function handler(m, { sock }) {
    const query = m.text?.trim();
    if (!query)
      return m.reply(`*PLAY CALL*\n\nMasukkan judul lagunya.\nContoh: ${m.prefix}playcall surat cinta untuk starla`);
  
    m.react("⏳");
    try {
      const video = await searchVideo(query);
      if (!video) throw new Error("Video tidak ditemukan");
  
      const canCall = !!global.voipClient && typeof global.voipClient.call === "function";
  
      // ---- tanpa mesin telpon: putar lagunya sebagai audio (fitur tetap jalan) ----
      if (!canCall) {
        await m.reply(`*PLAY CALL*\n\nMesin panggilan suara belum aktif di bot ini, jadi lagu diputar sebagai audio.\nJudul: *${video.title}*`);
        const buf = await getAudioBuffer(video, m, sock);
        if (buf) {
          await sock.sendMessage(m.chat, { audio: buf, mimetype: "audio/mpeg", ptt: false, fileName: `${video.title}.mp3` }, { quoted: m.fakeObj });
          return;
        }
        const { fetchAndSend } = require("../../lib/mediadl.js");
        await fetchAndSend(sock, m.chat, m.fakeObj, video.url, { audio: true });
        return;
      }
  
      // ---- dengan mesin telpon: panggil nomor pengirim dan putar lagunya ----
      const audioBuffer = await getAudioBuffer(video, m, sock);
      if (!audioBuffer) throw new Error("Gagal mengambil audio");
  
      const tmpDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      const tmpFile = path.join(tmpDir, `call_${crypto.randomBytes(4).toString("hex")}.mp3`);
      fs.writeFileSync(tmpFile, audioBuffer);
      const cleanup = () => { try { fs.existsSync(tmpFile) && fs.unlinkSync(tmpFile); } catch {} };
  
      const targetNumber = m.sender.split("@")[0].split(":")[0];
      await m.reply(m.isGroup
        ? `Panggilan grup tidak didukung, memanggil nomormu secara privat (${targetNumber})...`
        : `Memanggil nomormu (${targetNumber})...`);
  
      let call;
      try {
        call = await global.voipClient.call(targetNumber, { audioSource: tmpFile, durationMs: 300000 });
      } catch (e) {
        cleanup();
        // panggilan gagal -> tetap putar sebagai audio
        await m.reply(`Panggilan gagal (${e.message}). Lagu dikirim sebagai audio.`);
        await sock.sendMessage(m.chat, { audio: audioBuffer, mimetype: "audio/mpeg", fileName: `${video.title}.mp3` }, { quoted: m.fakeObj });
        return;
      }
      call.on?.("connected", () => m.reply(`*TERHUBUNG*\nLagu *${video.title}* sedang diputar di telpon!`));
      call.on?.("ended", (reason) => { cleanup(); m.reply(`Panggilan diakhiri: ${reason}`); });
      call.on?.("error", (err) => console.error("[VoIP Call Error]", err));
    } catch (err) {
      console.error("[PlayCall]", err);
      m.reply(`Gagal memainkan lagu: ${err.message}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
