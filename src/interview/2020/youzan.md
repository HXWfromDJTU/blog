盒子模型说一下？

JavaScript

* 说说原型链吧
    * 复盘:
      1. hasOwnProperty 可以实现不往原型链向上查找，只在本对象查找属性
      2. getOwnPropertyNames 可以获取只属于自身的属性key列表，包括不可枚举的
    - ES5 中如何实现继承
* 说说函数作用域？
    * let const 的引入对作用域有什么影响？
    * 说说作用域链是什么？
    * 复盘
      * 作用域
        1. 作用域一般分为全局作用域 与 函数作用域，let const 使用之后还会形成块级作用域
        2. 代码在执行的时，会创建一个一个 `执行环境` 或者称之为 `执行上下文`。
        3. 每个执行环境都有一个与之相关的 `变量对象`，执行环境中所有的变量都存在这里
      * 作用域链
        1. 每个执行环境中的变量对象，通过 [[ scope ]] 属性指向外层执行环境的变量对象，就像是原型链那样
        2. 在访问某个执行环境中访问某些变量时，会沿着作用域链向上寻找
      * let 与 const
        1. ES 6 中的 let 与 const 可以形成块级作用域
        2. 常见的 if () {} 、for 语句中定于到的 let、const 都只能够在内块级作用域内部使用
        3. 实际项目中，完全可以使用 let 与 const 来替代 var，可以细化变量使用行为，减少代码的副作用

Sentry 上报是怎么使用的呢？

* 首屏优化有哪些方法？
  * 复盘: 
    * 减少网络传输次
      1. SSR
      2. http 2.0 Server Push
      4. 提取关键 CSS 内嵌到HTML中，减少css文件请求
    * 加快请求
      1. 使用CDN
      2. HTTP 2.0 多路复用
    * 减小文件大小
      1. 模块异步加载 (代码分割，使用webpack 的分包技术 基于 ES 7 import()语法)
      2. 关键资源使用 preload 保证资源优先被请求
    * 渲染
      1. 图片实行懒加载，避免过多图片渲染卡顿浏览器
    * 补充: 
      1. 静态文件缓存，比如 vue 等类库的可以设置长时间的缓存。而后通过 contentHash进行控制更新
      2. 使用 websocket 进行通信，减少 tcp 握手次数
      3. (交互体验上) 使用骨架屏 或者 loading，从情绪上较少用户的焦躁
      4. script 的执行会阻塞UI线程，所以使用 async 与 defer 与延缓script 的执行
      5. (交互体验上) 优先使用本地缓存的数据 (web-storage) 展示给用户，再等待 xhr返回更新数据
  * 归纳: 
      1. 减少请求  ===> 后端直出SSR、内嵌关键CSS 与 JS、Server push、静态文件设置长时间缓存
      2. 减小请求 ===> 模块异步加载、webpack 分包
      3. 加速请求 ===> 使用CDN、h2 多路复用、websocket 较少握手次数
      4. 交互体验上 ===> 骨架屏、loading、优先使用缓存展示数据
      5. 渲染上 ===> script - async - defer、 图片懒加载、资源 preload 调整加载顺序

- 可以从打包、网络各个方面去说说

* http2.0 有什么优化？
  1. server-push
  2. 多路复用
  3. 头部压缩 ===>  使用静态 + 动态索引表 + huffan 压缩 大大减小了头部的占用空间

* http 与 https 有什么不同？握手过程说一下？
  * 异同点:
    1. https 全称 http over secure socket layer, 顾名思义就是 建立在安全套接字上的 http协议
    2. 只是在http 握手前增加了一个 tls的握手过程说，其余工作原理与http完全一致
    3. https 实现了加密通信，大大加强了现代网络的通信安全
  * 握手过程
    1. 服务器向 CA 机构申请证书，把准备用于 TLS 握手的非对称加密公钥进行证书加密，证书本身是一个非对称加密的公私钥对
    2. 客户端向服务器发起请求，并携带一个随机数 R1, 称之为 client hello，并出示自己支持的加密套件，让服务端选择
    3. 服务端返回一个随机数 R2，并选择一个加密套件，并且下发自己的证书给客户端
    4. 客户端收到证书，开始验证证书，验证成功则可以取出服务器的公钥
    5. 生成随机数 pre-maaster，并使用服务端公钥加密这个 pre-maaster，发送给服务端 
    6. 服务端收到加密的 pre-master，使用私钥解开，得到pre-master
    7. 双方都有 s1 + s2 + pre-master, 三者混合 + 对称加密套件 生成 对称加密的秘钥
    8. 尝试通信后，即可开始后续的http传输       

Vue 中 Vue-DOM 的作用是什么呢？
  1. 直接操作DOM开销大，整个流程都要走一遍
  2. 频繁操作会造成用户操作上的卡顿
  3. v-dom 是一个纯粹的JavaScript对象，用于记录节点的信息
  4. 因为依托JavaScript，所以容易实现跨平台
  5. 比对v-dom 的效率也比比对真实DOM的效率要高得多

