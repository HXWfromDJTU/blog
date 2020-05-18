# 前端模块化 - Webpack 
> "Node.js 从最一开始就支持模块化编程。然而，在 web，模块化的支持正缓慢到来。在 web 存在多种支持 JavaScript 模块化的工具，这些工具各有优势和限制。webpack 基于从这些系统获得的经验教训，并将_模块_的概念应用于项目中的任何文件。"

从 `Webpack 4`对模块化的面数来看，深知自己的历史任务深重，所以扛起了所有的前端几乎所有的模块化方案: 
* `ES6`的 `import` 与 `export` 语句
* `CommonJS` 的 `require` 与 `module.exports`
* `AMD` 的 `define` 与 `require` 语句
* `CMD` 的 `define`
* `css/less/sass` 中的 `@import` 语句


## CommonJS
根据`CommonJS`规范，全局中可以直接取到`exports`、`require`、`module`这三个经典的变量。再加上运行环境为`node`,所以多加两个`__filename`与`__dirname`
* [__filename](http://nodejs.cn/api/modules.html#modules_filename)
* [__dirname](http://nodejs.cn/api/modules.html#modules_dirname)
* [CommonJS](./common-js.md)

`Webpack`根据以上的基本需要，将当前模块封装在一个块级作用域中，并将这些变量当做模块的全局变量传入。
```js
(function(exports, require, module, __filename, __dirname){
  // YOUR MODULE CODE
});
```
### 无法 tree shaking
`CommonJS`规范下，代码是在运行时才确定依赖关系的，所以`webpack`在实现上也是依照规范去做。只能在打包编译的时候加入`完整的模块`到最后的`bundle`中，无法实现`Tree Shaking`.


## ES6 Module
对于`ES6 Module`的编译过程静态化处理，`Webpack`也以文件为维度对模块进行划分，得到`module1`、`module2`、`module3`等，最后还有入口模块`moduleEntry`。

> 这里的设计思维，有点像是`Javascript`的作用域链.

```js
// moduleA.js
export const A = 'A value'
//  moduleB.js
export const B = 'B value'
// moduleC.js
export const C = 'C value'

// app.js
import { A } from './es6/moduleA'
import { B } from './es6/moduleB'
import { C } from './es6/moduleC'

console.log('==== entry.js ======')
console.log(A)
console.log(B)
```
我们把`app.js`作为打包入口，则会得到以下结构的代码
```js
// 入口模块
(function (modules) {
    function webpackRequire(moduleId) {
        // ...
    }
    webpackRequire(1);
})([module1, module2, module3, moduleEntry]);
```
### 引入
`Webpack`编译后的代码中，使用`__webpack_require__()`方法进行模块的调度。
```js
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
```
简单总结一下
* 使用了和内存进行模块单例缓存
* `__webpack_require__`参数为`moduleId`，该`ID`也为传入的模块数组下标的`ID`

### 导出
`__webpack_require__.d`(其实应该为`__webpack_require__.define`),函数用于导出模块，也就是实现`export`语句的基础方法，编译后的源码如下。
```js
__webpack_require__.d = function (exports, name, getter) {
    /******/
    if (!__webpack_require__.o(exports, name)) {
      /******/
      Object.defineProperty(exports, name, { enumerable: true, get: getter })
      /******/
    }
    /******/
  }
```

我们在打包后的代码中，除了看到`__webpack_require__.d`方法的定义，也有对应的使用。蔽日我们引入了`moduleA`、`moduleB`、`moduleC`。

![](/blog_assets/__webpack_require.define-a.png)

![](/blog_assets/__webpack_require.define-b.png)

![](/blog_assets/__webpack_require.define-c.png)

图中出现的`__webpack_exports__`则是表示暴露的整体对象，`__webpack_require__.d`负责给该对象添加属性。

## 混和兼容
打包后的代码中有这么一段代码如下，根据对应模块的类型，`ES6 Module`或者是`CommonJS`，进行不同的处理方式。
```js
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/
__webpack_require__.n = function (module) {
    /******/
    var getter = module && module.__esModule ?
      /******/      function getDefault () {
        return module['default']
      } :
      /******/      function getModuleExports () {
        return module
      }
    /******/
    __webpack_require__.d(getter, 'a', getter)
    /******/
    return getter
    /******/
  }
```

## AMD
`webpack`还实现了`AMD`规范，说明熟悉的`AMD`引入也是可行的。  
```js
// 使用AMD规范引入模块包
require(['./list', './edit'], function(list, edit){
    console.log(list)
     console.log(edit)
});
```

## webpack 自带方法
`require.ensure` 能够确保 `webpack` 进行打包的时候，会将异步引入的包和主包分离
```js
// ./list/index.js
console.log('i am the separated module')
module.exports = {
  abc: 123
}

// app.js
require.ensure([], function(require){
    const list = require('./list');
    console.log(list)
}, 'list');
```
![](/blog_assets/webpack_separted_module-import.png)

![](/blog_assets/webpack_separted_module.png)

当然我们正在做 `code spliting`的时候一般会通过`webpack.config.js`来进行配置`plugins`或者`optimization`来实现

## 总结 


## 参考资料
[1] [webpack 前端运行时的模块化设计与实现 - by Alien ZHOU](https://www.alienzhou.com/2018/08/27/webpack-module-runtime/)