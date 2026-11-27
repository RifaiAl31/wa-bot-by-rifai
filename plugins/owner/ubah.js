// Port dari 'plugin baru' (ubah_foto.js) — logika & teks output sama dengan plugin asal; dijalankan lewat lib/vanxone.js.
const S = require("../../lib/adapter/core.js")
const axios = require('axios')
const crypto = require('crypto')
const { fileTypeFromBuffer } = S
const fs = require('fs')
const path = require('path')

const branch = "main";
let repos = ["cdn1", "cdn2", "cdn3", "cdn4", "cdn5"];

async function ensureRepoExists(repo) {
	try {
		await axios.get(`https://api.github.com/repos/${global.userGh}/${repo}`, {
			headers: {
				Authorization: `Bearer ${global.ghTokens}`,
				"User-Agent": "Mozilla/5.0"
			}
		});
	} catch (e) {
		if (e.response?.status === 404) {
			await axios.post(
				"https://api.github.com/user/repos",
				{
					name: repo,
					private: false
				},
				{
					headers: {
						Authorization: `Bearer ${global.ghTokens}`,
						"User-Agent": "Mozilla/5.0"
					}
				}
			);

			if (!repos.includes(repo)) repos.push(repo);
		} else {
			throw e;
		}
	}
}

function generateRepoName() {
	return `cdn-${crypto.randomBytes(3).toString("hex")}`;
}

async function uploadFile(buffer, originalName = "file") {
	const detected = await fileTypeFromBuffer(buffer);
	const ext =
		detected?.ext ||
		originalName.split(".").pop() ||
		"bin";

	const code = crypto.randomBytes(3).toString("hex");
	const fileName = `${code}-${Date.now()}.${ext}`;
	const filePathGitHub = `uploads/${fileName}`;
	const base64Content = Buffer.from(buffer).toString("base64");

	let targetRepo =
		repos[Math.floor(Math.random() * repos.length)];

	try {
		await ensureRepoExists(targetRepo);
	} catch {
		targetRepo = generateRepoName();
		await ensureRepoExists(targetRepo);
	}

	await axios.put(
		`https://api.github.com/repos/${global.userGh}/${targetRepo}/contents/${filePathGitHub}`,
		{
			message: `Upload file ${fileName}`,
			content: base64Content,
			branch
		},
		{
			headers: {
				Authorization: `Bearer ${global.ghTokens}`,
				"User-Agent": "Mozilla/5.0",
				Accept: "application/vnd.github+json"
			},
			maxContentLength: Infinity,
			maxBodyLength: Infinity,
			timeout: 30000
		}
	);

	return `https://raw.githubusercontent.com/${global.userGh}/${targetRepo}/${branch}/${filePathGitHub}`;
}

function resolveImageSource(m) {
	if (m.quoted?.mtype === 'imageMessage' || m.quoted?.message?.imageMessage) {
		return m.quoted;
	}

	if (m.mtype === 'imageMessage' || m.message?.imageMessage) {
		return m;
	}

	return null;
}

const TH = require("../../lib/thumb.js")

function resolveVideoSource(m) {
	const q = m.quoted
	if (q && (q.mtype === 'videoMessage' || q.message?.videoMessage)) return q
	if (m.mtype === 'videoMessage' || m.message?.videoMessage) return m
	return null
}

// unggah ke GitHub; gagal (token mati / jaringan) -> simpan lokal di folder media supaya tetap berhasil
async function store(buf, name, localName) {
	if (global.ghTokens && global.userGh) {
		try {
			return { value: await uploadFile(buf, name), where: 'GitHub' }
		} catch (e) {
			console.log('[UBAH] unggah GitHub gagal, simpan lokal:', e.message)
		}
	}
	return { value: TH.saveLocal(buf, localName), where: 'lokal (folder media)' }
}

const handler = async (m, { usedPrefix, command }) => {
	const rawText = (m.text || m.quoted?.text || '').trim()
	const args = rawText.split(/\s+/).filter(Boolean).map((a) => a.toLowerCase())
	const type = args.find((a) => ['thumb', 'reply', 'gif'].includes(a))

	const help = `*Contoh:*\n- Kirim foto + caption: ${usedPrefix + command} thumb\n- Reply foto lalu ketik: ${usedPrefix + command} reply\n- Reply video/gif lalu ketik: ${usedPrefix + command} gif\n- Hidupkan/matikan GIF menu: ${usedPrefix + command} gif on / gif off\n\n*Pilihan:* thumb / reply / gif\nSemua juga bisa diatur manual di settings.js (global.thumbnail, global.thumbnailGif, global.thumbnailvid).`

	if (!type) return m.reply(help)

	// gif on / off
	if (type === 'gif' && ['on', 'off'].includes(args[args.indexOf('gif') + 1])) {
		const on = args[args.indexOf('gif') + 1] === 'on'
		TH.setSetting('thumbnailGif', on)
		return m.reply(`GIF thumbnail menu sekarang *${on ? 'AKTIF' : 'MATI'}* (global.thumbnailGif di settings.js).`)
	}

	try {
		if (type === 'gif') {
			const vid = resolveVideoSource(m)
			if (!vid) return m.reply(help)
			const buf = await vid.download()
			if (!buf) return m.reply('Gagal mendownload video')
			const r = await store(buf, `gif_${Date.now()}.mp4`, 'thumbnail.mp4')
			TH.setSetting('thumbnailvid', r.value)
			TH.setSetting('thumbnailGif', true)
			return m.reply(`GIF thumbnail menu berhasil diganti dan diaktifkan!\n\nTersimpan: ${r.where}\n${r.value}`)
		}

		const target = resolveImageSource(m)
		if (!target) return m.reply(help)
		const buf = await target.download()
		if (!buf) return m.reply('Gagal mendownload foto')
		const field = type === 'thumb' ? 'thumbnail' : 'fotoreply'
		const r = await store(buf, `upload_${Date.now()}.jpg`, type === 'thumb' ? 'thumbnail-custom.jpg' : 'fotoreply-custom.jpg')
		TH.setSetting(field, r.value)
		delete global.fotoreplyThumb
		await m.reply(`${type === 'thumb' ? 'Thumbnail menu' : 'Thumbnail reply'} berhasil diganti!\n\nTersimpan: ${r.where}\n${r.value}`)
	} catch (e) {
		console.error(e)
		await m.reply(`Error: ${e.message}`)
	}
};

handler.command = ["change", "ubah"];
handler.owner = true;
handler.noJadiBot = true
handler.mainOwner = true

module.exports = S.wrap(handler, {"category": "owner"})
