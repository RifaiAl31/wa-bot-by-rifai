// rpg/rpg-kandang — satu file: metadata + kode fitur (gabungan dari engine2/plugins/rpg/rpg-kandang.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "kandang"
  ],
  "category": "rpg",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur kandang (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/rpg").split('\\').join('/')
module.exports = __vx.plugin("rpg/rpg-kandang", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/rpg-kandang.js'
  const __vxExports = {};
  let handler = async (m, { conn }) => {
  	let banteng = global.db.data.users[m.sender].banteng;
  	let harimau = global.db.data.users[m.sender].harimau;
  	let gajah = global.db.data.users[m.sender].gajah;
  	let kambing = global.db.data.users[m.sender].kambing;
  	let panda = global.db.data.users[m.sender].panda;
  	let buaya = global.db.data.users[m.sender].buaya;
  	let kerbau = global.db.data.users[m.sender].kerbau;
  	let sapi = global.db.data.users[m.sender].sapi;
  	let monyet = global.db.data.users[m.sender].monyet;
  	let babihutan = global.db.data.users[m.sender].babihutan;
  	let babi = global.db.data.users[m.sender].babi;
  	let ayam = global.db.data.users[m.sender].ayam;
  
  	let ndy = `List Hewan Di Kandang
      
  • Banteng: ${banteng} Ekor
  • Harimau: ${harimau} Ekor
  • Gajah: ${gajah} Ekor
  • Kambing: ${kambing} Ekor
  • Panda: ${panda} Ekor
  • Buaya: ${buaya} Ekor
  • Kerbau: ${kerbau} Ekor
  • Sapi: ${sapi} Ekor
  • Monyet: ${monyet} Ekor
  • Babi Hutan: ${babihutan} Ekor
  • Babi: ${babi} Ekor
  • Ayam: ${ayam} Ekor
   
   `.trim();
  	conn.reply(m.chat, ndy, m);
  };
  handler.help = ['kandang'];
  handler.tags = ['rpg'];
  handler.command = /^(kandang)$/i;
  
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
