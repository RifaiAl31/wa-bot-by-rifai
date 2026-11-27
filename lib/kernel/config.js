// Simpan nilai global milik bot utama sebelum config runtime ini berjalan
const __orig = {}
for (const k of ["owners","ownername","nomorbot","namebot","nameSaluran","idSaluran","creator","versi","paircode","platforms","botMode","grupbot","buttonMode","public","publicTelegram","autoLidToJid","hanyaTerdaftar","wajibDaftar","bebasDaftar","replyCardOn","dbEngine","pconly","gconly","anticall","autoblockpm","autoblockwhitelist","autoblockmsg","autoreactsw","autoreactemoji","autoreadsw","autoreadgc","autoreadpc","autotyping","autorecordvn","multiplier","prefix","mess","fitur","extra","extraFitur","audioMenu","stickerPack","APIs","APIKeys","termai","autoai","tokengh","vercel","telegram","optimizer","antiban","qrisStatic","merchantGw","sociabuzz","sewamode","sewaAutoLeave","sewaPlans","thumb"]) if (globalThis[k] !== undefined) __orig[k] = globalThis[k]
import chalk from 'chalk'

// Simpan file ini → bot reload otomatis.

// ═══════════════ IDENTITAS ═══════════════
global.owners = []
global.ownername = 'Owner Bot'
global.nomorbot = ''
global.namebot = "WhatsApp Bot"
global.nameSaluran = global.namebot
global.idSaluran = ""
global.creator = "Owner Bot"
global.versi = "8.0.0"
global.paircode = ""

// ═══════════════ BOT ═══════════════
global.platforms = { whatsapp: true, telegram: true }   // telegram dilewati kalau token kosong

// Mode fitur: 'all' = semua kategori aktif (default). Isi nama folder plugin
// (lihat folder di dalam plugins/, mis. 'rpg') untuk membatasi bot
// hanya melayani 1 kategori itu buat semua orang (owner selalu lolos).
// Bisa juga diganti lewat command .botmode tanpa edit file ini.
global.botMode = 'all'

global.grupbot = false           // hanya melayani grup di daftar .grupbot
global.buttonMode = true        // true = mode pakai button | false = mode tanpa button, semua jadi teks biasa
global.public = true           // WhatsApp: true = semua orang | false = owner saja
global.publicTelegram = true    // Telegram: true = semua orang | false = owner saja
global.autoLidToJid = true      // auto convert LID → JID

global.hanyaTerdaftar = true    // hanya user terdaftar yang disimpan ke database
global.wajibDaftar = true       // semua fitur plugin wajib .daftar dulu
global.bebasDaftar = ['daftar', 'xp-register', 'unreg', 'xp-unregister', 'unregister']   // boleh dipakai tanpa daftar

global.replyCardOn = true       // m.reply tampil sebagai reply card
global.dbEngine = 'sqlite'      // 'sqlite' (otomatis JSON kalau gagal) | 'json'
global.pconly = false           // hanya private chat
global.gconly = false           // hanya grup
global.anticall = "off"         // off | tolak | block
global.autoblockpm = false        // auto block siapa pun (selain owner) yang chat pribadi ke bot
global.autoblockwhitelist = []   // nomor yang boleh PM bot tanpa diblokir, contoh: ['6281234567890']
global.autoblockmsg = ''         // pesan sebelum diblokir (kosong = tidak kirim pesan)

global.autoreactsw = false       // auto react story/status WhatsApp
global.autoreactemoji = '🥰'    // emoji untuk auto react story
global.autoreadsw = false        // auto lihat story/status WhatsApp
global.autoreadgc = false        // auto baca pesan grup (centang biru)
global.autoreadpc = false        // auto baca pesan private chat (centang biru)
global.autotyping = false         // auto "sedang mengetik..." saat ada pesan masuk
global.autorecordvn = true      // auto "sedang merekam suara..." saat ada pesan masuk (kalau autotyping juga true, dipilih acak)

global.multiplier = 38          // RPG: makin besar, level makin sulit
global.prefix = ["", ".", "!", ","]

// global.updateUrl = ""        // link zip untuk .updatebot
// global.updateToken = ""      // token GitHub (repo private)

global.mess = {
    wait: "Tunggu sebentar ya, lagi aku urus dulu...",
    owner: "Khusus owner. Yang ini nggak bisa aku bukain~",
    admin: "Khusus admin. Nanti aku kena omel kalau nekat!",
    group: "Fitur ini cuma jalan di dalam grup ya!",
    private: "Fitur ini cuma bisa dipakai di private chat ya!"
}

// ═══════════════ FITUR TAMBAHAN (.setfitur) ═══════════════
// Nyala/mati tiap fitur .setfitur bisa diatur dari sini juga. Command .setfitur di chat menang
// atas nilai di sini (sampai di-reset). Opsi lain (pajak, biaya, jam, dll) juga bisa diisi di sini.

