// 排序方法跑马场

let {bubbleSort,bubbleSortOptimize} = require('./BubbleSort');
let {quickSort,quickSortOptimize}  = require('./QuickSort');
let {insertSort,shellSort}  = require('./InsertSort');
let {selectSort}  = require('./SelectSort');
let {mergeSort}  = require('./MergeSort');
let {countingSort}  = require('./CountSort');
let {bucketSort} = require('./BucketSort')

// 无序数组
let {messData,param} = require('./data')

console.log('一共有'+ param.num +'个数据进行排序,范围在 0到 '+ 10**7+' 之间')

//冒泡排序
var sortTime = (new Date()).getTime();
console.log("\n冒泡排序结果：")
bubbleSort(messData.concat());
sortTime = (new Date()).getTime() - sortTime;
console.log('所花时间：'+sortTime+'ms'); 

// 冒泡排序优化后
var sortTime = (new Date()).getTime();
console.log("\n冒泡排序优化结果：")
bubbleSortOptimize(messData.concat());
sortTime = (new Date()).getTime() - sortTime;
console.log('所花时间：'+sortTime+'ms'); 



// 快速排序
sortTime = (new Date()).getTime();
console.log("\n快速排序结果：")
quickSort(messData.concat(),0,messData.length-1);
sortTime = (new Date()).getTime() - sortTime;
console.log('所花时间：'+sortTime+'ms'); 

// // 快速排序优化
// sortTime = (new Date()).getTime();
// console.log("\n快速排序优化后结果：")
// console.log(quickSortOptimize(messData.concat(),0,messData.length-1))
// sortTime = (new Date()).getTime() - sortTime;
// console.log('所花时间：'+sortTime+'ms'); 



// 插入排序
sortTime = (new Date()).getTime();
console.log("\n插入排序结果：")
insertSort(messData.concat());
sortTime = (new Date()).getTime() - sortTime;
console.log('所花时间：'+sortTime+'ms'); 

// 希尔排序
sortTime = (new Date()).getTime();
console.log("\n希尔排序结果：")
shellSort(messData.concat());
sortTime = (new Date()).getTime() - sortTime;
console.log('所花时间：'+sortTime+'ms'); 


// 选择排序
sortTime = (new Date()).getTime();
console.log("\n选择排序结果：");
selectSort(messData.concat())
sortTime = (new Date()).getTime() - sortTime;
console.log('所花时间：'+sortTime+'ms'); 



// 归并排序
sortTime = (new Date()).getTime();
console.log("\n归并排序结果：");
mergeSort(messData.concat());
sortTime = (new Date()).getTime() - sortTime;
console.log('所花时间：'+sortTime+'ms'); 


// 计数排序
sortTime = (new Date()).getTime();
console.log("\n计数排序结果：");
countingSort(messData.concat(),10**param.pow);
sortTime = (new Date()).getTime() - sortTime;
console.log('所花时间：'+sortTime+'ms'); 



// 桶排序
sortTime = (new Date()).getTime();
console.log("\n桶排序结果：");
bucketSort(messData.concat(),200);
sortTime = (new Date()).getTime() - sortTime;
console.log('所花时间：'+sortTime+'ms'); 
