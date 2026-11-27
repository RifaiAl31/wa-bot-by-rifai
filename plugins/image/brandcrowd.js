// ephoto/brandcrowd — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ephoto/brandcrowd.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "brandcrowd",
  "command": [
    "brandcrowd",
    "bcrowd",
    "logomaker"
  ],
  "category": "image",
  "desc": "Fitur brandcrowd <nama brand>",
  "usage": ".brandcrowd <nama brand>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ephoto").split('\\').join('/')
module.exports = __vx.plugin("ephoto/brandcrowd", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/brandcrowd.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const brandcrowd = __vxDef(require("../../lib/ext/lib/scrape/brandcrowd.js"));
  
  const handler = async (m, { sock, text, prefix, command, reply }) => {
  	const pfx = prefix || '.';
  	const botName = global.namaBot;
  	const input = text || (m.quoted && (m.quoted.text || m.quoted.caption));
  
  	if (!input) {
  		return reply(
  			'🎨 *BRANDCROWD LOGO MAKER*\n\n' +
  			'Cari inspirasi dan generate logo otomatis berdasarkan nama brand/usaha kamu.\n\n' +
  			'*Format Penggunaan:*\n' +
  			`• \`${pfx + command} <nama brand / teks>\`\n\n` +
  			'*Contoh:*\n' +
  			`• \`${pfx + command} WhatsApp Bot Cafe\`\n` +
  			`• \`${pfx + command} Zyro Cyber\``
  		);
  	}
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);
  
  	try {
  		const logos = await brandcrowd.searchLogos(input.trim());
  
  		if (!logos || !logos.length) {
  			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
  			return reply(`❌ Tidak ditemukan template logo untuk nama: *${input.trim()}*`);
  		}
  
  		const randomLogo = logos[Math.floor(Math.random() * logos.length)];
  
  		const caption = [
  			'🎨 *BRANDCROWD LOGO DESIGN*',
  			'',
  			`• 🏷️ *Brand:* ${input.trim()}`,
  			`• 📦 *Total Pilihan:* ${logos.length} Desain`,
  			'',
  			`Ketik ulang perintah \`${pfx + command}${input.trim()}\` untuk mencari variasi desain lainnya.`,
  			'',
  			`© ${botName}`
  		].join('\n');
  
  		await sock.sendMessage(
  			m.chat,
  			{
  				image: { url: randomLogo },
  				caption
  			},
  			{ quoted: m }
  		);
  
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
  
  	} catch (e) {
  		console.error('[BRANDCROWD ERROR]:', e);
  		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
  		return reply(`❌ Gagal mengambil template logo: ${e.message || e}`);
  	}
  };
  
  handler.help = ['brandcrowd <nama brand>'];
  handler.tags = ['maker', 'internet'];
  handler.command = ['brandcrowd', 'bcrowd', 'logomaker'];
  handler.limit = true
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
