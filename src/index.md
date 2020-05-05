### css
* opacity 为0的时候，理论上可以点击，但是实践发现确实有时候会点击不到。

### vue 3
* 全部模块都支持 tree-shaking



* vue-router

* vue
  * 再重新过一遍整个生命周期 与 实现逻辑
     * 需要明确真实际开发中，所有行为的前后关系
  * 依赖收集的 vue 2.0实现 与 3.0 的差别
  * 技术选型为什么vue，不是react
     * 门槛、招聘难度、生态、项目维护、项目定位的角度来考虑
     * 
      


* vuex
   * vuex的实现原理
   * 源码解读
   * mutation 与 actions 的根本区别，以及使用上的使用差别。
   * vue-persistent-state
      * 实现原理
      * 变动是同步的还是异步的
      
* nuxt
  * SSR 的原理以及优势
  * nuxt本身的优势 
  * 解决了什么问题
  * 前后端同构有什么优势，又有什么缺点
  * nuxt 开始的长时间白屏问题
  * node直出使用的是 renderToString 相关的函数吗？
      * vue 自身在SSR 上的支持有多少？
  
* electron
  * 基本实现原理
  * 窗口/进程间通信，窗口管理
  * 可以与浏览器的实现原理一起分析清楚
  * 调用宿主平台的api
  
* virtual DOM
  * react 的virtual DOM 与 vue 设计上有什么不同点？
  * 

* Diff 算法
   * 基本实现
   * 2.0 与 3.0 的优化
   * 为什么是O(n)复杂度而不是O(n^3)
   
* pm2 部署
  * 与pm2 比较，docker k8s 部署，几种方案之间的区别
  * 部署 node 时如何充分利用服务器的多核
  * 如何配置 webhook 通知
  * 线上如何监控 cup 与 内存的变化

* 组件设计原则

* OAuth 登录的技术了解