Vue 的 diff 算法是怎么进行优化的？
  1. diff 算法在vue 中称之为patch，作用是比对新旧两个 v-dom 的差别
  2. 当 Component 数据发生变化、watcher会通知 component执行其用于更新的 render function,正是在这个过程中触发的patch.
  3. 整体的过程是 先比较 v-dom 的高度是否一致，然后再同层比较
  4. 先比较是否存在子节点
     * 若都有子节点，则使用updateChildren 进行后头头、尾尾、头尾、尾头比较进行优化
  5. 借助用户设置的 key 进行比对优化，并产生依赖。若节点类型、key相同则会直接被认为是同一个节点
  6. 所以列表中 key 的设置，不能使用下标进行，十分容易出错
  7. 原本 On3 的时间复杂度，可以降低到 On 的复杂度

Vue 响应式原理？
  1. Vue 响应式机制，主要基于发布订阅模式来设计的。
  2. 其中有三个种关键的对象，Observer Dep 与 Watcher。
  3. Observer 相当于是被观察者，对应Vue中的药别观察的一项数据。
     Watcher 相当于是订阅者，对应Vue中的一个组件，拥有自己的 update function
     Dep 相当于是二者的一个中介，帮助Observer管理他的订阅者们(watcher)
  4. 简单的实现代码如下
  ```js
  class Observer {
      dep: new Dep() // Obaserver 对象对应额 Dep 对象，帮助观察者管理依赖

      constructor (obj, key, value) {
        const curr = obj[key]
        // 深度遍历内层
        if (Object.prototype.toString.call(curr) === '[object Object]') {
            Object.keys(curr).forEach(innerKey => {
                new Observer(curr, innerKey, curr[innerKey])
            })
        }

        // 本层绑定
        Object.defineProperty(obj, key, {
            enumrable: true,
            configrable: true,
            get () {
                if (Dep.target) {
                   this.dep.addSub(Dep.target)
                }
                return this.value
            },
            set (value) {
                this.dep.notify()
                this.value = value
            }
        })
      }
  }

  class Dep {
      static target = null
      subs = []
      constructor () {}

      notify () {
          this.subs.forEach(watcher => {
              watcher.update()
          })
      }

      addSub (watcher) {
          this.subs.push(watcher)
      }
  }

  class Watcher {
      constructor () {
          Dep.target = this
          this.render() // render 的时候会访问组件模板中的数据，形成依赖收集
          Dep.target = null
      }

      render () {
        console.log('update...')
      }
  }
  ```
  5. 数据的响应式原理 和 数据双向绑定 呢一定不要混淆。在 Vue 中双向绑定需要显式使用，而响应式原理(也就是单项数据流)是隐式开启的。这样迎合和框架设计的一个初衷。

Vue 的双向绑定原理呢？(注意区别与响应式原理)
 1. 双向绑定一般说的是我们在 Vue 中使用的 v-model 这种显式调用绑定到的情况。
 2. 是基于发布订阅机制来实现的。通过 props 向内传递，通过 emit 向外通知。

