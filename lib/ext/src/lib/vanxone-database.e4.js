'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
const __vxExports = {};
// getDatabase() -> instance database WhatsApp Bot yang SUDAH di-init (dipakai bersama engine 3, satu sumber data: database/vanxone/*.json).
// Sebelumnya file ini berisi class asli yang tidak pernah di-init -> error "Database belum diinisialisasi".
const __vxm0 = require("./vanxone-database.js"); __vxExports["getDatabase"] = __vxm0["getDatabase"]; __vxExports["initDatabase"] = __vxm0["initDatabase"]; __vxExports["Database"] = __vxm0["Database"];
const __vxm1 = require("./vanxone-database.js"); __vxExports["default"] = __vxDef(__vxm1);


Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
