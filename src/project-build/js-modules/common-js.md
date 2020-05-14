# CommonJS 之 Node.js模块化

> `CommonJS` 是一种JS模块规范。规范内容主要分为`模块定义`、`模块引用`与`模块标志`三个部分。Node.js的模块机制是其主要的实践。
___
## 模块定义
##### 文件即模块
CommonJS 规定每一个文件就是一个模块，拥有自己的作用域。文件内的`变量`、`函数`、`类`都是私有的，其他文件不可以直接访问到，只有通过`module.exports`这个`神魔之井`进行访问。

##### module 对象
```js
// 最简单的一个模块，使用node命令执行它，输出以下的内容
module.exports = {
    abc: 123
}
console.log(module)
```
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/node-module.png)

* module.id 模块的标志符
* module.loaded 标志模块是否已经完成加载
* module.children 表示其所依赖的其他模块
* module.parent 指向模块的父模块
* module.exports 表示对外暴露的`对象`（👈注意这个用词）
* module.filename 表示模块的文件名，带有绝对路径

##### module.exports 与 exports
> 先说结论，请您放弃使用`exports`，严格使用`module.exports`进行模块暴露

其实`Node`为每一个模块，都提供了一个当前模块下的全局`exports`变量，指向了当前模块下的`module.exports`,也就是在每一个模块的开头，手动执行了以下语句
```js
var exports = module.exports
```
___

## 模块引用
`Node.js`中有一个全局性方法`require()`用于同步加载模块
```js
const module1 = require('./module.js')
module1.getName() // 'module1'
```
##### 引用的是值的拷贝
`CommonJS`中模块加载机制，`require`函数引入的是输出模块中`module.exports`的值得拷贝。也就是说，内部值的变化，外界不再能够感知到。
```js
// moduleA.js
var innerValue = 'innerValue'

setTimeout(() => {
    innerValue = 'innerValue has been changed'
}, 100)

function changeInnverValue () {
    innerValue = 'innerValue has been changed by function'
}

module.exports = {
    innerValue,
    changeInnverValue
}

// index.js
const moduleA = require('./moduleA')

console.log('before', moduleA.innerValue) // before innerValue

moduleA.changeInnverValue()

console.log('after', moduleA.innerValue) // after innerValue

setTimeout(() => {
    console.log('after timmer', moduleA.innerValue) // after timmer innerValue
}, 3000)
```
##### 一次运行，多次加载
> 一个模块可能会被多个其他模块所依赖，也就会被多次加载。但是每一次加载，获取到的都是第一次运行所加载到缓存中的值， `require.cache`会指向已经加载的模块。

```js
// module-imported
module.exports = {abc: 123}

// index.js
require('./module-imported')
require('./module-imported').tag = 'i have been imported'
const moduleImported = require('./module-imported')

console.log(moduleImported.tag) // 输出 'i have been imported'

console.log(require.cache) // 输出如下图
```
![](/blog_assets/node-modules-require-cache.png)

上面两个例子结合，可以说明对于同一个模块，node只会加载一次。后续的读取都是从缓存中读取出来。

##### 缓存机制补充
对于模块缓存机制，若是存在两个同名模块，存放于不同的路径，则那么`require()`方法仍然会重新加载该模块，而不会从缓存中读取出来。如以下例子。

```bat
|-- node_modules
    |-- module-importe.js #外层同名模块
|-- index.js  #入口文件
|-- node_modules
    |-- module-importe.js #内层同名模块
```
```js
// index.js
const moduleA = require('module-imported')
const moduleB = require('../node_modules/module-imported')
moduleA.tag = 'moduleA tagged'
moduleB.tag = 'moduleB tagged'
console.log(require.cache)
console.log(moduleA.tag)
console.log(moduleB.tag)
module.exports = {
    name: 'index module'
}
```
![](/blog_assets/node-modules-same-name.png)
___
## 模块标识

##### require()路径参数规则
* 必须是小驼峰命名方式的字符串
* 以'../'或者'./'开头的相对路径 或者 绝对路径
* 可以不书写`.js`后缀名

##### require()路径解析规则
* `/`开头表示绝对路径。
* `./` 或 `../` 表示相对路径。
* 除了以上两种情况，则表示加载的是核心模块。
* 自定义模块指的是非路径形式的文件模块。

##### 路径分析(自定义模块)
我们同样使用上面的输出结果。可以看到路径是逐级向上寻找的过程。从当前目录下的`node_modules`一直寻找到根目录下的`node_modules`为止。逐级向上寻找的方式，FNer们是否似曾相识呢？(Javascript的原型链溯源👩‍🏫‍)

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/node_modules_path.png)

这种情况常见于我们项目开发中，引用的第三方模块包。
* 它们不属于核心模块包
* 不属于我们业务代码中自己封装的参数模块

##### 文件拓展名
require()函数在解析`标识符`的时候，对于不指定文件拓展名的情况，Node.js按照`.js`、`.node`、`.json`文件的顺序补足拓展名后，再尝试进行加载。

##### 目录与模块
```js
// app.js
const abcModule = require('abcmodule')
```
```bat
--|-- app.js
  |-- node_modules
        |-- abcmodule
            |-- index.js
            |-- package.json
```
若在上述的逐级匹配寻找的过程中，匹配到了一个目录(如上图)。则会进把匹配到的目录当做一个模块包，首先寻找文件夹下的`package.json`文件(也就是模块包的配置文件)。

```json
// 省略了一大堆其他属性
{
  "author": "",
  "bundleDependencies": false,
  "deprecated": false,
  "description": "",
  "license": "BSD-2-Clause",
  "main": "index.js",
  "name": "http",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "version": "0.0.0"
}
```
`package.json` 中的 "main" 配置项则会被指定位模块的加载入口。

```js
"main": "not-found.js"
```
若`"main"`指定的文件是不存在的，加载机制则会默认依次寻找当前目录下的`index.js`、`index.node`、`inde.json` 来作为文件模块的入口。

___

## 参考资料
[1][CommonJS规范 - ruanyifeng](https://javascript.ruanyifeng.com/nodejs/module.html#toc6)

[2][《深入浅出Node.js》 - 朴灵](https://book.douban.com/subject/25768396/)