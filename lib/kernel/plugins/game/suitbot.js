import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdSuitbot = rpgCmd(["suitbot"], async (A) => {
    const { m, XRG, isBan, XRB, XReaction, text, reply, vanxone, botname, pushname } = A
    switch (0) {
        default:
            {
            if (!m.isGroup) return XRG()
            if (isBan) return XRB()
            await XReaction()
            				const userChoice = text.toLowerCase();
            				const choices = ['batu', 'gunting', 'kertas'];
            				const botChoice = choices[Math.floor(Math.random() * choices.length)];
            				if (!choices.includes(userChoice)) {
            					return reply(`Pilih antara *batu*, *gunting*, atau *kertas* ya, Kak!\nContoh: ${vanxone} batu`);
            				}
            				let hasil = '';
            				if (userChoice === botChoice) {
            					hasil = `Kita Seri! kamu Pilih *${botChoice}* Dan aku juga pilih *${botChoice}*`;
            				} else if (
            					(userChoice === 'batu' && botChoice === 'gunting') ||
            					(userChoice === 'gunting' && botChoice === 'kertas') ||
            					(userChoice === 'kertas' && botChoice === 'batu')
            				) {
            					hasil = `😞 ${botname} Kalah, ${pushname} menang 👍\nAku pilih *${botChoice}*`;
            				} else {
            					hasil = `Yess, ${botname} menang! ${botname} pilih *${botChoice}*`;
            				}
                reply(hasil);
            }

            break;
    }
}, { tags: 'game' })

const __plugin = cmdSuitbot

// satu command = nama file; command lama dibuang (alias)
export default oneCommand(__plugin, 'suitbot', { subs: false })
