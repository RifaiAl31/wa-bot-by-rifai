'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
// getDatabase() -> basis data WhatsApp Bot asli (users/groups/settings/stats/sewa/owner, koin/energi/exp/level, cooldown, dst).
// Kode asli ada di vanxone-database-core.js (hanya lowdb diganti vanxone-minilow.js). Data disimpan di database/vanxone/*.json.
// Kompatibel dengan plugin lama: db.db.data.characterai tetap tersedia (disimpan di database/vanxone.json).
const path = __vxDef(require("path"));
const { createRequire } = require("module");
const { Database } = require("./vanxone-database-core.js");


const inst = new Database(path.resolve(process.cwd(), 'database', 'WhatsApp Bot'))
Promise.resolve(inst.init()).catch((e) => console.log('[ext]', e && e.message))
try {
  const legacy = require("../../../jstore.js").open('WhatsApp Bot', { users: {}, groups: {}, characterai: {} })
  if (!Object.getOwnPropertyDescriptor(inst.db.data, 'characterai')) {
    Object.defineProperty(inst.db.data, 'characterai', { enumerable: false, configurable: true, get: () => legacy.data.characterai || (legacy.data.characterai = {}) })
  }
  const origSave = inst.save.bind(inst)
  inst.save = async () => { legacy.save(); return origSave() }
} catch {}

function getDatabase() { return inst }
async function initDatabase() { return inst }

const __vxDefault = getDatabase

Object.defineProperty(__vxExports, "getDatabase", { enumerable: true, get: () => getDatabase });
Object.defineProperty(__vxExports, "initDatabase", { enumerable: true, get: () => initDatabase });
Object.defineProperty(__vxExports, "Database", { enumerable: true, get: () => Database });
Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
