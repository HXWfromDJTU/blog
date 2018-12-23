let { ArrayList } =  require('./array.js');


let al = new ArrayList()

al.push(123);
al.push(456);
al.push(123);
al.push(456);
al.pop()

console.log(al.indexOf(123));
al.show()