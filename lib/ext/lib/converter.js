'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxUrl = require('url').pathToFileURL(__filename).href;
const __vxExports = {};
const { promises } = require("fs");
const { join } = require("path");
const { spawn } = require("child_process");

async function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
	try {
		const tmp = join(global.__dirname(__vxUrl), '../tmp', Date.now() + '.' + ext);
		const out = tmp + '.' + ext2;

		await promises.writeFile(tmp, buffer);

		await new Promise((resolve, reject) => {
			spawn('ffmpeg', ['-y', '-i', tmp, ...args, out])
				.on('error', reject)
				.on('close', (code) => {
					if (code !== 0) reject(new Error(`FFmpeg exited with code ${code}`));
					else resolve();
				});
		});

		const data = await promises.readFile(out);

		return {
			data,
			filename: out,
			delete() {
				return promises.unlink(out);
			},
		};
	} finally {
		try {
			await promises.unlink(tmp);
		} catch {}
	}
}

/**
 * Convert Audio to Playable WhatsApp Audio
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 * @returns {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toPTT(buffer, ext) {
	return ffmpeg(buffer, ['-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on'], ext, 'ogg');
}

/**
 * Convert Audio to Playable WhatsApp PTT
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 * @returns {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toAudio(buffer, ext) {
	return ffmpeg(buffer, ['-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on', '-compression_level', '10'], ext, 'opus');
}

/**
 * Convert Audio to Playable WhatsApp Video
 * @param {Buffer} buffer Video Buffer
 * @param {String} ext File Extension
 * @returns {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toVideo(buffer, ext) {
	return ffmpeg(buffer, ['-c:v', 'libx264', '-c:a', 'aac', '-ab', '128k', '-ar', '44100', '-crf', '32', '-preset', 'slow'], ext, 'mp4');
}



Object.defineProperty(__vxExports, "toAudio", { enumerable: true, get: () => toAudio });
Object.defineProperty(__vxExports, "toPTT", { enumerable: true, get: () => toPTT });
Object.defineProperty(__vxExports, "toVideo", { enumerable: true, get: () => toVideo });
Object.defineProperty(__vxExports, "ffmpeg", { enumerable: true, get: () => ffmpeg });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
