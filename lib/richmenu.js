// lib/richmenu.js — menu mode RICH.
//
//  Menu = kartu RICH HTML asli (richResponseMessage), interaktif (kategori, cari, halaman), tampil OTOMATIS tanpa tombol "Unduh"
//  (lib/richsend.js -> bypassDownload). Tema warna mengikuti .tema (lib/theme.js). TIDAK dijadikan gambar.
//
//  Dipanggil dari plugins/info/menu.js lewat params.richMenu. Mode TEXT / gagal kirim -> return false,
//  lalu menu teks biasa yang tampil. Mode diatur .uimode (lib/uimode.js).
'use strict'

const ui = require('./ui')
const uimode = require('./uimode')
const { getUser, expNeeded, topUsers, countUsers } = require('./db')
const { userOf } = require('./utils')

// ---------------------------------------------------------------- kartu menu HTML
async function sendNativeMenu(ctx, sub) {
  const richui = require('./richui')
  const { catIcon, cmdIcon } = require('./menuicons')
  const thumb = require('./thumb')
  const { sock, msg, from, sender, isOwner, prefix, plugins } = ctx
  const list = Array.isArray(plugins) ? plugins : [...plugins]
  const { groups, order } = ui.collect(list, isOwner)
  const popular = new Set([...order].filter((c) => groups[c].length >= 10).sort((a, b) => groups[b].length - groups[a].length).slice(0, 2))
  const cats = order.map((c) => ({
    id: c,
    icon: catIcon(c),
    label: ui.labelOf(c),
    desc: ui.longDescOf(c),
    hot: popular.has(c),
    items: groups[c].map((p) => ({ i: cmdIcon(p, c), c: ui.mainCmd(p), d: p.desc || '' }))
  }))
  const key = String(sub || '').trim().toLowerCase()
  const hit = order.find((c) => c.toLowerCase() === key)
  const start = key === 'all' ? 'all' : hit ? 'cat' : 'home'

  const n = userOf(sender)
  const u = getUser(sender)
  if (msg.pushName) u.name = msg.pushName
  const need = expNeeded(u.level)
  const ranking = topUsers('level', 1e9)
  const pos = ranking.findIndex((x) => x.id === n) + 1
  let avatar = ''
  try {
    avatar = await richui.avatarUri(await ui.avatarOf(sock, sender))
  } catch {}

  let banner = ''
  try {
    if (global.uiMenuBanner === true) {
      // banner bawaan tema (mis. foto koboy hitam-putih) = file kecil siap pakai; tema tanpa banner memakai thumbnail bot
      const tb = require('./theme').rich().banner
      const tf = tb && require('path').join(__dirname, '..', tb)
      if (tf && require('fs').existsSync(tf)) {
        banner = `data:image/jpeg;base64,${require('fs').readFileSync(tf).toString('base64')}`
      } else {
        const img = await thumb.image()
        const out = await require('sharp')(img).resize(520, 192, { fit: 'cover', position: 'attention' }).jpeg({ quality: 58 }).toBuffer()
        banner = `data:image/jpeg;base64,${out.toString('base64')}`
      }
    }
  } catch {}

  const total = cats.reduce((a, c) => a + c.items.length, 0)
  const card = richui.menuApp({
    banner,
    prefix,
    start,
    cat: hit || '',
    link: global.uiTapLink ? `https://wa.me/${userOf(sock.user?.id)}?text=` : '',
    user: {
      greeting: ui.greeting(),
      name: u.name || ui.maskNumber(n),
      status: isOwner ? 'OWNER' : 'MEMBER',
      chat: from.endsWith('@g.us') ? 'Grup' : 'Pribadi',
      avatar,
      level: u.level,
      pct: Math.min(100, Math.floor((u.exp / need) * 100)),
      exp: ui.fmt(u.exp),
      expNeed: ui.fmt(need),
      money: ui.rp(u.money),
      bank: ui.rp(u.bank),
      limit: u.limit,
      rank: pos,
      rankTotal: ranking.length
    },
    info: { mode: 'Public', users: typeof countUsers === 'function' ? countUsers() : ranking.length, total, uptime: Math.floor(process.uptime()) },
    cats
  })
  await richui.sendHtml(sock, from, card.html, card.label)
  return true
}

async function send(ctx, sub = '') {
  if (!uimode.isRich() || (global.config && global.config.richMode === false)) return false
  try {
    if (!ctx || !ctx.plugins || (!Array.isArray(ctx.plugins) && typeof ctx.plugins[Symbol.iterator] !== 'function')) return false
    if (!uimode.isNative()) return false
    return await sendNativeMenu(ctx, sub)
  } catch (err) {
    console.log('[RICHMENU] kartu HTML gagal, pakai menu teks:', err.message)
    return false
  }
}

module.exports = { send }
