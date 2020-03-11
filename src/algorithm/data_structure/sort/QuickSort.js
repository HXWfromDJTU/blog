/* 
快速排序
最坏时间复杂度  O(n²)
平均时间复杂度  O(n * log n)
非稳定排序   因为分区的过程中涉及到元素的交换操作，所以快排不是一个稳定的排序算法
是原地排序算法


与归并排序的比较；归并排序是没有keyValue基准值的，而快排的核心就是取出一个基准值，并以基准值作为核心去拆分
*/
// 使用递归分而治之的思想进行快速排序
let  quickSort = function(arr,low,high){
    let partitionIndex;
    let left = low;
    let right = high;
    // 递归终止条件是 左右数组大小都小于1
    if(left<right){
        // 获取分区点
        partitionIndex = partition(arr,left,right);
        //(此时左边数组是小于分区点，右边是大于分区点)
        quickSort(arr,left,partitionIndex-1<left?left:partitionIndex-1);
        quickSort(arr,partitionIndex+1>right?right:partitionIndex+1,right);
    }
    return arr;
}
// 获取分区点，并且原地将元素按照分区点左右分好
let partition = function(arr,left,right){
    let keyIndex = left; // 默认取第一个元素为基准
    let index = keyIndex+1; // 取基准值的下一个元素，作为准备替换的位置
    for(let i=index;i<=right;i++){
        if(arr[i]<arr[keyIndex]){
            [arr[i],arr[index]] = [arr[index],arr[i]];// 若便利到比基准值小的元素，则排放到基准值右侧
             index++; // 存放位置向右移动
        }
    }
    // 将基准值放到最后划分的位置
    //  (注意当前 index已经是指向了大于基准值的一个元素，所以index要自减)
    [arr[keyIndex],arr[index-1]] = [arr[index-1],arr[keyIndex]];
    return index-1;
}

/*
优化点：
   1 三数取中法，每次都取集合的第一个数、最后一个数字、和中位数（下标在中间），通过覆盖所有的情况比较，取出三这者中真正的值大小的中间数。然后使用整个数字作为每一轮排序的 基准值 key
   2 当需要排列的数字少于13的时候（经过实践证明），使用插入排序的效率明显高于快速排序，所以当区间内容长度小于13的时候，我们转而使用插入排序
*/

let quickSortOptimize = function(arr,low,high){
   let partitionIndex;
   let left=low;
   let right = high;
   if(left<right){
       partitionIndex = partitionOptimize(arr,left,right);
       quickSortOptimize(arr,left,partitionIndex-1<left?left:partitionIndex-1);
       quickSortOptimize(arr,partitionIndex+1>right?right:partitionIndex,right);
   }
   return arr;
}

let  partitionOptimize =  function(arr,left,right){
    // 三数去中法获取基准值
    let isOptimize =(right-left>3)
    let keyValue = isOptimize?getMidPosValue(arr,left,right):arr[left];
    let keyIndex = isOptimize?null:left;
    // 从左开始存放
    let index = left; 
    for(let i=index;i<=right;i++){
     if(arr[i]<=keyValue){
         [arr[i],arr[index]] = [arr[index],arr[i]]; //位置交换
         index++;
         // 记录基准值位置
         if(arr[i]==keyValue) keyIndex=i;
     }
    }
    // 矫正基准值位置
    [arr[keyIndex],arr[index]] = [arr[index],arr[keyIndex]];
    return index;
}


// 获得中位值(暂定默认为三数取中)
let getMidPosValue = function(arr,left,right){
    console.log(left,right)
    let keyArr = [arr[left],arr[right],arr[left+Math.floor((right-left)/2)]];
    for(let i=left;i<=right;i++){
        for(let j=left;j<=right-i-1;j++){
          if(keyArr[j]>keyArr[j+1]){
              [keyArr[j],keyArr[j+1]] = [keyArr[j+1],keyArr[j]];
          }
        }
    }
    console.log(keyArr[Math.floor(keyArr.length/2)])
    return keyArr[Math.floor(keyArr.length/2)];
}




module.exports ={
    quickSort,quickSortOptimize
}