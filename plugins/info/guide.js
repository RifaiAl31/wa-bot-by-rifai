// main/guide — satu file: metadata + kode fitur (gabungan dari engine5/plugins/main/guide.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "guide",
  "command": [
    "tutorial",
    "guide",
    "panduan"
  ],
  "category": "info",
  "desc": "Tutorial penggunaan bot",
  "usage": ".guide"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/guide", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/guide.js'
  const __vxExports = {};
  const handler = async (m, { sock, reply, prefix, usedPrefix, command }) => {
  	await sock.sendMessage(m.chat, { react: { text: '⏱', key: m.key } }).catch(() => null);
  
  	const p = prefix || usedPrefix || '.';
  	const botName = global.namaBot;
  	const ownerName = global.namaOwner;
  	const userName = m.pushName || 'User';
  
  	const ruless = `📚 *TUTORIAL PENGGUNAAN BOT*
  
  1. *Penggunaan Prefix:*
  Semua perintah diawali dengan tanda titik (*.*) atau prefix yang berlaku.
  _Contoh:_ \`${p}menu all\`
  
  2. *Fitur Pencarian (Search):*
  Gunakan kata kunci setelah perintah.
  _Contoh:_ \`${p}play judul lagu\` atau \`${p}lyric query\`
  
  3. *Fitur Pengunduh (Downloader):*
  Sertakan tautan/URL media yang valid setelah perintah.
  _Contoh:_ \`${p}pindl https://pin.it/xxxxxx\`
  
  4. *Fitur Konversi Media (Convert/Maker):*
  Kirim atau reply media (foto, audio, video) lalu ketik perintahnya.
  _Contoh:_ Balas foto lalu ketik \`${p}sticker\` atau balas VN ketik \`${p}tomp3\`
  
  5. *Bantuan & Donasi:*
  Ketik \`${p}owner\` untuk menghubungi pemilik bot atau \`${p}sc\` untuk informasi source code.
  
  _Note: Jika mengalami kendala/error, hubungi owner bot._`;
  
  	const sections = [
  		{
  			title: "NAVIGASI UTAMA",
  			highlight_label: "Pilihan",
  			rows: [
  				{ 
  					header: "📜 DAFTAR MENU", 
  					title: `Tampilkan dashboard fitur ${botName}`, 
  					description: ``, 
  					id: `${p}menu` 
  				},
  				{ 
  					header: "👑 OWNER BOT", 
  					title: `Hubungi pemilik ${ownerName}`, 
  					description: ``, 
  					id: `${p}owner` 
  				}
  			]
  		}
  	];
  
  	const imageUrl = "https://raw.githubusercontent.com/sahrilcode/cdn3/main/uploads/fde534-1791630398577.jpg";
  
  	await sock.sendButtons(m.chat, {
  		image: { url: imageUrl },
  		text: ruless,
  		footer: `© ${botName}`,
  		messageParams: {
  			limited_time_offer: {
  				text: "Panduan Pengguna: " + userName,
  				url: global.wagc,
  				copy_code: "WhatsApp Bot-Tutorial",
  				expiration_time: Date.now() * 99999
  			},
  			bottom_sheet: {
  				in_thread_buttons_limit: 1,
  				list_title: "Tutorial",
  				button_title: "Pilih Aksi"
  			}
  		},
  		buttons: [
  			{
  				title: 'Navigasi Cepat',
  				sections: sections,
  				icon: 'NONE'
  			},
  			{
  				displayText: 'Group Bot',
  				url: global.wagc
  			}
  		]
  	}, { quoted: m });
  
  	await sock.sendMessage(m.chat, { react: { text: '🕊️', key: m.key } }).catch(() => null);
  };
  
  handler.help = ['tutorial', 'guide', 'panduan'];
  handler.tags = ['main'];
  handler.command = ['tutorial', 'guide', 'panduan'];
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
