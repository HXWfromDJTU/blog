## 排序


线性排序

小规模排序

O n * log N

分区点的选择

需要考虑数据的特点


最坏情况 O(n<sup>2</sup>)

选择分区点：
随机法

快速排序，使用的是递归来实现的
限制递归深度，超过则

qSort
源码实现
多种排序进行组合操作

时间复杂度并不会代表代码运行的时间
![](/blog_assets/sort.png)
### 冒泡排序
时间复杂度 
最坏：O(n<sup>2</sup>)
最好：O(n)
平均：O(n<sup>2</sup>)

空间复杂度：O(1) 原地排序
稳定性：稳定排序
```js
// 基础冒泡排序
funtion bubble(arr){
    let len = arr.length; 
    for(let i=0;i<len;i++){
        for(let j = i+1; j<len;j++){
            // 
            if(arr[j]>arr[i]){
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}
```
优化点：
1⃣️ 若某一轮已经没有冒泡操作则证明，整个数组已经达到有序状态
2⃣️ 记录一轮中最后一次发生冒泡的位置，并且下轮冒泡时的终止位置设置为该点，减少无用循环
3⃣️ 每次正向冒泡之后，立刻反向冒泡

### 快速排序
最坏时间复杂度  O(n<sup>2</sup>)
平均时间复杂度  O(n * log n)
非稳定排序
```js
fucntion quickSort(arr){
    // 若数组长度为1，则不需要排序
   if(arr.length == 0){
       return arr;
   }
   let leftArr = []; //左容器
   let rightArr = []; //右容器
   let key = arr[0] // 设立基准值
   for(let i=0;i<arr.length;i++){
       if(arr[i]>key){
           rightArr.push(arr[i])
       }else{
           leftArr.push(arr[i])
       }
   }
   // 递归分治的想法去解决子集数组
   return [].concat(qucikSort(leftArr),[key],quickSort(rightArr));
}
```
优化点：
1⃣️ 三数取中法，每次都取集合的第一个数、最后一个数字、和中位数（下标在中间），通过覆盖所有的情况比较，取出三这者中真正的值大小的中间数。然后使用整个数字作为每一轮排序的 基准值 key
2⃣️当需要排列的数字少于13的时候（经过实践证明），使用插入排序的效率明显高于快速排序，所以当区间内容长度小于13的时候，我们转而使用插入排序  
3️⃣ 随机法
随机选择分区点 

### 插入排序
1⃣️ 带排序数组氛围已排序部分和未排序部分，初始时已排序数组只有一个元素，然后剩下的都是未排序部分
2⃣️ 未排序部分每次往已排序部分呢插入元素，并且是按照大小顺序进行插入，要保持已排序数组的有序性
3⃣️ 直到为排序数组为空
![](/blog_assets/insertSort.gif)

```js
// 插入排序
insertSort(arr){
  let len = arr;
  // 若长度为1，则无需排序
  if(len==1){
      return arr;
  }
  // 正向循环取出数字作为每一轮的基准数字（也就是用于插入的数字）
  for(let i =0;i<len;i++){
      let key = arr[i];
      // 设定反向遍历的起点
      let j = i-1;
      while(j>0 && arr[j]>key){
          arr[j+1] = arr[j]; // 数字向后移动，让出插入位置
          j --; //游标向前移动
      }
      arr[j] = key;  //插入数字
  }
  // 返回结果
  return arr;
}

```
优化点
1⃣️
2⃣️

### 归并排序



### 选择排序



