# MVVM常用概念理解

## MVVM指的是什么？
MvvM 是数据流的概念，与 单向数据流所对应。双向指的是视图(view)与模型(model)通过ViewModel，双向绑定在一起。监测机制检测到了，一方发生变化，另一方也自动发生变化。
![mvvm](../blog_assets/mvvm.jpg)

## 脏检测 与 getter/sette
上一个部分提到了监测机制....Angular 的脏检测(dirty check)开创了数据监测的先河，但是监听效率比较低。

现在几乎所有的前端的框架，都已经改为使用`getter/setter`实现数据监听，保证数据的变化在一个时间循环周期内能够检测到。