global.fitur = {
    marketplace: { on: false },        // .market .mjual .mbeli
    eventShop: { on: false },          // .eventshop .eventbuy
    reward: { streak: { on: false } }, // bonus streak .harian/.mingguan
    clan: { on: false },               // .clan
    lbMingguan: { on: false },         // leaderboard mingguan
    antidelete: { on: false },         // pesan dihapus -> owner/chat asal
    antiedit: { on: false },           // pesan diedit -> owner/chat asal
    antiviewonce: { on: false },       // sekali lihat -> owner/chat asal
    logCommand: { on: false },         // catat command yang dipakai
    laporanHarian: { on: false },      // ringkasan harian ke owner
    blacklist: { on: false }           // isi lewat .setfitur blacklist tambah ...
}

global.extra = {
    jamBahagia: { on: false },  // hadiah dikali pengali jam tertentu
    misi: { on: false },        // misi harian (.misi)
    referral: { on: false }     // undang teman (.invite)
}

global.extraFitur = {
    turnamen: { on: false },  // turnamen mingguan antar clan
    badge: { on: false }      // badge pencapaian user
}

// ═══════════════ MEDIA ═══════════════
global.audioMenu = "https://cdn.zass.in/DtCQB2nUiE.mp3"
global.kthumb = {
    utama: "https://cdn.zass.in/tlQJc8Qp8I.jpg",
    menu: "https://cdn.zass.in/tlQJc8Qp8I.jpg",
    videoMenu: "https://cdn.zass.in/8yaSI5BefZ.mp4",
    docMenu: "https://cdn.zass.in/ztGCbJeVZV.pdf"
}
global.stickerPack = {
    packname: global.namebot,
    author: global.ownername
}

// ═══════════════ API & TOKEN ═══════════════
global.APIs = { yann: '' }
global.APIKeys = { '': 'YOUR-APIKEY' }

// Termai API (plugins/ai/termai-*.js) — key diambil dari https://termai.cc, atau env TERMAI_KEY
global.termai = { url: 'https://api.termai.cc', key: process.env.TERMAI_KEY || '' }
global.autoai = { name: global.namebot, aliases: [], persona: '', voice: 'cute voice' }


global.tokengh = ""   // GitHub (.setghtoken)

global.vercel = {
    token: process.env.VERCEL_TOKEN || "",
    teamId: ""                  // isi hanya kalau deploy ke Team
}

global.telegram = {
    token: "",   // @BotFather atau env TELEGRAM_TOKEN
    owners: [],       // ID angka (kirim /myid ke bot)
    dropPending: true,          // abaikan pesan numpuk saat bot mati
    maxAgeSec: 0,               // abaikan pesan lebih tua dari N detik (0 = off)
    registerCommands: true,     // daftarkan /menu, /myid, /ping
    hideCategories: ['rich', 'rpg', 'relationship', 'user', 'fun', 'clan', 'economy'],   // tidak tampil & tidak direspon di Telegram
}

// ═══════════════ PERFORMA ═══════════════
global.optimizer = {
    maxMsgAgeSec: 0,            // 0 = pesan lama tidak pernah dilewati
    maxPendingPerChat: Infinity,
    memSoftRatio: 1,            // 1 = pembersihan memori tidak pernah jalan
    memHardRatio: 1,
    rssHardRatio: 1,
    connectStuckMs: 86_400_000, // watchdog reconnect saat "connecting"
    deadSocketMs: 86_400_000,   // watchdog reconnect saat websocket mati
    tmpMaxAgeMs: 86_400_000,    // file temp dihapus setelah 1 hari
    quiet: false
}

global.antiban = {
    minDelayMs: 1200,           // jeda minimum antar pesan
    maxDelayMs: 3200,           // jeda maksimum (acak)
    perMinute: 20,              // maks pesan keluar / menit
    perChatPerMinute: 10        // maks per chat / menit
}

// ═══════════════ PEMBAYARAN ═══════════════
global.qrisStatic = ""

// QRIS GoPay otomatis (.order) — token = INTERNAL_TOKEN di Vercel
global.merchantGw = {
    url: "",
    token: "",
    storeName: "WhatsApp Bot",
    ttlMin: 10,                 // order hangus kalau belum dibayar (menit)
    graceMin: 45,               // tetap dicek setelah hangus (menit)
    pollSec: 8,                 // jeda cek saat ada yang ditunggu (detik)
    idlePollSec: 30,            // jeda cek saat sepi (detik)
    notifyIncoming: true,       // notif ke owner tiap uang masuk
    donateMax: 10000000,        // maks donasi per transaksi
    donateChannel: ""           // ID saluran WhatsApp untuk notif donasi masuk, contoh: "120363xxxxxxxxxxxx@newsletter"
                                // kosong = tidak kirim ke saluran | bot harus admin/pemilik saluran, kalau bukan tidak dikirim
}

