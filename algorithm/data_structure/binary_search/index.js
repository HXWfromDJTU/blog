let {binary_search_recursion,binary_search_while} = require('./binary_search');

let arr = [11,13,14,15,67,789,678,985,999,1443,9987,111965,92625];


//console.log(binary_search_recursion(11165,arr,0,arr.length-1))

console.log(binary_search_while(111965,arr,0,arr.length-1))