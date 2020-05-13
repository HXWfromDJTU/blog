const moduleA = require('./moduleA')

console.log('before', moduleA.innerValue) // before innerValue

moduleA.changeInnverValue()

console.log('after', moduleA.innerValue) // after innerValue

setTimeout(() => {
    console.log('after timmer', moduleA.innerValue) // after timmer innerValue
}, 3000)