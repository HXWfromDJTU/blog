# Javascript内存分配

最近在`webpack`调试的时候遇到，经常遇到`heap oout of menory`的情况，导致调试开发工作的极度不顺利。所以决心了解一下`Javascript`和`node`的内存机制。

本篇文章先了解`Javascript In Browser`的内存机制

Javascript有两种原始数据类型
* 原始值：`String` `Number` `boolean` `null` `undefined`   
:arrow_right: 原始值存储在`栈`中                      
* 引用值：`Object`  `Function` `Array`
  :arrow_right: 引用类型的指针存储在`栈`中，指向存在`堆`中的实际对象。

### 栈(stack)
`stack`是有结构的，存放一些基本类型的变量和对对象的引用，存在栈中的数据，大小与生命周期都是必须确定的。
`stack`的寻址速度要快于`heap`
### 堆(heap)
`heap`是没有结构，数据人以存放的。`heap`用于复杂数据类型分配空间

### 堆和栈的大小
程序运行时，每个线程分配一个stack，每个进程分配一个heap，也就是说，stack


### 内存的释放 GC回收机制