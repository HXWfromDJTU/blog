## 平安智慧城市

### 一面

* Vuex 中 mutation 为什么是同步的？
    1. 直接原因是方便进行数据调试
    2. mutation 和 action 二者必须有一个要被用于处理复杂的请求、业务，另一个必须是简单、可预期的操作
    3. action 是一个架构上的设计，并不属于 Vue 的设计管理范围  
    * 参考这个回答  [https://www.zhihu.com/question/48759748](https://www.zhihu.com/question/48759748)

* nextTick 的使用场景
    * 从源码和文档可以知道，DOM的更新是异步的，一个组件中所有的同步修改都会被去重并且放到 nextTick 队列中进行
    * 由于入队先后关系，DOM 更新的nextTick 是优先与用户的nextTick的
    * 所以使用 nextTick 可以保证callback 是在 DOM 更新完成后进行的

- props 为什么要设计成单项数据流
    1. props 单项流动，便于数据调试
    2. 参考 v-modle 的使用，显式地声明双向绑定使得数据更可控
    3. 若 props 是大量使用的场景，所有数据双向绑定，会使得父组件的状态很大程度上收到子组件影响

* vue router 中 history 模式 与 hash 模式的实现原理分别是什么？
    * [https://zhuanlan.zhihu.com/p/37730038](https://zhuanlan.zhihu.com/p/37730038) 蚂蚁金服大神的解释   
    - [https://juejin.im/post/6844903945530245133](https://juejin.im/post/6844903945530245133) vue-router 常见面试题目
    - history 后端配置原因  [https://juejin.im/post/6844903856359342087](https://juejin.im/post/6844903856359342087)
    - vue-router 整体知识  [https://juejin.im/post/6844903589123457031#heading-9](https://juejin.im/post/6844903589123457031#heading-9)  

* keep-alive 的实现原理是什么？
  * 复盘: 
    1. keep-alive 是一个虚拟的节点，不会被渲染成DOM。
    2. Vue 内部使用 JavaScript 对象来缓存组件实例，使用组件名称作为key。
    3. 同时，黑名单、白名单匹配的也是组件的名称。会根据规则的变化而实时删除组件。
    4. 在 Keep-Alive 组件被销毁的时候，内部缓存的所有组件的 destory 生命周期都会被调用。     
    5. 允许用户最大缓存数目。 this.keys 用于保存组件在缓存对象中的 key，并且用于实现 LRU 淘汰算法。每次命中缓存时，则会更新 this.keys中组件key的位置
  * 参考资料  [https://juejin.im/post/6844903837770203144](https://juejin.im/post/6844903837770203144)
    
- watch 中 deep true是如何实现的？
    * 复盘：
      1. 若设置了 deep: true，在对数据生成 Watcher 对象的时候，会调用 traverse 函数处理数据值本身，touch 所有的子元素，实现依赖收集。
      2. 会有一定的性能差别，特别是数据量大、层次深的时候。
      3. 同样值得关注的，日常工作中的写法是仅仅设置 handler 的写法。
        1. handler、 immediate 、 deep
           ```js
            watch: {
                obj: {
                        handler(newName, oldName) {
                        console.log('obj.a changed');
                    },
                immediate: true,
                deep: true
                }
            } 
           ```
    * [https://juejin.im/post/6844903600737484808](https://juejin.im/post/6844903600737484808)

- 防抖与节流的区别是什么？
    ```js
        function throttle (func, wait, immeadiate) {
            var timer = null 

            return function () {
                var self = this
                var args = Array.prototype.slice.call(arguments, 0)

                if (timer) clearTimeout(timer) // 强行移除定时器

                if (immeadiate) {
                    var callNow = !timer // 处于非冷却期，则可以表明可以马上执行
                    
                    timer = setTimeout(function () {
                        clearTimerout(timer)
                        timer = null
                    }, wait)
                    
                    func.apply(self, args)
                } else {
                    timer = setTimeout(function () {
                        clearTimeout(timer)
                        timer = null
                        func.apply(self, args)
                    })
                }
            }
        }

        function debounce (func, wait) {
            var timer = null
            var preious = 0

            return function () {
                var self = this
                var args = Array.prototype.slice.call(arguments, 0)
                var remaining = wait - (new Date().getTime() - previous)

                // 初次执行命中后者，后续会面中前者
                if (remaining < 0 || remaining > wait) {
                    // 设置空白冷却期
                    timer = setTimeout(function () {
                        clearTimeout(timer)
                        timer = null
                    }, wait)

                    // 立即执行函数
                    previous = new Date().getTime() // 更新执行时间
                    func.apply(self, args)
                } else if (timer) {
                    timer = setTimeout(function () {
                        clearTimeout(timer)
                        timer = null
                        func.apply(self, args)
                    }, remaining)
                }
            }
        }
    ```
* webpack plugin 的原理是什么？是如何工作的？
  * 复盘:
    * webpack 整体流程
      1. 初始化编译入口
      2. run
      3. make 从 entry 选项递归每个入口，对每个模块进行build。
      4. before-resolve 对模块位置进行解析
      5. build-module 开始构建某个模块
      6. normal-module-loader 将 loader 完成的module进行编译，生成 AST 树
      7. 遍历AST，遇到require表达式时，手机依赖
      8. seal 所有的依赖build 完成开始优化
      9. emit 输出到目录
    * webpack plugin 工作原理？
        * 是一个叫做 webpack tapable 的东西，起到一个类似于事件分发的过程
        * ？？？

* 协商缓存、强缓存详细的流程是怎么样的，用到了哪些头字段和技术？
    1. 强缓存使用是 Expire / Cache-Coltrol 等头字段
    2. 协商缓存使用的是 Etag/If-None-Match  Last-Modified/ If-Modified-Since 两种字段
    * 流程
        1. 客户端初次请求资源(本地无缓存)，服务器返回 200 OK，并且携带 Expire 或者 Cache-Coltrol 等字段
            * Expire: 0 与 no-store 都表示不允许进行缓存
        2. 客户端第二次进行请求时，先判断本地是否有缓存 ===> Expire 是否过期 ===> 是否 no-cache ===> Max-age是否超时 以决定是否发起请求？
            * 若 Expire 或者 Max-Age 未超时，则直接使用本地缓存
        3. 发起协商缓存 优先使用 If-None-Match: Etag 请求头 ===> If-Modified-Since: Last-Modified-Time 进行请求
        4. 若条件请求成功，表明命中了协商缓存，服务器返回 304 Not Modified 通知客户端直接使用本地缓存即可。
        5. 若条件请求失败，则继续走正常请求的返回结果，返回 200 OK 或者 其他错误码

* 说说插槽的用法
    * 作用域插槽和普通插槽，但一般都用后者了
        1. 普通插槽的作用域是父组件作用域
        2. 作用域插槽的作用域可以来自子组件 和 父组件
    * 但回顾一下compile 的不同结果
        1. 普通插槽编译出来的是固定的节点
        2. 作用域插槽编译出来的是一个 插槽的渲染函数，子组件可以提供参数

### 二面

* 你做的Nodejs在公司处于什么角色？
- 如何调用后端的接口的？
- rpc吗？
* 项目中用到了node的哪些核心模块
    1. http 模块

Nodejs 中如何捕获异常
- try-catch 吗？不可能到处都写满吧
- uncaught-Exception 全局捕获？

* Vue 父子组件传参有哪些方式？
  * EventBus的实现原理什么？
    1. 基于一个EventEmitter的设计
    2. EventBus 相当于发布订阅模式中的Proxy

* 父给子传递一个对象，子元素改变对象上的属性，是否会被反映到父组件上
  * 陷阱题目: 注意传入的是一个对象，属于引用类型
    1. 子组件修改对象上的属性，修改到的仍然是同一个对象
    2. 所以会出现类似 “双向绑定” 的假象

* 使用了 mixin 后，组件中同名生命周期函数的执行顺序 ？谁先谁后呢？
  * mixin混合后
    1. data、method、computed、watch 以组件的优先
    2. 同名生命周期，组件中的先执行，而后mixin中的内容再执行

* Vue-Router 的模式有多少种呢？
  * 一共有三种模式，hash mode/ history mode/ abstruct mode(内部使用)，前两者可供开发者调用
  * hash mode 的优缺点。
    1. 兼容性比较好，但是路由看起来比较丑
    2. 服务器不能接收到#号后面的内容，但也不需要进行配合前端进行路由改造
    3. 实现原理用的是 浏览器监听 hashChange 事件
  * history mode
    1. 基于 HTML 5 的 history Api 进行构建，pushState添加路由
    2. 需要服务端进行路由覆盖，否则刷新后会出现页面找不到的情况
    3. 路由看起来更好看

* 协商缓存的过程说一下？
  （参考一面回答）
  * from disk cache? 是什么意思？ 错误码是多少？
    * from disk cache 是指从浏览器的缓存中读出， 状态码 为 200 OK
  * 协商缓存返回的错误码是什么呢？
    * 若命中了缓存，状态码为 304 Not Modiefied
    * 若没有命中缓存，则结果为 普通请求的状态码
    https://heyingye.github.io/2018/04/16/%E5%BD%BB%E5%BA%95%E7%90%86%E8%A7%A3%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9A%84%E7%BC%93%E5%AD%98%E6%9C%BA%E5%88%B6/

* 说说事件循环
- 宏任务微任务
- 看代码写输出

* 说说原型链
    * new 关键字是什么意思
    * 继承是怎么实现的？
        ```js
        function SuperCtor (a) {
            this.a = a
        }
        function SubCtor (a, b) {
            SuperCtor.call(this, a) // 经典继承(属性非共用)
            this.b = b
        }
        // 原型链继承(属性共用)
        function _extends (subCtor, superCtor) {
            // 省略参数校验
            var _proto_ = Object.create(superCtor.prototype)
            _proto_.constructor = subCtor
            subCtor.prototype = _proto
        }
        ```
    * new 关键字的书写
      ```js
        function _new (Ctor) {
            // 省略参数校验
            var obj = Object.create(Ctor.prototype)
            var args = Array.prototype.slice.call(arguments, 1)
            var retCtor = Ctor.apply(obj, args)

            var isLeagalObj = retCtor !== null && typeof retCtor === 'object'

            return isLeagalObj ? retCtor : obj
        }
      ```