'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
const { getDatabase } = require("../../../src/lib/vanxone-database.e8.js");
const config = __vxDef(require("../../../config.e8.js"));
const moment = __vxDef(require("moment-timezone"));
// TODO: sesuaikan path import AIRich dengan lokasi class-nya di project
const messageBuilder = __vxDef(require("../../../../MessageBuilder.js"));
const { AIRich } = messageBuilder;
const pluginConfig = {
    name: 'intro',
    alias: ['perkenalan', 'selamatdatang'],
    category: 'group',
    description: 'Tampilkan pesan intro grup',
    usage: '.intro',
    example: '.intro',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

const DEFAULT_INTRO = `halo kak @user 🖐

Kenalan dulu yukk
- Nama :
- Umur :
- Asal :
- Hobi :
- Status :

Semoga betah yahh, di grup @group

> Untuk Owner:
ganti intro bawaan dengan .setintro <text>`
 function parsePlaceholders(text, m, groupMeta, mentionLabel = null) {
    const now = moment().tz('Asia/Makassar')
    const dateStr = now.format('D MMMM YYYY')
    const timeStr = now.format('HH:mm')

    const userTag = mentionLabel || `@${m.sender.split('@')[0]}`
    return text
        .replace(/@user/gi, userTag)
        .replace(/@group/gi, groupMeta?.subject || 'Grup')
        .replace(/@count/gi, groupMeta?.participants?.length || '0')
        .replace(/@date/gi, dateStr)
        .replace(/@time/gi, timeStr)
        .replace(/@desc/gi, groupMeta?.desc || 'Tidak ada deskripsi')
        .replace(/@botname/gi, config.bot?.name || 'WhatsApp Bot')
}

// Pesan rich dengan tombol salin, berisi form intro yang tinggal diisi
async function sendCopyableForm(sock, jid, groupMeta) {
    const groupName = groupMeta?.subject || 'grup'
    const form =
        `\`intro ${groupName}\` \n` +
        `nama: \n` +
        `umur: \n` +
        `asal daerah: \n` +
        `hobi: \n` +
        `status: `

    const rich = new AIRich(sock)

    rich.addSection({
        view_model: {
            __typename: 'GenAIAddonActionLayoutViewModel',
            addon_action_type: 'COPY_TO_CLIPBOARD',
            addon_action_alignment: 'END',
            primitives: [
                {
                    __typename: 'GenAIMarkdownTextUXPrimitive',
                    text: form,
                    inline_entities: []
                }
            ]
        }
    })

    await rich.send(jid)
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const groupData = db.getGroup(m.chat) || db.setGroup(m.chat)
    const groupMeta = m.groupMetadata

    const introText = groupData.intro || DEFAULT_INTRO
    const parsed = parsePlaceholders(introText, m, groupMeta)

    // Teks sapaan (mention tetap jalan)
    await m.reply(parsed, { mentions: [m.sender] })

    // Form intro yang bisa disalin lewat tombol
    try {
        await sendCopyableForm(sock, m.chat, groupMeta)
    } catch (err) {
        console.error('[intro] gagal kirim rich message:', err)
    }
}


Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
Object.defineProperty(__vxExports, "parsePlaceholders", { enumerable: true, get: () => parsePlaceholders });
Object.defineProperty(__vxExports, "DEFAULT_INTRO", { enumerable: true, get: () => DEFAULT_INTRO });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
