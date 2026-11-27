// tools/jadwaltv — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/jadwaltv.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "jadwaltv",
  "command": [
    "jadwaltv"
  ],
  "category": "tools",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/jadwaltv", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/jadwaltv.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fs = __vxDef(require("fs"));
  const axios = __vxDef(require("axios"));
  const cheerio = __vxNs(require("cheerio"));
  
  const pluginConfig = {
    name: "jadwaltv",
    alias: [],
    category: "tools",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { text }) {
  	if (!text) throw 'Input Query'
  	let res = await jadwalTV(text)
  	let txt = res.result.map((v) => `[${v.jam.replace('WIB', ' WIB')}] ${v.acara}`).join`\n`
  	m.reply(`Jadwal TV ${res.channel}\n\n${txt}`)
  }
  
  async function jadwalTV(name) {
  	let list = JSON.parse(fs.readFileSync('../../src/jadwaltv.json', 'utf-8'))
  	let data = list.find((v) => (new RegExp(name, 'gi')).test(v.channel)), result = []
  	if (!data) throw 'List Channel Yg Tersedia:\n\n' + list.map(v => v.channel).sort().join('\n')
  	let html = (await axios.get(`https://www.jadwaltv.net/${data.isPay ? 'jadwal-pay-tv/' : ''}${data.value}`)).data
  	let $ = cheerio.load(html)
  	$('div > table.table').find('tbody > tr').slice(1).each(function () {
  		let jam = $(this).find('td').eq(0).text()
  		let acara = $(this).find('td').eq(1).text()
  		if (!/Jadwal TV/gi.test(acara) && !/Acara/gi.test(acara)) result.push({ jam, acara })
  	})
  	return { channel: data.channel.toUpperCase(), result }
  }
  /*
  async function listJadwalTV() {
  	let html = (await axios.get('https://www.jadwaltv.net/jadwal-pay-tv')).data
  	let $ = cheerio.load(html), result = []
  	$('#channelPayTVDropdown.dropdown > option').get().map((v) => {
  		let name = $(v).text().toLowerCase()
  		result.push({ value: $(v).val(), channel: name, isPay: true })
  	})
  	return [
  		{ value: 'channel/antv', channel: 'antv', isPay: false },
  		{ value: 'channel/gtv', channel: 'gtv', isPay: false },
  		{ value: 'channel/indosiar', channel: 'indosiar', isPay: false },
  		{ value: 'channel/inewstv', channel: 'inews tv', isPay: false },
  		{ value: 'channel/kompastv', channel: 'kompas tv', isPay: false },
  		{ value: 'channel/metrotv', channel: 'metro tv', isPay: false },
  		{ value: 'channel/mnctv', channel: 'mnctv', isPay: false },
  		{ value: 'channel/nettv', channel: 'net tv', isPay: false },
  		{ value: 'channel/ochannel', channel: 'ochannel', isPay: false },
  		{ value: 'channel/rcti', channel: 'rcti', isPay: false },
  		{ value: 'channel/rtv', channel: 'rtv', isPay: false },
  		{ value: 'channel/sctv', channel: 'sctv', isPay: false },
  		{ value: 'channel/trans7', channel: 'trans7', isPay: false },
  		{ value: 'channel/transtv', channel: 'transtv', isPay: false },
  		{ value: 'channel/tvone', channel: 'tvone', isPay: false },
  		{ value: 'channel/tvri', channel: 'tvri', isPay: false },
  		...result
  	]
  }
  */
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
