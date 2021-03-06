# Javascript 变量存储

> 最近在`webpack`调试的时候遇到，经常遇到`heap oout of menory`的情况，导致调试开发工作的十分不顺利。所以决心了解一下`Javascript`和`node`的内存机制。

## 数据类型与存储空间
本篇文章先了解`Javascript In Browser`的内两种原始数据类型

| 类型 | 包含种类 | 存储情况 |
| --- | --- | --- |
| 原始值 | `Number` `boolean` `null` `undefined` | 原始值存储在`栈`中    |
| 引用值 | `Object`  `Function` `Array` | 引用类型的指针存储在`栈`中，指向存在`堆`中的实际对象    |

### 堆与栈
| 栈(stack) | 描述 |
| --- | --- |
| 结构 | 栈的优势就是存取速度比堆要快，仅次于直接位于CPU中的寄存器 |
| 值的变动 | 从一个变量向另一个变量复制基本类型的值，会创建这个值的一个副本 |
| 大小与存活时间 | 所占内存空间大小、生命周期都是固定的 |

| 堆(heap) | 描述 |
| --- | --- | 
| 结构 | 因为在运行时动态分配内存，所以存取速度比较慢 |
| 值的变动 | 原地操作 |
| 大小与存活时间 | 可以动态地分配内存大小，生存期也不必事先告诉编译器 |

## String 存储的特殊情况

#### 存储空间
`Javascript` 中的 `String` 虽然是 `原始类型`，但事实上 `V8` 堆内使用（类似数组的）连续空间存储字符串。并且使用`OneByte` 和 `TwoByte`两类结构来做存储。     

#### 字符串的不可变性(举例) 
```js
const str = 'abcdef'

// 可读
conso.log(str[2]) // c 

str[2] = 'x'

// 但不可写
console.log(str) // abcdef
```

`Javascript`的字符串属于基础类型，每次往字符串中加添加内容，其实在内存中都是新创建了一个新字符串对象，旧字符串对象短时间也还在内存中，但马上会被GC回收。    

## js函数传参是传值还是传引用？
首先我们给一个定论，是传值。而且所有情况都只传值。 

在函数传参的时候，内核是复制了一个栈帧的值作为形参的值，栈帧上存的是什么，那么我们就复制的是什么。    

##### `基本类型`     
在基本类型传参的时候，我们同样理解为拷贝栈帧，此时栈帧中保存的就是基本类型的值，比如说`123`，`true`，那么形参中的栈帧保存的也是一个这样的基本类型值。    

##### `引用类型`     
在传递引用类型的的时候。首先，实参在栈中存储的值就是一个指向堆中对应数据对象的`指针`，在传递函数参数的时候，将这个指针的值赋值了一份，作为形参的值。那么此时，形参的栈空间也存着一个值相同的指针，都指向了堆中的同一个对象。 

### 举例说明
```js
// 原对象
let a = {key:123};

// 转换方式1
function changeAttr(b){
  b.key = 789;
}

// 转换方式2
function changeItSelf(c){
  c = {key2:888}
}

// 开始试验
changeAttr(a);     
console.log(a);   // {key:789}

changeItSelf(a);  
console.log(a)    // {key:789}
```
我们可以看出`changeAttr`操作中，访问到了a中的内容，并且进行了修改。而`changeItSelf`中的内容并没有修改成功。来画一下当时的栈帧情况。  

#### changeAttr      

|栈内存| | -- |堆内存||
|---| --- | --- |---|--|
| a|`xxx0081270xx`| -- | `xxx0081270xx` |{key:123}|  

然后执行了函数`changeAttr`，进行了栈帧的拷贝，除了变量名字不同，值是完全的一致，所指向堆的位置也一致。也就不难明白为什么会修改到同一个对象了，以下是修改后的内存情况。  

|栈内存|| -- |堆内存||
|---| --- |--- |--- |--- |
| a|`xxx0081270xx`|  -- | `xxx0081270xx` |{key:123}|  
| b|`xxx0081270xx`|     

#### changeItSelf
而当调用`changeItSelf`的时候，这时候是对c的值直接进行修改，也就是赋值了a的值(也就是那个内存地址)之后，我们又用一个新的内存地址覆盖了c的值。         

|栈内存| |--|堆内存||
|---| --- |--- |--- |--- |
| a|`xxx0081270xx`| --  | `xxx0081270xx` |{key:789}|  
| c|`a762784368wqe`| -- | `a762784368wqe` |{key:888}|              

所以到这里，我们坚定地继续喊出：`JS函数调用的时候，形参的到的就是实参的值`  

## 指针(pointer)与引用(reference)
这个问题其实比较绕的原因是，大多数的前端工程师不知道`指针`的定义
> 在计算机科学中，指针（英语：Pointer），是编程语言中的一类数据类型及其对象或变量，用来表示或存储一个存储器地址，这个地址的值直接指向（points to）存在该地址的对象的值。 
--- 《维基百科 - 指针》

JavaScript中没有`指针`这个数据类型，也不能够将一个变量作为另一个变量的`指针`。

> JavaScript中没有指针，引用的工作机制也不尽相同。在JavaScript中变量不可能成为指向另一个变量的引用。
———《你不知道的JavaScript 中卷》2.5 值和引用，第1版28页。

但是，无论语言怎么变，都脱离不了冯诺依曼的计算及结构，`CPU`和`内存`。

* 我们可以认为Javascript中没有指针，因为没有指针这种数据类型，也不能将一个变量指向另一个变量。        

* 我们也可以认为JavaScript中的引用和指针是类似的一套体系，都是实际内容存储的内存空间的一个地址。

* JavaScript变量赋值、传递的时候，时钟传递的是`值`，这个`值`本身是一个基础类型的内容，异或是`对象的引用`就交给函数解析器去理解了。



## 其他的声音

#### 知乎网友

> Q: JavaScript字符串的内容存储在哪里，是堆中还是栈中?

> A: 你写JS里面用到的所有东西，字符串，数字，数组，对象，甚至整个代码片段（文件），在JS引擎里面都会 new 一个指针（对象引用）出来，所以如果你要问字符串在堆还是栈，那么可以说是堆。然而脚本语言引擎的目的就是为了托管内存管理，让你不用去知道到底是堆还是栈。

<div align="right">----- from KennethJ - 知乎 <a href="https://www.zhihu.com/question/41534018/answer/92029393">传送门</div>

#### 高程三

来源于《Javascript 高级程序设计》- 第四章 4.3.4  

![](/blog_assets/js_memory_manage.png)


## 参考资料
[1] [图1 - 链接](https://blog.csdn.net/pingfan592/article/details/55189622)     
[2] [字符串在 V8 内的表达 - @superzheng](https://juejin.im/entry/59a67f3a5188252428611e62)    
[3] [[讨论] JavaScript中String的存储 - iteye](https://hllvm-group.iteye.com/group/topic/38923)


<!-- ## 类型判断
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
<div style="text-align:center;">变量对象与堆内存(图①)</div> -->
