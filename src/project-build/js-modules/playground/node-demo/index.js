const moduleA = require('module-imported')
const moduleB = require('../node_modules/module-imported')
moduleA.tag = 'moduleA tagged'
moduleB.tag = 'moduleB tagged'

console.log(require.cache)

console.log(moduleA.tag)
console.log(moduleB.tag)

module.exports = {
    name: 'index module'
}
