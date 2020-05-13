### Webpack

##### CommonJS
webpack默认支`CommonJS`规范,也实现了其中`Modules/Async/A`提出的`require.ensure`的语法。
```js
// require.ensure 能够确保 webpack进行打包的时候，会将异步引入的包和主包分离
require.ensure([], function(require){
    var list = require('./list');
    list.show();
}, 'list');
```
##### ES6 
若要支持 ES 6 Modules则需要加入 babel-plugin-import 一类的转垫片插件，执行的时候，你会发现`babel`会把我们的`import`都转译为熟悉的`CommonJS`的`require`  

例如 
```js
import list from './list';
//等价于 
let list = require('./list');
```

##### webpack自带方法
`require.include`是一个和 CommonJS规范下`require.ensure`极为相似的方法，而且还不能自己决定单独打包的模块名称。


##### AMD
1️⃣ webpack除了实现了Common规范以外，还实现了AMD规范，说明熟悉的AMD引入也是可行的。  
```js
// 使用AMD规范引入模块包
require(['./list', './edit'], function(list, edit){
    list.show();
    edit.display();
});
```

##### 总结 
```js
//可打包在一起的同步代码，使用import语法
import list from './list';

//需要独立打包、异步加载的代码，使用require.ensure
require.ensure([], function(require){
    var list = require('./list');
});
```
要想了解更多使用`webpack`进行前端优化的方法，请看我的另一篇文章 [前端优化第二曲👉](/browser/front_end_optimize.md)  