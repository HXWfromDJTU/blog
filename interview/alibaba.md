
### 电话初探
___
##### 说一下你了解CSS盒模型。
* [box-sizing](../css/box.md)
##### 说一下一个未知宽高元素怎么上下左右垂直居中
* [“内容”垂直居中](../css/vertical_middle.md) 
* [自适应垂直居中 - by DDFE](https://juejin.im/post/586b94e5ac502e12d62d4ab6)
 * [参考文章](https://www.zhangxinxu.com/wordpress/2009/08/%E5%A4%A7%E5%B0%8F%E4%B8%8D%E5%9B%BA%E5%AE%9A%E7%9A%84%E5%9B%BE%E7%89%87%E3%80%81%E5%A4%9A%E8%A1%8C%E6%96%87%E5%AD%97%E7%9A%84%E6%B0%B4%E5%B9%B3%E5%9E%82%E7%9B%B4%E5%B1%85%E4%B8%AD/)
##### 说一下你了解的弹性flex布局 

##### 分析一下原型链，对象，构造函数之间的一些关系。
* [对象上的方法](../JS/OOJECT_FUNC.md)
* [原型链](https://www.cnblogs.com/HXW-from-DJTU/p/5933920.html)
* [类的继承](../JS/extend.md)
* [new的时候发生了什么](../JS/what_does_new_do.md)

##### this的指向
* [apply bind call this 的恩怨情仇 ](../JS/apply_call_bind_this.md)
##### DOM事件的绑定的几种方式
* [DOM事件的绑定的几种方式](../JS/eventBinding.md)

##### target和currentTarget的区别
* [currentTarget VS target](../JS/eventBubble.md)
##### 说说函数的柯里化
* [柯里化](../JS/curry.md)

##### 说说http 2.0、websocket、https
* [http2.0](../network/http2.0.md)
* [https](../https.md)

##### 简单说一下vue compile的过程
* [vue-compile](../vue/vue_render.md)

##### 说一下深拷贝的原理
* [对象深浅拷贝](../JS/object_copy.md)
___
### 一轮技术面
##### webpack的入口是如何配置的？如何配置多入口呢？
* [webpack多入口配置](../project_build/webpack/multi_entry.md)
#####  项目中使用到Babel了，来说说 `transform-runtime`和stage-2的作用吧。
* [babel配置](../project_build/babel.md)

##### webpack配置中使用到了webpack.optimize.UgliJsPlugin，有没有感觉到压缩速度很慢，如何改进呢？
* [webpack配置优化笔记](../project_build/webpack/optimize_webpack.md)
* [webpack打包优化](https://juejin.im/post/5b1e303b6fb9a01e605fd0b3)

##### 了解http协议吗？说说200和304的区别吧。
协商缓存与强制缓存的区别，超时、缓存控制字段。
* [http状态码](../network/status_code.md)

##### 说说平时怎么解决跨域问题，JSONP的原理是什么？CORS要如何设置？
* [跨域基础](../CORS.md)
* [跨域实践](../CORS_ON_WORK.md)

##### 说一下深拷贝的原理。
* [对象拷贝](../JS/OBJECT_COPY.md)
___
### 二轮技术面

##### 有没有写过webpack的loader,Loader的原理是什么？Loader一般怎么配置呢？


##### 有没有研究过Webpack的一些原理和机制，如何实现的？
* [webpack工作原理](https://juejin.im/entry/5b0e3eba5188251534379615)

##### babel转换ES6成为ES5和ES3的原理是什么？平时有研究吗？
* [babel原理](../project_build/babel.md)
* [babel插件开发](../project_build/babel_plugin_dev.md)


##### git大型项目的团队合作，如何实现？
* [gitflow](https://juejin.im/entry/57b47e2c7db2a200546e2ab7)

##### 什么是函数额柯里化？说一下JS哪些原生的API用到了函数柯里化的实现？
* [柯里化的基本介绍](../JS/curry.md)

##### ES6箭头函数的this指向是怎么样的？有使用过拓展运算符吗？
* [箭头函数的拓展](http://es6.ruanyifeng.com/#docs/function)
* [拓展运算符](../ES6/extendSymbol.md)

##### 说一下Vue实现双向绑定的原理，以及vue.js和react.js的异同点，若何在项目中选择这两个框架？
* [Vue源码解读之 双向绑定](https://github.com/HXWfromDJTU/blog/blob/master/vue/Vue%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB%E4%B9%8B%20%E5%8F%8C%E5%90%91%E7%BB%91%E5%AE%9A.md)

##### 书写博客的交互性细节


___
### 三轮技术面

##### 说说自己项目的技术栈..以及项目中遇到的一些问题、如何解决的？


##### A公司的一项业务，不想用B公司的网站进行调用，A服务器若是遇到来自B公司的请求，直接拒绝服务？如何解决？


##### 二分查找时间复杂度是多少？怎么实现？
[参考文章](https://juejin.im/entry/5b875108f265da436152fe8f)

##### XSS是什么？如何进行的XSS攻击，我们又该如何防御呢？
* [XSS攻击那些事](https://juejin.im/entry/5a116ec4f265da4326526f10)

##### 线性存储与链式存储有什么不一样？有哪些优点和缺点？

##### 手写出最简单的数组去重代码。
* [数组去重](../algorithem/duplicate_removal.md)
