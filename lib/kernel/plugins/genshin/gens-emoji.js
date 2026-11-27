// ───────── gens-emoji ─────────
// Dipecah dari plugins/game/genshin.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdGensEmoji = rpgCmd(["gens-emoji"], async (A) => {
    const { isBan, XRB, XReaction, text, reply, vanxone } = A
    const genshindb = await A.loadGenshin().catch(() => null)
    if (!genshindb) return A.reply('Modul *genshin-db* belum terpasang. Jalankan: npm i genshin-db')
    switch (0) {
        default:
            {
            if (isBan) return XRB()
            await XReaction()
              if (!text) return reply(`Contoh: *${vanxone} anemo*\nHarap berikan nama emoji.`);
              try {
                let result = await genshindb.emojis(text);
                if (result) {
                  let response = `*Emoji Ditemukan: ${result.name}*\n\n`;
                  response += `_${result.description}_\n\n`;
                  response += `*Rarity:* ${result.rarity || "Data tidak tersedia"}`;
                  reply(response);
                } else {
                  reply("Emoji tidak ditemukan.");
                }
              } catch (error) {
                console.error(error);
                let available = await genshindb.emojis("names", {
                  matchCategories: true
                });
                reply(`*Tidak Ditemukan*\n\n*Emoji yang tersedia:* ${available.join(", ")}`);
              }
            };
            break
    }
}, { tags: 'genshin' })

// satu command = nama file
export default oneCommand(cmdGensEmoji, 'gens-emoji')
