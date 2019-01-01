// 选择排序

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