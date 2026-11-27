// Jembatan config (versi CommonJS, karena plugin hasil port WhatsApp Bot pakai require()).
// Bentuknya sama dengan WhatsApp Bot/config.js, dibaca dari identitas/APIkey WhatsApp Bot (settings.js).
const bot = require("../../config.js")
const owners = require("../owners.js")
const DEF = { cuki: 'cuki-x' }
const num = (j) => String(j || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
const key = (k) => (global.apiKeys && global.apiKeys[k]) || DEF[k] || ''

const config = {
  bot: { name: bot.botName, developer: bot.ownerName, number: bot.ownerNumber, version: '2.5.5' },
  owner: { name: bot.ownerName, number: [bot.ownerNumber] },
  mode: 'public',
  command: { prefix: '.' },
  energi: { enabled: true, default: 99999, owner: -1 },
  limits: { default: 99999 },
  features: { antiCall: false, autoTyping: true, autoRead: true, logMessage: true },
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
  info: { website: bot.links && bot.links.wa ? 'https://' + bot.links.wa : '' },
  assets: {}
}
config.isOwner = (n) => { try { return owners.isOwner(num(n) + '@s.whatsapp.net') || owners.isOwner(String(n)) } catch { return false } }
config.isPartner = () => false
config.isBanned = (n) => { try { return !!require("../guard.js").isBanned(num(n) + '@s.whatsapp.net') } catch { return false } }
config.isSelf = () => false
config.getOwnerName = () => bot.ownerName
config.getConfig = () => config

module.exports = config
module.exports.config = config
module.exports.isOwner = config.isOwner
module.exports.isPartner = config.isPartner
module.exports.isBanned = config.isBanned
module.exports.isSelf = config.isSelf
module.exports.getOwnerName = config.getOwnerName
module.exports.getConfig = config.getConfig
