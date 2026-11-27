// fun/moveon — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/moveon.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "moveon",
  "command": [
    "moveon"
  ],
  "category": "fun",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/moveon", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/moveon.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  /*
  
  # Fitur : Gatau
  # Type : Plugins ESM
  # Created by : 
  # Api : Local Logic
  
     ⚠️ _Note_ ⚠️
  
  */
  
  const pluginConfig = {
    name: "moveon",
    alias: [],
    category: "fun",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
      const conn = sock;
    const alasanGagal = [
      "*Error: Masih menyimpan fotonya di galeri*",
      "*Error: Masih suka stalking story-nya tiap malam*",
      "*Error: File hati sedang digunakan oleh proses lain: 'rindu.exe'*",
      "*Error: Gagal menghapus karena kenangan terlalu dalam*",
      "*Error: Sistem mendeteksi denyut jantung meningkat saat melihat namanya*",
      "*Error: Modul 'ikhlas.dll' belum terpasang*",
      "*Error: Masih berharap tanpa sadar*",
      "*Error: Masih ingat semua kata sandi dia*",
      "*Error: Proses move on terhenti, karena lagu 'Kenangan Manis.mp3' diputar kembali*",
      "*Error: Chat terakhir belum dihapus, masih dibaca berulang-ulang*"
    ]
  
    const teks = [
      "⏳ *Menjalankan perintah: moveon.exe*",
      "⌛ Mengakses direktori kenangan...",
      "⌛ Menemukan 1.042 file terkait: mantan.jpg, tawa.mp3, chat_kita.txt, pelukan terakhir.mp4",
      "⌛ Menghapus file: mantan.jpg",
      "⌛ Menghapus file: tawa.mp3",
      "⌛ Menghapus file: chat_kita.txt",
      "⌛ Menghapus file: pelukan terakhir.mp4",
      "⌛ Membersihkan folder: /hati/kenangan/spesial",
      "⌛ Menghapus log malam_nangis.log",
      "⌛ Menghapus config: harapan.yaml",
      "⌛ Menonaktifkan modul: berharap_lagi.dll",
      "⌛ Menutup port luka_terbuka 4040",
      "⌛ Mencabut izin akses memori emosional",
      "⌛ Restart sistem perasaan...",
      "⌛ Verifikasi status...",
      "❌ *Gagal*"
    ]
  
    for (let i = 0; i < teks.length; i++) {
      setTimeout(() => {
        conn.sendMessage(m.chat, { text: teks[i] }, { quoted: m })
      }, i * 1600)
    }
  
    
    setTimeout(() => {
      let alasan = alasanGagal[Math.floor(Math.random() * alasanGagal.length)]
      conn.sendMessage(m.chat, { text: alasan }, { quoted: m })
    }, teks.length * 1600)
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
