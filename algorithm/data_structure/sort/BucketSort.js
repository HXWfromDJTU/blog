/**
 * 桶排序
 * 
 * 时间复杂度 O(n)
 * 非原地排序
 * 是稳定排序
 * 适用场景：
 * 1️⃣ 
 * 
 * 实现步骤：
 * 1⃣️ 计算数组内最大值与最小值的差值，并根据桶的数目计算出每个桶的大小
 * 2⃣️ 依次创建每个桶的数据结构，使用取整的方式，决定降数字放入桶中
 * 3⃣️ 每个桶中第二次放入数据的时候，需要将数据插入到从小到大排序的相应位置（也就是说桶中始终需要保持一个有序性）
 * 4⃣️ 最后将所有桶合并起来
 */

 /**
  * 桶排序算法
  * @param {*} arr 需要排序的数组
  * @param {*} bucketSize 桶的大小
  */
 let bucketSort = function(arr,bucketSize){
      let len = arr.length;
      let size = bucketSize; // 桶的大小
      let max=arr[0],min=arr[0]; // 元素的范围
      // 遍历找到最大最小值
      for(let i=0;i<len;i++){
         if(arr[i]>max){
             max =arr[i];
         }else{
             min = arr[i];
         }
      }
      let bucketNum = Math.floor(((max-min)/size)); // 桶的数量 
      let container = new Array(bucketNum); // 装桶的大容器 
      // 元素放入桶中
      for(let i=0;i<len;i++){
          let bucketIndex = Math.floor(arr[i]/size);
          let bucket = container[bucketIndex];
          // 判断该桶中是否有元素
          if(!bucket){
               container[bucketIndex] = [arr[i]]; // 初始存入元素
          }else{
               // 现将元素直接插入桶末尾
               bucket[bucket.length] = arr[i];
               // 然后排序，使用插入排序，保持桶内始终有序 
               for(let j=1;j<bucket.length;j++){
                  let item = bucket[j]; // 准备插入的元素值
                  let index = j-1;
                  while(index>=0 && bucket[index]>item){
                      bucket[index+1]  = bucket[index];
                      index --;
                  }
                  bucket[index+1] = item;
               }
               // 将插入并排序后的桶放回容器中
               container[bucketIndex] = bucket;
          }
      }
      
      // 链接所有的桶
      let result = [];
      for(let i=0;i<container.length;i++){
          result = result.concat(container[i]);
      }
      return result;
 }


 module.exports= {
    bucketSort
 }