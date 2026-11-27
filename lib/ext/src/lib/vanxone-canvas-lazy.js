'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxExports = {};
/**
 * @napi-rs/canvas dimuat saat pertama kali dipakai, bukan saat plugin di-import.
 * Dipakai sebagai pengganti: import { createCanvas, loadImage, GlobalFonts } from "../../src/lib/vanxone-canvas-lazy.js"
 */
const { createRequire } = require("module");


let _mod;
const lib = () => (_mod ??= require("@napi-rs/canvas"));

const createCanvas = (...args) => lib().createCanvas(...args);
const loadImage = (...args) => lib().loadImage(...args);
const GlobalFonts = new Proxy(
  {},
  {
    get: (_t, prop) => {
      const v = lib().GlobalFonts[prop];
      return typeof v === "function" ? v.bind(lib().GlobalFonts) : v;
    },
  },
);

// Pengganti `import * as _canvas from "@napi-rs/canvas"`: namespace dimuat saat pertama diakses
// (mis. `const { createCanvas, Path2D } = _canvas` di dalam handler).
const canvasNs = new Proxy(
  {},
  {
    get: (_t, prop) => {
      const v = lib()[prop];
      return typeof v === "function" && !/^[A-Z]/.test(String(prop)) ? v.bind(lib()) : v;
    },
    has: (_t, prop) => prop in lib(),
  },
);

Object.defineProperty(__vxExports, "createCanvas", { enumerable: true, get: () => createCanvas });
Object.defineProperty(__vxExports, "loadImage", { enumerable: true, get: () => loadImage });
Object.defineProperty(__vxExports, "GlobalFonts", { enumerable: true, get: () => GlobalFonts });
Object.defineProperty(__vxExports, "canvasNs", { enumerable: true, get: () => canvasNs });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
