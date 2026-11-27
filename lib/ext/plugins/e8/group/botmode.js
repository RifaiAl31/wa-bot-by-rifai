'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxExports = {};
const { getDatabase } = require("../../../src/lib/vanxone-database.e8.js");

const pluginConfig = {
    name: 'botmode',
    alias: ['setmode', 'mode'],
    category: 'group',
    description: 'Atur mode bot untuk grup ini',
    usage: '.botmode <md/pushkontak/otp/all/jagagrup>',
    example: '.botmode md',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

const MODES = {
    md: {
        name: 'Multi-Device',
        desc: 'Mode default dengan semua fitur standar',
        allowedCategories: null,
        excludeCategories: ['pushkontak']
    },
    all: {
        name: 'All Features',
        desc: 'Semua fitur dari semua mode bisa diakses',
        allowedCategories: null,
        excludeCategories: null
    },
    pushkontak: {
        name: 'Push Kontak',
        desc: 'Mode khusus untuk push kontak ke member',
        allowedCategories: ['owner', 'main', 'group', 'sticker', 'pushkontak'],
        excludeCategories: null
    },
    otp: {
        name: 'OTP Service',
        desc: 'Mode layanan OTP otomatis',
        allowedCategories: ['main', 'group', 'sticker', 'owner'],
        excludeCategories: null
    },
    jagagrup: {
        name: 'Jaga Grup',
        desc: 'Mode minimalis khusus penjaga grup',
        allowedCategories: ['main', 'group', 'owner', 'sticker', 'cek', 'download'],
        excludeCategories: null
    }
}

const MODE_EMOJI = {
    md: '📱',
    all: '🌐',
    pushkontak: '📤',
    otp: '🔐',
    jagagrup: '🛡️'
}

function buildSelectRows(currentMode, prefix) {
    return Object.entries(MODES).map(([key, val]) => ({
        title: `${MODE_EMOJI[key]} ${key.toUpperCase()}${key === currentMode ? ' ✓' : ''} — ${val.name}`,
        description: val.desc,
        id: `${prefix}botmode ${key}`
    }))
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const args = m.args || []
    const mode = (args[0] || '').toLowerCase()

    const groupData = db.getGroup(m.chat) || {}
    const currentMode = groupData.botMode || 'md'

    const sendModeMenu = async (extraText = '') => {
        const rows = buildSelectRows(currentMode, m.prefix)

        const buttons = [
            {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: '🔧 Pilih Mode Bot',
                    sections: [{ title: 'Mode Tersedia', rows }]
                })
            }
        ]

        const bodyText =
            `🔧 *ʙᴏᴛ ᴍᴏᴅᴇ*\n\n` +
            (extraText ? `${extraText}\n\n` : '') +
            `> Mode saat ini: *${currentMode.toUpperCase()}* (${MODES[currentMode]?.name || 'Unknown'})\n` +
            `\n*📋 DESKRIPSI MODE:*\n\n` +
            Object.entries(MODES).map(([key, val]) =>
                `- *${MODE_EMOJI[key]} ${key.toUpperCase()} — ${val.name}*\n  ${val.desc}`
            ).join('\n\n') +
            `\n\n> Pilih mode dari tombol di bawah 👇\n` +
            `> _Pengaturan berlaku per-grup_`

        await sock.sendButton(
            m.chat,
            null,
            bodyText,
            m,
            { buttons }
        )
    }

    if (!mode) {
        return await sendModeMenu()
    }

    if (!Object.keys(MODES).includes(mode)) {
        return await sendModeMenu(`❌ Mode *"${mode}"* tidak valid. Pilih dari daftar berikut:`)
    }

    const newGroupData = {
        ...groupData,
        botMode: mode
    }

    db.setGroup(m.chat, newGroupData)
    db.save()

    await m.react('✅')

    if (mode === 'jagagrup') {
        extraInfo = `\n\n🛡️ *Jaga Grup aktif!*\n` +
            `> Plugin aktif: main, group, owner, sticker, cek, download\n` +
            `> Plugin lain dinonaktifkan untuk grup ini`
    }

    const rows = buildSelectRows(mode, m.prefix)
    const buttons = [
        {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
                title: '🔄 Ganti Mode',
                sections: [{ title: 'Mode Lainnya', rows }]
            })
        }
    ]

    await sock.sendButton(
        m.chat,
        null,
        `✅ *ᴍᴏᴅᴇ ᴅɪᴜʙᴀʜ*\n\n` +
        `> Mode: *${MODE_EMOJI[mode]} ${mode.toUpperCase()}* (${MODES[mode].name})\n` +
        `> Grup: *${m.chat.split('@')[0]}*\n` +
        `\n\n> Ketik \`${m.prefix}menu\` untuk melihat menu.\n` +
        `> Mau ganti mode lain? Pilih dari tombol di bawah 👇`,
        m,
        { buttons }
    )
}

function getGroupMode(chatJid, db) {
    const globalMode = db.setting('botMode') || 'md'
    if (!chatJid?.endsWith('@g.us')) return globalMode
    const groupData = db.getGroup(chatJid) || {}
    return groupData.botMode || globalMode
}

function getModeCategories(mode) {
    const modeConfig = MODES[mode] || MODES.md
    return {
        allowed: modeConfig.allowedCategories,
        excluded: modeConfig.excludeCategories
    }
}

function filterCategoriesByMode(categories, mode) {
    const modeConfig = MODES[mode] || MODES.md

    if (modeConfig.allowedCategories) {
        return categories.filter(cat => modeConfig.allowedCategories.includes(cat.toLowerCase()))
    }

    if (modeConfig.excludeCategories) {
        return categories.filter(cat => !modeConfig.excludeCategories.includes(cat.toLowerCase()))
    }

    return categories
}


Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
Object.defineProperty(__vxExports, "getGroupMode", { enumerable: true, get: () => getGroupMode });
Object.defineProperty(__vxExports, "getModeCategories", { enumerable: true, get: () => getModeCategories });
Object.defineProperty(__vxExports, "filterCategoriesByMode", { enumerable: true, get: () => filterCategoriesByMode });
Object.defineProperty(__vxExports, "MODES", { enumerable: true, get: () => MODES });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
