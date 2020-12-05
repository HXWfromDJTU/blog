### Vue
* DOM Diff 算法
* Vue 双向绑定原理，watch 原理
* 了解看过react? 说说什么是 fiber？
* 虚拟DOM的diff 算法
* 渲染过程 --- 建议刷一些视频，多复习巩固
* vue的生命周期，把知道的全写出来（写了十个，多了两个keep-alive的）
* keep-alive作用
* vue-router的原理 
* vue中v-if和v-show
* 双向绑定原理，2和3有什么区别
* defineproperty和proxy有什么区别 
* Vue nexttick 原理
* 有多少种不同类型的 Watcher
* Vue 什么时候收集 Watcher 的依赖
* 父子组件嵌套的时候，Vue 第一次注入 Watcher 的时候是什么时候，为什么
* computed 的 Watcher 和 data 的 Watcher 有啥区别
* Vuex 的设计模式
* 为什么异步操作要写到 actions 里面，而不能异步 mutation
* Vuex 是什么时候注入 Vue 的，怎么注入
* Vue 作为 viewModel 层，它是怎么感知 model 层中状态的变更的
* Vue 2.x 和 3.x 怎么劫持对象

* SPA 想做 SEO 有什么解决方案
    除了 SSR 和预渲染等方案，面试官还提到 noscript 标签也可以做 SEO?

### 打包优化
* webpack的异步加载如何实现
* webpack的分包策略
* webpack 的 loader 和 plugin 有什么区别
* webpack 构建后的输出，是基于什么模块协议的

### Javascript
* async / await 和 promise 有什么区别
    * generator/ITERATOR 暂停代码原理
    * promise 实现原理
* commonjs 和 esmodule 有什么区别
* for in 和 for of 有什么区别，可以 for of 对象吗
* cloneSymbol的作用

### 跨域
* JSONP
* CORS   
* 如何解决跨域
* 简单请求与复杂请求怎么区分？

### 其他   
* Base64图片有什么问题   
* 数组断引用的方式有什么   

### 浏览器原理
* 浏览器的GC原理过程   
* 跟Node GC 区分开来，另外做一篇笔记  
* 浏览器的加载原理，回流重绘，url输入后的流程，关键渲染路径等....（旧文章捡起来）
* V8 垃圾回收策略是怎样的

### 项目
* 长列表优化，以及长列表中，如果带搜索功能如何实现
    * 结合CCTip Wallet 的 balance 页面进行的优化讲解
    
* 日志与调试
    * LOGGER_LEVEL

## webpack
* webpack 与 webpack-cli 之间的关系是什么
   * 之前工作中遇到的各种错该怎么办
* webpack的基本原理
* webpack plugin 有哪些生命周期钩子，可以用来做什么？

对JavaScript的Api可以手写

https://zhuanlan.zhihu.com/p/31875370

## eslint
* 制定前端开发规约，提高项目可用性


### typescript
* typescript中type和interface的区别
* typescript你都用过哪些类型
* ts 中 type 和 interface 的区别
*  ts 中如何实现一个函数的重载 
* 实现一个 ts 的工具函数 GetOnlyFnProps<T> ，提取泛型类型 T 中字段类型是函数的工具函数，其中 T 属于一个对象。
* 实现一个 ts 的工具函数 UnGenericPromise<T> ，提取 Promise 中的泛型类型

### 设计模式
发布订阅和观察者模式的区别



- 前端基础题
    - 直接扫一遍基础面试题，做到无缺漏 `(23h)`
    - 跨域问题，单独花时间整理一个无遗留系列，`(结合实战，输出一篇 6h)`
- Vue/vuex/router原理
    - 源码实现原理过一遍 `(不死啃源码，只了解过程，输出博文一篇 4h)`
    - vue3 设计原理有时间也了解一下 `(了解改进点，输出博文一篇 4h)`
- nuxt
    - 项目为什么使用nuxt，优点在哪里？`(结合项目经验，输出博文一篇 4h)`
        - ssr
        - 访问速度优化
            - ttfb 与 CDN

