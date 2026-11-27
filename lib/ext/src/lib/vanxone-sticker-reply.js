'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxExports = {};
// Optional sticker-reply hook. Kept deliberately safe: when no dedicated
// sticker-reply engine is configured, returning false lets normal command
// processing continue without throwing an import/runtime error.
async function handleStickerReply() {
  return false;
}

Object.defineProperty(__vxExports, "handleStickerReply", { enumerable: true, get: () => handleStickerReply });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
