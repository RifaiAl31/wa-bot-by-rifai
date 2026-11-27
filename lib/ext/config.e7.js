'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
// Jembatan config: plugin hasil port WhatsApp Bot memakai bentuk config yang sama dengan WhatsApp Bot,
// jadi cukup pakai ulang config.e3.js (identitas bot, APIkey proxy, dan fungsi owner).
const __vxm0 = require("./config.e3.js"); const config = __vxDef(__vxm0); const { isOwner, isPartner, isBanned, isSelf, getOwnerName, getConfig } = __vxm0;
const __vxDefault = config

// nama lama yang dipakai beberapa fitur WhatsApp Bot (sebelumnya tidak diekspor -> fitur gagal dimuat)
const BOT_CORE_CONFIG = config
const BOT_DEVELOPER = (config && config.bot && (config.bot.developer || config.bot.author)) || 'Owner Bot'

Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => config });
Object.defineProperty(__vxExports, "isOwner", { enumerable: true, get: () => isOwner });
Object.defineProperty(__vxExports, "isPartner", { enumerable: true, get: () => isPartner });
Object.defineProperty(__vxExports, "isBanned", { enumerable: true, get: () => isBanned });
Object.defineProperty(__vxExports, "isSelf", { enumerable: true, get: () => isSelf });
Object.defineProperty(__vxExports, "getOwnerName", { enumerable: true, get: () => getOwnerName });
Object.defineProperty(__vxExports, "getConfig", { enumerable: true, get: () => getConfig });
Object.defineProperty(__vxExports, "BOT_CORE_CONFIG", { enumerable: true, get: () => BOT_CORE_CONFIG });
Object.defineProperty(__vxExports, "BOT_DEVELOPER", { enumerable: true, get: () => BOT_DEVELOPER });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
