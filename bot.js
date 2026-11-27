require("./lib/bootstrap.js") // pasang dependency otomatis kalau belum ada (panel: cukup klik Start)
require("./lib/ffpath.js").install() // ffmpeg bawaan masuk PATH kalau server tidak punya
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  normalizeMessageContent,
  Browsers
} = require('@whiskeysockets/baileys')
require("./lib/quietlog.js").install()
// Respon cepat & anti-macet: IPv4 dulu (IPv6 yang buntu bikin request menggantung di VPS/panel) + batas waktu default semua request axios
try { require('dns').setDefaultResultOrder('ipv4first') } catch {}
try { const ax = require('axios'); if (!ax.defaults.timeout) ax.defaults.timeout = 45000 } catch {}
const { Boom } = require('@hapi/boom')
const pino = require('pino')
const readline = require('readline')
const fs = require('fs')
const path = require('path')
const config = require("./config.js")
const { userOf, getGroupInfo } = require("./lib/utils.js")
const { addExp } = require("./lib/db.js")
const { handleAntiLink } = require("./lib/antilink.js")
const { handleParticipants } = require("./lib/groups.js")
const { isBanned, handleAfk, handleBadWord, isMutedFor } = require("./lib/guard.js")
const { startScheduler } = require("./lib/scheduler.js")

const logger = pino({ level: 'silent' })
const pluginDir = path.join(__dirname, 'plugins')
const plugins = new Map()
global.__vanPlugins = () => [...new Set(plugins.values())] // dipakai lib/engine/registry.js (totalfitur2, benefitowner, searchplugin, dst.)
// Modul "hook" (tanpa perintah): passive(ctx) dipanggil untuk setiap pesan (return true = hentikan pemrosesan),
// onParticipants(sock, ev) untuk peristiwa anggota grup, init(sock) saat bot terhubung (harus idempoten).
const hooks = []

// ---------- Settings (mode self/public) ----------
const settingsFile = path.join(__dirname, 'settings.json')
const settings = { mode: 'public' }
try {
  Object.assign(settings, JSON.parse(fs.readFileSync(settingsFile, 'utf8')))
} catch {}
const saveSettings = () => fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2))

// ---------- Auto load plugins (rekursif) ----------
function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.name.startsWith('.')) continue
    if (entry.isDirectory()) out.push(...walk(full))
    else if (entry.name.endsWith('.js')) out.push(full)
  }
  return out
}

function loadPlugins() {
  plugins.clear()
  hooks.length = 0
  if (!fs.existsSync(pluginDir)) fs.mkdirSync(pluginDir, { recursive: true })
  const result = { loaded: 0, failed: [] }
  const cats = require("./lib/categories.js")

  // Tahap 1: muat semua file (kategori otomatis dirapikan lewat lib/categories.js)
  const found = []
  for (const full of walk(pluginDir).sort()) {
    const file = path.relative(pluginDir, full)
    try {
      delete require.cache[require.resolve(full)]
      const plugin = require(full)
      if (plugin && plugin.hook === true && (plugin.passive || plugin.onParticipants || plugin.init)) {
        found.push({ file, full, plugin, hook: true })
        continue
      }
      if (typeof plugin.run !== 'function' || !plugin.command) {
        console.log(`[PLUGIN] dilewati (format salah): ${file}`)
        result.failed.push({ file, error: 'format salah (butuh run & command)' })
        continue
      }
      plugin.category = cats.canon(plugin.category)
      found.push({ file, full, plugin, hook: false })
    } catch (err) {
      console.log(`[PLUGIN] gagal memuat ${file}:`, err.message)
      result.failed.push({ file, error: err.message })
    }
  }

  // Tahap 2: fitur asli WhatsApp Bot selalu menang — fitur dari engine/ (plugin.__ported = peringkat) didaftarkan paling akhir
  // dan tidak menimpa command yang sudah ada.
  found.sort((a, b) => (a.plugin.__ported || 0) - (b.plugin.__ported || 0) || (a.file < b.file ? -1 : 1))
  for (const { file, full, plugin, hook } of found) {
    if (hook) {
      hooks.push(plugin)
      result.loaded++
      console.log(`[PLUGIN] hook dimuat: ${file}`)
      continue
    }
    // catat file asal (tidak ikut ter-enumerate) untuk .addfitur / .delfitur
    Object.defineProperty(plugin, '__file', { value: full, enumerable: false, configurable: true, writable: true })
    let cmds = (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).map((c) => String(c).toLowerCase())
    // plugin.override = varian terbaik hasil merge: sengaja MENIMPA command bercabang (play, tiktok, ytmp3, dst.)
    if (plugin.__ported && !plugin.override) {
      cmds = cmds.filter((c) => !plugins.has(c))
      if (!cmds.length) { result.loaded++; continue }
      plugin.command = cmds
    }
    for (const cmd of cmds) plugins.set(cmd, plugin)
    result.loaded++
    console.log(`[PLUGIN] dimuat: ${file}`)
  }
  return result
}


