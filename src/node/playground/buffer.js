let fs = require('fs')

let data = fs.readFileSync(__dirname + '/test.txt', 'utf8')
console.log(data)

let data2 = fs.readFile(__dirname + '/test.txt', data => {
  console.log(data)
})
