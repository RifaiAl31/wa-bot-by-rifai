// ───────── gens-materials ─────────
// Dipecah dari plugins/game/genshin.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdGensMaterials = rpgCmd(["gens-materials"], async (A) => {
    const { isBan, XRB, XReaction, text, reply, vanxone } = A
    const genshindb = await A.loadGenshin().catch(() => null)
    if (!genshindb) return A.reply('Modul *genshin-db* belum terpasang. Jalankan: npm i genshin-db')
    switch (0) {
        default:
            {
            if (isBan) return XRB()
            await XReaction()
              if (!text) return reply(`Contoh: *${vanxone} boreal wolf's milk*\nHarap berikan nama material.`);
              try {
                let result = await genshindb.materials(text);
                if (result) {
                  let response = `*Material Ditemukan: ${result.name}*\n\n`;
                  response += `_${result.description || "Deskripsi tidak tersedia"}_\n\n`;
                  response += `*Rarity:* ${result.rarity || "Data tidak tersedia"}\n`;
                  response += `*Type:* ${result.type || "Data tidak tersedia"}`;
                  reply(response);
                } else {
                  reply("Material tidak ditemukan.");
                }
              } catch (error) {
                console.error(error);
                let available = await genshindb.materials("names", {
                  matchCategories: true
                });
                reply(`*Tidak Ditemukan*\n\n*Material yang tersedia:* ${available.join(", ")}`);
              }
            };
            break
    }
}, { tags: 'genshin' })

// satu command = nama file
export default oneCommand(cmdGensMaterials, 'gens-materials')
