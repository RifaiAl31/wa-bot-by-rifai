// misc/tool-translate — satu file: metadata + kode fitur (gabungan dari engine2/plugins/misc/tool-translate.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "t"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur t (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/misc").split('\\').join('/')
module.exports = __vx.plugin("misc/tool-translate", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tool-translate.js'
  const __vxExports = {};
  /*
  Saluran: 
  ini wm gw cok jan di hapus
  */
  
  
  let handler = async (m, { args, usedPrefix, command }) => {
  	let lang, text;
  	if (args.length >= 2) {
  		(lang = args[0] ? args[0] : "id"), (text = args.slice(1).join(" "));
  	} else if (m.quoted && m.quoted.text) {
  		(lang = args[0] ? args[0] : "id"), (text = m.quoted.text);
  	} else throw `Ex: ${usedPrefix + command} id hello i am robot`;
  	try {
  		const prompt = text.trim();
  		let res = await translate(prompt, lang);
  		let lister = Object.keys(await langList());
  		let supp = `Error : Bahasa "${lang}" Tidak Support`;
  		if (!lister.includes(lang))
  			return m.reply(
  				supp +
  					"\n\n*Example:*\n." +
  					command +
  					" id hello\n\n*Pilih kode yg ada*\n" +
  					lister.map((v, index) => `${index + 1}. ${v}`).join("\n"),
  			);
  
  		let Detect = res[1].toUpperCase() ? res[1].toUpperCase() : "US";
  		let ToLang = lang.toUpperCase();
  		let caption = `*❲•❳ Terdeteksi ❲•❳*
  - ${Detect}
  
  *❲•❳ Ke Bahasa ❲•❳*
  - ${ToLang}
  
  *❲•❳ Terjemahan ❲•❳*
  - ${res[0].trim()}
  `;
  		await m.reply(
  			caption,
  			null,
  			m.mentionedJid
  				? {
  						mentions: conn.parseMention(caption),
  				  }
  				: {},
  		);
  	} catch (e) {
  		await m.reply(eror);
  	}
  };
  handler.help = ["translate"].map((v) => v + " *ᴛᴇxᴛ*");
  handler.tags = ['tools'];
  handler.command = /^(tran(slate)|tr?)$/i
  
  const __vxDefault = handler;
  
  async function langList() {
  	let data = await fetch(
  		"https://translate.google.com/translate_a/l?client=webapp&sl=auto&tl=en&v=1.0&hl=en&pv=1&tk=&source=bh&ssel=0&tsel=0&kc=1&tk=626515.626515&q=",
  	).then((response) => response.json());
  	return data.tl;
  }
  
  async function translate(query = "", lang) {
  	if (!query.trim()) return "";
  	const url = new URL("https://translate.googleapis.com/translate_a/single");
  	url.searchParams.append("client", "gtx");
  	url.searchParams.append("sl", "auto");
  	url.searchParams.append("dt", "t");
  	url.searchParams.append("tl", lang);
  	url.searchParams.append("q", query);
  
  	try {
  		const response = await fetch(url.href);
  		const data = await response.json();
  		if (data) {
  			return [data[0].map((item) => item[0].trim()).join("\n"), data[2]];
  		} else {
  			return "";
  		}
  	} catch (err) {
  		throw err;
  	}
  }
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
