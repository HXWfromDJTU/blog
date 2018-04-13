# Vue源码解读

Vue core的基本内容，围绕的是大家熟悉的 Vue生命周期来书写的。

熟悉的生命周期图
![生命周期图](https://cn.vuejs.org/images/lifecycle.png?_sw-precache=6f2c97f045ba988851b02056c01c8d62)





文章疑问？
> 1、Dep对象是什么作用，dep.notify()呢？
* Dep对象是用于处理数据依赖的，它有一个id和subs（用于收集依赖）
* set方法会调用dep.notify方法来通知所有依赖的Watcher对象，让他们调用自己的update方法来进行更新。
> 2、defineReactive()的作用是什么？

>3、observe() 方法的作用

> 4、walk方法的作用是什么？
walk方法会对value中的属性循环调用definereactivity方法。
> 5、definereactivity方法的作用
调用JS原生的  Object.defineProperty()给每一个变量设定get/set拦截，使得平时我们的`取值`与`赋值`是通过内部操作之后才进行的