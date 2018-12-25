/* 
快速排序
最坏时间复杂度  O(n²)
平均时间复杂度  O(n * log n)
非稳定排序


*/
// 使用递归分而治之的思想进行快速排序
let  quickSort = function(arr){
    if(arr.length==0){
        return arr;
    }
    let leftArr = [];
    let rightArr = [];
    let keyValue = arr[0]; // 任意选择一个中间值
    for(let i=1;i<arr.length;i++){
        if(arr[i]>keyValue){
            rightArr.push(arr[i]); // 小的值放在左边的数组中
        }else{
            leftArr.push(arr[i]);
        }
    }
    // 假设左右数组已经有序，使用递归进行排序
    return [].concat(quickSort(leftArr),keyValue,quickSort(rightArr));
}


/*
优化点：
   1 三数取中法，每次都取集合的第一个数、最后一个数字、和中位数（下标在中间），通过覆盖所有的情况比较，取出三这者中真正的值大小的中间数。然后使用整个数字作为每一轮排序的 基准值 key
   2 当需要排列的数字少于13的时候（经过实践证明），使用插入排序的效率明显高于快速排序，所以当区间内容长度小于13的时候，我们转而使用插入排序
*/




module.exports ={
    quickSort
}