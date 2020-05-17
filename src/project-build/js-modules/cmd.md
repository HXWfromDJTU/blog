# CMD 规范 (依赖就近)

> CMD 规范集合了CommonJS 和 AMD，取长补短。其最有名的实现是射雕的[sea.js](https://seajs.github.io/seajs/docs/)

## 语法规范

### 模块定义
```js
define(function(require, exports, module) {
    // 同步引入模块
    const module2 = require('./module2')

    // 异步引入模块
    const module1 = require('./module3', function (module3) {
        cosnole.log(module3)
    })

    const name = 'module1'

    const getName = function () {
        return name
    }

    // 模块暴露
    module.exports.module1 = {
        getName
    }å
})
```

### 模块暴露
```js
define(function(require, exports, module) {
    // 模块暴露
    module.exports.module1 = {
        getName
    }   
})
```


## 与 `AMD`的不同点 
* `AMD`对代码的态度是预执行     
* `CMD`对代码的态度是懒执行(也就是上面说的依赖就近)，比如`SeaJS`就是在代码需要用到包的内容时候，内核才会去异步地调用这些包。(不同于AMD所有的包都在一开始就加载)

## 缺点
* 依赖`spm`进行打包(`spm`是`sea.js`的打包工具)
* 射雕貌似不再维护了