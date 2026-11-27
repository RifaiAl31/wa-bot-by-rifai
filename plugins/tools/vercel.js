// Vercel deployment management commands.
module.exports = require('../../lib/adapter/e9.js').plugin("vercel/vercel", {"command":["adddomain", "addsub", "deldomain", "delvercel", "deployvercel", "envvercel", "gantidomain", "listdomain", "listvercel", "redeployvercel"],"category":"tools","desc":"Manage Vercel deployments","usage":".deployvercel <name>"})