// ---------- Helper ----------
const seen = new Set()

// Pesan "sedang diproses" tidak perlu jadi chat: cukup reaksi ⏳. Pesan gagal ditandai ❌.
const WAIT_RE = /^\s*(⏳|⌛|🔎|🔬)|^\s*(Mengunduh|Mencari|Membuat|Menguji|Mengirim|Memproses|Menghitung|Menyiapkan|Masuk antrian)/i
const FAIL_RE = /^\s*(❌|⚠️)|gagal|tidak ditemukan|tidak bisa|tidak valid|\berror\b|ditolak|kesalahan/i

function getBody(msg) {
  const m = normalizeMessageContent(msg.message)
  if (!m) return ''

  // Tombol interaktif (quick_reply / list): id tombol dipakai sebagai perintah
  const flow = m.interactiveResponseMessage?.nativeFlowResponseMessage
  if (flow) {
    let id = ''
    try {
      const parsed = typeof flow.paramsJson === 'string' ? JSON.parse(flow.paramsJson || '{}') : flow.paramsJson || {}
      id = parsed.id || parsed.selectedId || parsed.row_id || ''
      // cadangan: cocokkan teks tombol dengan kartu yang dibalas
      if (!id) id = require("./lib/cardreply.js").lookupByLabel(msg, parsed.display_text || m.interactiveResponseMessage?.body?.text) || ''
    } catch (err) {
      console.log('[BTN] paramsJson tidak terbaca:', err.message)
    }
    console.log(`[BTN] tombol ditekan (${flow.name || '?'}): ${id ? id.slice(0, 120) : 'KOSONG, mentah=' + String(flow.paramsJson).slice(0, 200)}`)
    return id
  }
  if (m.templateButtonReplyMessage?.selectedId) return m.templateButtonReplyMessage.selectedId

  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.buttonsResponseMessage?.selectedButtonId ||
    m.listResponseMessage?.singleSelectReply?.selectedRowId ||
    ''
  )
}

const owners = require("./lib/owners.js")
const isOwnerJid = (jid) => owners.isOwner(jid)

