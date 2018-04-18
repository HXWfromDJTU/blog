# Vue源码解读之 双向绑定
Vue2.0是包括多个部分，其中`数据双向绑定`的实现，使用的是著名的`观察者/订阅者模式`来设计的
### 整体流程
> Vue 双向绑定实现流程

① 给需要检测的数据，通过循坏调用`Object.defineProperty`的形式，来实现数据`赋值(set)`和`取值(get)`的拦截
② get对象中，先判断当前`Dep.target`是否为空，若不为空，则加入到dep.subs订阅者数组中去。
* Watcher的创建
  ① 组件渲染时候，vue先compileToFunction函数将组件中的template，生成一个render函数。
  ② 创建一个 watcher 对象，并将生成的render函数传递给这个Watcher对象用于DOM更新，创建之时也会调用一次render方法
  ③ 调用render方法时候，会去访问到传入的template中的data选项的值，那么就会被data的getter方法拦截到
  ④ 被拦截到后，则会将这个Watcher对象添加到依赖中
* Watcher的使用
  ⑤ 一个watcher对象对应一整个template的数据监控
  ⑥ 只要template中的任意一个数据发生变化，Watcher对象都会调用之前传入的render方法去重新渲染
  ⑦ 因为Vue2.x系列已经采用Virtual DOM，当data改变时，只会重新渲染修改了的部分
![vue双向绑定流程](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/vue/Vue%E5%8F%8C%E5%90%91%E7%BB%91%E5%AE%9A%E5%8E%9F%E7%90%86%E6%B5%81%E7%A8%8B%E5%9B%BE.png)
### Q & A？
> 1、Dep对象是什么

* dep
`Dep`对象是用于处理数据依赖的，每一个dep都有一个id，每一个`Observer`对应一个`Dep`
* dep.subs
 `dep.sub`用于记录所有会取该`data`的`Watcher`对象(也就是一个存放`Watcher`对象的数组)，当该数据发生变化时(get或者set)，`dep对象`就会`通知`subs数组`中的所有`Watcher对象`进行更新。
* dep.notify
上面提到的通知，即是dep.notify，set方法会调用dep.notify方法来通知所有依赖的Watcher对象，让他们调用自己的update方法来进行更新，去更新他们所在的template
* dep.target
   指向当前数据的Watcher对象
>2、observe() 方法的作用

* `observe`方法主要用于给数据，挂载 Observer()类
* `Observer()`类。主要用于递归地监听对象上所有的属性（通过`walk`方法），在属性值发生改变的时候，触发相应的`Watcher`
> 3、walk方法的作用是什么？

* walk方法会对value中的属性循环调用 definereactivity 方法。
* definereactivity 方法，是Vue是实现通过`Object.definedProperty`监听`get/set`的包装方法 
* 调用`JS`原生的 `Object.defineProperty()`给每一个变量设定get/set拦截，使得平时我们的`取值`与`赋值`是通过内部操作之后才进行的，这也是Vue实现双向绑定的核心。
>4、Watcher对象的作用

* Watcher 是观察者的角色，用于监听`template`的`data`数据的变化。当检测的数据的`get/set`被触发的时候，执行自身的`render函数`更新`VirturalDOM`
> 有时候监听不到数据的变化？

`data`选项中的数据是在组件初始渲染的时候，就进行get/set的监听，在初始化之后再绑定到data选项上的数据，是无法实现数据拦截的。
> 修改数据之后，马上去获取对应的DOM值，为何还未发生改变？
Vue为了避免频繁地操作DOM，所以使用队列，手机一个'tick'的变化，等到'tick'完成的时候，才一起去更新这些DOM内容。
