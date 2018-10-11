# Javascript模块化
___
### ComonJS (服务端运行)
`CommonJS`中有一个全局性方法`require()`用于同步加载模块
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
___
### AMD (浏览器运行)
* 产生原因
要是浏览器也采取 ，同样参考自CommonJS规范。但是CommonJS规范加载代码采用的是阻塞性的同步加载，在服务端直接读取内部资源自然没有大问题，但是在客户端加载服务器的异步资源包，有一个网络传输的问题，浏览器同步加载，代码有可能会长时间阻塞在加载的地方。
* 所以AMD(异步模块定义)就出现了
```js
　require([module], callback);
```
以`JS`中最常见的函数回调来实现异步加载，异步执行。
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
___
### CMD  (依赖就近)
`CMD`规范的实现框架有著名的`SeaJS`。
* 与 `AMD`的不同点：
   ① `AMD`对代码的态度是预执行
   ② `CMD`对代码的态度是懒执行(也就是上面说的依赖就近)，比如`SeaJS`就是在代码需要用到包的内容时候，内核才会去异步地调用这些包。
* 优点：很容易在`node`中运行。
* 缺点：依赖`spm`进行打包(`spm`是`sea.js`的打包工具)

___

### ES6 模块化
ES6 模块的设计思想时尽量的静态化，是的编译的时候就能够确定模块的依赖关系。
```js
import {moduleA,moduleB,moduleC} from 'fs';
```
ES 6模块不是对象，而是通过`export`命令显示输出的代码，在通过`import`命令输入。这种加载称之为`静态加载`、`编译时加载`，这样的加载效率要比CommonJS模块加载效率高，所以ES6不能够引入模块本身。

而CommonJS和AMD规范，都只能在运行的时候确定这些东西。比如，`CommonJS`模块就是对象，输入时必须查找对象属性。

### export
单个`export`
```js
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;
```
整体`export`
```js
fucntion fun(){}
let  obj =  {a:123,bac:123}
export { fun, obj }
```
使用别名导出
```js
export {
  a as fun,
  c as obj
}
```
##### 静态引入
```js
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
```
`import` 与 `export` 可以处于模块的任意位置，但必须处于模块顶层，如果处于块级作用域内，就会报错。因为若是在嵌套代码中，就没法做静态优化，也就未被了`ES 6`的设计初衷。在静态分析阶段，这些语法都是没法得到值的。

### import
使用`export`命令定义了模块的对外接口以后，其他JS文件可以通过import命令进行加载这个模块...
> 注意并不能加载这个文件对象，只可以加载文件内暴露的对象

但是我们能够对模块的整体进行加载
```js
export function area(radius) {
  return Math.PI * radius * radius;
}
export function circumference(radius) {
  return 2 * Math.PI * radius;
}
```
使用 `*` 与 `as` 关键字进行整体加载
```js
import * as circle from './circle';   // 对模块的整体加载
console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
```
##### 不可修改性
`import`命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。
原则上不允许修改接口，但可以修改接口里面的值，其他的模块也能够拿到修改后的值，但是我们不推荐这样做，因为这样的修改是不可以追踪的。

`import`相当于新的一种声明，与`let`，`function`等，所以在`Javascript`中也存在变量提升，import会在静态解析时，被解拆分成声明与赋值两个部分。

##### export default
使用`export default`的特点就是模块的使用者不用关心模块到底暴露了一个什么东西，也不用根据内部的命名来定义引入的名称。

##### 复合写法
```js
export { foo, bar } from 'my_module';
// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```
