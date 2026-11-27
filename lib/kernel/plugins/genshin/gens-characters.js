// ───────── gens-characters ─────────
// Dipecah dari plugins/game/genshin.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdGensCharacters = rpgCmd(["gens-characters"], async (A) => {
    const { isBan, XRB, XReaction, text, reply, vanxone } = A
    const genshindb = await A.loadGenshin().catch(() => null)
    if (!genshindb) return A.reply('Modul *genshin-db* belum terpasang. Jalankan: npm i genshin-db')
    switch (0) {
        default:
            {
            if (isBan) return XRB()
            await XReaction()
              if (!text) return reply(`Contoh: *${vanxone} diluc*\nHarap berikan nama karakter.`);
              try {
                let result = await genshindb.characters(text);
                if (result) {
                  let response = `*Karakter Ditemukan: ${result.name}*\n\n`;
                  response += `_${result.description}_\n\n`;
                  response += `*Rarity:* ${result.rarity || "Data tidak tersedia"}\n`;
                  response += `*Vision:* ${result.vision || "Data tidak tersedia"}\n`;
                  response += `*Senjata:* ${result.weapon || "Data tidak tersedia"}`;
                  reply(response);
                } else {
                  reply("Karakter tidak ditemukan.");
                }
              } catch (error) {
                console.error(error);
                let available = await genshindb.characters("names", {
                  matchCategories: true
                });
                reply(`*Tidak Ditemukan*\n\n*Karakter yang tersedia:* ${available.join(", ")}`);
              }
            };
            break
    }
}, { tags: 'genshin' })

// satu command = nama file
export default oneCommand(cmdGensCharacters, 'gens-characters')
