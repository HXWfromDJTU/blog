# Javascript内存分配

最近在`webpack`调试的时候遇到，经常遇到`heap oout of menory`的情况，导致调试开发工作的极度不顺利。所以决心了解一下`Javascript`和`node`的内存机制。

本篇文章先了解`Javascript In Browser`的内存机制

Javascript有两种原始数据类型
* 原始值：`String` `Number` `boolean` `null` `undefined`   
:arrow_right: 原始值存储在`栈`中                      
* 引用值：`Object`  `Function` `Array`
  :arrow_right: 引用类型的指针存储在`栈`中，指向存在`堆`中的实际对象。

### 栈(stack)
* `stack`是有结构的，存放一些基本类型的变量和对对象的引用，存在栈中的数据，大小与生命周期都是必须确定的。
* `stack`的寻址速度要快于`heap`
* 因为基本类型所占内存空间大小都是固定的，因此被保存在`栈内存`中
* 从一个变量向另一个变量复制基本类型的值，会创建这个值的一个副本
### 堆(heap)
* `heap`是没有结构，数据人以存放的。`heap`用于复杂数据类型分配空间
* 引用类型的值是对象，保存在堆内存中。
* 从一个变量向另一个变量复制引用类型的之，复制的其实是指针，因此两个变量最终都指向一个对象。


### 类型判断
想要确定一个值是哪种`基本类型`，可以使用`typeof`运算符
```js
typeof(123) // "number"
typeof("aaa") // "string"
typeof({})  // "object"
typeof([])  // "object"
typeof(function(){}) //"function"
```
想确定一个值是那种引用类型可以使用`instanceof`操作符
```js
function Q(){}
let qqq = new Q();
// 判断 qqq 是实例对象
qqq instanceof Q; // true
qqq instanceof Object // true
qqq instanceof Function // false
qqq instanceof Array // false
```
### 实例与比较
```js
var a1 = 0;   // 变量对象
var a2 = 'this is string'; // 变量对象
var a3 = null; // 变量对象

var b = { m: 20 }; // 变量b存在于变量对象中，{m: 20} 作为对象存在于堆内存中
var c = [1, 2, 3]; // 变量c存在于变量对象中，[1, 2, 3] 作为对象存在于堆内存中
```
![](/blog_assets/stack_heap.png)
<div style="text-align:center;">变量对象与堆内存(图①)</div>

___
### 内存的释放 GC回收机制
###### 内存的生命周期
```js
1、分配当前代码所需的内存
2、使用非配到的内存，进行读写操作等
3、使用结束，将不需要的内存空间进行释放、归还。可以使手动或者GC标记回收
```
###### 垃圾回收
`GC标记清理`
`Javascript`有自动垃圾回收机制，原理是JS 内核找出那些不在使用的值，然后释放其占用的内存。垃圾回收器(`GC`)会每隔固定的时间就会执行一次释放操作。
建议减少使用全局变量的使用，因为在GC标记回收中，全局变量是最难判断是否该释放的。
而在局部作用域中，使用标记清除的算法，容易找出那些对象是不再使用的。
`手动清理`
```js
let obj = {a:123,qq:123};
obj = null;
```
[Javascript垃圾回收 - SwainWong](/JS/GC.md)
___
### 参考资料
图① [链接](https://blog.csdn.net/pingfan592/article/details/55189622)
