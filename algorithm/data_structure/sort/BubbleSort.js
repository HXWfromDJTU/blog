/* 冒泡排序算法
  时间复杂度 
     最坏：O(n²)
     最好：O(n²）
     平均：O(n²)
空间复杂度：O(1) 原地排序
稳定性：稳定排序
 */
let bubbleSort = function(arr){
   let i = 0;
   let j = 0;
   for(i;i<arr.length;i++){
       for(j=0;j<arr.length-1-i;j++){
           if(arr[j]>arr[j+1]){
              [arr[j],arr[j+1]] = [arr[j+1],arr[j]];
           }
       }
   }
   return arr;
}
/**
 * 
优化点：
 1 若某一轮已经没有冒泡操作则证明，整个数组已经达到有序状态
 2 记录一轮中最后一次发生冒泡的位置，并且下轮冒泡时的终止位置设置为该点，减少无用循环
 3 每次正向冒泡之后，立刻反向冒泡
 */

 let bubbleSortOptimize = function(arr){
      let i,j;
      for(i=0;arr.length;i++){
          let flag=false; // 每一次内循环前，都将flag置为false
          let lastSwapPos = arr.length - 1 -i;
          for(j=0;j<lastSwapPos;j++){
              if(arr[j]>arr[j+1]){
                  flag = true;  // 触动标志      
                  [arr[j],arr[j+1]] = [arr[j+1],arr[j]];
              }   
          }
          lastSwapPos = j; // 记录最后一次发生交换的位置
          if(!flag) break; // 若已经没有任何一个交换操作，说明已经有序
      }
      return arr;
 }


module.exports = {
    bubbleSort,
    bubbleSortOptimize
}