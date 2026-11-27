// other/ichigobanana — satu file: metadata + kode fitur (gabungan dari engine8/plugins/other/ichigobanana.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "image-tools",
  "command": [
    "image-tools"
  ],
  "category": "other",
  "desc": "Image generation and editing tools",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/other").split('\\').join('/')
module.exports = __vx.plugin("other/ichigobanana", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ichigobanana.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e8.js"));
  const { ImageUploadService } = require("node-upload-images");
  
  const OBS_KEY = config.APIkey.obscura;
  
  async function uploadBuf(buf) {
    const service = new ImageUploadService("pixhost.to");
    const { directLink } = await service.uploadFromBinary(buf, "img.jpg");
    return directLink;
  }
  
  async function live3d(
    imageBuffer,
    prompt = "Make this person the skin is very black, but skin tone still natural",
  ) {
    const imgUrl = await uploadBuf(imageBuffer);
    const r = await axios.get(
      `https://api.obscuraworks.org/api/tools/edit-image?url=${encodeURIComponent(imgUrl)}&prompt=${encodeURIComponent(prompt)}`,
      {
        headers: {
          Accept: "application/json, image/*, audio/*, video/*",
          Authorization: `Bearer ${OBS_KEY}`,
        },
        responseType: "arraybuffer",
        timeout: 120000,
      },
    );
    const image = Buffer.from(r.data);
    return { image };
  }
  
  async function fluxImage(message, ratio = "1:1") {
    const r = await axios.post(
      "https://api.yuulabs.web.id/api/ai/flux-img",
      {
        message,
        ratio,
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 120000,
      },
    );
  
    const data = r.data;
    if (!data?.status || !data?.result?.url) {
      throw new Error(data?.message || data?.error || "Gagal membuat gambar");
    }
  
    return data.result;
  }
  
  const pluginConfig = {
    name: "image-tools",
    description: "Image generation and editing tools",
  };
  
  const handler = async (message, { live3d, fluxImage }) => {
    return { live3d, fluxImage };
  };
  
  
  Object.defineProperty(__vxExports, "live3d", { enumerable: true, get: () => live3d });
  Object.defineProperty(__vxExports, "fluxImage", { enumerable: true, get: () => fluxImage });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