### 计数排序
1⃣️ 计算出最大最小数字之差，确定计数范围
2⃣️ 创建好适应上述大小的容器，称之为计数容器 C，并且每个元素的value初始化为0
3⃣️ 遍历需要排序的数组，并使用遍历元素作为计数容器C的key，value为出现次数，也就是每便利到对应的一个值就++1；
4⃣️ 最后使用一个result数组容器盛放结果，对计数容器C进行遍历，循环条件是当前key对应的value不为0，此时的key其实就是我们需要进行排序的元素，每次将key输出到result之后，对应的value就自减 1，意思为出现的次数减1.
```java
// 计数排序，a 是数组，n 是数组大小。假设数组中存储的都是非负整数。
public void countingSort(int[] a, int n) {
  if (n <= 1) return;

  // 查找数组中数据的范围
  int max = a[0];
  for (int i = 1; i < n; ++i) {
    if (max < a[i]) {
      max = a[i];
    }
  }

  int[] c = new int[max + 1]; // 申请一个计数数组 c，下标大小 [0,max]
  for (int i = 0; i <= max; ++i) {
    c[i] = 0;
  }

  // 计算每个元素的个数，放入 c 中
  for (int i = 0; i < n; ++i) {
    c[a[i]]++;
  }

  // 依次累加
  for (int i = 1; i <= max; ++i) {
    c[i] = c[i-1] + c[i];
  }

  // 临时数组 r，存储排序之后的结果
  int[] r = new int[n];
  // 计算排序的关键步骤，有点难理解
  for (int i = n - 1; i >= 0; --i) {
    int index = c[a[i]]-1;
    r[index] = a[i];
    c[a[i]]--;
  }

  // 将结果拷贝给 a 数组
  for (int i = 0; i < n; ++i) {
    a[i] = r[i];
  }
}

```

```js
function countingSort(iArr, max) {
// 统计长度
var n = iArr.length;
// 设置结果集
var oArr = [];
// 创建长度max的数组，填充0
var C = [];
for(var i = 0; i <= max; i++){
C[i] = 0;
}
// 遍历输入数组，填充C
for(var j = 0; j < n; j++){
C[iArr[j]]++;
}
// 遍历C，输出数组
for(var k = 0; k <= max; k++){
// 按顺序将值推入输出数组，并在比较后将对应标志位减1
while(C[k]-- > 0){ // 巧妙利用 while将对应key的所有数字都输出，不会出现重复数字只输出一个的问题
oArr.push(k);
}
}
return oArr;
}
```
![](/blog_assets/counting_sort.png)
### 桶排序
1⃣️ 计算数组内最大值与最小值的差值，并根据桶的数目计算出每个桶的大小
2⃣️ 依次创建每个桶的数据结构，使用取整的方式，决定降数字放入桶中
3⃣️ 每个桶中第二次放入数据的时候，需要将数据插入到从小到大排序的相应位置（也就是说桶中始终需要保持一个有序性）
4⃣️ 最后将所有桶合并起来

### 基数排序
```js
function radixSort(arr,maxDigit){
    let mod = 10; 
    let dev = 1;
    // 利用 mod抹平差异，利用 dev 进行分桶
    // 每一轮的基数不断在增大，第一轮为 1 ，mod和
    for(let i = 0;i < maxDigit;i++,dev *=10,mod *=10){
        // 多次循环分桶
        for(let j=0;j<arr.length;j++){
          let bucket = parseInt((arr[j] % mod) / dev);
          if(counter[bucket] = null){
              counter[bucket] = [arr[j]]
          }
        }
        
        let pos = 0;
        for( let x =0;x<count.length;x++){
            let value = null;
            if(counter[j] != null){
                while((value = counter[x].shift())!=null){
                    arr[pos++] = value;
                }
            }
        }   
    }
    return arr;
}
```

这三种排序算法都利用了桶的概念，所有算法内部都并不设计元素间的比较，但对桶的使用方法上有明显差异：
1⃣️ 基数排序：根据键值的每位数字来分配桶
2⃣️ 计数排序：每个桶只存储单一键值
3⃣️ 桶排序：每个桶存储一定范围的数值






### 排序优化
qsort    STL sort()
大规模数据

小规模数据
O(n * logN)

归并排序的使用，特点是并不是原地排序，需要额外占用空间。
快速排序不够稳定，时间会被退化成 O(n<sup>2</sup>)

分区点的选择，将中间值选择为分区点的方法，会更加合理。
三数字取中，五数取中

qsort综合了归并排序和快速排序，数据小的时候自动使用归并排序，数据大的时候使用快速排序。
时间复杂度表示的是时间增长的趋势，并不是代码实际执行的时间。

哨兵节点的技巧在qsort中的使用

合理选择分区点 和 避免递归过深

### 线性排序
非基于比较
###### 桶排序
需要十分容易分到多个桶中，桶内基本不需要再排序，
时间复杂度可以第一 o n* log n
10 GB订单数据
扫描数据边界，设置桶的大小
针对数据

###### 计数排序
计数排序可以看成是桶排序的一种特殊情况