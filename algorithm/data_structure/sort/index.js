// 排序方法跑马场

let {bubbleSort} = require('./BubbleSort');
let {quickSort}  = require('./QuickSort');
// 无序数组
let arr = [11,334,53,24,567,23,67,34545,7783,124];
console.log(bubbleSort(arr.concat()))

console.log(quickSort(arr.concat()))