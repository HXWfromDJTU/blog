# 前端性能优化_第二曲 善用前端工具


### tree_shaking


### code-spliting 
使用CommonJS 的 require.ensure 进行异步模块加载，webpack内部也对CommonJS这一异步加载机制进行了实现，在webpack打包时，就会将当前模块与异步加载模块分离开打包成为两个bundle.js，名称可以根据传递参数来决定。
```js
require.ensure([],function(require){
    let m1 =  require('module1.js');
    let m2 =  require('module2.js');
},'bundle2')
```
以上代码通过webpack打包之后，除了生成主要的`main.js`之外，还会生成`bundle2.HASHCODE.js`作为异步加载的模块。从而实现`code-spliting`。

### gzip 



### 参考文档
[webpack官网指南](https://webpack.docschina.org/guides/code-splitting/)