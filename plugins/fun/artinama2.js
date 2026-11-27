// fun/artinama2 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/artinama2.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "artinama2",
  "command": [
    "artinama2"
  ],
  "category": "fun",
  "desc": "Mencari arti sebuah nama (implementasi WhatsApp Bot).",
  "usage": ".artinama2 <nama>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/artinama2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/artinama2.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  const request = __vxDef(require("request"));
  const cheerio = __vxNs(require("cheerio"));
  
  let handler = async (m, { text }) => {
    if (!text) throw 'Namanya siapa?'
    let nama = text
  request.get({
          headers: {'content-type' : 'application/x-www-form-urlencoded'},
          url:     'http://www.primbon.com/arti_nama.php?nama1='+ nama +'&proses=+Submit%21+',
        },function(error, response, body){
            let $ = cheerio.load(body);
            var y = $.html().split('arti:')[1];
            var t = y.split('method="get">')[1];
            var f = y.replace(t ," ");
            var x = f.replace(/<br\s*[\/]?>/gi, "\n");
            var h  = x.replace(/<[^>]*>?/gm, '');
        console.log(""+ h);
        m.reply(`Arti Dari Nama ${nama} Adalah ${nama}\n\n${h}`)
    });
  }
  const pluginConfig = {
    name: 'artinama2',
    alias: [],
    category: 'fun',
    description: 'Mencari arti sebuah nama (implementasi WhatsApp Bot).',
    usage: '.artinama2 <nama>',
    example: '.artinama2 <nama>',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
