// ai/ai-petimg — satu file: metadata + kode fitur (gabungan dari engine2/plugins/ai/ai-petimg.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "petimg",
    "petvid"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur petimg (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/ai-petimg", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ai-petimg.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /*
  • Nama Fitur : Text2Pet AI (Image & Video Generator)
  • Type       : Plugin ESM
  • Author     : WhatsApp Bot
  */
  
  const axios = __vxDef(require("axios"));
  
  class AgungDevXText2Pet {
    constructor() {
      this.baseUrl = "https://text2pet.zdex.top"
      this.token = this.decryptToken()
      this.headers = {
        "user-agent": "AgungDevX FreeScrape/1.0.0",
        "accept-encoding": "gzip",
        "content-type": "application/json",
        authorization: this.token
      }
    }
  
    decryptToken() {
      const cipher = "hbMcgZLlzvghRlLbPcTbCpfcQKM0PcU0zhPcTlOFMxBZ1oLmruzlVp9remPgi0QWP0QW"
      const shift = 3
  
      return [...cipher].map(c => {
        if (/[a-z]/.test(c)) {
          return String.fromCharCode((c.charCodeAt(0) - 97 - shift + 26) % 26 + 97)
        } else if (/[A-Z]/.test(c)) {
          return String.fromCharCode((c.charCodeAt(0) - 65 - shift + 26) % 26 + 65)
        }
        return c
      }).join("")
    }
  
    generateDeviceId() {
      const chars = "0123456789abcdef"
      let id = ""
      for (let i = 0; i < 16; i++) {
        id += chars[Math.floor(Math.random() * chars.length)]
      }
      return id
    }
  
    async generateImage(prompt) {
      if (!prompt || !prompt.trim()) {
        return { success: false, error: "Prompt is required" }
      }
  
      try {
        const response = await axios.post(
          `${this.baseUrl}/images`,
          { prompt },
          { headers: this.headers }
        )
  
        if (response.data.code !== 0 || !response.data.data) {
          return { success: false, error: "Image generation failed" }
        }
  
        return {
          success: true,
          url: response.data.data,
          prompt: response.data.prompt || prompt
        }
      } catch (error) {
        return { success: false, error: error.message }
      }
    }
  
    async generateVideo(prompt) {
      if (!prompt || !prompt.trim()) {
        return { success: false, error: "Prompt is required" }
      }
  
      try {
        const payload = {
          deviceID: this.generateDeviceId(),
          isPremium: 1,
          prompt,
          used: [],
          versionCode: 6
        }
  
        const response = await axios.post(
          `${this.baseUrl}/videos`,
          payload,
          { headers: this.headers }
        )
  
        if (response.data.code !== 0 || !response.data.key) {
          return { success: false, error: "Failed to get video key" }
        }
  
        return await this.checkVideoProgress(response.data.key)
      } catch (error) {
        return { success: false, error: error.message }
      }
    }
  
    async checkVideoProgress(key) {
      const payload = { keys: [key] }
  
      for (let attempt = 0; attempt < 100; attempt++) {
        try {
          const response = await axios.post(
            `${this.baseUrl}/videos/batch`,
            payload,
            {
              headers: this.headers,
              timeout: 15000
            }
          )
  
          if (response.data.code === 0 && response.data.datas?.[0]) {
            const data = response.data.datas[0]
  
            if (data.url && data.url.trim()) {
              return {
                success: true,
                url: data.url.trim(),
                safe: data.safe === "true",
                key: data.key,
                videoId: data.video_id
              }
            }
          }
  
          await new Promise(resolve => setTimeout(resolve, 2000))
        } catch (error) {
          if (attempt < 99) {
            await new Promise(resolve => setTimeout(resolve, 2000))
            continue
          }
          return { success: false, error: error.message }
        }
      }
  
      return { success: false, error: "Video generation timeout" }
    }
  }
  
  const generator = new AgungDevXText2Pet()
  
  let handler = async (m, { text, command, conn }) => {
    if (!text) {
      return m.reply(
        `❗ Contoh penggunaan:\n` +
        `.petimg a cute cat anime\n` +
        `.petvid cinematic sunset beach`
      )
    }
  
    try {
      if (command === "petimg") {
        m.reply("✨ Generating image...")
  
        const res = await generator.generateImage(text)
        if (!res.success) return m.reply("❌ " + res.error)
  
        return conn.sendMessage(
          m.chat,
          {
            image: { url: res.url },
            caption: `🖼 *TEXT TO IMAGE*\n\n📝 Prompt:\n${res.prompt}`
          },
          { quoted: m }
        )
      }
  
      if (command === "petvid") {
        m.reply("✨ Generating video... (bisa agak lama)")
  
        const res = await generator.generateVideo(text)
        if (!res.success) return m.reply("❌ " + res.error)
  
        return conn.sendMessage(
          m.chat,
          {
            video: { url: res.url },
            caption: `🎥 *TEXT TO VIDEO*\n\n📝 Prompt:\n${text}`
          },
          { quoted: m }
        )
      }
    } catch (e) {
      console.error(e)
      return m.reply("❌ Terjadi error.")
    }
  }
  
  handler.help = ["petimg", "petvid"]
  handler.tags = ["ai"]
  handler.command = ["petimg", "petvid"]
  handler.limit = true
  handler.register = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
