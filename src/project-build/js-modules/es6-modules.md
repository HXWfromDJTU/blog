##### ES6 
若要支持 ES 6 Modules则需要加入 babel-plugin-import 一类的转垫片插件，执行的时候，你会发现`babel`会把我们的`import`都转译为熟悉的`CommonJS`的`require`  

例如 
```js
import list from './list';
//等价于 
let list = require('./list');
```


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