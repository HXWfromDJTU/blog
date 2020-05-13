require('./module-imported')
require('./module-imported').tag = 'i have been imported'
const moduleImported = require('./module-imported')

console.log(require.cache)

console.log(moduleImported.tag)

module.exports = {
    name: 'index module'
}