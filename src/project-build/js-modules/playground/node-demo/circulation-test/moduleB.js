// moduleB.js
exports.x = '6';
console.log('7', require('./moduleA.js').x);
exports.x = '8';