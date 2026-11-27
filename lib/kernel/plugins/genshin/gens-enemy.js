// ───────── gens-enemy ─────────
// Dipecah dari plugins/game/genshin.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdGensEnemy = rpgCmd(["gens-enemy"], async (A) => {
    const { isBan, XRB, XReaction, text, reply, vanxone } = A
    const genshindb = await A.loadGenshin().catch(() => null)
    if (!genshindb) return A.reply('Modul *genshin-db* belum terpasang. Jalankan: npm i genshin-db')
    switch (0) {
        default:
            {
            if (isBan) return XRB()
            await XReaction()
              if (!text) return reply( `Contoh: *${vanxone} ruin guard*\nHarap berikan nama musuh.`);
              try {
                let result = await genshindb.enemies(text);
                if (result) {
                  let response = `*Musuh Ditemukan: ${result.name}*\n\n`;
                  response += `_${result.description || "Deskripsi tidak tersedia"}_\n\n`;
                  response += `*Level:* ${result.level || "Data tidak tersedia"}\n`;
                  response += `*Rarity:* ${result.rarity || "Data tidak tersedia"}\n`;
                  response += `*Element:* ${result.element || "Data tidak tersedia"}`;
                  reply(response);
                } else {
                  reply("Musuh tidak ditemukan.");
                }
              } catch (error) {
                console.error(error);
                let available = await genshindb.enemies("names", {
                  matchCategories: true
                });
                reply(`*Tidak Ditemukan*\n\n*Musuh yang tersedia:* ${available.join(", ")}`);
              }
            };
            break
    }
}, { tags: 'genshin' })

// satu command = nama file
export default oneCommand(cmdGensEnemy, 'gens-enemy')
