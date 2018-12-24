let {binary_search_recursion,binary_search_while,binary_search_find_first} = require('./binary_search');

let arr = [11,13,14,15,67,789,678,985,999,1443,9987,111965,92625];

let arr2 = [11,22,33,33,33,44,555,555,555,666]
console.log(binary_search_recursion(11165,arr,0,arr.length-1))

console.log(binary_search_while(111965,arr,0,arr.length-1))

console.log(binary_search_find_first(555,arr2,0,arr2.length-1))