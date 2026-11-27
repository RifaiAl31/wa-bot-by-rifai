'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxExports = {};
const { getDatabase } = require("../../../src/lib/vanxone-database.e4.js");
const pluginConfig = {
    name: 'botmode',
    alias: ['setmode', 'mode'],
    category: 'group',
    description: 'Atur mode bot untuk grup ini',
    usage: '.botmode <md/pushkontak/otp/all>',
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
        excludeCategories: ['pushkontak', 'otp']
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
        allowedCategories: ['main', 'group', 'sticker', 'owner', 'otp'],
        excludeCategories: null
    }
}

function handler(m, { sock }) {
    const db = getDatabase()
    const args = m.args || []
    let mode = (args[0] || '').toLowerCase()
    const groupData = db.getGroup(m.chat) || {}
    const currentMode = groupData.botMode || 'all'

    if (!mode) {
        let modeList = ''
        for (const [key, val] of Object.entries(MODES)) {
            const isCurrent = key === currentMode ? ' ⬅️' : ''
            modeList += `┃ \`${m.prefix}botmode ${key}\`${isCurrent}\n`
            modeList += `┃ └ ${val.desc}\n`
        }

        return m.reply(
            `🔧 *ʙᴏᴛ ᴍᴏᴅᴇ*\n\n` +
            `> Mode saat ini: *${currentMode.toUpperCase()}* (${MODES[currentMode]?.name || 'Unknown'})\n` +
            `\n╭─「 📋 *ᴘɪʟɪʜᴀɴ* 」\n` +
            `${modeList}` +
            `╰───────────────\n\n` +
            `> _Pengaturan per-grup_`
        )
    }

    if (!Object.keys(MODES).includes(mode)) {
        return m.reply(`❌ Mode tidak valid. Pilihan: \`${Object.keys(MODES).join(', ')}\``)
    }



    const newGroupData = {
        ...groupData,
        botMode: mode
    }

    db.setGroup(m.chat, newGroupData)
    db.save()

    m.react('✅')

    return m.reply(
        `✅ *ᴍᴏᴅᴇ ᴅɪᴜʙᴀʜ*\n\n` +
        `> Mode: *${mode.toUpperCase()}* (${MODES[mode].name})\n` +
        `> Grup: *${m.chat.split('@')[0]}*\n` +
        `\n\n> Ketik \`${m.prefix}menu\` untuk melihat menu.`
    )
}

function getGroupMode(chatJid, db) {
    const globalMode = db.setting('botMode') || 'all'
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
