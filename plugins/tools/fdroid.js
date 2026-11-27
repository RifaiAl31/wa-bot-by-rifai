// internet/fdroid — satu file: metadata + kode fitur (gabungan dari engine7/plugins/internet/fdroid.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "fdroid",
  "command": [
    "fdroid",
    "fdroidsearch",
    "fdroiddl",
    "fdroidapp"
  ],
  "category": "tools",
  "desc": "Cari dan dapatkan link download aplikasi open-source dari F-Droid",
  "usage": ".fdroid <nama_aplikasi>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/internet").split('\\').join('/')
module.exports = __vx.plugin("internet/fdroid", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fdroid.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  /***
    @ Base: https://f-droid.org/
    @ Author: WhatsApp Bot
    @ Note: Search, detail, and download apps from F-Droid
  ***/
  
  const axios = __vxDef(require("axios"));
  const cheerio = __vxNs(require("cheerio"));
  
  const CONFIG = {
      HEADERS: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'id,en-US;q=0.9,en;q=0.8'
      }
  };
  
  const fdroid = {
      search: async (query) => {
          try {
              const url = `https://search.f-droid.org/?q=${encodeURIComponent(query)}&lang=id`;
              const response = await axios.get(url, { headers: CONFIG.HEADERS });
              const html = response.data;
              const $ = cheerio.load(html);
              const apps = [];
  
              $('a.package-header').each((index, element) => {
                  const appName = $(element).find('h4.package-name').text().trim();
                  const appDesc = $(element).find('span.package-summary').text().trim();
                  const appLink = $(element).attr('href');
                  const appIcon = $(element).find('img.package-icon').attr('src');
                  const appLicense = $(element).find('span.package-license').text().trim();
  
                  if (appName && appLink) {
                      apps.push({
                          name: appName,
                          description: appDesc,
                          link: appLink,
                          icon: appIcon,
                          license: appLicense
                      });
                  }
              });
  
              return {
                  success: true,
                  data: apps
              };
          } catch (error) {
              return {
                  success: false,
                  error: error.response?.statusText || error.message
              };
          }
      },
  
      detail: async (url) => {
          try {
              const response = await axios.get(url, { headers: CONFIG.HEADERS });
              const html = response.data;
              const $ = cheerio.load(html);
              
              const versionElement = $('li.package-version#latest').length > 0 
                  ? $('li.package-version#latest') 
                  : $('li.package-version').first();
                  
              const versionText = versionElement.find('.package-version-header').text().trim();
              const versionMatch = versionText.match(/Versi\s+([\d.]+)/i) || versionText.match(/Version\s+([\d.]+)/i);
  
              const appDetails = {
                  version: versionMatch ? versionMatch[1] : (versionText.replace(/[^0-9.]/g, '').split(/\s+/)[0] || '-'),
                  addedOn: versionElement.find('.package-version-header').text().match(/(?:Ditambahkan pada|Added on)\s+(.+)/i)?.[1]?.trim() || null,
                  requirement: versionElement.find('.package-version-requirement').text().trim() || null,
                  sourceLink: versionElement.find('.package-version-source a').attr('href') || null,
                  permissions: versionElement.find('.package-version-permissions .no-permissions').text().trim() || 'Permissions not listed',
                  downloadLink: versionElement.find('.package-version-download a').attr('href') || null,
                  apkSize: versionElement.find('.package-version-download').contents().filter(function() {
                      return this.nodeType === 3;
                  }).text().trim().split('|')[0].trim() || null
              };
  
              return {
                  success: true,
                  data: appDetails
              };
          } catch (error) {
              return {
                  success: false,
                  error: error.response?.statusText || error.message
              };
          }
      }
  };
  
  const pluginConfig = {
      name: 'fdroid',
      alias: ['fdroidsearch', 'fdroiddl', 'fdroidapp'],
      category: 'internet',
      description: 'Cari dan dapatkan link download aplikasi open-source dari F-Droid',
      usage: '.fdroid <nama_aplikasi>',
      example: '.fdroid termux',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  };
  
  async function handler(m, { sock, text, command, prefix }) {
      const pfx = prefix || m.prefix || '.';
  
      if (!text) {
          if (m.react) await m.react('❌');
          return m.reply(
              `*Format Salah!*\n\n` +
              `Gunakan perintah berikut:\n` +
              `\`${pfx}${command} <nama aplikasi>\`\n\n` +
              `*Contoh:*\n` +
              `\`${pfx}${command} termux\``
          );
      }
  
      if (m.react) await m.react('⏳');
  
      try {
          const searchRes = await fdroid.search(text);
  
          if (!searchRes.success || !searchRes.data || searchRes.data.length === 0) {
              if (m.react) await m.react('❌');
              return m.reply(`❌ Aplikasi "*${text}*" tidak ditemukan di F-Droid.`);
          }
  
          const app = searchRes.data[0];
          const detailRes = await fdroid.detail(app.link);
  
          if (!detailRes.success || !detailRes.data) {
              if (m.react) await m.react('❌');
              return m.reply(`❌ Gagal mengambil detail aplikasi "*${app.name}*".`);
          }
  
          const details = detailRes.data;
  
          if (m.react) await m.react('✅');
  
          let caption = `🤖 *F-DROID APP DOWNLOADER*\n\n`;
          caption += `📦 *Nama App:* ${app.name}\n`;
          caption += `📝 *Deskripsi:* ${app.description || '-'}\n`;
          caption += `🔖 *Lisensi:* ${app.license || '-'}\n`;
          caption += `📌 *Versi:* ${details.version}\n`;
          if (details.apkSize) caption += `⚖️ *Ukuran:* ${details.apkSize}\n`;
          if (details.requirement) caption += `📲 *Persyaratan:* ${details.requirement}\n`;
          if (details.addedOn) caption += `📅 *Rilis/Update:* ${details.addedOn}\n`;
          if (details.sourceLink) caption += `🌐 *Source Code:* ${details.sourceLink}\n`;
          caption += `\n🔗 *Link Download APK:*\n${details.downloadLink || app.link}`;
  
          if (app.icon) {
              await sock.sendMessage(m.chat, {
                  image: { url: app.icon },
                  caption: caption
              }, { quoted: m });
          } else {
              await m.reply(caption);
          }
  
      } catch (error) {
          console.error('F-Droid Plugin Error:', error);
          if (m.react) await m.react('❌');
          await m.reply('❌ *GAGAL*\n\n> ' + error.message);
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
