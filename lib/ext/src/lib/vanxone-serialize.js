'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxExports = {};
// Dipakai plugin qwa hanya kalau sock.store ada (WhatsApp Bot tidak memakainya), jadi cukup passthrough.
async function serialize(sock, msg) { return msg }
const __vxDefault = serialize

Object.defineProperty(__vxExports, "serialize", { enumerable: true, get: () => serialize });
Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
