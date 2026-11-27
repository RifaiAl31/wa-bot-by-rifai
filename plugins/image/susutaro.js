// canvas/susutaro — satu file: metadata + kode fitur (gabungan dari engine7/plugins/canvas/susutaro.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "susutaro",
  "command": [
    "susutaro",
    "taro"
  ],
  "category": "image",
  "desc": "Memberikan efek Susu Taro pada gambar",
  "usage": ".susutaro <reply image>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/susutaro", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/susutaro.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const FormData = __vxDef(require("form-data"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  
  const pluginConfig = {
    name: "susutaro",
    alias: ["taro"],
    category: "canvas",
    description: "Memberikan efek Susu Taro pada gambar",
    usage: ".susutaro <reply image>",
    example: ".susutaro",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const q = m.quoted ? m.quoted : m;
    const isImage = q?.isImage
  
    if (!isImage) {
      return m.reply(`*SUSU TARO*\n> Reply Gambarnya sambil ketik \`${m.prefix}susutaro\``);
    }
  
    m.react("🕕");
  
    try {
      const buffer = await q.download();
  
      const fd = new FormData();
      fd.append("file", buffer, {
        filename: "img.jpg",
        contentType: "image/jpeg",
      });
  
      const { data: cdn } = await axios.post(
        "https://cloud.yardansh.com/upload",
        fd,
        { headers: fd.getHeaders() },
      );
  
      if (!cdn?.url) throw new Error("Upload CDN gagal");
  
      const api = `https://api.cuki.biz.id/api/canvas/susu-taro?apikey=${(global.apiKeys && global.apiKeys.cuki) || ''}&image=${encodeURIComponent(cdn.url)}`;
  
      await sock.sendMedia(m.chat, api, null, m, {
        type: "image",
      });
  
      m.react("✅");
    } catch (error) {
      console.error(error);
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
