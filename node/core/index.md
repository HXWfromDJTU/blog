# Node源码解读笔记📒

1️⃣ node的几个核心依赖模块
![](/blog_assets/node_source.png)

2️⃣ 跨平台的libuv
![](/blog_assets/node_libuv.png)

♑️ I/O请求  根据平台不一样，使用不同的解决方案。
♑️ File请求 所有平台则使用线程池的解决方案

3️⃣ 不可缺少的V8
♉️ Handle 与 引用的概念，handle与GC的关系
♉️ V8通过Handle获得对象的引用，而不是通过C++
♐️ Scope的整体释放，可以释放整体下的所有变量。
其他浏览器Javascript:源代码 --->抽象语法树 --->字节码 --->JIT--->本地代码。
V8直接将抽象语法树转换为本地代码，保证了执行的速度。