# 常用算法的JS实现

## 排序算法
### 1、冒泡排序
* 复杂度：O(N2)
```js
function(arr){
   var i =0,j=0;
   //外层用于移动检索起点
   for(i= 1;i<arr.length;i++){
       //内层用于从起点开始，后面的元素两两比较
       for(j=0; j<arr.length- i; i++){
           var temp = 0;
           //假若前一项大于后一项，则进行位置调换
           if(arr[j]>arr[j+1]){
               temp = arr[j];
               arr[j] = arr[j+1];
               arr[j+1] = temp;
           }
       }
   }   
}
```
### 2、快速排序
[原理分析](https://blog.csdn.net/yzllz001/article/details/50982841)
* 复杂度 
```js
function quickSort(arr,l,r){
    if(l < r){
        //x为基准数
        var i = l,j =r ,x = arr[i];
        //若两个指针未相遇
        while(i<j){ 
            //未相遇 且 右边指针的值大于基准值，则后标签向前移动
            while(i<j && arr[j]>x){
                j--;
            }
            //这里用 i++，被换过来的值肯定比 x(基准值)小，赋值后直接让 i++，
            if(i<j){
                arr[i++]=arr[j];
            }
            //未相遇，且左边前值大于基准值，则前标签向后移动
            while(i<j && arr[i]<x){
                i++;
            }
            //替换值
            if(i<j){
              arr[j--] = arr[i];
            }
        }
        arr[i] = x;
        quickSort(arr,l ,i-1);
        quickSort(arr, i+1,r);
    }
}
```
### 3、二路归并
* 复杂度 O(n)
```js
function merge(left, right) {
    var result = [],
        il = 0,
        ir = 0;
    while (il < left.length && ir < right.length) {
        if (left[il] < right[ir]) {
            result.push(left[il++]);
        } else {
            result.push(right[ir++]);
        }
    }
    while(left[il]){
        result.push(left[il++]);
    }
    while(right[ir]){
        result.push(right[ir++]);
    }
    return result;
}
```

## 字符串操作算法

### 1、判断回文字符串
```js
function palidrome(str){
    // \W匹配任何非单词字符。
    var re = /[\W_]/g;
    // 将字符串全部变换成小写字符，并去除字母以外的所有字符
    var lowRegStr = str.toLowerCase().replace(re,"");
    // 如果字符串的第一个和最后一个字符串不相同，那么字符串就肯定是palindrome
    if(lowRegStr.length ===0 ) return true;
    //如果第一个字符和最后一个字符不相同，那么字符就肯定不是palindrome
    if(lowRegStr[0]!= lowRegStr[lowRegStr.length-1]) return false;
    //递归
    return palindrome(lowRegStr.slice(1,lowRegStr.length-1));
}

```
### 2、翻转字符串
* 思路一：反向遍历字符串
```js
function reverseStr(str){
 var tmp = '';
 for(var i=str.length-1;i>=0;i--){
     tmp += str[i];
 }
 return tmp;
}
```
* 思路二：转化成array操作
```js
function reverseStr(str){
    var arr = [];
    //前后两个移动的指针
    var i =0,j = arr.length-1;
    //每移动一位，前后两个元素相互交换一次
    while(i<j){
        tmp =arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        i++;
        j++;
    }
    return arr.join("");
}
```
* 思路三：使用数组原生调转(与思路二)
```js
function reverseStr(str){
     var tmpArr =  str.split("");
     var resultArr = tmpArr.reverse();
     return resultArr.join("")
}
```

### 数组去重
```js
function unique(array){
    let arr = array;
    let result = [];
    let hashtable = {};
    arr.forEach(item=>{
      if(!hashtable[item]){
          result.push(item) 
          hashtable[item] = true; // 占位
      }
    })
    return result;
}
```
### 统计字符串中个字母的出现次数
```js
function countCharactarTimes(str){
    // 若长度为 1 则不需要统计
      if(str.length == 1){
          return str;
      }
      // 转化为数组操作
     let strArray = str.split('');
      //  使用一个 Map 保持不重复
      let charMap = {};
       strArray.forEach(char=>{
          if(!charMap[char]){
              charMap[char] = 1;
          }else{
              charMap[char] +=1; 
          }
      })
       return  charMap;
}
```
### 阶乘
非递归版本
```js
function factorialize(num){
    let result = 1;
    // 不接受负数
    if(num < 0) return -1;
    // 0 或者 1 则直接返回本身
    if(num == 0 || num ==1 ){
         return  1;
    }
    // 从输入数字循环乘到 1
    while(num>1) {
        result *= num--;
    }
    return result;
}
```
递归版本
```js
function factorialize(num){
   let result = 1;
   // 过滤非常规情况
   if(num <=) return -1;
   if(num<0 || num ==1){
       return 1;
   }
   // 阶乘循环
   if(num > 1){
       return num * factorialize(num -1);
   }
}
```
### 二分查找
```js
function binary_search(arr,low,high,key){
    if(low > high)
    return -1;
    // 取出中间数
    var mid = parseInt( (low + high)/2);
    if(key == arr[mid]){
        // 返回对应值的位置
        return mid;
    }else if(key > arr[mid]){
        // 取后半段
        return binary_search(arr,mid+1,hight,key);
    }else if(key < arr[mid]){
        // 取前半段
        return binary_search(arr,low,mid-1,key);
    }
}
```

### 交换两个变量的值
```js
function swap(a,b){
    //  用其中一个两作为 二者差值的容器
    b = b - a;
    // a 的最终值值为原本值加上差值
    a = a + b;
    //  b 的最终值为 a 的最终值减去差值
    b = a -  b;
}
```