Vue 3 相比较于Vue2 有哪些改变？
[vue 3.x 文档](https://vue3js.cn/docs/zh/api/composition-api.html#setup)
  * 使用 Proxy 代替 getter与setter进行数据操作监听。
     1. get/set 无法对新增的属性进行监听
        ```js
          Vue.set(vm.state, 'name', 'vue 2') // vue 2.0 版本中需要用这样的方法去添加可被监听的新属性
        ```
     2. vue2 中监听数组变化，使用的是重写几个数组的操作方法
     3. 对于对象需要深度遍历，在每一个层级都要绑定 observer 实例，使得data体积膨胀
  * Virtual DOM 进行了重构，提高了 Diff 算法效率
    1. PatchFlag 标记了静态节点
    2. cacheHandler 事件监听缓存
    3. hoistStatic 静态节点提升

  * 压缩包更小了，减小了一倍
  * Composition Api 代替了过去的 Option Api
    1. 解决了一个功能代码被分拆到多个不同地方的问题
    2. 使用 reactive 或者 ref 声明响应式数据，写法上不一致

* Proxy 是如何解决Vue2这些问题的？
  1. Vue 3.x 中使用 rective 作为用户自定义绑定数据的范围    
  2. Proxy 进行设置操作拦截函数，Reflect 用于调用原内置的拦截函数     


Node.js
* 洋葱模型的实现原理是怎么样的？
   * 复盘:
     * 洋葱模型的天然实现就是递归
     * compose 的源码书写
     ```js
        function compose (middwares) {
            // 省略类型判断

            return function (context, next) {
                let deepestIndex = -1

                function dispatch (currIndex) {
                    if (deepestIndex >= i) Promise.reject('next can not be invoke mutiple times')
                    deepestIndex = currIndex

                    var work = middwares(currIndex)
                    if (!work) return Promise.resolve()

                    try {
                        return Promise.resolve(work(context, dispatch.bind(null, currIndex + 1))
                    } catch (err) {
                        return Promise.reject(err)
                    }
                }
                dispatch(0)
            }
        }
     ```

* Node.js 的事件循环怎么理解？
   * 说 Node.js 的事件循环，需要分为 11.0 版本之前和之后来说
      1. 前者在宏任务 与 微任务 的执行上与浏览器有一定差异，即若有多个timer 的callback超时在 timer queue中。则会依次执行timer callback，而其中产生的微任务，会被放到 timer queue 被清空的时候，再被统一执行
      2. 后者趋于和浏览器行为一致，即当前timer callback 产生的微任务，会在下一个callback执行前被执行。     
   * 正常的事件循环是怎么样的？
      1. Node.js 的时间循环一般分为六个阶段。timer、idle、prepare、poll、check、close。
      2. 我们一般需要关注
        * timer 阶段执行 setTimeout 与 setInterval的 callback
        * check 阶段 执行 setImmediate 的 callback
        * poll 阶段执行其他的 一些操作的回调，比如网络连接、文件读写结果等
      3. 详解poll phase
        1. 首先判断系统当前是否设置了 timer。 (先看第 2 条) ===> (若 设置了走 3 ，未设置走4)
        2. 再判断 poll queue 是否为空，若不为空，则循环执行 poll queue 中所有的 callback。直到超过了限制 或者 清空了poll queue，然后进入 check phase。 若为空，则看第 1 条的结果。
        3. 判断 timer queue 中是否有超时的 callback, 若有则进入 timer 阶段，执行所有超时的定时器。
        4. 判断 是否有 setImmediate 的callback 等待执行，若有则进入 check phase 执行其callback
      4. 总体规则   
          1. 每次进入 poll pahse、timer phase、check phase 都会将当时对应的 poll queue、timer phase、check phase中的任务清空掉
          2. 上述三个 queue 中的任务都为宏任务，每执行一个宏任务，就会清空掉当前 micro taks queue 中的所有任务，然后再执行下一个任务
          3. phase 之前的顺序，主要按照 poll phase 的情况进行调度 poll ==> check 、 poll ===> timer 还是 poll 等待，需要按照当时情况而决定    
       5. 关于定时器超时 与 setImmediate    
          1. 按照上面的情况说明，定时器的调度是不确定时间的
       6. 面试可以列举官网的文件读写延迟了定时器的例子
       7. 参考官网文档: https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/
           https://juejin.cn/post/6844904007270563848 
 
   * 网络 I/O 应该在哪里处理呢？

Node 的内存管理  和 垃圾回收机制说一下？
 * node.js 的内存分为两种 堆内存 与 对外内存
    1. 使用 process.memoryUsage 可以查看内存使用情况
    2. node.js 使用 V8 作为内核，所以默认情况相爱 64 位的机器 限制内存为 1.4GB   
    3. 可以用 max-old-space-size 与 max-new-space-size 进行堆内存大小的调整    
 * 垃圾回收
    1. 自动回收:  javascript 中的垃圾回收主要由内核来完成，开发者需要在使用的时候注意甄别内存溢出的情况即可
    2. GC Root: 检测一个变量是否能够被回收，即这个变量是否能够从GC Root所触达到
    3. 基于内存: V8 的垃圾回收指的是在堆内存范围内进行垃圾回收
    4. 垃圾回收算法: 
        1. Scavenge 一分为二，from sapace 与 to space
        2. mark Swap 与 mark compact 算法用于老生代的垃圾回收，工作流程是标记活跃的，清除不活跃的。
           两个算法的区别在于，后者会在老生代空间不足的时候吗，现将已标记变量移动到内存的一边，便于腾出连续空间。    
    5. 用时：1.4GB 堆内存的Node.js，完成一次GC的时间需要在 50 ms 左右，会造成程序的停顿


如何解决内存溢出问题？
   * 内存泄漏(memory leak)是指程序中动态分配的 堆内存 空间，由于程序使用 或者 其他原因未释放，所导致的程序运行减速，甚至系统崩溃等严重后果。
   * 避免溢出的方案:
     1. 全局变量的释放
     2. 使用闭包需要记得及时释放
     3. 事件监听
     4. 定时器
     5. 模块引用最好在顶级进行，而不是在函数中引用，从而使得模块不能进行缓存，造成内存浪费

   * node-heapdump 检测工具

遇到过哪些内存溢出的问题？
* 参考这篇文章深入了解实战情况
https://github.com/aliyun-node/Node.js-Troubleshooting-Guide/blob/master/0x08_%E5%AE%9E%E8%B7%B5%E7%AF%87_%E7%BB%BC%E5%90%88%E6%80%A7%20GC%20%E9%97%AE%E9%A2%98%E5%92%8C%E4%BC%98%E5%8C%96.md


Node.js 异常捕获