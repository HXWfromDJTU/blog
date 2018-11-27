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
   return [].concat(qucikSort(leftArr),[q],quickSort(rightArr));
}
```
优化点：
1⃣️ 三数取中法，每次都取集合的第一个数、最后一个数字、和中位数（下标在中间），通过覆盖所有的情况比较，取出三这者中真正的值大小的中间数。然后使用整个数字作为每一轮排序的 基准值 key
2⃣️当需要排列的数字少于13的时候（经过实践证明），使用插入排序的效率明显高于快速排序，所以当区间内容长度小于13的时候，我们转而使用插入排序


### 插入排序
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


### 计数排序
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

### 基数排序