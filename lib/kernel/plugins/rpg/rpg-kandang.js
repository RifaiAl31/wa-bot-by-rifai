import { adapt } from '../../lib/engine/plugins.js'
let handler = async (m, { conn }) => {
    let banteng = global.kdb.data.users[m.sender].banteng;
    let harimau = global.kdb.data.users[m.sender].harimau;
    let gajah = global.kdb.data.users[m.sender].gajah;
    let kambing = global.kdb.data.users[m.sender].kambing;
    let panda = global.kdb.data.users[m.sender].panda;
    let buaya = global.kdb.data.users[m.sender].buaya;
    let kerbau = global.kdb.data.users[m.sender].kerbau;
    let sapi = global.kdb.data.users[m.sender].sapi;
    let monyet = global.kdb.data.users[m.sender].monyet;
    let babihutan = global.kdb.data.users[m.sender].babihutan;
    let babi = global.kdb.data.users[m.sender].babi;
    let ayam = global.kdb.data.users[m.sender].ayam;

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
handler.help = ['rpg-kandang']
handler.tags = ['rpg']
handler.command = ['rpg-kandang']

export default adapt(handler, { category: 'rpg' })
