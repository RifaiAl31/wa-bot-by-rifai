// Configure Vercel deployment access.
module.exports = require('../../lib/adapter/e9.js').plugin("vercel/setvercel", {"command":["setvercel"],"category":"tools","desc":"Configure Vercel deployment access","usage":".setvercel <token> [teamId]"})