function question(text) {
  // Console Pterodactyl hanya menampilkan baris yang diakhiri newline. Prompt readline tidak pakai newline,
  // jadi tulisannya tidak pernah muncul dan bot terlihat "stuck". Tulis dulu lewat console.log.
  console.log(text)
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false })
  return new Promise((resolve) =>
    rl.question('> ', (answer) => {
      rl.close()
      resolve(answer)
    })
  )
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// fetchLatestBaileysVersion tidak punya timeout; kalau GitHub lambat/diblok panel, bot menggantung diam-diam.
async function getWaVersion() {
  try {
    const res = await Promise.race([
      fetchLatestBaileysVersion(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout 8 detik')), 8000))
    ])
    return res.version
  } catch (err) {
    console.log('[BOT] gagal ambil versi WA terbaru, pakai versi bawaan Baileys:', err.message)
    return undefined
  }
}

// ---------- Start bot ----------
async function startBot() {
  console.log('[BOT] membaca sesi & menyiapkan koneksi...')
  const { state, saveCreds } = await useMultiFileAuthState(
    path.join(__dirname, config.sessionDir)
  )
  const version = await getWaVersion()

  const sock = makeWASocket({
    ...(version ? { version } : {}),
    logger,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger)
    },
    browser: Browsers.ubuntu('Chrome'),
    markOnlineOnConnect: false,
    syncFullHistory: false, // jangan unduh riwayat lama: start lebih cepat & hemat RAM
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 25000,
    defaultQueryTimeoutMs: 60000,
    retryRequestDelayMs: 250,
    getMessage: async () => undefined // cegah error 'getMessage' saat WhatsApp minta kirim ulang pesan
  })
  global.conn = global.mainSock = sock // fitur gaya `conn` membaca global ini

  sock.ev.on('creds.update', saveCreds)

  // jalur kirim mentah (tanpa lapisan tampilan)
  sock.__rawSend = sock.sendMessage.bind(sock)
  // Pesan rich (kartu HTML, game HTML, AI rich) langsung tampil tanpa tombol "Unduh" (lib/richfix.js). Dipasang paling dalam
  // supaya semua pengirim rich di bawahnya (richui, plugin game, engine) otomatis kebagian.
  require("./lib/richfix.js").install(sock)
  require("./lib/thumb.js").install() // global.getThumbnail() / getMenuMedia(): foto & GIF thumbnail dari settings.js
  // UI kartu HTML: semua balasan teks otomatis jadi kartu (lihat lib/richui.js; matikan lewat global.uiMode = 'text')
  require("./lib/richui.js").install(sock, config)
  // Rapikan semua balasan teks fitur bergaya WhatsApp Bot (judul, garis, baris label, footer). Matikan: global.uiFormat = false
  global.__mess = config.mess
  global.__prefix = config.prefix
  require("./lib/fmt.js").install(sock)
  // Pengirim tombol / carousel / produk / AI rich = kode WhatsApp Bot asli (engine/lib/wraper-send). Dipasang paling luar.
  await require("./lib/adapter/send.js").install(sock)

  // ---------- Pairing code (tanpa QR) ----------
  if (!sock.authState.creds.registered) {
    // Nomor bisa diisi di settings.js (global.pairingNumber = '628xxx') atau env PAIRING_NUMBER,
    // jadi tidak perlu mengetik di console panel. Kalau kosong, bot menanyakannya di console.
    let input = process.env.PAIRING_NUMBER || global.pairingNumber || ''
    if (!String(input).replace(/[^0-9]/g, '')) input = await question('Masukkan nomor WhatsApp bot (contoh 628xxx):')
    const phoneNumber = String(input).replace(/[^0-9]/g, '')
    if (!phoneNumber) {
      console.log('Nomor tidak valid.')
      process.exit(1)
    }
    console.log(`[BOT] meminta pairing code untuk ${phoneNumber}...`)
    await sleep(3000) // tunggu websocket terbuka dulu
    let code
    for (let i = 1; i <= 3 && !code; i++) {
      try {
        code = await sock.requestPairingCode(phoneNumber)
      } catch (err) {
        console.log(`[BOT] gagal minta pairing code (percobaan ${i}/3): ${err.message}`)
        await sleep(3000)
      }
    }
    if (!code) {
      console.log('[BOT] pairing code gagal diminta. Cek nomor (pakai kode negara, tanpa +) dan koneksi internet panel, lalu restart.')
      process.exit(1)
    }
    console.log(`\nPAIRING CODE: ${code?.match(/.{1,4}/g)?.join('-') || code}\n`)
    console.log('Buka WhatsApp > Perangkat tertaut > Tautkan dengan nomor telepon, lalu masukkan kode di atas.')
  }

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      console.log(`[${config.botName}] terhubung sebagai ${sock.user?.id}`)
      startScheduler(sock)
      for (const h of hooks) if (typeof h.init === 'function') Promise.resolve().then(() => h.init(sock)).catch((err) => console.log('[HOOK] init', h.name, err.message))
      require("./lib/voip.js").init(sock).catch(() => {})
      require("./lib/autojoin.js").run(sock).catch((err) => console.log('[AUTOJOIN]', err.message))
    }

    if (connection === 'close') {
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode
      if (code === DisconnectReason.loggedOut) {
        console.log('Sesi logout. Hapus isi folder session lalu jalankan ulang untuk pairing baru.')
        process.exit(1)
      }
      console.log(`Koneksi terputus (kode ${code}), menyambung ulang...`)
      startBot()
    }
  })

  // ---------- Welcome / leave ----------
  sock.ev.on('group-participants.update', (ev) =>
    handleParticipants(sock, ev).catch((err) => console.log('[ERROR] welcome/leave:', err.message))
  )
  sock.ev.on('group-participants.update', async (ev) => {
    for (const h of hooks) if (typeof h.onParticipants === 'function') { try { await h.onParticipants(sock, ev) } catch (err) { console.log('[HOOK] onParticipants', h.name, err.message) } }
  })

  // Satu fungsi pemroses pesan untuk bot utama DAN jadibot (parameter sock = socket yang menerima pesan)
  const handleUpsert = async (sock, { messages, type }) => {
    if (type !== 'notify' && type !== 'append') return

    for (const msg of messages) {
      try {
        if (msg.key.remoteJid === 'status@broadcast') continue
        if (!msg.message) continue // peristiwa grup/sistem atau pesan yang gagal didekripsi (diringkas oleh lib/quietlog)
        if (type === 'notify') { try { require("./lib/viewonce.js").capture(sock, msg) } catch {}; try { require("./lib/adapter/e9.js").captureViewOnce(sock, msg) } catch {} } // simpan media sekali-lihat saat masuk (dipakai .rvo)
        // 'append' = pesan lama/riwayat; hanya tekanan tombol yang masih baru yang diproses
        const tap = require("./lib/cardreply.js").isTap(msg)
        if (type === 'append' && !(tap && Date.now() / 1000 - Number(msg.messageTimestamp || 0) < 120)) continue
        if (seen.has(msg.key.id)) continue
        seen.add(msg.key.id)
        if (seen.size > 2000) seen.delete(seen.values().next().value)
        if (tap) console.log(`[RX] balasan tombol diterima (${Object.keys(msg.message).join(',')}) dari ${msg.key.participant || msg.key.remoteJid}`)

        const from = msg.key.remoteJid
        const isGroup = from.endsWith('@g.us')
        const sender = isGroup
          ? msg.key.participant || msg.participant
          : msg.key.fromMe
            ? sock.user.id
            : from

        let body = getBody(msg).trim()
        if (tap && !body) console.log('[BTN] balasan tombol diterima tetapi tidak ada perintahnya:', JSON.stringify(msg.message).slice(0, 400))

        // Balas kartu interaktif dengan angka/kata (cadangan bila tombol tidak merespons)
        if (body && !body.startsWith(config.prefix)) {
          const viaReply = require("./lib/cardreply.js").resolve(msg, body)
          if (viaReply) {
            console.log(`[BTN] via balasan kartu: "${body}" → ${viaReply.slice(0, 100)}`)
            body = viaReply
          }
        }

        if (isGroup && !msg.key.fromMe && sender) require("./lib/activity.js").count(from, sender)

        // Antidelete + auto-respon grup (lib/grouptools.js). Gagal di sini tidak boleh menghentikan bot.
        let autoStop = false
        try { autoStop = await require("./lib/grouptools.js").observe(sock, msg, { from, sender, isGroup, body, prefix: config.prefix }) } catch (err) { console.log('[GROUPTOOLS]', err.message) }
        if (autoStop) continue

        // Antilink: jalan untuk semua pesan grup (bukan hanya perintah)
        if (isGroup && !msg.key.fromMe && (await handleAntiLink(sock, msg, { from, sender, body, isOwner: isOwnerJid(sender) || owners.isOwnerMsg(msg) }))) continue

        // Antibadword + AFK: jalan untuk semua pesan, bukan hanya perintah
        if (isGroup && !msg.key.fromMe && (await handleBadWord(sock, msg, { from, sender, body, isOwner: isOwnerJid(sender) || owners.isOwnerMsg(msg) }))) continue
        if (!msg.key.fromMe) await handleAfk(sock, msg, { from, sender, body, prefix: config.prefix })

        // Anti-spam grup: hanya cek info admin ketika batas flood terlewati
        if (isGroup && !msg.key.fromMe && sender && require("./lib/antispam.js").enabled(from) && !isOwnerJid(sender) && !owners.isOwnerMsg(msg)) {
          const hit = require("./lib/antispam.js").check(from, sender, msg.key)
          if (hit) {
            const info = await getGroupInfo(sock, from, sender)
            if (!info.isAdmin) {
              if (info.isBotAdmin) for (const k of hit.keys) sock.sendMessage(from, { delete: k }).catch(() => {})
              if (hit.warn) await sock.sendMessage(from, { text: `🚫 @${userOf(sender)} terdeteksi spam (pesan beruntun). Mohon kirim pesan dengan wajar.`, mentions: [sender] })
              continue
            }
          }
        }

        // Hook pasif plugin (anti-tagall, jawaban game tanpa prefix, dll). Return true = pesan sudah ditangani.
        if (hooks.length) {
          const hookCtx = { sock, msg, from, sender, isGroup, body, prefix: config.prefix, config, settings, isOwner: !!msg.key.fromMe || isOwnerJid(sender) || owners.isOwnerMsg(msg) }
          let stop = false
          for (const h of hooks) {
            if (typeof h.passive !== 'function') continue
            try { if (await h.passive(hookCtx)) { stop = true; break } } catch (err) { console.log('[HOOK] passive', h.name, err.message) }
          }
          if (stop) continue
        }

        const isOwner = !!msg.key.fromMe || isOwnerJid(sender) || owners.isOwnerMsg(msg)
        // prefix dinamis (.setprefix) + mode tanpa prefix (.prefix off / .noprfx on) — lib/vanxone.js
        const plen = require("./lib/adapter/core.js").prefixLen(body, isOwner, (w) => plugins.has(w))
        if (plen < 0) continue

        const args = body.slice(plen).trim().split(/\s+/)
        const command = (args.shift() || '').toLowerCase()
        if (!command) continue

        const plugin = plugins.get(command)
        if (!plugin) continue

        // Wajib daftar (.regis on): user belum terdaftar diminta .daftar dulu
        if (require("./lib/adapter/core.js").regisBlock(sender, isOwner, command)) {
          await sock.sendMessage(from, { text: `Kamu belum terdaftar. Ketik *${config.prefix}daftar* dulu untuk memakai bot.` }, { quoted: msg }).catch(() => {})
          continue
        }

        // Mode self: hanya owner yang dilayani
        if (settings.mode === 'self' && !isOwner && !(isGroup && require("./lib/adapter/owner.js").isBypass(from))) continue

        // User di-ban & grup di-mute (kecuali admin) diabaikan
        if (!isOwner && isBanned(sender)) continue
        if (isGroup && !isOwner && (await isMutedFor(sock, { from, sender, command }))) continue

        const ctx = {
          sock,
          msg,
          from,
          sender,
          isGroup,
          isOwner,
          body,
          args,
          text: args.join(' '),
          command,
          prefix: config.prefix,
          config,
          settings,
          saveSettings,
          plugins: [...new Set(plugins.values())],
          reloadPlugins: loadPlugins
        }

        // ---- Indikator proses lewat reaksi emoji: ⏳ saat menunggu, ✅ saat selesai, ❌ saat gagal ----
        const state = { waiting: false, failed: false }
        const react = (emoji) => sock.sendMessage(from, { react: { text: emoji, key: msg.key } }).catch(() => {})
        ctx.react = (emoji = '⏳') => {
          if (emoji === '⏳') {
            if (state.waiting) return Promise.resolve()
            state.waiting = true
          }
          return react(emoji)
        }
        ctx.reply = (text) => {
          const t = String(text)
          if (WAIT_RE.test(t)) return ctx.react('⏳') // "Mengunduh..." dll tidak dikirim sebagai chat
          if (state.waiting && FAIL_RE.test(t.slice(0, 120))) state.failed = true
          return sock.sendMessage(from, { text }, { quoted: msg })
        }
        // perintah yang berjalan lebih dari ±1,2 detik otomatis diberi ⏳
        const slowTimer = plugin.selfReact ? null : setTimeout(() => ctx.react('⏳'), 1200)

        if (plugin.owner && !isOwner) {
          clearTimeout(slowTimer)
          await ctx.reply(config.mess.only.owner)
          continue
        }

        if ((plugin.group || plugin.admin || plugin.botAdmin) && !isGroup) {
          clearTimeout(slowTimer)
          await ctx.reply(config.mess.only.group)
          continue
        }

        // Plugin yang membaca isAdmin / isBotAdmin / groupMetadata dari ctx otomatis mendapat info grup
        // (sebelumnya hanya plugin ber-flag admin/botAdmin, sehingga swgc/absen/topchat selalu menolak admin).
        const wantsInfo = isGroup && !plugin.admin && !plugin.botAdmin && (plugin.needsInfo || /\b(isAdmin|isBotAdmin|groupMetadata)\b/.test(String(plugin.run)))
        if (wantsInfo) {
          try {
            const info = await getGroupInfo(sock, from, sender)
            ctx.groupMetadata = info.metadata
            ctx.isAdmin = info.isAdmin
            ctx.isBotAdmin = info.isBotAdmin
          } catch (err) {
            console.log('[GROUP] gagal membaca info grup:', err.message)
            ctx.isAdmin = false
            ctx.isBotAdmin = false
          }
        }

        if (plugin.admin || plugin.botAdmin) {
          const info = await getGroupInfo(sock, from, sender)
          if (plugin.admin && !info.isAdmin && !isOwner) {
            clearTimeout(slowTimer)
            await ctx.reply(config.mess.only.admin)
            continue
          }
          if (plugin.botAdmin && !info.isBotAdmin) {
            clearTimeout(slowTimer)
            await ctx.reply(config.mess.only.badmin)
            continue
          }
          ctx.groupMetadata = info.metadata
          ctx.isAdmin = info.isAdmin
          ctx.isBotAdmin = info.isBotAdmin
        }

        // ---- Mode bertahan hidup: tiap fitur memakai energi, saldo, dan limit (lib/survival.js) ----
        let spent = null
        try {
          const gate = require("./lib/survival.js").charge({ sender, plugin, command, isOwner })
          if (gate.block) { clearTimeout(slowTimer); await ctx.reply(gate.block); continue }
          spent = gate
        } catch (err) { console.log('[SURVIVAL]', err.message) }

        try { require("./lib/cmdstats.js").hit(plugin.name || command, sender) } catch {}
        const player = addExp(sender, 10)
        if (msg.pushName) player.name = msg.pushName
        try {
          const names = [].concat(plugin.command).map((c) => String(c).toLowerCase())
          const richui = require("./lib/richui.js")
          await richui.run(
            {
              t0: Date.now(), name: msg.pushName || '', number: String(sender || '').split('@')[0].split(':')[0], category: plugin.category, command, body: ctx.body,
              title: String(plugin.name || command).replace(/[-_]+/g, ' '), icon: require("./lib/menuicons.js").cmdIcon(plugin, plugin.category),
              plain: names.some((n) => richui.OPTS.plain.has(n)),
              // metadata untuk panduan & detail eksekusi otomatis (lib/uidoc.js)
              desc: plugin.desc || '', usage: plugin.usage || '', aliases: names, isGroup, isOwner,
              owner: !!plugin.owner, admin: !!plugin.admin, group: !!plugin.group, botAdmin: !!plugin.botAdmin,
              groupName: ctx.groupMetadata?.subject || ''
            },
            () => require("./lib/menuflow.js").wrap(ctx, command, () => plugin.run(ctx))
          )
          clearTimeout(slowTimer)
          if (state.waiting) await react(state.failed ? '❌' : '✅')
        } catch (err) {
          clearTimeout(slowTimer)
          console.log(`[ERROR] ${command}:`, err)
          if (spent && spent.refund) spent.refund() // fitur gagal -> biaya dikembalikan
          if (state.waiting) await react('❌')
          await sock.sendMessage(from, { text: config.mess.error.fitur }, { quoted: msg }).catch(() => {})
        }
      } catch (err) {
        console.log('[ERROR] handler pesan:', err)
      }
    }
  }
  sock.ev.on('messages.upsert', (ev) => handleUpsert(sock, ev))
  global.__vxHandleUpsert = handleUpsert
}

