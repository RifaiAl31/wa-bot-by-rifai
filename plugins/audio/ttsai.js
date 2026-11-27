// tts/ttsai — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tts/ttsai.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "ttsvoice",
  "command": [
    "ttsvoice"
  ],
  "category": "audio",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tts").split('\\').join('/')
module.exports = __vx.plugin("tts/ttsai", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ttsai.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  const { "exec": execCallback } = require("child_process");
  const { writeFileSync, unlinkSync, readFileSync } = require("fs");
  const { promisify } = require("util");
  
  const exec = promisify(execCallback)
  
  const AvailableVoices = {
    nahida: 'nahida',
    nami: 'nami',
    ana: 'ana',
    optimus: 'optimus_prime',
    goku: 'goku',
    elon: 'elon_musk',
    mickey: 'mickey_mouse',
    kendrick: 'kendrick_lamar',
    eminem: 'eminem'
  }
  
  const pluginConfig = {
    name: "ttsvoice",
    alias: [],
    category: "tts",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text, prefix, command }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    let [model, ...rest] = text.split(" ")
    let message = rest.join(" ")
  
    if (!model || !message)
      return m.reply(
  `🗣️ *Cara pakai:*
  ${usedPrefix + command} <model> <teks>
  
  📌 *Daftar suara:*
  ${Object.keys(AvailableVoices).join(", ")}
  
  Contoh:
  ${usedPrefix + command} nahida halo hilman`
      )
  
    model = model.toLowerCase()
  
    if (!AvailableVoices[model])
      return m.reply(
  `❌ Model tidak ditemukan!
  
  📌 *List model:* 
  ${Object.keys(AvailableVoices).join(", ")}`)
    
    await m.reply(`🎤 Membuat suara *${model}* ...`)
  
    try {
      let api = `https://api-faa.my.id/faa/tts-legkap?text=${encodeURIComponent(message)}`
      let res = await fetch(api)
      let json = await res.json()
  
      if (!json?.result) throw 'Gagal ambil list suara.'
  
      // FIX: trim & case-insensitive
      let selected = json.result.find(v => 
        String(v.model).trim().toLowerCase() === AvailableVoices[model].toLowerCase()
        && v.url
      )
  
      if (!selected)
        return m.reply(`❌ Suara *${model}* tidak tersedia.`)
  
      let audioRes = await fetch(selected.url)
      let wav = Buffer.from(await audioRes.arrayBuffer())
  
      let input = `./tmp_${model}.wav`
      let output = `./tmp_${model}.opus`
  
      writeFileSync(input, wav)
  
      await exec(`ffmpeg -y -i ${input} -c:a libopus -b:a 64k ${output}`)
  
      let opus = readFileSync(output)
  
      await conn.sendMessage(m.chat, {
        audio: opus,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true,
        caption: `🎤 *${selected.voice_name || model}*`
      }, { quoted: m })
  
      unlinkSync(input)
      unlinkSync(output)
  
    } catch (e) {
      console.error(e)
      m.reply('❌ Error saat membuat suara TTS.')
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
