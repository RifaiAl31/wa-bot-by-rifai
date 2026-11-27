'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
const __vxExports = {};
// engine3 + decodeJid (tambahan)
const { jidDecode } = require("@whiskeysockets/baileys");
Object.assign(__vxExports, __vxNs(require("./vanxone-serialize.js")));
const __vxm1 = require("./vanxone-serialize.js"); __vxExports["default"] = __vxDef(__vxm1);
function decodeJid(jid) {
  if (!jid) return jid
  if (/:\d+@/gi.test(jid)) {
    const d = jidDecode(jid) || {}
    return (d.user && d.server && d.user + '@' + d.server) || jid
  }
  return jid
}

Object.defineProperty(__vxExports, "decodeJid", { enumerable: true, get: () => decodeJid });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
