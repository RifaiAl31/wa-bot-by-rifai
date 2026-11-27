// lib/portkit.js — adapter generik untuk paket hasil port yang formatnya SAMA dengan WhatsApp Bot
// (pluginConfig + handler(m, { sock, text, args, command, prefix })). Dipakai oleh lib/vanxone.js,
// lib/vanxone2.js, lib/vanxone2.js. Fungsi sock tambahan (sendMedia/sendButton/stiker dst.) dan
// pembentukan objek m dipakai bersama dari lib/vanxone.js (sock yang sama, jadi aman dipakai lintas paket).
'use strict'

const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')
const vanxoneNimbus = require("./e3.js")

function makeAdapter(packName, rank = 9) {
  const cache = new Map()
  function loadModule(file) {
    if (!cache.has(file)) {
      const p = Promise.resolve().then(() => require(file))
      p.catch(() => cache.delete(file))
      cache.set(file, p)
    }
    return cache.get(file)
  }
  const reg = require('./modreg.js')
  const loadPlugin = (rel) => reg.get(packName, rel)

  const cooldowns = new Map()
  function preflight(meta, ctx) {
    const { isOwner, isGroup, sender } = ctx
    if (meta.private && isGroup) return 'Fitur ini hanya bisa dipakai di chat pribadi bot.'
    for (const k of (meta.needs && meta.needs.apikeys) || []) {
      if (!(global.apiKeys && global.apiKeys[k])) {
        return `Fitur ini butuh apikey *${k}* yang belum diisi.\nOwner: isi \`global.apiKeys.${k}\` di settings.js lalu restart bot.`
      }
    }
    if (meta.cooldown && !isOwner) {
      const k = `${packName}:${meta.name}:${sender}`
      const last = cooldowns.get(k) || 0
      const wait = meta.cooldown * 1000 - (Date.now() - last)
      if (wait > 0) return `Tunggu ${Math.ceil(wait / 1000)} detik lagi sebelum memakai perintah ini.`
    }
    return null
  }

  function plugin(rel, meta) {
    const cmds = [...new Set(meta.command.map((c) => String(c).toLowerCase()))]
    global.uiPlain = [...new Set([...(global.uiPlain || []), ...cmds])]

    return {
      name: meta.name || cmds[0],
      command: cmds,
      category: meta.category,
      desc: meta.desc || `Perintah ${cmds[0]}`,
      usage: meta.usage || '',
      owner: !!meta.owner,
      override: !!meta.override,
      group: !!meta.group,
      admin: !!meta.admin,
      botAdmin: !!meta.botAdmin,
      selfReact: true,
      run: async (ctx) => {
        const { sock, msg, from, sender, isOwner } = ctx
        vanxoneNimbus.extend(sock)
        const quotedOpt = { quoted: msg }
        const reply = (text, chatId, options = {}) => sock.sendMessage(chatId || from, { text: typeof text === 'string' ? text : String(text), ...options }, quotedOpt)

        const block = preflight(meta, ctx)
        if (block) return reply(block)

        let mod
        try {
          mod = await loadPlugin(rel)
        } catch (err) {
          console.log(`[${packName.toUpperCase()}] gagal memuat ${rel}:`, err.message)
          const pkg = /Cannot find (?:package|module) '([^']+)'/.exec(err.message)
          return reply(pkg ? `Dependensi *${pkg[1]}* belum terpasang. Owner: jalankan \`npm install\` lalu restart bot.` : `Fitur gagal dimuat: ${err.message}`)
        }
        if (typeof mod.handler !== 'function') return reply('Fitur ini tidak punya handler.')

        if (meta.cooldown) cooldowns.set(`${packName}:${meta.name}:${sender}`, Date.now())

        const m = vanxoneNimbus.buildM(sock, ctx, reply)
        m.isOwner = !!isOwner
        m.isAdmin = !!ctx.isAdmin
        m.isBotAdmin = !!ctx.isBotAdmin
        m.isGroup = !!ctx.isGroup
        m.isBanned = false
        m.hasQuotedMedia = !!(m.quoted && m.quoted.isMedia)

        // fitur bergaya `conn` (Hoshino/VEMZO) & `db` (setting/getGroup/getUser) ikut dilayani — tanpa ini handler { conn } / { db } error "undefined"
        let conn = sock
        try { conn = require('./e6.js').buildConn(sock) } catch {}
        let db = null
        try { db = await vanxoneNimbus.loadDb() } catch {}
        // `config` per paket (config.js / config.e7.js ...) — dipakai fitur gaya { config } seperti game sos/blockade/othello
        let pkgConfig = {}
        try {
          const cf = require('./extmap.js').p(packName, 'config.js')
          if (cf) { const cm = await loadModule(cf); pkgConfig = (cm && cm.default) || cm || {} }
        } catch {}
        const participants = (ctx.groupMetadata && ctx.groupMetadata.participants) || []
        const params = {
          sock, conn, db, config: pkgConfig, m, msg, text: ctx.text, args: ctx.args, command: ctx.command, usedPrefix: m.prefix, prefix: m.prefix, reply,
          isOwner, isROwner: !!isOwner, isMods: !!isOwner,
          isGroup: ctx.isGroup, isAdmin: ctx.isAdmin, isBotAdmin: ctx.isBotAdmin, groupMetadata: ctx.groupMetadata, participants
        }
        try {
          await mod.handler(m, params)
        } catch (err) {
          console.log(`[${packName.toUpperCase()}:${meta.name}]`, err.message)
          if (isOwner) await reply(`🔧 *Detail error (khusus owner)*\n\nFitur: ${meta.name}\nPenyebab: ${err.message}`).catch(() => {})
        }
      }
    }
  }

  const tag = require("./rank.js")
  const plugin2 = (rel, meta, thunk) => { reg.register(packName, rel, thunk); return plugin(rel, meta) }
  return { plugin: tag(rank, plugin2), module: (rel, thunk) => reg.moduleOnly(packName, rel, thunk), loadPlugin }
}

module.exports = makeAdapter
