'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
const Builder = __vxDef(require("../../MessageBuilder.js"));

const { AIRich } = Builder

async function sendSocialMedia(conn, jid, quoted) {
    const pp = /^https?:\/\//.test(String(global.thumbnail || '')) ? global.thumbnail : ''
    const socials = [
        { subtitle: 'WhatsApp Channel', url: global.saluran, source: 'WHATSAPP', caption: 'WhatsApp Bot' },
        { subtitle: 'Telegram', url: global.tele, source: 'TELEGRAM', caption: 'Telegram' },
        {
            subtitle: 'Instagram',
            url: global.ig ? `https://instagram.com/${String(global.ig).replace(/^@/, '')}` : '',
            source: 'INSTAGRAM',
            caption: 'Instagram'
        }
    ].filter(({ url }) => /^https?:\/\//i.test(String(url || '')))
    if (!socials.length) return false
    const card = (title, subtitle, caption, url, source) => ({
        username: title,
        profile_url: pp,
        title,
        subtitle,
        caption,
        verified: true,
        url,
        thumbnail: pp,
        source,
        footer: subtitle,
        deeplink: url,
        icon: pp,
        orientation: 'LANDSCAPE',
        post_type: 'PHOTO',
        like: 0,
        comment: 0,
        share: 0
    })

    return await new AIRich(conn)
        .addPost(socials.map(({ subtitle, url, source, caption }) => card(global.namebot || 'WhatsApp Bot', subtitle, caption, url, source)))
        .send(jid, { quoted })
}
Object.defineProperty(__vxExports, "sendSocialMedia", { enumerable: true, get: () => sendSocialMedia });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
