// ai/chatgpt — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai/chatgpt.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "chatgpt",
  "command": [
    "chatgpt"
  ],
  "category": "ai",
  "desc": "Fitur chatgpt <pesan>",
  "usage": ".chatgpt <pesan>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/chatgpt", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/chatgpt.js'
  const __vxExports = {};
  const { chatgpt } = require("../../lib/ext/lib/scrape/chatgpt.e5.js");
  
  const handler = async (m, { sock, text, reply, example }) => {
  	if (!text) return reply(example('hai'));
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
  
  	try {
  		const res = await chatgpt(text);
  
  		if (!res || !res.ok || !res.answer) {
  			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  			return reply('❌ Gagal mendapatkan respon dari ChatGPT.');
  		}
  
  		const result = res.answer.trim();
  
  		const codeBlockRegex = /```(\w+)?\r?\n([\s\S]*?)```/g;
  		const codeMatches = [...result.matchAll(codeBlockRegex)];
  
  		if (codeMatches.length > 0 && typeof global.AIRich !== 'undefined') {
  			try {
  				const rich = new global.AIRich(sock);
  				let lastIndex = 0;
  
  				for (const match of codeMatches) {
  					const textBefore = result.substring(lastIndex, match.index).trim();
  					if (textBefore) rich.addText(textBefore);
  
  					const lang = (match[1] || 'javascript').toLowerCase();
  					const codeContent = match[2].trim();
  
  					rich.addCode(lang, codeContent);
  					lastIndex = match.index + match[0].length;
  				}
  
  				const textAfter = result.substring(lastIndex).trim();
  				if (textAfter) rich.addText(textAfter);
  
  				await rich.send(m.chat, { quoted: m });
  				await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
  				return;
  			} catch (errRich) {
  				console.error('[AIRich ChatGPT Error]:', errRich);
  			}
  		}
  
  		await reply(result);
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
  
  	} catch (e) {
  		console.error('[CHATGPT PLUGIN ERROR]:', e);
  		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
  		await reply(`❌ Terjadi kesalahan: ${e.message || 'Gagal menghubungi ChatGPT'}`);
  	}
  };
  
  handler.help = ['chatgpt <pesan>'];
  handler.tags = ['ai'];
  handler.command = ['chatgpt', 'cai'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
