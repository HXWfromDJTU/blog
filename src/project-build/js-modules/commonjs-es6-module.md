# CommonJS  与 ES6 Module 差异比较

## 值的拷贝 与 值的 引用 
* `CommonJS` 引入的是模块值一个拷贝
* `ES 6 module`引入的是暴露对象的引用,本质上是暴露了一个指向对应内存空间的指针，模块内部值改变，外部引用值也会改变。   

## this的指向
* 在模块中 `CommonJS`的`this`指向当前模块

* 而ES 6 module中this指向的是`undefined`。

同时，`ES 6`模块中也不存在
`arguments`、`require`、`module`、`exports`、`__filename`、`__dirname`这些对象

## 处理的阶段
* CommonJS 在执行阶段进行处理
* ES6 Module 则对标的是编译阶段的静态处理，但是在`执行阶段`也有`import()`语句来对补充空缺

## 同步与异步
* `CommonJS`加载模块使用的`require()`是同步加载的。
* `ES6 Module`中的`import()`方法，返回的是一个`Promise`对象，属于异步加载。

## Node.js 加载 ES6 Module
* 文件名以`.mjs`结尾的文件，代码中可以出现`import` 或者 `export`等`ES 6`模块代码，Nodejs引擎也会将其当做`ES 6 Module`进行处理。 

* 文件名以`.cjs`结尾的文件，`Node.js`引擎会将采用`CommonJS`加载该模块。

* 若文件后缀仅仅为`.js`，则需要搭配`package.json`配置文件中的`type`字段来标志自身的模块编写规范。
```json
{
    "main": "./dist/index.js", // 后缀没有指明是 cjs 还是 mjs
    "type": "module" // 标明是ES6 模块
}
```

* `Node.js`版本 `v13.2`之后直接支持了`ES 6 Module`，可以采用`package.json`中`exports`字段，对模块入口进行指定。
```json
{
    "exports": {
        "require": "./main.cjs", // CommonJS 入口
        "default": "./main.js" // ES 6 入口
    }
}
```
其原理是`exports`字段为`.`路径声明了一个别名，这里的`.`也就是指模块入口。


## ES 6 加载 CommonJS 模块
```json
{
    "type": "module",
    "main": "./dist/index.cjs", // 用于 CommonJS 识别
    "exports": {
        "require": "./index.cjs",
        "default": "./index.mjs"
    }
}
```
### 只能够整体加载
`ES6 module`加载`CommonJS`不能够做到单一输出的加载，只能够整体进行加载，因为`CommonJS`的模块化是`运行时`加载的，而`ES6 Module`则是在编译时进行的加载。
```js
// moduleA.cjs
module.exports = {
    bar: 123,
    foo: 456s
}

// app.mjs
import { bar } from "moduleA.cjs" // error
```

## 参考资料
[ECMascript6 入门 - 阮一峰](https://es6.ruanyifeng.com/#docs/module-loader)