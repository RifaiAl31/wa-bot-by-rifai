'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
const moment = __vxDef(require("moment-timezone"));
const TIMEZONE = 'Asia/Jakarta'

moment.locale('id')

function now() {
    return moment.tz(TIMEZONE)
}

function formatTime(format = 'HH:mm:ss') {
    return moment.tz(TIMEZONE).format(format)
}

function formatDate(format = 'DD-MM-YYYY') {
    return moment.tz(TIMEZONE).format(format)
}

function formatDateTime(format = 'DD-MM-YYYY HH:mm:ss') {
    return moment.tz(TIMEZONE).format(format)
}

function formatFull(format = 'dddd, DD MMMM YYYY HH:mm:ss') {
    return moment.tz(TIMEZONE).format(format)
}

function getHour() {
    return parseInt(moment.tz(TIMEZONE).format('HH'), 10)
}

function getMinute() {
    return parseInt(moment.tz(TIMEZONE).format('mm'), 10)
}

function getCurrentTimeString() {
    return moment.tz(TIMEZONE).format('HH:mm')
}

function fromTimestamp(timestamp, format = 'DD-MM-YYYY HH:mm:ss') {
    return moment(timestamp).tz(TIMEZONE).format(format)
}

function getLocalDateObject() {
    return moment.tz(TIMEZONE).toDate()
}


Object.defineProperty(__vxExports, "now", { enumerable: true, get: () => now });
Object.defineProperty(__vxExports, "formatTime", { enumerable: true, get: () => formatTime });
Object.defineProperty(__vxExports, "formatDate", { enumerable: true, get: () => formatDate });
Object.defineProperty(__vxExports, "formatDateTime", { enumerable: true, get: () => formatDateTime });
Object.defineProperty(__vxExports, "formatFull", { enumerable: true, get: () => formatFull });
Object.defineProperty(__vxExports, "getHour", { enumerable: true, get: () => getHour });
Object.defineProperty(__vxExports, "getMinute", { enumerable: true, get: () => getMinute });
Object.defineProperty(__vxExports, "getCurrentTimeString", { enumerable: true, get: () => getCurrentTimeString });
Object.defineProperty(__vxExports, "fromTimestamp", { enumerable: true, get: () => fromTimestamp });
Object.defineProperty(__vxExports, "getLocalDateObject", { enumerable: true, get: () => getLocalDateObject });
Object.defineProperty(__vxExports, "TIMEZONE", { enumerable: true, get: () => TIMEZONE });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
