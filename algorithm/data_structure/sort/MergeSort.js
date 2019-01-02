/**
 * 时间复杂度 O(n*log n)
 * 空间复杂度 O(n)  空间翻倍
 * 是稳定的排序算法
 * 非原地排序算法
 */

// 归并排序 (归并)
let mergeArr = function(leftArr,rightArr){
    let result = [];
   // 当两边数组都还有值的时候，各去处第一个元素进行比较(最小的元素进行比较),不断取出放置，直到有一边的数组空了为止
    while(leftArr.length>0 && rightArr.length>0){
       if(leftArr[0]<rightArr[0]){
           result.push(leftArr.shift());
       }else{
           result.push(rightArr.shift());
       }
    }
    // 直接清空小数组
    while(leftArr.length>0){
        result.push(leftArr.shift());
    }
    // 直接清空大数组
    while(rightArr.length){
        result.push(rightArr.shift());
    }
    return result;
}

// 归并函数入口，也主要用于数组的拆分（拆分）
let mergeSort = function(array){
    let arr  = array;
    // 数组不可再被拆分
    if(arr.length<2){
        return arr;
    }
    let mid = Math.floor(arr.length/2);
    let leftArr = arr.slice(0,mid);
    let rightArr =  arr.slice(mid);
    // 合并结果
    return result = mergeArr(mergeSort(leftArr),mergeSort(rightArr));
}


module.exports = {
    mergeSort
}

