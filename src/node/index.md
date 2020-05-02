最新待补充内容:

* JavaScript 引用传递
   * 有哪些类型使用的是值传递，哪些类型又是引用传递。
   * 如何判断两个对象相等？比如select组件中，选项值是对象，如何判断选中呢？
   * JavaScript中的引用和 C++ 中的指针区别在哪？
   * 字符串为何是不可被修改的呢？
   * 数值0.01 + 0.02 === 0.03 的景点问题


* 内存释放
   * V8 GC
      * 浏览器、node环境中的GC策略有什么异同点
      * 和其他语言Java、Python、Go的GC策略有什么异同点
      * 新生代、老生代、各种淘汰算法之间是如何协作完成GC的
         * 不同的数据类型，存储的位置是否不一致，对应的释放策略呢？
      * 实战情况中有哪些常见操作，有内存泄漏风险
      * 闭包中的内容何时释放。
      
 * 模块机制
    * node基于CommonJS 规范，与其他AMD、CMD的比较。
    * node的require的实现原理
    * require 模块的作用域、模块间是否会相互影响的问题
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
     