// Satu folder session = satu proses. Dua proses sekaligus merusak sesi enkripsi (Bad MAC).
{
  const lockDir = path.join(__dirname, config.sessionDir)
  fs.mkdirSync(lockDir, { recursive: true })
  const lock = require("./lib/singleton.js").acquire(path.join(lockDir, '.bot.pid'))
  if (!lock.ok && !process.env.ALLOW_MULTI) {
    console.log(`\n[STOP] Bot ini sudah berjalan di proses lain (PID ${lock.pid}).`)
    console.log('Menjalankan dua bot dengan folder session yang sama merusak enkripsi (error "Bad MAC").')
    console.log(`Hentikan yang lama dulu:  kill ${lock.pid}   (atau pm2 stop all / tutup tab Termux lain)\n`)
    process.exit(1)
  }
}

{
  const code = owners.newClaimCode()
  console.log(`[OWNER] Kalau bot bilang "hanya untuk owner" padahal kamu owner (ID WhatsApp berupa @lid):`)
  console.log(`[OWNER] di CHAT PRIBADI ke bot kirim:  ${config.prefix}claimowner ${code}   (berlaku 30 menit, sekali pakai)`)
}

loadPlugins()
startBot()

process.on('unhandledRejection', (err) => console.log('[unhandledRejection]', err))
process.on('uncaughtException', (err) => console.log('[uncaughtException]', err))
