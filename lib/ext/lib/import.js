'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxExports = {};
// Shim WhatsApp Bot: buttons-send.js milik WhatsApp Bot meng-import '../import.js' (import global WhatsApp Bot yang berat).
// Di WhatsApp Bot cukup menyediakan global yang dipakai helper pengirim.
const polls = {}
if (typeof global.getPollCommands !== 'function') global.getPollCommands = () => polls



Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
