# iterator 遍历器
1️⃣ 为各种数据结构提供一个统一的、便捷的数据接口
2️⃣ 使得数据成员按照某种次序排列
3️⃣ 为`for...of`提供实现遍历命令

### for...of
Iterator接口的目的，就是为了所有数据结构，提供了一种访问机制，也就是`for...of`循环，详见下文，当使用`for...of`的时候，循环会自动寻找Iterator接口。
   
```js
const obj = {
    [Symbol.iterator]:function(){
        return {
            next(){
                return {  
                    value:1,
                    done:true
                }
            }
        }
    }
}
```
### 遍历器对象
1️⃣ 本质就是一个指针对象，初始指向数据的起始位置
2️⃣ 初次调用遍历器next方法，指针就指向第一个元素，后依次调用next方法，指针指向依次向后移动。
3️⃣ 每次返回一个 value值与一个是否完成的状态done。
```js
{
    value:'hahah',
    done:true 
}
```
4️⃣ 代码表示一个遍历器对象
```js
function makeIterator(array){
    var index = 0;
    return {
        next:function(){
            // 判断遍历是否到达尾部
            return index<arr.length?{value:array[index++]}:{done:true}
        }
    }
}

```
### 部署了 Iterator对象的数据结构

* Array
* Map
* Set
* String
* arguments
* typedArray
* NodeList 对象

1️⃣ 以上数据结构原生情况下就拥有 Iterator接口，也就是拥有 [Symbol.iterator] 属性
2️⃣ 注意：js原生对象是没有部署 iterator接口的，因为原生对象的数据结构是否非线性的，部署iterator接口，意味着要将数据进行一个有序化转换,所以遍历对象请示用`for...in`
![](/blog_assets/object_iterator.png)


### 如何添加遍历器接口
1️⃣ 手工实现一个遍历器接口
```js
fucntion Obj(value){
   this.value = value;
   this.next = null;
}
Obj.prototype[Symbol.iterator] = function(){
    var iterator = { next:next};
    var current = this;

    function next(){
       if(current){
           // 取出当前值
          var value = current.value;
          // 指针后移
          current = current.next;
          return {value:value,done:false }
       }else{
          return  {value:undefined,done:true }
       }
    }
    return iterator;
}
```
2️⃣ 借用现有对象的遍历器接口
```js
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator] // 借用数组的遍历器接口
};
```

### 调用 iterator 接口的地方
1⃣️ 结构赋值
对数组和set进行解构赋值的时候，会默认调用`iterator`接口

2⃣️ 扩展运算符
数组和字符串的拓展运算符，会默认调用`iterator`接口
相反而言也成立，也就是说所有具有`iterator`接口的数据，都可以使用拓展运算符进行转换为数组

3⃣️ yield * 后面
我们所熟知的生成器`generator`接口，在底层也是使用`iterator`借口去实现。

4⃣️ 字符串的 Iterator 接口
![](/blog_assets/iterator_str.png)

5⃣️ 数组的 Iterator 接口
![](/blog_assets/iterator_array.png)

`for...of`遍历数组和字符串也就是调用对象的 Symbol.iterator 
![](/blog_assets/iterator_compare.png)

6⃣️ Set和Map的Iterator接口
```js
new Map([['a',1],['b',2]])）


```

7⃣️ 所有以可以接受数组作为参数的场合，都会调用遍历器接口
例如：
```js
for...of   //遍历数组
Array.form()   // 数组转换
new Map([123,3445])  // 以数组为参数创建map对象
```

### 计算后生成的遍历器对象

还记得es6新增的Set与Map对象在遍历的时候，通常使用的是`entries`、`keys`、`values`三个方法。返回的都是一个遍历器对象,所遍历的都是j计算生成的数据结构。

### 异步遍历器
1️⃣ 异步遍历器，与同步最大的不同，特点是调用next方法时候，返回的是一个promise对象,这个promise对象then返回的参数就是熟悉的`{value：xxx,done:false}`的信息了。

2️⃣ 异步遍历器每一个next遍历返回的Promise,都要then去获取结果，代码会显得十分臃肿，那么我们结合async...await的写法，将返回的promise放在await后面进行处理，就可以得到近似同步的执行代码了

3️⃣ for...await of是相比较与for...of的异步Iterator循环方法。

4️⃣ 异步声明的generator
```js
async function* gen() {
  yield 'hello';
}
const genObj = gen();
genObj.next().then(x => console.log(x));
```
初始化这个gen，会返回一个异步的Iterator对象，使用for...await of进行遍历
![](/blog_assets/async_generator.png)

5️⃣ yield * 语句后面也可以跟一个异步遍历器,注意是`yield *`而不是`yield`