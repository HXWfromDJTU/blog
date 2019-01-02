/* 
插入排序

时间复杂度：O(n²)
空间复杂度 O(1) 
稳定排序

步骤：
1⃣️ 带排序数组分为已排序部分和未排序部分，初始时已排序数组只有一个元素，然后剩下的都是未排序部分
2⃣️ 未排序部分每次往已排序部分呢插入元素，并且是按照大小顺序进行插入，要保持已排序数组的有序性
3⃣️ 直到为排序数组为空
*/

function insertSort(array){
   let arr = array;
   let i,j;
   for(i=1;i<arr.length;i++){
       // 设定本轮基准
       let key = arr[i];
       // 以当前基准为起点，反向查找比基准值小或者等于的值，找到则插入这个位置，没有找到则不进行任何操作
       let j = i-1;
       while(j>=0 && arr[j]>key){
           arr[j+1] = arr[j];
           j--;
       }
       arr[j+1] = key;
   }
   return arr;
}

module.exports={
    insertSort
}

