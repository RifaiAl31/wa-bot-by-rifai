// main/menu — satu file: metadata + kode fitur (gabungan dari engine5/plugins/main/menu.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "menu",
  "command": [
    "menu",
    "help"
  ],
  "category": "info",
  "desc": "Tampilkan daftar perintah",
  "usage": ".menu [kategori|all]"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/menu", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/menu.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxUrl = require('url').pathToFileURL(__filename).href;
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const { fileURLToPath } = require("url");
  
  // MENU_TYPES ada di plugins/owner/setmenu.js (terdaftar di registri modul). Dulu dimuat dari file lib/ext/plugins/main/setmenu.js
  // yang tidak ada -> ENOENT -> ".menu" selalu "Terjadi kesalahan". Sekarang diambil lewat registri; kalau tetap gagal -> menu teks polos.
  const loadSetmenu = async () => require("../../lib/adapter/modreg.js").get('engine5', 'main/setmenu')
  
  const handler = async (m, { sock, getMenuData, usedPrefix, isOwner, text, botSet, getMenuConfig, isJadiBot, db, richMenu }) => {
  
  	// mode rich (.uimode rich): kartu menu interaktif; mode text atau gagal -> lanjut ke menu teks di bawah
  	if (typeof richMenu === 'function' && await richMenu((text || '').trim().toLowerCase())) return
  
  	let MENU_TYPES = null
  	try {
  		MENU_TYPES = (await loadSetmenu()).MENU_TYPES
  	} catch (err) {
  		console.log('[MENU] setmenu gagal dimuat, pakai menu teks polos:', err.message)
  	}
  	const rawMenu = getMenuData()
  	const sub = (text || '').trim().toLowerCase()
  
  	const menu = {}
  	for (const [cat, cmds] of Object.entries(rawMenu || {})) {
  		menu[cat] = (cmds || []).map(c => {
  			if (typeof c === 'string') return c
  			if (Array.isArray(c)) return c[0]
  			const cmd = c.cmd ?? c.command
  			if (Array.isArray(cmd)) return cmd[0]
  			if (typeof cmd === 'string') return cmd
  			return c
  		})
  	}
  
  	const status = isOwner ? 'owner' : 'user'
  	const typeSub = `${font(`this is the result for the *menu ${sub}*`)}`
  	const prfx = botSet.multiprefix ? `[${botSet.prefix || '.'}]` : 'multi prefix'
  	const info = m.senderInfo
  	const myinfo = info?.username ? `@${info.username}` : info?.jid?.split('@')[0] || info?.lid?.split('@')[0] || m.sender.split('@')[0]
  	const limitInfo = isOwner ? 'unlimited' : (() => { const l = db.getLimitInfo(m.sender); return `${l.limit}/${l.max}` })()
  	
  	const config = getMenuConfig()
  	const wantKey = isJadiBot && config.type === 'poll menu' ? 'extended' : config.type
  	// tipe menu mengikuti .setmenu (bawaan: foto + tombol list). Gagal kirim -> teks polos (lihat di bawah)
  	const entry = (MENU_TYPES && (Object.values(MENU_TYPES).find(v => v.key === wantKey) || MENU_TYPES[1])) || null
  
  	const greeting = m.pushName || 'kak'
  	
  	const formatSection = (category, cmds) => {
  		if (!cmds?.length) return ''
  		const label = (c) => {
  			const rawCmd = c.cmd ?? (Array.isArray(c.command) ? c.command[0] : c.command) ?? c
  			const name = typeof rawCmd === 'string' ? rawCmd : (rawCmd?.cmd ?? '')
  			return `${usedPrefix}${name}`
  		}
  		const lines = cmds.map((c) => `▢ ${label(c)}`)
  		return `${font(`*⌯ menu ${category}*\n${lines.join('\n')}`)}`
  	}
  
  	const botInfo = `${font(`*⌯ bot info:*`)}
  - bot name : *${global.namaBot}*
  - creator : *${global.namaOwner}*
  - prefix : \`${prfx}\`
  - mode : *${botSet.public ? 'public' : 'self'}*
  - library : *${global.library}*
  - version : \`${global.versi}\`
  - runtime : *${global.rtBot}*
  - type : *${global.typeSc}*
  - database : *${global.data}*`
  
  	const userInfo = `${font(`*⌯ users info:*`)}
  - name : *${m.pushName}*
  - number/username : *${myinfo}*
  - status : *${status}*
  - limit : \`${limitInfo}\``
  
  	const CATEGORY_ALIAS = {
  		random: 'main',
  	}
  
  	const allFolders = Object.keys(menu).sort()
  	let teks = ''
  
  	if (sub === 'all') {
  		teks = `${font(`Hello *${greeting}*`)}
  ${font(`Here are all the *commands* in this source!`)}
  
  ${botInfo}
  
  ${userInfo}
  
  `
  		for (const [cat, cmds] of Object.entries(menu)) {
  			teks += formatSection(cat, cmds) + '\n\n'
  		}
  
  	} else if (sub) {
  		const folder = CATEGORY_ALIAS[sub] || sub
  		teks = `Hello ${greeting}\n${typeSub}\n\n${userInfo}\n\n`
  
  		if (menu[folder]?.length) {
  			teks += formatSection(folder, menu[folder]) + '\n'
  		} else if (folder in menu) {
  			teks += `Belum ada command di kategori *${folder}*\n`
  		} else {
  			teks += `*Kategori ${sub}* tidak ditemukan.\n\nKategori tersedia:\n` +
  				allFolders.map(f => `- ${f}`).join('\n') + '\n'
  		}
  
  	} else {
  		const REVERSE_ALIAS = Object.fromEntries(Object.entries(CATEGORY_ALIAS).map(([k, v]) => [v, k]))
  		const list = ['all', ...allFolders.map(f => REVERSE_ALIAS[f] || f)]
  
  		teks = `hi ${greeting} 🪸, i am an automated system (WhatsApp Bot) that can help to do something, search and get data / information only through WhatsApp.
  
  ${botInfo}
  
  ${userInfo}
  
  ${font(`*⌯ cmd category*`)}
  ${list.map(c => `- ${c}`).join('\n')}
  
  ${font(`*use:* ${usedPrefix}menu [category]`)}
  ${font(`*ex:* ${usedPrefix}menu all`)}`
  	}
  
  	// teks polos: dipakai bila tipe menu tidak ada / gagal terkirim (tombol, link preview, dll tidak didukung perangkat)
  	const plain = () => sock.sendMessage(m.chat, { text: teks }, { quoted: m })
  	if (!entry) return plain()
  	try {
  		if (entry.buildSubmenuPoll && sub) return await entry.buildSubmenuPoll({ sock, m, customText: teks })
  		return await entry.build({ sock, m, menu, usedPrefix, status, customText: teks, isMainMenu: !sub })
  	} catch (err) {
  		console.log('[MENU] tipe menu gagal, kirim teks polos:', err.message)
  		return plain()
  	}
  }
  
  handler.command = ['menu']
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
