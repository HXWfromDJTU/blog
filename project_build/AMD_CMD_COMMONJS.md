## AMD_CMD_COMMONJS

##### ComonJS (服务端运行)
CommonJS中有一个全局性方法`require()`用于同步加载模块
* 优点：服务器模块便于重用。
* 缺点： 同步的模块加载方式不适合在浏览器的环境中使用，同步意味着加载阻塞，浏览器加载资源是异步的。
```js
// foo.js
module.exports = function(x) {
  console.log(x);
};

// main.js
var foo = require("./foo");
foo("Hi");
```

##### AMD (浏览器运行)
* 产生原因
要是浏览器也采取 ，同样参考自CommonJS规范。但是CommonJS规范加载代码采用的是阻塞性的同步加载，在服务端直接读取内部资源自然没有大问题，但是在客户端加载服务器的异步资源包，有一个网络传输的问题，浏览器同步加载，代码有可能会长时间阻塞在加载的地方。
* 所以AMD(异步模块定义)就出现了
```js
　require([module], callback);
```
以JS中最常见的函数回调来实现异步加载，异步执行。
```js
  require(['math'], function (math) {
　　　　math.add(2, 3);
　});
  require(['moduleA', 'moduleB', 'moduleC'], function (moduleA, moduleB, moduleC){
　　　　// some code here
　　});
```
* 优点： 适合在浏览器环境异步加载。保证各个模块之间的依赖关系。便于模块的编写与维护。
* 缺点：阅读和书写比较困难。

##### CMD  (依赖就近)
`CMD`规范的实现框架有著名的`SeaJS`。
* 与 `AMD`的不同点：
   ① `AMD`对代码的态度是预执行
   ② `CMD`对代码的态度是懒执行(也就是上面说的依赖就近)，比如`SeaJS`就是在代码需要用到包的内容时候，内核才会去异步地调用这些包。
* 优点：很容易在`node`中运行。
* 缺点：依赖`spm`进行打包(`spm`是`sea.js`的打包工具)