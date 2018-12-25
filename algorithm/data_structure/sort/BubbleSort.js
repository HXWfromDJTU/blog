/* 冒泡排序算法
  时间复杂度 
     最坏：O(n²)
     最好：O(n²）
     平均：O(n²)
空间复杂度：O(1) 原地排序
稳定性：稳定排序

优化点：
 1 若某一轮已经没有冒泡操作则证明，整个数组已经达到有序状态
 2 记录一轮中最后一次发生冒泡的位置，并且下轮冒泡时的终止位置设置为该点，减少无用循环
 3 每次正向冒泡之后，立刻反向冒泡
 */
let bubbleSort = function(arr){
   let i = 0;
   let j = 0;
   for(i;i<arr.length;i++){
       for(j=i+1;j<arr.length;j++){
           if(arr[i]>arr[j]){
              [arr[i],arr[j]] = [arr[j],arr[i]];
           }
       }
   }
   return arr;
}

module.exports = {
    bubbleSort
}