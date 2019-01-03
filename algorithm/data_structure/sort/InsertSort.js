/* 
插入排序

时间复杂度：O(n²)
空间复杂度 O(1) 
稳定排序

步骤：
1⃣️ 带排序数组分为已排序部分和未排序部分，初始时已排序数组只有一个元素，然后剩下的都是未排序部分
2⃣️ 未排序部分每次往已排序部分里插入元素，并且是按照大小顺序进行插入，要保持已排序数组的有序性
3⃣️ 直到为排序数组为空
*/
function insertSort(array){
   let arr = array;
   let i;
   for(i=1;i<arr.length;i++){
       // 设定本轮基准
       let key = arr[i];
       // 以当前基准为起点，反向查找比基准值小或者等于的值，找到则插入这个位置，没有找到则不进行任何操作
       let j = i-1;
       // 若是没有找到合适的位置
       while(j>=0 && arr[j]>key){
           // 则不断让出位置
           arr[j+1] = arr[j];
           j--;
       }
       arr[j+1] = key;
   }
   return arr;
}

/** 
 * 插入排序的改进  --  希尔排序
 * 时间复杂度 O(n)
 */

let shellSort = function(arr){
    // 设置单位gap
    let gap =1;
    // 找到最适合的gap的最大值
    while(gap<arr.length/3){
        gap = gap * 3 +1;
    }
   // 执行过 gap为1的排序后，数组肯定为有序数组
   for(;gap>0;gap = Math.floor(gap/3)){
      for(let j=gap;j<arr.length;j+=1){ //遍历分组内元素 (重点....这一行)
        let current = arr[j]; // 找到准备插入的值
        let index = j - gap;  // 游标从准备插入值的前一位开始倒数
         while(index>=0 && arr[index]>current){  // 若一直到不到插入位置
             arr[index+gap] = arr[index]; //  则元素一直向后移动让开位置，注意这里的跨度 是gap
             index-=gap; // index值不断向前移动
         }
         arr[index+gap] = current; // 找到了插入位置，或者到了队头，则执行插入
      }
 } 
 return arr;
}
  
module.exports={
    insertSort,shellSort
}

