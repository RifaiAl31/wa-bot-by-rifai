// Kunci rahasia dibaca dari .env lokal (file ini tidak di-commit).
// Salin .env.example ke .env lalu isi kunci Anda; tanpa itu fitur terkait aman (kunci kosong).
try {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    for (const raw of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq < 1) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if ((value.startsWith('\"') && value.endsWith('\"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
} catch {}

/*
 ┌──────────────────────────────────────────────────────────────────┐
 │  SETTINGS — satu-satunya file pengaturan bot (gaya global.*)     │
 │  Ubah → simpan → restart bot.                                    │
 │  ⚠️  Jangan kirim/screenshot file ini: berisi kunci rahasia.      │
 └──────────────────────────────────────────────────────────────────┘

  DAFTAR ISI
   1. Identitas & stiker
   2. Menu & tampilan (thumbnail, animasi, audio)
   3. Mode rich / tampilan kartu
   4. Kontak & saluran
   5. Grup
   6. Downloader
   7. API key (semua kunci di satu tempat)
   8. Alamat dasar API
   9. Fitur tambahan (GitHub, Telegram, API utama plugins.zip)
  10. Payment gateway (AutoOrder QRIS)
  11. SMM
  12. AI
  13. Lain-lain & pesan bot
*/


// ════════════════════════════════════════════════════════════════
//  1. IDENTITAS & STIKER
// ════════════════════════════════════════════════════════════════
global.botname       = 'WhatsApp Bot'          // nama bot
global.ownername     = 'Owner Bot'             // nama owner
global.ownernumber   = '6285712563492'   // nomor owner untuk permission dan .report; tidak ditampilkan publik
global.owner         = []                     // owner TAMBAHAN, mis. ['62812xxxxxxx'] (atau pakai .addowner / .claimowner)
global.prefix        = '.'
global.sessionName   = 'session'              // nama folder sesi login (jangan diubah kalau bot sudah login)
global.pairingNumber = '6285738290599'         // nomor WA bot untuk pairing code, mis. '628123456789' (kosong = ditanya di console, hanya kalau belum login)
global.packname      = 'WhatsApp Bot'          // nama pack stiker
global.author        = 'Owner Bot'             // author stiker
global.stickerPack   = { packname: 'WhatsApp Bot', author: 'Owner Bot' }   // dipakai fitur stiker tambahan
global.footer        = 'WhatsApp Bot'


// ════════════════════════════════════════════════════════════════
//  2. MENU & TAMPILAN
// ════════════════════════════════════════════════════════════════
// ---- Thumbnail ----
global.thumbnail    = './media/thumbnail.jpg'   // thumbnail netral lokal
global.thumbnailGif = false                   // true = menu memakai GIF/video di bawah | false = hanya foto
global.thumbnailvid = ''                      // sumber GIF: link .mp4 ATAU path lokal './media/thumbnail.mp4' (link mati → otomatis foto)
global.fotoreply    = ''                      // kosong = pakai global.thumbnail
global.music        = 'https://cdn.nekohime.site/file/j8n4a9q4.mp4'   // voice note setelah menu ('' = nonaktif)

// ---- Alur .menu / .allmenu ----
// "Loading ." → "Loading .." → "Loading ..." → "Loading Complete ✓" (pesan di-EDIT) → menu asli → audio.
global.menuLoading      = true                // true = animasi loading sebelum menu | false = langsung menu
global.menuLoadingDelay = 500                 // jeda tiap frame animasi (milidetik)
global.menuWithAudio    = true                // true = kirim audio tepat di bawah menu | false = menu saja
global.menuAudio        = './media/menu.mp3'  // path lokal ATAU link https://... (file lokal tidak ada → pakai global.music)
global.menuAudioPtt     = false               // true = audio sebagai voice note | false = audio biasa
global.menuCommands     = ['menu', 'help', 'allmenu']   // perintah yang memakai alur ini
global.menuFlowMainOnly = true                // true = hanya .menu/.allmenu polos (pilih kategori lewat tombol tidak mengulang animasi & audio)


// ════════════════════════════════════════════════════════════════
//  3. MODE RICH / TAMPILAN KARTU
// ════════════════════════════════════════════════════════════════
global.richMode       = true                  // pesan bertombol/carousel | false = teks biasa
global.richHints      = true                  // petunjuk "balas pesan ini dengan angka" di kartu bertombol
global.richNative     = true                  // true = rich HTML ASLI (bawaan) | false = matikan paksa (balasan jadi teks)
global.richAutoRender = true                  // true = kartu rich langsung tampil tanpa tombol "Unduh" | false = perilaku lama

global.uiMode   = 'text'                      // 'rich' = kartu RICH HTML | 'text' = teks biasa. Ganti lewat chat: .uimode rich / .uimode text
global.uiTheme  = 'koboy'                     // tema kartu rich: koboy (bawaan) | obsidian | angker | neraka | iblis | aurora | sunset | ocean | emerald | sakura | gold | ruby | mono. Ganti lewat chat: .tema rich <nama>
global.uiCopy   = 'auto'                      // tombol Salin di mode rich: 'auto' (hasil berisi data) | 'all' (semua balasan) | 'off'
global.uiPlain  = []                          // perintah yang tetap teks biasa, mis. ['ai', 'hash']
global.uiBotJid = '867051314767696@bot'       // JID bot untuk pesan rich (sama seperti di ytPlayer)
global.uiMenuBanner = true                    // true = banner foto di atas kartu menu rich (tema koboy: assets/koboy-banner.jpg, tema lain: thumbnail)
global.uiNavButtons = false                   // true = tampilkan tombol native "Tap Here!" di bawah kartu menu
global.uiTapLink    = false                   // true = tap perintah di kartu membuka chat bot dengan perintah terisi (wa.me)


// ════════════════════════════════════════════════════════════════
//  4. KONTAK & SALURAN
// ════════════════════════════════════════════════════════════════
global.ig       = ''
global.tele     = ''
global.saluran  = ''
global.wagc     = ''
global.channel  = ''                            // JID channel untuk label "Diteruskan" ('' = nonaktif)
global.channeln = 'WhatsApp Bot'                // nama channel untuk label tsb

// ════════════════════════════════════════════════════════════════
//  5. GRUP
// ════════════════════════════════════════════════════════════════
global.antilink  = { maxWarn: 3 }             // setelah N peringatan pelanggar dikeluarkan (0 = hanya hapus + peringatan)
global.warnLimit = 3                          // batas .warn / antibadword sebelum dikeluarkan (bot harus admin)


// ════════════════════════════════════════════════════════════════
//  6. DOWNLOADER
// ════════════════════════════════════════════════════════════════
global.downloader = {
  maxMB: 80,                                  // batas ukuran file
  maxImages: 10,                              // batas foto/slide per permintaan
  ytQuality: '720',                           // 360 / 480 / 720 / 1080
  cobalt: { url: '', apiKey: '' },            // opsional (instance cobalt milikmu)
  scriptmind: true,                           // YouTube lewat scriptmind.co
  ytultra: true,                              // YouTube lewat ytultra.com
  cobaltPool: true,                           // cobalt komunitas (instances.cobalt.best)
  scrapers: true,                             // TikTok (mobile API, snaptik) & Instagram (savefromins, instaloadr)
  ytdlp: {
    path: '',                                 // kosong = otomatis
    cookies: '',                              // path cookies.txt (atau kirim lewat .ytcookies)
    proxy: '',                                // mis. 'http://user:pass@host:port' (atau .ytdlp proxy)
    autoInstall: true,
    maxMinutes: 30
  }
}


// ════════════════════════════════════════════════════════════════
//  7. API KEY  — semua kunci fitur dikumpulkan di sini
//     Isi di antara tanda kutip → simpan → restart bot.
//     Kosong = fitur terkait membalas "butuh apikey" (bot tidak crash).
// ════════════════════════════════════════════════════════════════
// ---- AI & pencarian ----
global.geminikey   = (process.env.GEMINI_KEY || '')   // Google Gemini   → https://aistudio.google.com/apikey (gratis). Dipakai: vision/nanobanana, .aiagent, AI gambar
global.groqkey     = (process.env.GROQ_KEY || '')   // Groq            → https://console.groq.com/keys (gratis). Dipakai: .transkrip, .aiagent
global.aquakey     = (process.env.AQUA_KEY || '')                                  // Free-RestAPI    → https://free-restapi.biz.id . Dipakai: .ai-models .kimi-vision .talkingphoto .age-detection .gpt2image
global.fishkey     = ''                       // Fish Audio      → https://fish.audio (menu API Keys). Dipakai: suara AI
global.youtubekey  = ''                       // YouTube Data v3 → https://console.cloud.google.com . Dipakai: pencarian YouTube resmi

// ---- Downloader & media ----
global.loaderkey   = (process.env.LOADER_KEY || '')   // loader.to/savenow → https://loader.to . Dipakai: .ytmp3 .ytmp4
global.topmediakey = (process.env.TOPMEDIA_KEY || '')     // TopMedia          → scraper media. Ganti kalau pemilik layanan memberi kunci baru
global.anabotkey   = (process.env.ANABOT_KEY || '')             // Anabot       → https://anabot.my.id (kunci publik 'freeApikey'). Dipakai: .ringtone .izen, downloader cadangan
global.miftahkey   = (process.env.MIFTAH_KEY || '')                 // Miftahganzz  → https://api.miftahganzz.my.id (kunci publik). Dipakai: downloader Twitter cadangan
global.cukikey     = (process.env.CUKI_KEY || '')                 // Cuki API     → https://api.cuki.biz.id (kunci publik 'cuki-x'). Dipakai: .pin .pap .lahelu .susutaro .hotline dll

// ---- Maker, stiker & hiburan ----
global.lolkey      = (process.env.LOL_KEY || '')   // LoLHuman → https://api.lolhuman.xyz (Dashboard). Dipakai: .superhero .stikerwa .kannabrat .ohno .meme2 .meme3 .pacarsertifikat .facedetector
global.neoxrkey    = (process.env.NEOXR_KEY || '')     // Neoxr    → https://api.neoxr.eu (dashboard). Dipakai ±90 fitur: .attp2 .emojimix .getmusik .carimusik .pixiv .bingimage .jadwalbola dll
global.theresavkey = (process.env.THERESAV_KEY || '')                  // Theresav → https://api.theresav.biz.id . Dipakai: .bratcewek2 .animebrat2 .animebrat3
global.fgsikey     = ''                       // FGSI     → https://fgsi.dpdns.org (format fgsiapi-xxxx). Dipakai: .sora2 dll
global.fireflykey  = ''                       // Firefly  → https://firefly.maiku.my.id . Dipakai: .pinvid .text2img .npmstalk .ytstalk
global.albykey     = ''                       // Alby     → https://albyoffc.my.id (format albymd-xxxx). Dipakai: .suppbypass
global.xrinakey    = ''                       // Xrina    → https://apiii-xrina.vercel.app (minta ke pemilik API). Dipakai: .rch (react channel)
global.btc         = ''                       // BetaBotz → https://api.betabotz.eu.org (format btz-xxxx). Dipakai fitur hasil port yang memanggil api.betabotz
global.xyro        = ''                       // Xyroinee → https://api.xyroinee.xyz (menu Profile/Dashboard). Dipakai fitur hasil port yang memanggil api.xyroinee

// ---- Layanan lain ----
global.jasaotpkey  = ''                       // JasaOTP  → https://jasaotp.id (menu API). Dipakai: .nokos versi JasaOTP
global.pitucodekey = (process.env.PITUCODE_KEY || '')            // PituCode → https://api.pitucode.com . Dipakai: .ceknamadana (cek nama e-wallet)

// ---- Kumpulan kunci (dibaca plugin lewat global.apiKeys.<nama>) ----
global.apiKeys = {
  // kunci khusus fitur tertentu
  kyzz: (process.env.KYZZ_KEY || ''),                       // WAJIB untuk: .brat(black/green/pink/gojo/v2/vermeil/vid*) .qc .ssweb .twitstalk
  azbry: '',                                  // .spotifydl (bila API-nya meminta kunci)
  siputzx: '',
  covenant: '',                               // .melolo (bila penyedia API meminta kunci)
  obscura: '',                                // api.obscuraworks.org → .nikparser
  vercel: '',                                 // token Vercel → .deploy (owner)
  vamx: (process.env.VAMX_KEY || ''),                      // .nftoken .netflixtoken .nftv (kunci bawaan fitur; ganti kalau punya sendiri)
  // dari daftar di atas
  lolhuman: global.lolkey,   betabotz: global.btc,        xyroinee: global.xyro,
  neoxr: global.neoxrkey,    cuki: global.cukikey,        anabot: global.anabotkey,   theresav: global.theresavkey,
  miftah: global.miftahkey,  fgsi: global.fgsikey,        alby: global.albykey,       xrina: global.xrinakey,
  firefly: global.fireflykey, aqua: global.aquakey,       gemini: global.geminikey,
  groq: global.groqkey,      jasaotp: global.jasaotpkey,  fishaudio: global.fishkey,  youtube: global.youtubekey,
  topmedia: global.topmediakey, loaderto: global.loaderkey, pitucode: global.pitucodekey
}


// ════════════════════════════════════════════════════════════════
//  8. ALAMAT DASAR API  (ganti kalau alamat penyedia berubah)
// ════════════════════════════════════════════════════════════════
global.APIs = {
  kyzz: 'https://api.kyzzz.xyz',
  siputzx: 'https://api.siputzx.my.id',
  azbry: 'https://api.azbry.com',
  deline: 'https://api.deline.web.id'         // .bratcewek
}


// ════════════════════════════════════════════════════════════════
//  9. FITUR TAMBAHAN
// ════════════════════════════════════════════════════════════════
// ---- API utama fitur dari plugins.zip (±200 fitur ai/downloader/maker/game/dll) ----
// Memakai satu penyedia REST API lewat global.web + global.apikey.vxapi.
// Kunci kosong = fitur terkait membalas error dari server. Ganti global.web bila domain penyedia API kamu beda.
global.web    = (process.env.WEB_API_BASE || '')
global.apikey = { vxapi: (process.env.VXAPI_KEY || '') }

// ---- GitHub & Telegram ----
global.ghTokens = ''                          // token GitHub (classic, scope: gist + repo) → .gist .upgh/.url/.cdn .ubah
global.userGh   = ''                          // username pemilik token (repo CDN cdn1..cdn5 dibuat otomatis)
global.tgToken  = (process.env.TG_TOKEN || '')   // token bot Telegram (dari @BotFather) → .sticketele


// ════════════════════════════════════════════════════════════════
// 10. PAYMENT GATEWAY (AutoOrder QRIS)
//     Docs: https://auto-order.alxzyy.my.id/docs — QRIS otomatis untuk topup saldo bot
// ════════════════════════════════════════════════════════════════
global.autoorder = {
  apiKey: 'AOC-32B4A15AFEB7511213E8CBD112D2A82A8403BE533F047184',   // X-API-Key dari dashboard AutoOrder (kosong = QRIS otomatis mati)
  baseUrl: 'https://auto-order.alxzyy.my.id/api/v2',
  storageKey: ''                              // key Storage (ak_live_...) bila beda dari apiKey; kosong = pakai apiKey
}


// ---- SMM / suntik sosmed (.smmorder .smmservices .smmstatus) ----
global.alipshop = { baseUrl: '', apiKey: '' } // kosong = fitur SMM menampilkan peringatan belum diatur


// ════════════════════════════════════════════════════════════════
// 12. AI (.ai)
// ════════════════════════════════════════════════════════════════
global.ai = {
  provider: 'openai',                         // 'openai' (kompatibel OpenAI/OpenRouter/Groq) | 'anthropic' (Claude resmi)
  url: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',                                 // ISI DI SINI. Kosong = pakai layanan gratis (Pollinations)
  model: 'gpt-4o-mini',                       // untuk anthropic mis. 'claude-sonnet-5-5'
  free: { url: 'https://gen.pollinations.ai/v1/chat/completions', model: 'openai' },
  system: 'Kamu adalah WhatsApp Bot, asisten yang ramah dan membantu. Jawab singkat, jelas, dan dalam bahasa yang dipakai pengguna.'
}


// ════════════════════════════════════════════════════════════════
// 13. LAIN-LAIN & PESAN BOT
// ════════════════════════════════════════════════════════════════
global.weather = { name: 'Jakarta, Indonesia', lat: -6.2088, lon: 106.8456 }

global.mess = {
  error: {
    fitur: 'Terjadi kesalahan saat menjalankan fitur ini. Silakan coba lagi nanti atau hubungi Owner Bot.'
  },
  only: {
    group: 'Fitur ini hanya dapat digunakan di grup.',
    owner: 'Fitur ini hanya dapat digunakan oleh Owner Bot.',
    admin: 'Fitur ini hanya dapat digunakan oleh admin grup.',
    badmin: 'Jadikan bot sebagai admin grup terlebih dahulu.'
  }
}
