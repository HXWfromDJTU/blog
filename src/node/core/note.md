# node源码阶段

1️⃣ 调试命令参数   
> node --trace http.js

2️⃣ http模块 --> _http_server.js --> net模块  --> EventEmitter  

3️⃣ 借助 builtin node_buffer.cc 中提供的功能来实现大容量内存申请和管理，目的是能够脱离 V8 内存大小使用限制

4️⃣ 在模块文件中，声明var x = 1，该变量不是global对象的属性，global.x等于undefined。这是因为模块的全局变量都是该模块私有的，其他模块无法取到

5️⃣ exports 与 modules.exports  






___

### 参考文章
[deep-into-node by yjhjstz](https://github.com/yjhjstz/deep-into-node/blob/master/chapter1/chapter1-0.md)