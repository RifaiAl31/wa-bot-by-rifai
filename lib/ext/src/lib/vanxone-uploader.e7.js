'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
const axios = __vxDef(require("axios"));
const FormData = __vxDef(require("form-data"));

const termaiKey = 'AIzaBj7z2z3xBjsk'
const termaiDomain = 'https://c.termai.cc'

async function uploadToTermai(buffer, filename = 'image.jpg') {
  const form = new FormData()
  form.append('file', buffer, { filename })

  const response = await axios.post(`${termaiDomain}/api/upload?key=${termaiKey}`, form, {
    headers: { ...form.getHeaders(), 'User-Agent': 'Mozilla/5.0' },
    timeout: 60000
  })

  if (response.data?.status && response.data?.path) {
    return response.data.path
  }

  throw new Error('Termai upload failed')
}

const uploadImage = uploadToTermai
const uploadToTelegraph = uploadToTermai
const uploadTo0x0 = uploadToTermai
const uploadToCatbox = uploadToTermai
const uploadToTmpfiles = uploadToTermai
const uploadToUguu = uploadToTermai

const fs = __vxDef(require("fs"));
const path = __vxDef(require("path"));
const { ImageUploadService } = require("node-upload-images");
const config = __vxDef(require("../../config.e7.js"));

const { updateAssetAndSave } = require("./vanxone-asset-manager.e7.js");

async function updateAssetUrl(assetKey, buffer, filename = 'image.jpg') {
  let localPath = config.assets?.[assetKey];

  if (!localPath || localPath.startsWith('http')) {
    let folder = 'image';
    if (filename.endsWith('.mp4')) folder = 'video';
    else if (filename.endsWith('.mp3')) folder = 'audio';

    localPath = `./assets/${folder}/${filename}`;

    if (!config.assets) config.assets = {};
    config.assets[assetKey] = localPath;

    const configPath = path.join(process.cwd(), 'config.js');
    let configContent = fs.readFileSync(configPath, 'utf8');

    const regex = new RegExp(`("${assetKey}"\\s*:\\s*)"([^"]+)"`);
    if (regex.test(configContent)) {
      configContent = configContent.replace(regex, `$1"${localPath}"`);
    } else {
      const assetsBlockRegex = /(assets\s*:\s*\{)([^}]*)(\})/;
      if (assetsBlockRegex.test(configContent)) {
        configContent = configContent.replace(assetsBlockRegex, (match, p1, p2, p3) => {
          let inner = p2.trim();
          if (inner.endsWith(',')) inner = inner.slice(0, -1);
          if (inner.length > 0) return `${p1}\n    ${inner},\n    "${assetKey}": "${localPath}"\n  ${p3}`;
          return `${p1}\n    "${assetKey}": "${localPath}"\n  ${p3}`;
        });
      }
    }
    fs.writeFileSync(configPath, configContent, 'utf8');
  }

  const fullPath = path.resolve(process.cwd(), localPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  updateAssetAndSave(assetKey, buffer, localPath);

  return localPath;
}
Object.defineProperty(__vxExports, "uploadImage", { enumerable: true, get: () => uploadImage });
Object.defineProperty(__vxExports, "uploadToTelegraph", { enumerable: true, get: () => uploadToTelegraph });
Object.defineProperty(__vxExports, "uploadTo0x0", { enumerable: true, get: () => uploadTo0x0 });
Object.defineProperty(__vxExports, "uploadToCatbox", { enumerable: true, get: () => uploadToCatbox });
Object.defineProperty(__vxExports, "uploadToTmpfiles", { enumerable: true, get: () => uploadToTmpfiles });
Object.defineProperty(__vxExports, "uploadToUguu", { enumerable: true, get: () => uploadToUguu });
Object.defineProperty(__vxExports, "updateAssetUrl", { enumerable: true, get: () => updateAssetUrl });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
