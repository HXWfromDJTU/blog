# CMD 规范

> CMD 规范集合了CommonJS 和 AMD，取长补短。其最有名的实现是射雕的[sea.js](https://seajs.github.io/seajs/docs/)

### 语法规范

##### 模块定义
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
    }
})
```

##### 模块暴露
```js
define(function(require, exports, module) {
    // 模块暴露
    module.exports.module1 = {
        getName
    }   
})
```