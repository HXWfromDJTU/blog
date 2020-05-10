# AMD 规范

> AMD 是一种模块管理规范,全称是`Asynchronous Module Definition`(异步模块定义)。其中一个实现则是著名的[require.js](https://requirejs.org/)。

### 特点
AMD的最大特点是他的`A` ==> `Asynchronous`，规范规定模块的加载过程是异步的，不会影响侯后续的代码执行。
> 同步加载模块会阻塞浏览器的代码执行，是当初AMD产生的主要原因。
##### CommonJS 写法
```js
require(['really-big-module']);
const bigData = new BigData()
bigData.getData()

// 被模块加载阻塞的操作
console.log('some action')
```
##### AMD 写法
```js
require(['really-big-module'], function (BigData) {
    const bigData = new BigData()
    bigData.getData()
});
// 同步可执行，不需要等待 really-big-module 模块的加载
console.log('some action')
```

### 语法

##### 定义模块
```js
// 没有依赖模块的模块
define(function () {
    return {
        abc: 123
    }
})

// 有依赖的情况
define(['module1', 'module2'], function (m1, m2) {
   return {
       abc: 123
   }
})
```

##### 引入模块
```js
// 入口声明的所直接依赖的模块即可
requirejs(['module-service', 'jquery'], function (moduleService, $) {
    moduleService.showMsg()
    moduleService.showModuleData()
    console.log($) // 打印出query的$函数
})
```

##### 单独模块配置
```js
// require.js 的模块配置
require.config({
　　　paths: {
　　　　　"jquery": "jquery.min",
　　　　　"underscore": "underscore.min",
　　　　　"backbone": "backbone.min"
　　　}
　});
```

身处`webpack`统治时期的当下前端开发时代，对这些配置项是否也有似曾相识的感觉呢？

### 值得注意

* 使用`require.js`引入模块的时候，被引入的模块也需要是遵循`require.js`规范，否则需要使用`shim`配置项进行额外声明。

```js
// 比如 backbone.js 没有遵循AMD规范，则需要我们额外定义它的依赖，还要帮它指明要暴露哪些对象
require.config({
　　shim: {
　　　　'backbone': {
　　　　　　deps: ['underscore', 'jquery'],
　　　　　　exports: 'Backbone'
　　　　}
　　}
});
```