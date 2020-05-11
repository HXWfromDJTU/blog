# CommonJS

> `CommonJS` 是一种JS模块规范，主要为了弥补当前`Javascript`没有标准的缺陷。Node.js的模块机制是其主要的实践。

### 规范内容
`CommonJS`对模块的定义非常简单，主要分为了`模块引用`、`模块定义`与`模块标志`三个部分。
### 语法

##### 模块定义
> 使用`exports`和`module.exports`去暴露模块

```js
// module1
cosnt name = 'module1'

function getName () {
    reutrn name
}

module.exports = {
    getName
}
```

### 模块引用
> 中有一个全局性方法`require()`用于同步加载模块
```js
const module1 = require('./module.js')

module1.getName() // 'module1'
```

### 模块标识
* 必须是小驼峰命名方式的字符串
* 以'../'或者'./'开头的相对路径 或者 绝对路径
* 可以不书写`.js`后缀名

___
##### 优点：
1️⃣ 服务器模块便于重用。
2️⃣ 模块的导出和引入机制使得用户完全不需要考虑变量污染，比较于使用命名空间的方案就好很多。

##### 缺点
同步的模块加载方式不适合在浏览器的环境中使用，同步意味着加载阻塞，浏览器加载资源是异步的。
```js
// foo.js
module.exports = function(x) {
  console.log(x);
};

// main.js
var foo = require("./foo");
foo("Hi");
```