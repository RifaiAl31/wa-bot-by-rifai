// owner/owner-fakemsg — satu file: metadata + kode fitur (gabungan dari engine2/plugins/owner/owner-fakemsg.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "fakemsg"
  ],
  "category": "owner",
  "owner": false,
  "group": true,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur fakemsg (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/owner-fakemsg", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/owner-fakemsg.js'
  const __vxExports = {};
  const { delay } = require("@whiskeysockets/baileys");
  
  const handler = async (m, { conn, text }) => {
  	if (!m.quoted) {
  		return m.reply('Reply pesan yang ingin diproses.');
  	}
  
  	if (!text) {
  		return m.reply('Masukkan teks pengganti.');
  	}
  
  	const stanzaId = m.quoted.id; //target stanza
  
  	try {
  		const tempId = await conn.relayMessage(
  			m.chat,
  			{
  				extendedTextMessage: {
  					text: '',
  					contextInfo: {
  						isGroupStatus: true,
  					},
  				},
  			},
  			{}
  		);
  
  		const tempId2 = await conn.relayMessage(
  			m.chat,
  			{
  				protocolMessage: {
  					key: {
  						jid: m.chat,
  						fromMe: true,
  						id: tempId,
  					},
  					type: 14,
  					editedMessage: {
  						extendedTextMessage: {
  							text,
  							contextInfo: {
  								isGroupStatus: false,
  							},
  						},
  					},
  				},
  			},
  			{
  				messageId: stanzaId,
  			}
  		);
  
  		await delay(100);
  
  		await Promise.allSettled([
  			conn.sendMessage(m.chat, {
  				delete: {
  					remoteJid: m.chat,
  					id: tempId,
  					fromMe: true,
  				},
  			}),
  			conn.sendMessage(m.chat, {
  				delete: {
  					remoteJid: m.chat,
  					id: tempId2,
  					fromMe: true,
  				},
  			}),
  		]);
  	} catch (e) {
  		console.error('[fakemsg]', e);
  		await m.reply('Error: ' + (e?.message || e));
  	}
  };
  
  handler.help = ['fakemsg'];
  handler.tags = ['owner'];
  handler.command = /^fakemsg$/i;
  handler.owner = false;
  handler.group = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
