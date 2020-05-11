# CommonJS

> `CommonJS` 是一种JS模块规范，主要为了弥补当前`Javascript`没有标准的缺陷。Node.js的模块机制是其主要的实践。

### 规范内容
`CommonJS`对模块的定义非常简单，主要分为了`模块引用`、`模块定义`与`模块标志`三个部分。

##### 文件即模块
CommonJS 规定每一个文件就是一个模块，拥有自己的作用域。文件内的`变量`、`函数`、`类`都是私有的，其他文件不可以直接访问到，只有通过`module.exports`这个`神魔之井`进行访问。

##### 一次运行，多次加载
一个模块可能会被多个其他模块所依赖，也就会被多次加载。但是每一次加载，获取到的都是第一次运行所加载到缓存中的值。

##### module 对象
```js
// 最简单的一个模块，使用node命令执行它，输出以下的内容
module.exports = {
    abc: 123
}
console.log(module)
```
![](/blog_assets/node-module.png)

* module.id 模块的标志符
* module.loaded 标志模块是否已经完成加载
* module.children 表示其所依赖的其他模块
* module.parent 指向模块的父模块
* module.exports 表示对外暴露的`对象`（👈注意这个用词）
* module.filename 表示模块的文件名，带有绝对路径

##### module.exports 与 exports
> 先说结论，放弃使用`exports`，严格使用`module.exports`进行模块暴露



___

##### 模块定义
使用`exports`和`module.exports`去暴露模块

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

##### 模块引用
中有一个全局性方法`require()`用于同步加载模块
```js
const module1 = require('./module.js')

module1.getName() // 'module1'
```

##### 模块标识
* 必须是小驼峰命名方式的字符串
* 以'../'或者'./'开头的相对路径 或者 绝对路径
* 可以不书写`.js`后缀名
