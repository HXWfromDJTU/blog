# 数组的高阶函数
> 业务写多了也郁闷，回顾扎实一下基础，避免老翻MDN

## 高阶函数
### Array.prototype.sort()
* 传入一个方法，对数组内的元素进行排序

### Array.prototype.forEach()
* 传入一个方法，对数组的每一个元素，进行想要的操作

 ### Array.prototype.every()
* 传入一个方法，检验数组中的每一个元素，若所有元素都能通过测试，则返回一个`true`，否则返回`false`
```js
function isBelowThreshold(currentValue) {
  return currentValue < 40;
}
var array1 = [1, 30, 39, 29, 10, 13];
array1.every(isBelowThreshold);
```

### Array.prototype.some()
* 数组中至少有一个元素，满足测试用例，则返回`true`，否则返回`false`

### Array.prototype.filter()
* 将数组中的每个元素，都经过一定的校验，校验通过的则保留，不通过的去除，返回结果新数组

### Array.prototype.find()
> 是一个简化版的 `filter`，因为只找第一个
* 传入一个函数，数组中的元素逐个传入函数处理，返回第一个能够使得函数返回`true`值的元素，若没有，则返回`undefined`

### Array.prototype.findIndex()
> 是 `find`方法的异形
* 传入一个方法，返回第一个符合传入方法要求的第一个元素的`数组索引`

### Array.prototype.map()
* 传入一个方法，对数组的每个元素，逐个进行`改造`，并且`改造结果`推入新数组中。

### Array.prototype.reduce()
> 传入一个方法用于处理，`function ( 累加器 ，当前值 ， 当前索引值，原数组 )`
*  每一次的`return值`会作为下一轮的`累加器`的值
* 常见功能：
  * 数组元素累加
     ```js
     let sum = [0, 1, 2, 3].reduce( (a, b) =>{
       return a + b;
    }, 0);
    ``` 
  * 二维数组传化为一维数组
    ```js
     var flattened = [[0, 1], [2, 3], [4, 5]].reduce(
        (a, b)=> {
          return a.concat(b);
        },
        []   // 这个是初始值
     );
     // flattened is [0, 1, 2, 3, 4, 5]
    ```
  * 数组去重  (比较耗费性能，不推荐使用)
    ```js
    let result = arr.sort().reduce((init, current)=>{
      if(init.length===0 || init[init.length-1]!==current){
          init.push(current);
        }
       return init;
      }, []);
    ```

### Array.prototype.reduceRight()
* 和 reduce的方法一样，只不过执行方向从右到左




## 构造器方法
### Array.form()
* 从类数组或者可迭代对象中创建一个新的数组实例
```js
 let array = Array.form('happy'); 
 array; // (5) ["h", "a", "p", "p", "y"]
```
### Array.isArray()
* 用来判断某个变量是否一个数组对象
```js
  Array.isArray([1,3,5]); //true
  Array.isArray({xxx:123});  //false
  ...
```
### Array.of()
* 本方法根据一个可变参数数量，进行新数组的实例化。而不考虑参数的数量或者类型。
 ```js
  Array.of(7);       // [7] 
  Array.of(1, 2, 3); // [1, 2, 3]
  Array(7);          // [ , , , , , , ]
  Array(1, 2, 3);    // [1, 2, 3]
  ```

## 对象原型上的方法
这些方法会修改他们实例自身的值
### Array.prototype.pop 
* 删除数组的末尾最后一个元素，并返回这个元素

### Array.prototype.push()
* 删除数组末尾的一个或者多个元素，并返回这个新数组的长度

### Array.prototype.reverse()
* 颠倒数组元素

### Array.prototype.shift()
* 删除数组的第一个元素，并返回这个元素

### Array.prototype.unshift()
* 在数组的开头添加一个或者多个元素，并返回数组的新长度

### Array.prototype.splice()
* 在任意的位置给数组，增添或者删除任意个元素
    删除内容时，返回被删除元素组成的数组
    添加内容时，返回一个空数组
> array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
* `start`参数： 删除数组元素的起始位置
* `deleteCount`参数  删除数组元素的个数。
    此值，若起始点到最大下标的差，则表示后面的元素全部删除。
    若此值为`0`，则必须要提供一个插入的元素。
* `item1,item2`
     从`start`位置开始添加传入的元素。

## 访问方法
这些方法不会修改原数组的值，只是借用原数组作为一个参数，返回需要的值

### Array.prototype.concat()
* 用当前数组，与传入的内容连接而成一个新数组，并返回

### Array.prototype.slice()
* 截取当前的数组的一个部分，返回这个新数组

### Array.prototype.indexOf()
* 返回数组中的第一个与指定值相等的元素的索引，若找不到则返回`-1`

### Array.prototype.lastIndexOf()
* 返回数组中最后一个与指定值相等的元素，若找不到，则返回`-1`

### Array.prototype.include()
* 传入一个任意值，判断这个值在数组中是否存在。若存在，则返回`true`

## 迭代方法

### Array.entries()
* 返回一个数组的迭代器对象，该迭代器包含所有的数组元素键值对

### Array.prototype.keys()
* 返回一个迭代器对象，内部包含数组所有元素的键

### Array.prototype.values()
* 返回一个迭代器对象，该迭代器对象包含所有数组元素的值。


