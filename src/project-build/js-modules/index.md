# Javascript模块化
![](/blog_assets/JS_MODULES_COVER.png)

### 为什么要模块化
在传统项目中，当项目依赖与多个子模块，而这些子模块之间项目之间又相互又依赖关系，会出现`不可能人工手动维护的情况`。参照这个[👉例子](/src/project-build/js-modules/playground/no-modules-demo/index.html)。
___
### AMD (浏览器运行)
##### 产生原因
要是浏览器也采取 ，同样参考自CommonJS规范。但是CommonJS规范加载代码采用的是阻塞性的同步加载，在服务端直接读取内部资源自然没有大问题，但是在客户端加载服务器的异步资源包，有一个网络传输的问题，浏览器同步加载，代码有可能会长时间阻塞在加载的地方。

所以`AMD`(异步模块定义)就出现了
```js
　require([module], callback);
```
以`JS`中最常见的函数回调来实现异步加载，异步执行。
```js
   // 获取math依赖工具包，使用其中的add方法
  require(['math'], function (math) {
　　　　math.add(2, 3);
　});
  require(['moduleA', 'moduleB', 'moduleC'], function (moduleA, moduleB, moduleC){
　　　　// some code here
　　});
```
###### 优点
 适合在浏览器环境异步加载。保证各个模块之间的依赖关系。便于模块的编写与维护。
##### 缺点
阅读和书写比较困难，因为有大量的嵌套代码。
___
### CMD  (依赖就近)
`CMD`规范也就是`Common Module Define`,实现框架有射雕的`SeaJS`。
##### 与 `AMD`的不同点 
1️⃣ `AMD`对代码的态度是预执行     
2️⃣ `CMD`对代码的态度是懒执行(也就是上面说的依赖就近)，比如`SeaJS`就是在代码需要用到包的内容时候，内核才会去异步地调用这些包。(不同于AMD所有的包都在一开始就加载)
##### 优点
很容易在`node`中运行。
##### 缺点
依赖`spm`进行打包(`spm`是`sea.js`的打包工具)

___

### ES6 Module
##### 标签引入
```html
<script type="module" src="./foo.js"></script>
<!-- 效果类似于 -->
<script src="./foo.js" defer></script>
<!-- async标志，会自动加载，并且加载成功就马上执行，不管script标签的前后顺序(除非当前有script正在执行) -->
<script src="./foo.js" defer></script>
```
>`defer`关键字表示脚本的`执行`延迟到文档加载完成之后。 ![](/blog_assets/defer_script.png)    

> `module`关键字也能够使得JS在DOM加载完后才执行，兼容性不如前者,IE封杀，edge 16+,FF60+,Chrome 61+
![](/blog_assets/module_script.png)   

当二者同时出现的时候，执行顺序是`一般脚本` >  `module脚本`  > `defer脚本` > `DOMContentLoaded事件`           


##### import引入

```js
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
```
`import` 与 `export` 可以处于模块的任意位置，但必须处于模块顶层，如果处于块级作用域内，就会报错。因为若是在嵌套代码中，就没法做静态优化，也就未被了`ES 6`的设计初衷。在静态分析阶段，这些语法都是没法得到值的。

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
ES6 模块的设计思想时尽量的静态化，是的编译的时候就能够确定模块的依赖关系。
```js
import { moduleA, moduleB, moduleC } from 'fs';
```
ES 6模块不是对象，而是通过`export`命令显示输出的代码，在通过`import`命令输入。这种加载称之为`静态加载`、`编译时加载`，这样的加载效率要比`CommonJS`模块加载效率高，所以ES6不能够引入模块本身。

而CommonJS和AMD规范，都只能在运行的时候确定这些东西。比如，`CommonJS`模块就是对象，输入时必须查找对象属性。

##### export
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


##### export default
使用`export default`的特点就是模块的使用者不用关心模块到底暴露了一个什么东西，也不用根据内部的命名来定义引入的名称。

##### 复合写法
```js
export { foo, bar } from 'my_module';
// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```
___ 
#### ES 6 module 与 CommonJS的几大差异  
1️⃣ CommonJS引入的是模块的一个拷贝，而ES 6 module引入的是暴露对象的引用(模块内部值改变，外部引用值也会改变)   
2️⃣ 在模块中,CommonJS的this指向当前模块，而ES 6 module中this指向的是undefined。es6模块中也不存在
`arguments`、`require`、`module`、`exports`、`__filename`、`__dirname`这些对象
(注意es 6 规范中的是 `export`...与`exports`不是一个东西)
___


### Node 模块化 这部分有很多问题，需要验证后修改

1️⃣ 采用`CommonJS`规范与`ES6`规范,但采取的是不同的加载方案。所以我们看到在`node`中，既可以使用`export`与`export default`，也能够使用`CommonJS`的`module.exports` 和 `exports`  

2️⃣ `import`命令在`node.js`中是异步加载的，这一点与`import`在浏览器中异步加载的行为方式一致。

3️⃣ 在`node.js`中，使用`import`导入`CommonJS`编写的模块时，会将CommonJS模块中的`module.exports`等同为`export default`命令。但引入时，使用的是`*`的话，则会多一层`default`
```js
// common_module.js
let abc = 456;
module.exports = abc;

// main.js
import * as bar from './common_module.js';
bar ; // {default:{abc:456}}
```
4️⃣ 在使用`import`(ES6规范)引用CommonJS模块的时候，不能够进行解构赋值(解构引用)，因为ES6的`import`可以分成引用和运行，也就是在解析的时候就知道自己需要哪些模块中的量，但是被引用的`CommonJS`模块却要到运行时在能够确定哪些内容能够被暴露。
```js
// 不正确
import { readFile } from 'fs'; // fs是CommonJS模块包 
```
但是规范允许整体引入 
```js
import * as whole from 'fs';
```
5️⃣ node在使用`import`引入模块的时候，可以类似`url`一样带参数，若带的参数或者值不一样，那么就会当做两次的引入，并且保存在成不同的缓存。   

___
### Webpack

##### CommonJS
webpack默认支`CommonJS`规范,也实现了其中`Modules/Async/A`提出的`require.ensure`的语法。
```js
// require.ensure 能够确保 webpack进行打包的时候，会将异步引入的包和主包分离
require.ensure([], function(require){
    var list = require('./list');
    list.show();
}, 'list');
```
##### ES6 
若要支持 ES 6 Modules则需要加入 babel-plugin-import 一类的转垫片插件，执行的时候，你会发现`babel`会把我们的`import`都转译为熟悉的`CommonJS`的`require`  

例如 
```js
import list from './list';
//等价于 
let list = require('./list');
```

##### webpack自带方法
`require.include`是一个和 CommonJS规范下`require.ensure`极为相似的方法，而且还不能自己决定单独打包的模块名称。


##### AMD
1️⃣ webpack除了实现了Common规范以外，还实现了AMD规范，说明熟悉的AMD引入也是可行的。  
```js
// 使用AMD规范引入模块包
require(['./list', './edit'], function(list, edit){
    list.show();
    edit.display();
});
```

##### 总结 
```js
//可打包在一起的同步代码，使用import语法
import list from './list';

//需要独立打包、异步加载的代码，使用require.ensure
require.ensure([], function(require){
    var list = require('./list');
});
```
要想了解更多使用`webpack`进行前端优化的方法，请看我的另一篇文章 [前端优化第二曲👉](/browser/front_end_optimize.md)        

### 循环引用
___
### 参考文档 
[阮一峰 ES6教程]()   
[webapck 模块化支持](https://blog.csdn.net/huang100qi/article/details/80581240)
