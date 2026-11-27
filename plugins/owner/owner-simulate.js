// owner/owner-simulate — satu file: metadata + kode fitur (gabungan dari engine2/plugins/owner/owner-simulate.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "simulasi",
    "simulate"
  ],
  "category": "owner",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur simulate (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/owner-simulate", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/owner-simulate.js'
  const __vxExports = {};
  let handler = async (m, { conn, usedPrefix, command, args: [event] }) => {
  	if (!event)
  		return await conn.reply(
  			m.chat,
  			`contoh:
  ${usedPrefix + command} welcome @user
  ${usedPrefix + command} bye @user
  ${usedPrefix + command} promote @user
  ${usedPrefix + command} demote @user`.trim(),
  			m
  		);
  	let part = m.mentionedJid[0] || m.sender;
  	let act = false;
  	m.reply(`*Simulating ${event}...*`);
  	switch (event.toLowerCase()) {
  		case 'add':
  		case 'invite':
  		case 'welcome':
  			act = 'add';
  			break;
  		case 'bye':
  		case 'kick':
  		case 'leave':
  		case 'remove':
  			act = 'remove';
  			break;
  		case 'promote':
  			act = 'promote';
  			break;
  		case 'demote':
  			act = 'demote';
  			break;
  		default:
  			throw eror;
  	}
  	if (act)
  		return conn.participantsUpdate({
  			id: m.chat,
  			participants: [{ id: part }],
  			action: act,
  			simulate: true,
  		});
  };
  handler.help = ['simulate'];
  handler.tags = ['owner'];
  handler.owner = true;
  
  handler.command = /^(simulate|simulasi)$/i;
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
