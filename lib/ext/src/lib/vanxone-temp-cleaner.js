'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
const fs = __vxDef(require("fs"));
const path = __vxDef(require("path"));
const { logger } = require("./vanxone-logger.e7.js");
const CLEAN_INTERVAL = 30 * 60 * 1000
const TEMP_DIRS = ['temp', 'tmp']

let cleanerTimer = null

function startTempCleaner() {
    if (cleanerTimer) return

    cleanerTimer = setInterval(() => {
        let totalCleaned = 0
        for (const dir of TEMP_DIRS) {
            const dirPath = path.join(process.cwd(), dir)
            if (!fs.existsSync(dirPath)) continue

            try {
                const files = fs.readdirSync(dirPath)
                for (const file of files) {
                    try {
                        fs.unlinkSync(path.join(dirPath, file))
                        totalCleaned++
                    } catch {}
                }
            } catch {}
        }
        if (totalCleaned > 0) {
            logger.system('temp', `cleaned ${totalCleaned} file(s)`)
        }
    }, CLEAN_INTERVAL)

    if (cleanerTimer.unref) cleanerTimer.unref()
    logger.success('temp', `Bakal bersih-bersih file tiap ${CLEAN_INTERVAL / 60000} menit`)
}

function stopTempCleaner() {
    if (cleanerTimer) {
        clearInterval(cleanerTimer)
        cleanerTimer = null
    }
}


Object.defineProperty(__vxExports, "startTempCleaner", { enumerable: true, get: () => startTempCleaner });
Object.defineProperty(__vxExports, "stopTempCleaner", { enumerable: true, get: () => stopTempCleaner });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
