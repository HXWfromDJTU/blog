# ES6 module

## 溯源
* 与前辈`CommonJS`、`AMD` 不同， 而`ES6` 尝试在语言层面上实现了模块化的功能
* `CommonJS` 与 `AMD` 都需要程序运行时才能够知道模块之间的依赖关系。而`ES 6 Module`要做到的是尽量的静态化，在编译时就确定模块的依赖关系，以及输出和输出的内容。



## export

##### 建立对应关系
> `export` 命令规定的是对外的接口，起的作用必须是与模块内部建立起`一以对应`的关系。

##### 动态绑定
> `export`语句输出的接口，与其对应的是动态绑定的关系，模块内部值的变化，会引起外部引用的变化。

例子一:
```js
// modulesA.js
export const number = 3
export function add () {
  number ++
}

// app.js
import { number, add } from 'moduleA'
console.log(number) // 3
add()
console.log(number) // 4
```

例子二: 
```js
// moduleA.js
class ModuleA {
  this.name = 'moduleA'
  this.getName = function () {
    return this.name
  }
}

export const objA = new ModuleA()

// a.js
import { objA } from 'moduleA'
objA.name = 'name has been changed'

// b.js
import { objA } from 'moduleA'
setTimeout(() => {
  console.log(objA.name) // 'name has been changed'
})
```
以上两个例子都可以说明，模块内部，引用方拿到的模块引用，都是指向同一个内存空间，任意一方改变了内存空间存储的值，那么任意一方取到的都是最新的值。

##### 必须处于顶级模块
> `ES6 Module` 的初衷是实现静态分析模块化，所以export必须处于模块顶层中，不能处于块级作用域内。


## import

##### 变量提升
> `import`会在静态解析时，会因为变量提升解拆分成声明与赋值两个部分。
```js·
console.log(abc)
import { abc } from 'module.js' // 并不会报错
```

##### 静态模块
> 与`export`相类似，同样遵循`ES 6`静态模块分析的设计初衷，`import` 语句同样不能处于`块级作用域`中，导出的值也不能够是`需要运算后得出的结果`。

##### 引用不可修改
> `import`命令输入的变量都是只读的，因为本质上来说，引入的是`输入接口`。改变引用本身，则会破坏模块之间的引用关系。

原则上不允许修改接口，但可以修改接口里面的值，其他的模块也能够拿到修改后的值，但是我们不推荐这样做，因为这样的修改是不可以追踪的。     

如下例子: 
```js
// common.js
export const config = {
  port: '8899',
  host: '123.77.33.56'
}

// a.js
import { config } from 'common.js'
config.port = '1234' // 不会报错

//b.js
import { config } from 'common.js'
console.log(config.port) // 一脸懵逼地拿到了 1234这个值，b的开发者回去看 common.js 又发现不了问题
```


##### 仅执行但不引入
> 一下的语句，仅仅会执行`my.module`模块的内容，但并不会引入任何代码。
```js
import 'my-module'
```

##### 整体引入
```js
import * as myModule from 'my-module'
```

##### 路径解析
> 优先解析`./`与`../`等相对路径，直接写`模块名称`则需要根据配置文件的规则来约定。

```bat
$ node --experimental-modules a.mjs  # 这里用node来运行一下
```
比如出现以上`循环引用`的情况下，`a.js`为入口`moduleB`被首先加载

## import()
##### 补充了运行时解析
* `ES 6 Module`的最终目的是要取代`CommonJS` 与 `AMD`，一统天下。那么在`运行时`的模块化中，使用`import()`函数来替代`require()`方法。
* `import()` 与 `import` 语句不一样，前者产生的是`运行时执行的异步加载`，后者产生的是`静态的连接关系`。

##### 异步加载
> `import()` 进行异步加载，方法返回的是一个`Promise`对象，那么显而易见的`require()`则是一个运行时同步加载的过程。

```js
// 异步加载
import list from './list';

// 同步加载
const list = require('./list');
```

##### 使用场景
> 因为`import()`是运行时执行，显而易见的我们可以用于做`code spliting`。

```js
const router = new VueRouter({
  routes: [
    { 
      path: '/foo', component: import('./Foo.vue'),
      path: '/bar', component: import('./Bar.vue'),
    }
  ]
})
```
详细请参考[👉这里](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html#%E6%8A%8A%E7%BB%84%E4%BB%B6%E6%8C%89%E7%BB%84%E5%88%86%E5%9D%97)


## export default

##### 默认名称为 default
> 使用 `export default`相当于对外暴露了一个`名为 default`的变量，变量的值直接跟在`export default`后面。



## export from

##### 模块转发
> 使用`export from`可以实现模块转发，(表面上相当于是import 与 export的结合)，但要实际进行静态解析的时候，当前模块是没有引入目标对象的。

```js
// moduleA
export { foo, bar } from 'moduleB'

console.log(foo) // error
```

##### 转发接口改名
> 中间模块转发接口的时候，可以对接口进行改名
```js
export { default as myModule } from 'that-module'

export * as myModule from 'that-module'
```

## 标签引入 

##### type="module"
```html
<script type="module" src="./foo.js" type="module"></script>

<!-- 效果类似于 -->
<script src="./foo.js" defer></script>
```

>`defer`关键字表示脚本的`执行`延迟到文档加载完成之后。

![](/blog_assets/defer_script.png)    

> `module`关键字也能够使得JS在DOM加载完后才执行，兼容性不如前者,IE封杀，edge 16+,FF60+,Chrome 61+

![](/blog_assets/module_script.png)   

当二者同时出现的时候，执行顺序是`一般脚本` >  `module脚本`  > `defer脚本` > `DOMContentLoaded事件`           


## 参考资料
[ES 6 入门 阮一峰- Module 的语法](https://es6.ruanyifeng.com/#docs/module)