// ai/kimi-vision — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/kimi-vision.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "kimi-vision",
  "command": [
    "kimi-vision",
    "kimivision",
    "kimi-v"
  ],
  "category": "ai",
  "desc": "Analisis gambar memakai Kimi Vision",
  "usage": ".kimi-vision <pertanyaan> (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/kimi-vision", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/kimi-vision.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const FormData = __vxDef(require("form-data"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const pluginConfig = {
    name: "kimi-vision",
    alias: ["kimivision", "kimi-v"],
    category: "ai",
    description: "Analisis gambar memakai Kimi Vision",
    usage: ".kimi-vision <pertanyaan> (reply gambar)",
    example: ".kimi-vision jelaskan gambar ini",
    isPremium: false,
    cooldown: 15,
    energi: 2,
    isEnabled: true,
  };
  
  async function uploadToAlice(buffer, mimetype = "image/jpeg") {
    const form = new FormData();
    form.append("cdnFile", buffer, {
      filename: `kimi-${Date.now()}.jpg`,
      contentType: mimetype,
    });
    const res = await axios.post("https://aliceecdn.vercel.app/upload", form, {
      headers: form.getHeaders(),
      timeout: 60000,
    });
    if (!res.data?.url) throw new Error("Upload gambar gagal");
    return res.data.url;
  }
  
  async function handler(m) {
    const key = config.aquaApi?.freeRestApiKey || "";
    if (!key) return m.reply("❌ API key Aqua belum diisi di config.js (aquaApi.freeRestApiKey).");
  
    const quoted = m.quoted;
    const isImage = /image\//i.test(String(quoted?.mimetype || m.mimetype || ""));
    let imageUrl = "";
    let prompt = m.args?.join(" ").trim() || "jelaskan gambar ini";
  
    try {
      if (isImage) {
        const buffer = await quoted.download();
        imageUrl = await uploadToAlice(buffer, quoted.mimetype);
      } else {
        const match = prompt.match(/https?:\/\/\S+/i);
        if (match) {
          imageUrl = match[0];
          prompt = prompt.replace(match[0], "").trim() || "jelaskan gambar ini";
        }
      }
  
      if (!imageUrl) {
        return m.reply(`🖼️ Reply/kirim gambar dengan caption *${m.prefix}${m.command} pertanyaan* atau berikan URL gambar.`);
      }
  
      await m.react("🕕");
      const { data } = await axios.get("https://free-restapi.biz.id/api/kimi-vision", {
        params: { url: imageUrl, prompt, apikey: key },
        timeout: 60000,
      });
      const result = data?.result || data?.data?.result;
      if (!result) throw new Error("API Kimi Vision gagal");
  
      await m.react("✅");
      return m.reply(String(result).slice(0, 12000));
    } catch (e) {
      console.error("[AQUA-KIMI-VISION]", e?.message || e);
      await m.react("❌").catch(() => {});
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
