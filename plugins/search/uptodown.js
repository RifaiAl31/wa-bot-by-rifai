// search/uptodown — satu file: metadata + kode fitur (gabungan dari engine7/plugins/search/uptodown.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "uptodown",
  "command": [
    "uptodown"
  ],
  "category": "search",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/uptodown", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/uptodown.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const axios = __vxDef(require("axios"));
  const { load } = require("cheerio");
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  
  class Uptodown {
      constructor(text) {
          this.baseUrl = "https://id.uptodown.com";
          this.text = text;
      }
  
      async search() {
          return axios.post(this.baseUrl + "/android/search", { q: this.text }).then((response) => {
              const $ = load(response.data);
              let result = [];
              $('.content .name a').each((_, a) => {
                  let _slug = $(a).attr('href');
                  let _name = $(a).text().trim();
                  result.push({
                      name: _name,
                      slug: _slug.replace("." + this.baseUrl.replace("https://", "") + "/android", "").replace("https://", "")
                  });
              });
              return result;
          }).catch((e) => {
              console.error(e);
              throw e;
          });
      }
  
      async download() {
          return axios.get("https://" + this.text + "." + this.baseUrl.replace("https://", "") + "/android").then(async (response) => {
              const $ = load(response.data);
              let image = [];
              let obj = {};
              let v = $('.detail .icon img');
              obj.title = v.attr('alt').replace("Ikon ", "") || "None";
              let slug = $('a.button.last').attr('href');
              obj.version = $('.info .version').text().trim() || "None";
              const downloadData = await this.getDownloadData(slug, obj.version);
              obj.download = downloadData || "None";
              obj.author = $('.autor').text().trim() || "None";
              obj.score = $('span[id="rating-inner-text"]').text().trim() || "None";
              obj.unduhan = $('.dwstat').text().trim() || "None";
              obj.icon = v.attr('src') || "None";
              $('.gallery picture img').each((_, a) => {
                  image.push($(a).attr('src'));
              });
              obj.image = image || [];
              obj.desc = $('.text-description').text().trim().split('\n')[0] || "None";
              return obj;
          }).catch((e) => {
              console.error(e);
              throw e;
          });
      }
  
      async getDownloadData(slug, version) {
          try {
              const response = await axios.get(slug);
              const downloadUrl = `https://dw.uptodown.net/dwn/${load(response.data)('.button-group.download button').attr('data-url')}${version}.apk`;
              const { headers } = await axios.head(downloadUrl);
              const downloadSize = headers["content-length"];
              return { size: downloadSize, url: downloadUrl };
          } catch (e) {
              console.error(e);
              throw e;
          }
      }
  }
  
  
  const pluginConfig = {
    name: "uptodown",
    alias: [],
    category: "search",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  const handler = async (m, { conn, args }) => {
      if (!args[0]) {
          return m.reply("Masukkan nama aplikasi untuk mencari.");
      }
  
      const query = args.join(" ");
      const uptodown = new Uptodown(query);
  
      try {
          const results = await uptodown.search();
          if (results.length === 0) {
              return m.reply("Aplikasi tidak ditemukan.");
          }
  
          const app = results[0];
          uptodown.text = app.slug;
  
          const details = await uptodown.download();
          
          const message = `
  *Title:* ${details.title}
  *Version:* ${details.version}
  *Author:* ${details.author}
  *Score:* ${details.score}
  *Unduhan:* ${details.unduhan}
  *Deskripsi:* ${details.desc}
  
  *Download:* ${details.download.url} (Size: ${details.download.size} bytes)
          `.trim();
  
          const iconBuffer = await axios.get(details.icon, { responseType: 'arraybuffer' }).then(res => res.data);
          await conn.sendMessage(m.chat, { image: Buffer.from(iconBuffer), caption: message }, { quoted: m });
  
          for (const img of details.image) {
              const imgBuffer = await axios.get(img, { responseType: 'arraybuffer' }).then(res => res.data);
              await conn.sendMessage(m.chat, { image: Buffer.from(imgBuffer) }, { quoted: m });
          }
          
          const apkBuffer = await axios.get(details.download.url, { responseType: 'arraybuffer' }).then(res => res.data);
          const fileName = `${details.title}-${details.version}.apk`;
          const filePath = path.join('/tmp', fileName);
          fs.writeFileSync(filePath, apkBuffer);
  
          await conn.sendMessage(m.chat, { document: { url: filePath }, mimetype: 'application/vnd.android.package-archive', fileName }, { quoted: m });
          
          fs.unlinkSync(filePath);
  
      } catch (e) {
          console.error(e);
          m.reply("Terjadi kesalahan saat mengambil data.");
      }
  };
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
