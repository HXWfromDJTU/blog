# Node源码解读笔记📒


### gyp构建工具

### node总览结构
![](/blog_assets/node_framework.png)  

##### 第一层(Javascript依赖包)
1️⃣ Standard Libary 是我们日常项目常用的 HTTP Buffer模块  

##### 第二层(桥阶层)
2️⃣  Node Binding 是沟通C++和Javascript的桥梁,封装了底层C与C++模块包，暴露出JavaScript接口给上层调用  

##### 第三层 (C/C++依赖包)
3️⃣ V8不必多说相当于Nodejs的引擎(V8相关的笔记📒，[传送门](/node/v8/v8.md))

4️⃣ libuv 填平了多个平台的对异步I/O的不同实现，在Win平台上则是直接使用IOCP代替转让部分的功能。 (libuv的笔记📒，[传送门](/node/core/libuv/libUV.md))

5️⃣ c-ares 是使用C语言实现的一个异步DNS查找的一个底层库，著名的Nodejs curl gevent都使用了c-ares作为底层

6️⃣ http_parser、OpenSSL、zlib等模块实现了一些和http请求封装有关的东西，比如说http解析、SSL和数据压缩
![](/blog_assets/node_source.png)

___
node的几个核心依赖模块




♑️ I/O请求  根据平台不一样，使用不同的解决方案。
♑️ File请求 所有平台则使用线程池的解决方案

3️⃣ 不可缺少的V8
♉️ Handle 与 引用的概念，handle与GC的关系
♉️ V8通过Handle获得对象的引用，而不是通过C++
♐️ Scope的整体释放，可以释放整体下的所有变量。
其他浏览器Javascript:源代码 --->抽象语法树 --->字节码 --->JIT--->本地代码。
V8直接将抽象语法树转换为本地代码，保证了执行的速度。