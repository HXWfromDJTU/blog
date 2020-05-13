// moduleA.js
exports.x = '3';
console.log('4', require('./moduleB.js').x);
exports.x = '5';