### Node 模块化  
> Node.js 的模块化基于`CommonJS`，但是进行了一定的取舍。同时也增加了不少自身需要的特性。

首先，我们清楚，Nodejs的引用过程需要经历三个步骤
* 路径分析
* 文件定位
* 编译执行



```js
// common_module.js
let abc = 456;
module.exports = abc;

// main.js
import * as bar from './common_module.js';
bar ; // {default:{abc:456}}
```
4️⃣ 在使用`import`(ES6规范)引用CommonJS模块的时候，不能够进行解构赋值(解构引用)，因为ES6的`import`可以分成引用和运行，也就是在解析的时候就知道自己需要哪些模块中的量，但是被引用的`CommonJS`模块却要到运行时在能够确定哪些内容能够被暴露。
```js
// 不正确
import { readFile } from 'fs'; // fs是CommonJS模块包 
```
但是规范允许整体引入 
```js
import * as whole from 'fs';
```
5️⃣ node在使用`import`引入模块的时候，可以类似`url`一样带参数，若带的参数或者值不一样，那么就会当做两次的引入，并且保存在成不同的缓存。   

___