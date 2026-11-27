'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxUrl = require('url').pathToFileURL(__filename).href;
const __vxExports = {};
// Objek config gaya bot asal, dibentuk dari config/settings WhatsApp Bot. Kunci API diisi di settings.js -> global.apiKeys.
const fs = __vxDef(require("fs"));
const path = __vxDef(require("path"));
const { fileURLToPath } = require("url");
const { createRequire } = require("module");

const bot = require("../../config.js")
const here = path.dirname(fileURLToPath(__vxUrl))
const DEF = { cuki: 'cuki-x' }
const key = (k) => (global.apiKeys && global.apiKeys[k]) || DEF[k] || ''

const owners = require("../owners.js")
const num = (j) => String(j || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')

const config = {
  bot: { name: bot.botName, developer: bot.ownerName, number: bot.ownerNumber, version: '3.4' },
  owner: { name: bot.ownerName, number: [bot.ownerNumber] },
  mode: 'public',
  command: { prefix: '.' },
  energi: { enabled: true, default: 99999, owner: -1 },
  limits: { default: 99999 },
  registration: { enabled: false, rewards: { koin: 30000, energi: 300, exp: 300000 } },
  features: { antiCall: false, blockIfCall: false, autoTyping: true, autoRead: true, logMessage: true, dailyLimitReset: true, smartTriggers: false },
  welcome: { defaultEnabled: false },
  goodbye: { defaultEnabled: false },
  ui: { menuVariant: 1, allmenuVariant: 2, replyVariant: 1 },
  payment: {},
  donasi: {},
  alipshop: { baseUrl: '', apiKey: '', ...(global.alipshop || {}) },
  errorTemplate: '☢ Kayaknya command `{prefix}{command}` lagi ada kendala\nSilahkan coba lagi nanti, {pushName}\n\n_Jika masalah berlanjut, silahkan hubungi owner bot_',
  messages: {
    wait: '🕕 *Proses...* Mohon tunggu sebentar ya.',
    success: '✅ *Berhasil!* Permintaan kamu sudah selesai.',
    error: '❌ *Error!* Ada masalah pada sistem, coba lagi nanti.',
    ownerOnly: '*Akses Ditolak!* Fitur ini khusus untuk Owner bot.',
    groupOnly: '👥 *Group Only!* Fitur ini hanya bisa digunakan di dalam grup.',
    privateOnly: '🔒 *Private Only!* Fitur ini hanya bisa digunakan di chat pribadi bot.',
    adminOnly: '🛡️ *Admin Only!* Kamu harus jadi Admin grup untuk pakai fitur ini.',
    botAdminOnly: '🤖 *Bot Bukan Admin!* Jadikan bot sebagai Admin grup dulu biar bisa kerja.',
    cooldown: '🕕 *Tunggu Dulu!* Kamu masih dalam cooldown. Tunggu %time% detik lagi ya.',
    energiExceeded: '⚡ *Energi Habis!* Energi kamu sudah habis.',
    limitDeducted: '🔋 Limit kau berkurang sebanyak {amount}. Sisa limit: {sisa}',
    banned: '🚫 *Kamu Dibanned!* Kamu tidak bisa menggunakan bot ini.'
  },
  sticker: { packname: bot.stickerPack, author: bot.stickerAuthor },
  saluran: { id: bot.newsletter.jid, name: bot.newsletter.name, link: '' },
  APIkey: new Proxy({}, { get: (_t, k) => (typeof k === 'string' ? key(k) : undefined), has: () => true }),
  // ---- alias/bagian config yang dipakai plugin hasil port; nilainya dibaca dari settings.js (global.apiKeys / global.ghTokens)
  zeroApi: new Proxy({}, { get: (_t, k) => (typeof k === 'string' ? key(k) : undefined), has: () => true }),
  aquaApi: { get freeRestApiKey() { return key('aqua') } },
  get geminiApiKey() { return key('gemini') },
  jasaotp: { get apiKey() { return key('jasaotp') }, markup: 2000, timeout: 300 },
  github: { get token() { return global.ghTokens || '' }, get owner() { return global.userGh || '' }, repo: 'cdn1', branch: 'main', folder: 'uploads' },
  dev: { debugLog: false },
  vercel: { get token() { return key('vercel') || global.vercelToken || '' } },
  info: { website: bot.links && bot.links.wa ? 'https://' + bot.links.wa : '' },
  assets: { 'pp-kosong': './assets/pp-kosong.jpg', 'vanxone-kertas': './assets/vanxone-kertas.jpg', 'vanxone-font': './assets/vanxone-font.ttf' }
}
// ---- fungsi bantu ala config asli, memakai pemilik dan ban milik bot
config.isOwner = (n) => { try { return owners.isOwner(num(n) + '@s.whatsapp.net') || owners.isOwner(String(n)) } catch { return false } }
config.isPartner = () => false
config.isBanned = (n) => { try { return !!require("../guard.js").isBanned(num(n) + '@s.whatsapp.net') } catch { return false } }
config.isSelf = () => false
config.getOwnerName = () => bot.ownerName
config.getConfig = () => config

// peta aset (nama tanpa ekstensi -> path file) dibaca dari folder WhatsApp Bot/assets
try {
  const top = path.join(here, '..', 'assets')
  const walk = (d, depth = 0) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name)
      if (e.isDirectory()) { if (depth < 4) walk(p, depth + 1) } else {
        const k = e.name.replace(/\.[^.]+$/, '')
        if (!config.assets[k]) config.assets[k] = './' + path.relative(path.join(here, '..'), p).split(path.sep).join('/')
      }
    }
  }
  walk(path.join(here, 'assets')); walk(top)
} catch {}

const __vxDefault = config

const isOwner = config.isOwner, isPartner = config.isPartner, isBanned = config.isBanned, isSelf = config.isSelf, getOwnerName = config.getOwnerName, getConfig = config.getConfig

Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => config });
Object.defineProperty(__vxExports, "isOwner", { enumerable: true, get: () => isOwner });
Object.defineProperty(__vxExports, "isPartner", { enumerable: true, get: () => isPartner });
Object.defineProperty(__vxExports, "isBanned", { enumerable: true, get: () => isBanned });
Object.defineProperty(__vxExports, "isSelf", { enumerable: true, get: () => isSelf });
Object.defineProperty(__vxExports, "getOwnerName", { enumerable: true, get: () => getOwnerName });
Object.defineProperty(__vxExports, "getConfig", { enumerable: true, get: () => getConfig });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
