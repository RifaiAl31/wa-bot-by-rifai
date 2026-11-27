'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxUrl = require('url').pathToFileURL(__filename).href;
const __vxExports = {};
const { GlobalFonts, loadImage } = require("@napi-rs/canvas");
const { join, dirname } = require("node:path");
const { fileURLToPath } = require("node:url");
const { existsSync, mkdirSync, writeFileSync } = require("node:fs");


const FONT_DIR = join(__dirname, '../../data/trash');
const DEFAULT_AVATAR_PATH = join(process.cwd(), 'media/avatar_contact.png');

const FONT_SOURCES = [
	{
		// Font Inter dari CDN jsDelivr (cepat & tidak limit 404)
		url: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf',
		file: 'Inter.ttf',
		family: 'Inter',
	},
	{
		// URL alternatif Noto Color Emoji yang valid
		url: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@main/fonts/NotoColorEmoji.ttf',
		file: 'NotoColorEmoji.ttf',
		family: 'NotoEmoji',
	},
];

let fontsReady = false;

async function ensureCanvasFonts() {
	if (fontsReady) return;
	if (!existsSync(FONT_DIR)) mkdirSync(FONT_DIR, { recursive: true });
	
	try {
		const { default: axios } = await import('axios');
		for (const f of FONT_SOURCES) {
			const p = join(FONT_DIR, f.file);
			if (!existsSync(p)) {
				try {
					const { data } = await axios.get(f.url, { 
						responseType: 'arraybuffer', 
						timeout: 30000,
						headers: { 'User-Agent': 'Mozilla/5.0' }
					});
					writeFileSync(p, Buffer.from(data));
				} catch (e) {
					// Abaikan jika font emoji gagal download, canvas tetap jalan pakai Inter
					if (f.file !== 'NotoColorEmoji.ttf') {
						console.error('[canvas-font-fetch-error]', f.file, e.message);
					}
				}
			}
			if (existsSync(p)) {
				try { GlobalFonts.registerFromPath(p, f.family); } catch (_) {}
			}
		}
	} catch (err) {
		console.error('[ensureCanvasFonts-error]', err);
	}
	fontsReady = true;
}

async function loadAvatarImage(ppUrl) {
	if (ppUrl) {
		try {
			return await loadImage(ppUrl);
		} catch (_) {}
	}
	if (existsSync(DEFAULT_AVATAR_PATH)) {
		try {
			return await loadImage(DEFAULT_AVATAR_PATH);
		} catch (_) {}
	}
	return null;
}

const FONT_FAMILY = 'Inter, NotoEmoji, Arial, sans-serif';
Object.defineProperty(__vxExports, "DEFAULT_AVATAR_PATH", { enumerable: true, get: () => DEFAULT_AVATAR_PATH });
Object.defineProperty(__vxExports, "ensureCanvasFonts", { enumerable: true, get: () => ensureCanvasFonts });
Object.defineProperty(__vxExports, "loadAvatarImage", { enumerable: true, get: () => loadAvatarImage });
Object.defineProperty(__vxExports, "FONT_FAMILY", { enumerable: true, get: () => FONT_FAMILY });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
