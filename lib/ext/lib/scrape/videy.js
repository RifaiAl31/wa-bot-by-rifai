'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
const axios = __vxDef(require("axios"));
const FormData = __vxDef(require("form-data"));
const fs = __vxDef(require("fs"));
const path = __vxDef(require("path"));
const crypto = __vxDef(require("crypto"));

async function uploadVidey(file) {
  if (!file) throw new Error('input required')
  if (!fs.existsSync(file)) throw new Error('file not found')

  const form = new FormData()
  form.append('file', fs.createReadStream(file), {
    filename: path.basename(file),
    contentType: 'video/mp4'
  })

  const res = await axios.post(
    'https://videy.co/api/upload?visitorId=' + crypto.randomUUID(),
    form,
    {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'Mozilla/5.0',
        origin: 'https://videy.co',
        referer: 'https://videy.co/',
        accept: 'application/json'
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    }
  )

  return res.data
}
Object.defineProperty(__vxExports, "uploadVidey", { enumerable: true, get: () => uploadVidey });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
