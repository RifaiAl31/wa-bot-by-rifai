'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
// Jembatan config: plugin hasil port WhatsApp Bot memakai bentuk config yang sama dengan WhatsApp Bot,
// jadi cukup pakai ulang WhatsApp Bot/config.js (identitas bot, APIkey proxy, isOwner/isPremium, dll).
const __vxm0 = require("./config.e3.js"); const config = __vxDef(__vxm0); const { isOwner, isPremium, isPartner, isBanned, isSelf, getOwnerName, getConfig } = __vxm0;
const __vxDefault = config


Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => config });
Object.defineProperty(__vxExports, "isOwner", { enumerable: true, get: () => isOwner });
Object.defineProperty(__vxExports, "isPremium", { enumerable: true, get: () => isPremium });
Object.defineProperty(__vxExports, "isPartner", { enumerable: true, get: () => isPartner });
Object.defineProperty(__vxExports, "isBanned", { enumerable: true, get: () => isBanned });
Object.defineProperty(__vxExports, "isSelf", { enumerable: true, get: () => isSelf });
Object.defineProperty(__vxExports, "getOwnerName", { enumerable: true, get: () => getOwnerName });
Object.defineProperty(__vxExports, "getConfig", { enumerable: true, get: () => getConfig });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
