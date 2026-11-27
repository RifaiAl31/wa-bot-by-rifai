// Port dari 'plugin baru' (gitclone.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/vanxone.js.
const S = require("../../lib/adapter/core.js")
/**
 * WhatsApp Bot — WhatsApp Bot
 * 
 * Library      : @whiskeysockets/baileys
 * Type         : Plugins | ESM Modules
 * Creator      : WhatsApp Bot
 * Recode       : WhatsApp Bot
 * 
 * Official Channels:
 * • 
 * 
 * Documentation:
 * [ID]  Baca README.md untuk melihat panduan.
 * [EN]  Read README.md untuk melihat panduan.
 * 
 * Distribution Notice:
 * Dilarang menyebarkan source code ini secara gratis
 * 
 * Pelanggaran terhadap ketentuan ini dapat menyebabkan
 * penghentian update dan dukungan terhadap source code.
 * 
 * Copyright © WhatsApp Bot 2026
 * All Rights Reserved.
 */

const regex = /(?:https?|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/([^\/\s#?]+)/i;

const handler = async (m, { sock, text, prefix, command, reply }) => {
	const pfx = prefix || '.';
	const input = text || (m.quoted && (m.quoted.text || m.quoted.caption));

	if (!input) {
		return reply(
			`📦 *GITHUB REPOSITORY CLONE*\n\n` +
			`Unduh repository GitHub publik dalam format file ZIP.\n\n` +
			`*Contoh Penggunaan:*\n` +
			`• \`${pfx + command} https://github.com/user/repo\`\n` +
			`• Balas pesan tautan GitHub dengan \`${pfx + command}\``
		);
	}

	const match = input.trim().match(regex);
	if (!match) {
		return reply('❌ URL repository GitHub tidak valid. Pastikan format tautan benar.');
	}

	const [, user, rawRepo] = match;
	const repo = rawRepo.replace(/\.git$/, '');

	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);

	const zipUrl = `https://api.github.com/repos/${user}/${repo}/zipball`;

	try {
		const response = await fetch(zipUrl, {
			headers: {
				'User-Agent': 'WhatsApp Bot/WhatsApp-Bot',
				'Accept': 'application/vnd.github.v3+json'
			},
			signal: AbortSignal.timeout(60000)
		});

		if (!response.ok) {
			if (response.status === 404) {
				throw new Error('Repository tidak ditemukan atau bersifat privat.');
			}
			throw new Error(`GitHub API error (${response.status})`);
		}

		const buffer = Buffer.from(await response.arrayBuffer());
		const fileName = `${repo}.zip`;

		const caption = [
			'📦 *GITHUB REPOSITORY DOWNLOADED*',
			'',
			`• 👤 *Author:* ${user}`,
			`• 📁 *Repo:* ${repo}`,
			`• 💾 *Ukuran File:* ${(buffer.length / (1024 * 1024)).toFixed(2)} MB`,
			'',
			`© ${global.namaBot}`
		].join('\n');

		await sock.sendMessage(
			m.chat,
			{
				document: buffer,
				mimetype: 'application/zip',
				fileName,
				caption
			},
			{ quoted: m }
		);

		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);

	} catch (e) {
		console.error('[GITCLONE ERROR]:', e);
		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
		return reply(`❌ Gagal mengambil repository GitHub: ${e.message || e}`);
	}
};

handler.help = ['gitclone <link github>'];
handler.tags = ['downloader'];
handler.command = ['gitclone', 'gitdl', 'ghclone'];
handler.limit = true;

module.exports = S.wrap(handler, {"category": "downloader"})
