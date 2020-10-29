最新待补充内容:

* JavaScript 引用传递
   * 有哪些类型使用的是值传递，哪些类型又是引用传递。 ✅
   * 如何判断两个对象相等？比如select组件中，选项值是对象，如何判断选中呢？
      * 浅拷贝 ✅
      * 深拷贝手写 ✅
      * _.isEqual() ✅
      
   * JavaScript中的引用和 C++ 中的指针区别在哪？ ✅
   * 字符串为何是不可被修改的呢？ ✅
   * 数值0.01 + 0.02 === 0.03 的经典问题 ✅
   
   
* Tengine
   - SLB(server load balance)   
* Nodejs 引擎的使用既支持V8也支持chakra。
   * shim chakra 
   * Nodejs rpc     
   * LAMP 与 MEAN 体系    
   * Model - Dao  - Services - Controller                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

* 内存释放
   * V8 GC 
      * 浏览器、node环境中的GC策略有什么异同点 ✅
      * 和其他语言Java、Python、Go的GC策略有什么异同点 ✅
      * 新生代、老生代、各种淘汰算法之间是如何协作完成GC的 ✅
         * 不同的数据类型，存储的位置是否不一致，对应的释放策略呢？ ✅
      * 实战情况中有哪些常见操作，有内存泄漏风险 ✅
      * 闭包中的内容何时释放。 ✅
      * 新生代内存地址移动到老生代内存地址的过程
      
 * 模块机制
    * node基于CommonJS 规范，与其他AMD、CMD的比较。 ✅
    * node的require的实现原理 ✅
    * require 模块的作用域、模块间是否会相互影响的问题 ✅
    * 为什么 Nodejs 不给每一个 .js文件一个独立的上下文，以避免作用域被污染呢？
       * [参考文章](https://www.zhihu.com/question/57375179/answer/152633354)
    * package.lock.json 的实际项目作用。
    * require 的 cache 与热更新的问题。
    * yarn、npm、cnpm 的异同点，又有哪些优势。
    
 * promise
    * 复习promise的实现过程
    
 * event模块
   * event 是构建很多模块的基础部件
   * 在作为基础模块，构建其他部件的时候，需要注意listener的释放
   * 如何实现一个一步的reduce
   * event 中的emit机制是同步还是异步  
   * node 中的eventLoop libuv 进一步理解
   * nodejs 的进程调度与 js 进程调度的区别
  
 * 进程管理
   * 进程间通信
     * 浏览器进程间通信
     * node 进程间通信
     * electron 进程间通信的对比  
  * 孤儿进程、守护进程是什么？设计思想是什么？
     * cluster 机制 or child_process 机制？有何异同点？
   * PM2 
     * pm2 如何实现的负载均衡
     * pm2 常用指令
       * pm2 monit
       
* fs 
  * readFile 与 readFileAsync 有什么区别？
  * studio 标准输入、输出      
       
* Buffer
  * stream ✅
    * creatReadStream
  * buffer/string/0x进制/stream之间的关系
  * 流与buffer的编码问题
      
* node 单元测试
   * 常用工具框架
   * 如何模拟数据
     
* node 自身的优缺点
   * IO 密集型业务优势，如何有优势呢？何谓IO、IO密集型业务呢？
   * OS模块
   * 常用的查看 OS 各项指标的api。
      * 可用内存、总内存、核数
      * 如何结合"OS模块"、v8模块、以及一些标志参数进行 node的运行时分析。
      * heapdump 等调试工具 
   * Error
   * 异常捕获
   * 内存溢出分析，[文章](https://zhuanlan.zhihu.com/p/25736931?group_id=825001468703674368)
   
* C++模块
   * node 的 C++模块是如何工作的？
   * 简单编写一个最最最最简单的C++模块，并使其运行起来。[参考内容](https://github.com/nodejs/node-addon-examples)
   
   
* 存储/缓存
   * redis 的使用
   * 抛开nodejs，业界其他语言的解决方案，使用的是什么工具库来解决缓存问题呢？
   

* node 安全
   * 如何防范sql注入
   * crypto 模块      
     * OpenSSL hash      
     * 常用工机具函数了解     
     
* koa 实现原理
   * 完善之前的最小化 koa demo ✅
   * 读完koa核心的3000行源码 ✅
   
* 模块化
   * require 与 module.exports 的区别
   
* v8 内核
  * JIT ✅
  * runtime 
  * 编译过程，字节码 ✅
  * 补充文章[入口](/src/node/core/v8/v8.md)
  * 各个主流的浏览器内核，对以上的编译过程有何优化，是否有直接实现？
  
  
 * 浏览器系列
  https://time.geekbang.org/column/intro/216
  根据课程列表，过一下自己的知识点
  
  * Serverless
  基础的serverles搭建


### 实战
* node对于option请求如何处理
* node如何处理cors跨域

## 基础补充
* node的event loop和浏览器的区别
