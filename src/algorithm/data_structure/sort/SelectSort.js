/**
 * 选择排序
 * 时间复杂度 O(n²)
 * 空间复杂度 O(1)
 * 非稳定排序 
 * 
 * 1️⃣ 和插入排序类似也是分为已排序部分和未排序部分
 * 2️⃣ 每一轮排序都找到未排序部分中最小的值，放到已排序部分的末尾
 * 3️⃣ 依次操作则可以得出结果
 * 
 */ 
let selectSort = function(array){
   let arr = array;
   let i,j;
   for(i=0;i<arr.length;i++){
       let j = i;
       // 暂定当前基准的下一个值为乱序中的最小值
       let minIndex = j;
       while(j<arr.length){
            // 不断寻找比最小值更小的值
            if(arr[minIndex]>arr[j]){
                minIndex = j;
            }
            j++;
       }
       // 将乱序中的最小值，塞到前半部分有序部分的最末尾。(两位置交换)
       let tmp = arr[i];
       arr[i] = arr[minIndex];
       arr[minIndex] = tmp;
   }
   return arr;
}


module.exports = {
    selectSort
}