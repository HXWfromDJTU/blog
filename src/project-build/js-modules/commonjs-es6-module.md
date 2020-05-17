# CommonJS 模块化 与 ES6 模块化的差异比较



## 值的拷贝 与 值的 引用 
> CommonJS引入的是模块的一个拷贝，而ES 6 module引入的是暴露对象的引用(模块内部值改变，外部引用值也会改变)   


## this的指向
> 在模块中,CommonJS的this指向当前模块，而ES 6 module中this指向的是undefined。

同时，`ES 6`模块中也不存在
`arguments`、`require`、`module`、`exports`、`__filename`、`__dirname`这些对象

## 处理的阶段
* nodejs



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