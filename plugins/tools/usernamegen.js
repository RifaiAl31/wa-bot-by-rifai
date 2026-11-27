// tools/usernamegen — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/usernamegen.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "usernamegen",
  "command": [
    "usernamegen",
    "genuser",
    "username",
    "genusername"
  ],
  "category": "tools",
  "desc": "Generate pilihan username keren berdasarkan nama, mode, & tema",
  "usage": ".usernamegen <nama> | [theme] | [mode]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/usernamegen", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/usernamegen.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "usernamegen",
    alias: ["genuser", "username", "genusername"],
    category: "tools",
    description: "Generate pilihan username keren berdasarkan nama, mode, & tema",
    usage: ".usernamegen <nama> | [theme] | [mode]",
    cooldown: 5,
    isEnabled: true,
  }
  
  async function handler(m, extra) {
    const fullText = (m.text || m.body || "").trim()
    
    // Ambil teks setelah nama command
    const argsText = fullText.replace(/^[\/.!#]?(usernamegen|genuser|username|genusername)\s*/i, "").trim()
  
    if (!argsText) {
      let guide = `✨ *USERNAME GENERATOR*\n\n`
      guide += `📌 *Cara Pakai:*\n`
      guide += `• \`.genuser <nama> | <theme> | <mode>\`\n\n`
      guide += `🎮 *Pilihan Theme:* \n`
      guide += `\`action\`, \`adventure\`, \`fantasy\`, \`historical\`, \`horror\`, \`mythology\`, \`nature\`, \`sci-fi\`, \`strategy\`\n\n`
      guide += `⚙️ *Pilihan Mode:*\n`
      guide += `\`instans\` (Default), \`ai\`\n\n`
      guide += `💡 *Contoh:* \`.genuser geto | mythology | instans\``
      return m.reply(guide)
    }
  
    // Split berdasarkan pipa (|)
    const parts = argsText.split("|").map(v => v.trim()).filter(Boolean)
  
    const name = parts[0] || "geto"
    const theme = (parts[1] || "action").toLowerCase()
    const mode = (parts[2] || "instans").toLowerCase()
  
    try {
      const targetUrl = `https://api.nexray.eu.cc/tools/usernamegen`
  
      const res = await axios.get(targetUrl, {
        params: {
          name: name,
          mode: mode,
          theme: theme
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        timeout: 10000
      })
  
      const data = res?.data
  
      if (!data) {
        return m.reply("❌ *Gagal mendapatkan respons dari API NexRay!*")
      }
  
      // Ekstrak Array Username
      let usernames = []
      if (Array.isArray(data?.result?.result)) {
        usernames = data.result.result
      } else if (Array.isArray(data?.result)) {
        usernames = data.result
      } else if (Array.isArray(data?.usernames)) {
        usernames = data.usernames
      }
  
      if (usernames.length === 0) {
        return m.reply("❌ *Gagal memproses daftar username dari server!*")
      }
  
      let resultText = `✨ *USERNAME GENERATOR RESULT (100 Teratas)*\n\n`
      resultText += `👤 *Nama Base:* ${name}\n`
      resultText += `🎨 *Theme:* ${theme}\n`
      resultText += `⚙️ *Mode:* ${mode}\n`
      resultText += `───────────────────\n\n`
  
      // Tampilkan 100 username teratas
      const limitList = usernames.slice(0, 100)
      limitList.forEach((username, idx) => {
        resultText += `${idx + 1}. \`${username}\`\n`
      })
  
      if (usernames.length > 100) {
        resultText += `\n_...dan ${usernames.length - 100} pilihan username lainnya!_`
      }
  
      resultText += `\n\n💡 *Tips:* Tap/salin username yang kamu suka!`
  
      return m.reply(resultText)
  
    } catch (error) {
      console.error("[UsernameGen Error]:", error?.message)
      const errDetail = error?.response?.data?.message || error?.message || "Server Error"
      return m.reply(`❌ *Terjadi Kesalahan:* ${errDetail}`)
    }
  }
  
  async function before(m) {
    return true
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "before", { enumerable: true, get: () => before });
  return __vxExports
})