global.sociabuzz = { username: '' }

// ═══════════════ SEWA BOT ═══════════════
global.sewamode = false         // true = grup wajib sewa
global.sewaAutoLeave = false    // true = keluar otomatis saat sewa habis

// hari: null = permanen | pakai: .sewa bulanan
global.sewaPlans = [
    { id: "harian",   nama: "1 Hari",   hari: 1,    harga: 2000 },
    { id: "mingguan", nama: "7 Hari",   hari: 7,    harga: 5000 },
    { id: "bulanan",  nama: "30 Hari",  hari: 30,   harga: 10000 },
    { id: "3bulan",   nama: "90 Hari",  hari: 90,   harga: 20000 },
    { id: "permanen", nama: "Permanen", hari: null, harga: 50000 }
]

// ═══════════════ AUTO RELOAD ═══════════════


// ═══════════════ DIATUR OLEH settings.js — blok ini menimpa nilai di atas ═══════════════
const __G = globalThis
const __pick = (...v) => v.find((x) => x !== undefined && x !== null && x !== '')
global.namebot = __pick(__G.botname, 'WhatsApp Bot')
global.ownername = __pick(__G.ownername, 'Owner Bot')
global.creator = global.ownername
global.nameSaluran = global.namebot
global.idSaluran = __pick(__G.channel, '')
global.paircode = ''
global.platforms = { whatsapp: true, telegram: false }
global.public = true
global.wajibDaftar = false            // Pendaftaran tidak diwajibkan
global.hanyaTerdaftar = false
global.replyCardOn = false            // tampilan balasan diurus lapisan UI
global.dbEngine = 'json'
global.audioMenu = ''
global.sewamode = false
global.grupbot = false
global.botMode = 'all'
global.thumb = undefined
global.kthumb = new Proxy({}, { get: (t, k) => (k in t ? t[k] : __G.thumbnail || '') })
Object.defineProperty(global, 'owners', {
  configurable: true,
  get() {
    try {
      const a = [__G.ownernumber, ...[].concat(__G.owner || [])]
      const o = globalThis.__vxOwners ? globalThis.__vxOwners() : []
      return [...new Set([...a, ...o].map((x) => String(x || '').replace(/\D/g, '')).filter(Boolean))]
    } catch { return [] }
  }, set() {}
})
// mess dibuat superset agar tidak mematahkan fitur lain
global.mess = Object.assign({ wait: 'Tunggu sebentar ya...', sewa: 'Fitur ini khusus grup sewa.', vip: 'Fitur ini khusus VIP.', botAdmin: 'Jadikan bot admin dulu.', mainOwner: 'Khusus owner utama.' }, __G.mess || {}, global.mess)
global.APIs = Object.assign({}, global.APIs || {}, __G.APIs || {})
global.APIKeys = Object.assign({}, global.APIKeys || {}, __G.APIKeys || {})
global.termai = { url: 'https://api.termai.cc', key: process.env.TERMAI_KEY || '' }
global.autoai = { name: global.namebot, aliases: [], persona: '', voice: 'cute voice' }
global.stickerPack = { packname: __pick(__G.packname, global.namebot), author: __pick(__G.author, global.namebot) }

// ── Pembayaran: isi data sendiri bila fitur terkait digunakan. ──
global.qrisStatic = __pick(__G.qrisStatic, '')
global.merchantGw = { url: '', token: '', storeName: global.namebot, ttlMin: 10, graceMin: 45, pollSec: 8, idlePollSec: 30, notifyIncoming: true, donateMax: 10000000, donateChannel: '' }
global.sociabuzz = { username: '' }
global.telegram = Object.assign({}, global.telegram, { token: '', owners: [] })

// Kembalikan global milik bot utama (config runtime ini tidak boleh menimpa pengaturan utama)
const __own = new Set(['owners','mess','APIs','APIKeys','kthumb'])
for (const k of Object.keys(__orig)) {
  if (__own.has(k)) continue
  try { global[k] = __orig[k] } catch {}
}
if (__orig.mess && typeof __orig.mess === 'object') global.mess = Object.assign({}, global.mess, __orig.mess)
if (__orig.APIs && typeof __orig.APIs === 'object') global.APIs = Object.assign({}, global.APIs, __orig.APIs)
if (__orig.APIKeys && typeof __orig.APIKeys === 'object') global.APIKeys = Object.assign({}, global.APIKeys, __orig.APIKeys)
global.kPrefixes = () => [String(globalThis.prefix || '.')]

import { fileURLToPath as __fu } from 'url'
global.kRichDir = __fu(new URL('./plugins/rich/', import.meta.url))
